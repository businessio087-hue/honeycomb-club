import { describe, expect, it, vi } from "vitest";
import { scrollToTop } from "./scrollToTop";

describe("scrollToTop", () => {
  it("scrolls the page back to the top", () => {
    const scrollTo = vi.fn();
    Object.defineProperty(window, "scrollTo", {
      value: scrollTo,
      writable: true,
      configurable: true,
    });

    scrollToTop();

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
  });
});
