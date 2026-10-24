import "dotenv/config";
import { randomUUID } from "node:crypto";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

type CommentColor = "yellow" | "pink" | "blue" | "green" | "orange";
type VisitorComment = {
  id: string;
  name: string;
  text: string;
  color: CommentColor;
  rotation: number;
  createdAt: string;
};

const commentColors = new Set<CommentColor>([
  "yellow",
  "pink",
  "blue",
  "green",
  "orange",
]);
const comments: VisitorComment[] = [];
const recentCommentPosts = new Map<string, number>();

const cleanCommentText = (value: unknown, maxLength: number) =>
  String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/comments", (_req, res) => {
    res.json(comments.slice(0, 40));
  });
  app.post("/api/comments", (req, res) => {
    const ip = req.ip || "unknown";
    const lastPost = recentCommentPosts.get(ip) || 0;
    if (Date.now() - lastPost < 10_000) {
      return res
        .status(429)
        .json({ error: "Please wait before posting again." });
    }
    if (req.body?.website)
      return res.status(400).json({ error: "Invalid submission." });

    const text = cleanCommentText(req.body?.text, 200);
    const name = cleanCommentText(req.body?.name, 60) || "Anonymous";
    const color = commentColors.has(req.body?.color)
      ? req.body.color
      : "yellow";
    const rotation = Math.max(-6, Math.min(6, Number(req.body?.rotation) || 0));
    if (!text)
      return res.status(400).json({ error: "Comment text is required." });

    const comment: VisitorComment = {
      id: randomUUID(),
      name,
      text,
      color,
      rotation,
      createdAt: new Date().toISOString(),
    };
    comments.unshift(comment);
    comments.splice(40);
    recentCommentPosts.set(ip, Date.now());
    return res.status(201).json(comment);
  });
  app.get("/api/platform/config.js", (_req, res) => {
    res
      .set("Cache-Control", "no-store")
      .type("application/javascript")
      .send(publicPlatformScript());
  });
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("Invalid PORT");
  server.on("error", error => {
    console.error("Server failed:", error.message);
    process.exit(1);
  });
  server.listen(port, "0.0.0.0", () =>
    console.log(`Server listening on port ${port}`)
  );
}

startServer().catch(error => {
  console.error(error);
  process.exit(1);
});
