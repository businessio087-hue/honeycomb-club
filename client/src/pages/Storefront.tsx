import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import {
  categories,
  money,
  products,
  type Category,
  type Product,
} from "@/data/products";

type CartLine = { product: Product; quantity: number };

const heroImage = "/assets/hero-store.jpeg";
const foliageImage = "/assets/foliage.jpg";
const logoUrl = "/assets/logo.png";
const yocoUrl = "/assets/yoco.png";
const wellnessImage = "/assets/healthTHS.jpg";
const cosmeticsImage = "/assets/COSEMETICTHC.jpg";
const smokeablesImage = "/assets/smokeableths.jpg";
const ediblesImage = "/assets/ediblesTHC.jpg";

function prepareBabbleHeading(heading: HTMLElement) {
  if (heading.dataset.babbleReady === "true") return;

  heading.classList.add("scroll-babble");

  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let currentNode = walker.nextNode();
  while (currentNode) {
    if (currentNode.textContent?.trim()) textNodes.push(currentNode as Text);
    currentNode = walker.nextNode();
  }

  let wordIndex = 0;
  textNodes.forEach(textNode => {
    const fragment = document.createDocumentFragment();
    textNode.textContent?.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/\s+/.test(part)) {
        fragment.appendChild(document.createTextNode(part));
        return;
      }
      const word = document.createElement("span");
      word.className = "babble-word";
      word.textContent = part;
      word.style.setProperty("--babble-delay", `${wordIndex * 0.05}s`);
      wordIndex += 1;
      fragment.appendChild(word);
    });
    textNode.parentNode?.replaceChild(fragment, textNode);
  });

  heading.dataset.babbleReady = "true";
}

function useScrollBabble(location: string) {
  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main h1, main h2, main h3, .site-footer h3"
      )
    );
    headings.forEach(prepareBabbleHeading);

    if (!("IntersectionObserver" in window)) {
      headings.forEach(heading => heading.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    headings.forEach(heading => observer.observe(heading));

    return () => observer.disconnect();
  }, [location]);
}

function useStoredAgeGate() {
  const [verified, setVerified] = useState(
    () => window.localStorage.getItem("thc-age-verified") === "yes"
  );
  const confirm = () => {
    window.localStorage.setItem("thc-age-verified", "yes");
    setVerified(true);
  };
  return { verified, confirm };
}

function GlassIconButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button className="icon-button glass" aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

function GreetingIntro({ onDone }: { onDone: () => void }) {
  const [unwinding, setUnwinding] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedTimer = window.setTimeout(onDone, 350);
      return () => window.clearTimeout(reducedTimer);
    }
    const unwindTimer = window.setTimeout(() => setUnwinding(true), 5600);
    const doneTimer = window.setTimeout(onDone, 7100);
    return () => {
      window.clearTimeout(unwindTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={unwinding ? "greeting-overlay unwinding" : "greeting-overlay"}
      role="status"
      aria-live="polite"
      aria-label="Welcome to The Honeycomb Club"
    >
      <div className="greeting-glow" />
      <div className="greeting-center">
        <img className="greeting-logo" src={logoUrl} alt="The Honeycomb Club" />
        <div className="greeting-script-wrap" aria-hidden="true">
          <span className="greeting-script">Welcome</span>
        </div>
        <span className="greeting-subline">to the Club</span>
      </div>
      <span className="greeting-fineprint">A South African first.</span>
    </div>
  );
}

function SiteHeader({
  cartCount,
  onCart,
  onSearch,
}: {
  cartCount: number;
  onCart: () => void;
  onSearch: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const shopMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideTap = (event: PointerEvent) => {
      if (!shopMenuRef.current?.contains(event.target as Node)) {
        setShopOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideTap);
    return () => document.removeEventListener("pointerdown", closeOnOutsideTap);
  }, []);

  const closeNavigation = () => {
    setMenuOpen(false);
    setShopOpen(false);
  };

  return (
    <header className="site-header">
      <div className="top-note">
        <span>18+ adult-only retail</span>
        <span className="dot" />
        <span>CBD · non-psychoactive · under 0.001% THC</span>
      </div>
      <div className="nav-shell glass">
        <Link href="/" className="brand-lockup">
          <img src={logoUrl} alt="The Honeycomb Club" />
        </Link>
        <nav className={menuOpen ? "primary-nav open" : "primary-nav"}>
          <Link href="/" onClick={closeNavigation}>
            Home
          </Link>
          <div className="nav-dropdown" ref={shopMenuRef}>
            <button
              onClick={() => setShopOpen(v => !v)}
              className="nav-link"
              aria-expanded={shopOpen}
            >
              Shop
            </button>
            {shopOpen && (
              <div className="dropdown-menu glass">
                <Link href="/shop" onClick={closeNavigation}>
                  All Products
                </Link>
                {categories.map(c => (
                  <Link
                    key={c.name}
                    href={`/shop?category=${c.name}`}
                    onClick={closeNavigation}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/about" onClick={closeNavigation}>
            About
          </Link>
          <Link href="/contact" onClick={closeNavigation}>
            Contact
          </Link>
        </nav>
        <div className="header-actions">
          <GlassIconButton
            label="Search"
            onClick={() => {
              setShopOpen(false);
              onSearch();
            }}
          >
            <Search size={18} strokeWidth={1.6} />
          </GlassIconButton>
          <Link
            href="/account"
            className="desktop-only"
            onClick={closeNavigation}
          >
            <GlassIconButton label="Account">
              <UserRound size={18} strokeWidth={1.6} />
            </GlassIconButton>
          </Link>
          <button
            className="cart-pill"
            onClick={() => {
              setShopOpen(false);
              onCart();
            }}
          >
            <ShoppingBag size={17} strokeWidth={1.7} />
            <span>{cartCount}</span>
          </button>
          <button
            className="mobile-menu"
            aria-label="Menu"
            onClick={() => {
              setShopOpen(false);
              setMenuOpen(v => !v);
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="age-overlay">
      <div className="age-backdrop" />
      <div
        className="age-card glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
      >
        <div className="age-mark">THC</div>
        <p className="eyebrow">The Honeycomb Club</p>
        <h1 id="age-gate-title">Before you enter, take a breath.</h1>
        <p>
          This is an adult-only cannabis retail experience. Our products are
          CBD-focused, non-psychoactive, and contain less than 0.001% THC.
        </p>
        <button className="button button-dark" onClick={onConfirm}>
          I am 18 or older <ArrowRight size={16} />
        </button>
        <span className="age-fineprint">
          By entering, you confirm that you are of legal age in your country.
        </span>
      </div>
    </div>
  );
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const results = useMemo(
    () =>
      query.trim()
        ? products
            .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5)
        : products.slice(0, 4),
    [query]
  );
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="search-modal glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-top">
          <span className="eyebrow" id="search-title">
            Search the Club
          </span>
          <button className="plain-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="search-input-wrap">
          <Search size={20} />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Try CBD oil, gummies, pre-rolls…"
          />
        </div>
        <div className="search-results">
          {results.map(p => (
            <button
              key={p.slug}
              className="search-result"
              onClick={() => {
                navigate(`/product/${p.slug}`);
                onClose();
              }}
            >
              <img src={p.image} alt="" />
              <span>
                <strong>{p.name}</strong>
                <small>
                  {p.category} · {money(p.price)}
                </small>
              </span>
              <ArrowRight size={17} />
            </button>
          ))}
          {query && !results.length && (
            <p className="muted">No products found. Try a broader search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CartDrawer({
  lines,
  onClose,
  onChange,
  onCheckout,
}: {
  lines: CartLine[];
  onClose: () => void;
  onChange: (slug: string, delta: number) => void;
  onCheckout: () => void;
}) {
  const total = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0
  );
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="drawer-head">
          <div>
            <span className="eyebrow">Your selection</span>
            <h2 id="cart-title">
              Cart <span>({lines.length})</span>
            </h2>
          </div>
          <button className="plain-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={32} strokeWidth={1.2} />
            <p>Your cart is waiting for something considered.</p>
            <Link
              className="button button-outline"
              href="/shop"
              onClick={onClose}
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {lines.map(line => (
                <div className="cart-line" key={line.product.slug}>
                  <img src={line.product.image} alt="" />
                  <div className="line-copy">
                    <strong>{line.product.name}</strong>
                    <span>{money(line.product.price)}</span>
                    <div className="qty">
                      <button onClick={() => onChange(line.product.slug, -1)}>
                        −
                      </button>
                      <span>{line.quantity}</span>
                      <button onClick={() => onChange(line.product.slug, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-total">
              <span>Subtotal</span>
              <strong>{money(total)}</strong>
            </div>
            <p className="compliance-note">
              CBD · non-psychoactive · less than 0.001% THC · SAHPRA approved.
            </p>
            <button className="button button-dark full" onClick={onCheckout}>
              Checkout <ArrowRight size={16} />
            </button>
          </>
        )}
      </aside>
    </div>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product) => void;
}) {
  return (
    <article className="product-card reveal">
      <Link
        href={`/product/${product.slug}`}
        className="product-image"
        style={{ background: product.accent }}
      >
        <img src={product.image} alt={product.name} />
        <span className="product-badge">{product.category}</span>
      </Link>
      <div className="product-info">
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3>{product.name}</h3>
          </Link>
          <p>{money(product.price)}</p>
        </div>
        <button
          className="round-add"
          aria-label={`Add ${product.name} to cart`}
          onClick={() => onAdd(product)}
        >
          +
        </button>
      </div>
    </article>
  );
}

function ComplianceBand() {
  return (
    <section className="compliance-band">
      <div className="container compliance-inner">
        <Sparkles size={19} />
        <p>
          <strong>CBD without the noise.</strong> All products contain less than
          0.001% THC and are SAHPRA approved.
        </p>
        <span>South African first</span>
      </div>
    </section>
  );
}

type CommentColor = "yellow" | "pink" | "blue" | "green" | "orange";
type VisitorComment = {
  id: string;
  name: string;
  text: string;
  color: CommentColor;
  rotation: number;
  createdAt: string;
};

const commentColors: CommentColor[] = [
  "yellow",
  "pink",
  "blue",
  "green",
  "orange",
];
const blockedCommentTerms = [
  "asshole",
  "bastard",
  "bitch",
  "bullshit",
  "cock",
  "crap",
  "cunt",
  "dick",
  "faggot",
  "fuck",
  "motherfucker",
  "nigga",
  "nigger",
  "piss",
  "pussy",
  "shit",
  "slut",
  "whore",
];
const blockedCommentPattern = new RegExp(
  `\\b(?:${blockedCommentTerms.join("|")})\\b`,
  "i"
);

function containsBlockedCommentLanguage(value: string) {
  return blockedCommentPattern.test(
    value
      .toLowerCase()
      .replace(/0/g, "o")
      .replace(/1/g, "i")
      .replace(/3/g, "e")
      .replace(/4/g, "a")
      .replace(/5/g, "s")
      .replace(/7/g, "t")
  );
}

const starterComments: VisitorComment[] = [
  {
    id: "starter-1",
    name: "The Club",
    text: "A calmer way to browse. Love the little details.",
    color: "yellow",
    rotation: -2,
    createdAt: "2026-10-18T10:00:00.000Z",
  },
  {
    id: "starter-2",
    name: "Nandi",
    text: "The space feels considered from the first click.",
    color: "pink",
    rotation: 3,
    createdAt: "2026-10-19T12:30:00.000Z",
  },
  {
    id: "starter-3",
    name: "M.",
    text: "Soft light, good energy, and a very thoughtful collection.",
    color: "blue",
    rotation: -4,
    createdAt: "2026-10-20T14:15:00.000Z",
  },
  {
    id: "starter-4",
    name: "Lebo",
    text: "The Wellness panel is beautiful.",
    color: "green",
    rotation: 2,
    createdAt: "2026-10-21T09:20:00.000Z",
  },
];

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function CommentNote({
  comment,
  entering = false,
}: {
  comment: VisitorComment;
  entering?: boolean;
}) {
  return (
    <article
      className={`comment-note note-${comment.color}${entering ? " note-entering" : ""}`}
      style={
        { "--note-rotation": `${comment.rotation}deg` } as React.CSSProperties
      }
    >
      <span className="note-tape" aria-hidden="true" />
      <p>{comment.text}</p>
      <footer>
        <strong>{comment.name}</strong>
        <time dateTime={comment.createdAt}>
          {formatCommentDate(comment.createdAt)}
        </time>
      </footer>
    </article>
  );
}

function CommentBoard() {
  const [comments, setComments] = useState<VisitorComment[]>(starterComments);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState<CommentColor>("yellow");
  const [sticking, setSticking] = useState(false);
  const [enteringId, setEnteringId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/comments")
      .then(response => (response.ok ? response.json() : Promise.reject()))
      .then((data: VisitorComment[]) => {
        if (active && Array.isArray(data) && data.length) setComments(data);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedText = text.trim();
    const trimmedName = name.trim() || "Anonymous";
    if (!trimmedText) {
      setError("Write a note before sticking it to the board.");
      return;
    }
    if (trimmedText.length > 200) {
      setError("Keep your note to 200 characters or fewer.");
      return;
    }
    if (containsBlockedCommentLanguage(`${trimmedName} ${trimmedText}`)) {
      setError("Please keep Club Board notes respectful.");
      return;
    }
    if (website) return;

    setError("");
    setSticking(true);
    const optimistic: VisitorComment = {
      id: `optimistic-${Date.now()}`,
      name: trimmedName.slice(0, 60),
      text: trimmedText,
      color,
      rotation: Math.round((Math.random() * 12 - 6) * 10) / 10,
      createdAt: new Date().toISOString(),
    };
    setComments(current => [optimistic, ...current].slice(0, 30));
    setEnteringId(optimistic.id);
    setText("");
    setName("");

    window.setTimeout(() => setSticking(false), 760);
    window.setTimeout(() => setEnteringId(null), 1200);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: optimistic.name,
          text: optimistic.text,
          color: optimistic.color,
          rotation: optimistic.rotation,
          website,
        }),
      });
      if (!response.ok) {
        const failure = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(failure?.error || "Could not stick note");
      }
      const saved = (await response.json()) as VisitorComment;
      setComments(current =>
        current.map(item => (item.id === optimistic.id ? saved : item))
      );
    } catch (submissionError) {
      setComments(current => current.filter(item => item.id !== optimistic.id));
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "That note could not be stuck. Please try again."
      );
    }
  };

  return (
    <section className="comment-board-section">
      <div className="container">
        <div className="comment-board-heading">
          <div>
            <div className="section-kicker">03 / Leave a note</div>
            <h2>
              Say hello,
              <br />
              <em>stick around.</em>
            </h2>
          </div>
          <p>Leave a little piece of your visit on the Club board.</p>
        </div>
        <div className="comment-board-layout">
          <form
            className={`comment-input-note note-${color}${sticking ? " is-sticking" : ""}`}
            onSubmit={submit}
          >
            <span className="note-tape" aria-hidden="true" />
            <label htmlFor="comment-text">Your note</label>
            <textarea
              id="comment-text"
              value={text}
              maxLength={200}
              onChange={event => setText(event.target.value)}
              placeholder="Write something kind…"
              rows={5}
              required
            />
            <div className="comment-note-meta">
              <label htmlFor="comment-name">Your name</label>
              <input
                id="comment-name"
                value={name}
                maxLength={60}
                onChange={event => setName(event.target.value)}
                placeholder="Anonymous"
              />
              <span>{text.length}/200</span>
            </div>
            <div
              className="comment-color-picker"
              aria-label="Choose a note color"
            >
              {commentColors.map(option => (
                <button
                  key={option}
                  type="button"
                  className={`color-swatch swatch-${option}${color === option ? " selected" : ""}`}
                  aria-label={`${option} note`}
                  aria-pressed={color === option}
                  onClick={() => setColor(option)}
                />
              ))}
            </div>
            <p className="comment-guidance">
              Keep it kind — offensive language will be blocked.
            </p>
            <button className="stick-button" type="submit" disabled={sticking}>
              {sticking ? "Sticking…" : "Stick it!"}
            </button>
            <input
              className="comment-honeypot"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={event => setWebsite(event.target.value)}
              aria-hidden="true"
            />
            {error && (
              <p className="comment-error" role="alert">
                {error}
              </p>
            )}
          </form>
          <div className="comment-board" aria-label="Visitor comment board">
            <div className="comment-board-topline">
              <span>From the Club community</span>
              <span>{comments.length} notes</span>
            </div>
            <div className="comment-board-scroll">
              {comments.map(comment => (
                <CommentNote
                  key={comment.id}
                  comment={comment}
                  entering={comment.id === enteringId}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage({ onAdd }: { onAdd: (p: Product) => void }) {
  const featured = products.slice(5, 9);
  return (
    <>
      <main>
        <section className="hero-section">
          <div
            className="hero-foliage"
            style={{ backgroundImage: `url(${foliageImage})` }}
          />
          <div className="hero-glass-panel glass">
            <div className="eyebrow">A South African 1st</div>
            <h1>
              The Honeycomb
              <br />
              <em>Club</em>
            </h1>
            <p>
              Welcome to The Honeycomb Club (THC) – A premium cannabis
              experience.
            </p>
            <Link className="button button-light" href="/shop">
              Shop Now <ArrowRight size={16} />
            </Link>
            <div className="hero-meta">
              <span>High-CBD / low-THC</span>
              <span>Menlyn Park · Pretoria</span>
            </div>
          </div>
          <div className="hero-caption">
            Botanical retail
            <br />
            for grown-up rituals
          </div>
        </section>
        <section className="intro-section container">
          <div className="section-kicker">01 / The Club</div>
          <div className="intro-grid">
            <h2>
              A calmer way
              <br />
              to <em>browse.</em>
            </h2>
            <div>
              <p className="lede">
                The Honeycomb Club sells cannabis (CBD – non psychoactive) to
                users in the South African market. We are here to make the best
                cannabis products available in a safe, legal and comfortable
                environment.
              </p>
              <p>
                Adult-only retail, state-of-the-art technology, forward-looking
                green practices, and a deep respect for security and safety.
              </p>
              <Link className="text-link" href="/about">
                Meet the Club <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        <section className="category-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="section-kicker">02 / Explore</div>
                <h2>
                  Made for the
                  <br />
                  <em>everyday.</em>
                </h2>
              </div>
              <p>Four considered ways into the collection.</p>
            </div>
            <div className="category-grid">
              {categories.map((category, index) => (
                <Link
                  className={`category-card cat-${index + 1}${index < 4 ? " has-image" : ""}`}
                  key={category.name}
                  href={`/shop?category=${category.name}`}
                  style={
                    index < 4
                      ? {
                          backgroundImage: `linear-gradient(180deg, rgba(14, 26, 20, 0.16), rgba(14, 26, 20, 0.72)), url(${index === 0 ? wellnessImage : index === 1 ? cosmeticsImage : index === 2 ? smokeablesImage : ediblesImage})`,
                        }
                      : undefined
                  }
                >
                  <div>
                    <span className="eyebrow">{category.eyebrow}</span>
                    <h3>{category.name}</h3>
                    <p>{category.copy}</p>
                  </div>
                  <ArrowRight size={18} />
                </Link>
              ))}
            </div>
          </div>
        </section>
        <CommentBoard />
        <section className="featured-section container">
          <div className="section-heading">
            <div>
              <div className="section-kicker">03 / Selected</div>
              <h2>
                Trending
                <br />
                <em>at the Club.</em>
              </h2>
            </div>
            <Link className="text-link" href="/shop">
              Browse all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="product-grid featured-grid">
            {featured.map(product => (
              <ProductCard key={product.slug} product={product} onAdd={onAdd} />
            ))}
          </div>
        </section>
        <section className="about-teaser">
          <div className="container about-teaser-inner">
            <div className="glass about-card">
              <div className="section-kicker">04 / About us</div>
              <h2>
                Cannabis, with a little more <em>care.</em>
              </h2>
              <p>
                We believe in making cannabis available to the communities we
                serve in a safe and legal manner. High-CBD, low-THC means our
                collection is bred, grown, and presented with intention.
              </p>
              <Link className="button button-light" href="/about">
                Read our story <ArrowRight size={16} />
              </Link>
            </div>
            <div className="about-photo">
              <video
                className="about-video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Close-up edible moment from The Honeycomb Club"
              >
                <source src="/assets/about-club.mp4" type="video/mp4" />
              </video>
              <span>
                Over 7 years
                <br />
                of growing
              </span>
            </div>
          </div>
        </section>
        <section className="visit-section container">
          <div className="visit-copy">
            <div className="section-kicker">05 / Visit us</div>
            <h2>
              Come by for a<br />
              <em>closer look.</em>
            </h2>
            <p>
              Shop LF33, Menlyn Park Shopping Centre
              <br />
              Atterbury Road & Lois Ave
              <br />
              Menlyn, Pretoria, 0063
            </p>
            <Link className="text-link" href="/contact">
              Plan your visit <ArrowRight size={16} />
            </Link>
          </div>
          <div className="visit-details glass">
            <div>
              <span className="eyebrow">Open hours</span>
              <p>
                Mon–Thu 9am–8pm
                <br />
                Fri & Sat 9am–9pm
                <br />
                Sunday 9am–6pm
              </p>
            </div>
            <div>
              <span className="eyebrow">WhatsApp</span>
              <a href="https://wa.me/+27673418785">+27 67 341 8785</a>
            </div>
            <div className="map-art">
              <MapPin size={18} />
              <span>
                Menlyn Park
                <br />
                Pretoria
              </span>
            </div>
          </div>
        </section>
      </main>
      <ComplianceBand />
    </>
  );
}

function ShopPage({ onAdd }: { onAdd: (p: Product) => void }) {
  const search = new URLSearchParams(window.location.search);
  const initial = (search.get("category") as Category | null) || "All";
  const [category, setCategory] = useState<Category | "All">(initial);
  const [query, setQuery] = useState("");
  const shown = products.filter(
    p =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <main className="shop-page container">
      <div className="shop-intro">
        <div>
          <div className="section-kicker">The collection</div>
          <h1>
            Our <em>shop.</em>
          </h1>
        </div>
        <p>
          Premium CBD products, grown and selected with care.
          <br />
          Less than 0.001% THC. SAHPRA approved.
        </p>
      </div>
      <div className="shop-tools">
        <div className="filter-pills">
          <button
            className={category === "All" ? "active" : ""}
            onClick={() => setCategory("All")}
          >
            All products
          </button>
          {categories.map(c => (
            <button
              key={c.name}
              className={category === c.name ? "active" : ""}
              onClick={() => setCategory(c.name)}
            >
              {c.name}
            </button>
          ))}
        </div>
        <label className="shop-search">
          <Search size={16} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search shop"
          />
        </label>
      </div>
      <div className="shop-count">
        <span>{shown.length} products</span>
        <span>Adult-only collection</span>
      </div>
      <div className="product-grid shop-grid">
        {shown.map(product => (
          <ProductCard key={product.slug} product={product} onAdd={onAdd} />
        ))}
      </div>
    </main>
  );
}

function ProductPage({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product) => void;
}) {
  return (
    <main className="product-page container">
      <Link className="back-link" href="/shop">
        <ChevronLeft size={16} /> Back to shop
      </Link>
      <div className="product-detail">
        <div
          className="product-detail-image"
          style={{ background: product.accent }}
        >
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-detail-copy">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="detail-price">{money(product.price)}</div>
          <div className="detail-rule" />
          <p className="lede">
            A considered selection from The Honeycomb Club’s South African CBD
            collection.
          </p>
          <div className="detail-notes">
            <span>CBD focused</span>
            <span>Under 0.001% THC</span>
            <span>SAHPRA approved</span>
          </div>
          <button className="button button-dark" onClick={() => onAdd(product)}>
            Add to cart <ShoppingBag size={16} />
          </button>
          <p className="detail-fineprint">
            For adult customers only. Please use products responsibly and
            according to the packaging directions.
          </p>
        </div>
      </div>
      <ComplianceBand />
    </main>
  );
}

function AboutPage() {
  return (
    <main className="content-page container">
      <div className="content-hero">
        <div className="section-kicker">The Club</div>
        <h1>
          A little more
          <br />
          <em>care.</em>
        </h1>
        <p className="lede">
          The Honeycomb Club (THC) is, at our core, a cannabis club committed to
          making cannabis available to the communities we serve in a safe and
          legal manner.
        </p>
      </div>
      <div className="content-split">
        <div
          className="content-image"
          style={{ backgroundImage: `url(${foliageImage})` }}
        />
        <div className="content-copy">
          <p>
            We intend to make cannabis available to the communities that we
            serve in a safe and legal manner. We will always remain respectful
            and vigilant with regards to the country’s laws during this
            evolution towards legalisation.
          </p>
          <p>
            We believe in a careful, legal approach to the cannabis plant. As
            such, we have embarked on our mission — to make available the best
            quality cannabis products.
          </p>
          <p>
            We have been breeding and growing high CBD cannabis for over 7
            years, and are excited to offer these products to people all over
            the world.
          </p>
          <div className="quote">
            “The best cannabis products, in a safe, legal and comfortable
            environment.”
          </div>
        </div>
      </div>
      <ComplianceBand />
    </main>
  );
}

function ContactPage() {
  return (
    <main className="content-page container">
      <div className="content-hero">
        <div className="section-kicker">Find us</div>
        <h1>
          Come by
          <br />
          <em>the Club.</em>
        </h1>
        <p className="lede">
          We’re in Menlyn Park, Pretoria. Say hello in person or reach out on
          WhatsApp.
        </p>
      </div>
      <div className="contact-grid">
        <div className="contact-card glass">
          <MapPin size={24} />
          <span className="eyebrow">Address</span>
          <p>
            Shop LF33, Menlyn Park Shopping Centre
            <br />
            Atterbury Road & Lois Ave
            <br />
            Menlyn, Pretoria, 0063
          </p>
          <a
            className="text-link"
            href="https://maps.google.com/?q=Menlyn+Park+Shopping+Centre"
          >
            Open in Maps <ArrowRight size={16} />
          </a>
        </div>
        <div className="contact-card glass">
          <Sparkles size={24} />
          <span className="eyebrow">Open hours</span>
          <p>
            Mon–Thu 9am–8pm
            <br />
            Fri & Sat 9am–9pm
            <br />
            Sunday 9am–6pm
          </p>
          <a className="text-link" href="https://wa.me/+27673418785">
            WhatsApp the Club <ArrowRight size={16} />
          </a>
        </div>
        <form
          className="contact-form glass"
          onSubmit={e => {
            e.preventDefault();
            alert("Thanks — the Club will be in touch.");
          }}
        >
          <span className="eyebrow">Send a note</span>
          <h2>Let’s talk.</h2>
          <input placeholder="Your name" required />
          <input type="email" placeholder="Email address" required />
          <textarea placeholder="How can we help?" rows={4} required />
          <button className="button button-dark" type="submit">
            Send message <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </main>
  );
}

function TermsPage() {
  return (
    <main className="content-page container">
      <div className="content-hero">
        <div className="section-kicker">Good to know</div>
        <h1>
          Terms &<br />
          <em>conditions.</em>
        </h1>
        <p className="lede">
          Please read these terms before using the website or purchasing from
          The Honeycomb Club.
        </p>
      </div>
      <div className="terms-card glass">
        <h2>Adult-only retail</h2>
        <p>
          All products sold by The Honeycomb Club are intended for adults only.
          By using this site, you confirm that you are of legal age in your
          country.
        </p>
        <h2>Product information</h2>
        <p>
          All our products contain less than 0.001% THC. Products are SAHPRA
          approved. Product packaging and directions should be followed
          carefully.
        </p>
        <h2>Responsible use</h2>
        <p>
          The Honeycomb Club respects South African law and does not make
          medical promises or health claims. Please use products responsibly and
          keep them away from children.
        </p>
        <h2>Retail details</h2>
        <p>
          Shop LF33, Menlyn Park Shopping Centre, Atterbury Road & Lois Ave,
          Menlyn, Pretoria, 0063.
        </p>
      </div>
    </main>
  );
}

function CartPage({
  lines,
  onChange,
  onCheckout,
}: {
  lines: CartLine[];
  onChange: (slug: string, delta: number) => void;
  onCheckout: () => void;
}) {
  const total = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0
  );
  return (
    <main className="content-page container">
      <div className="content-hero">
        <div className="section-kicker">Your selection</div>
        <h1>
          Cart <em>notes.</em>
        </h1>
        <p className="lede">
          Keep your considered picks together, then continue to Yoco checkout.
        </p>
      </div>
      {lines.length === 0 ? (
        <div className="terms-card glass empty-cart-page">
          <ShoppingBag size={30} strokeWidth={1.2} />
          <h2>Your cart is waiting.</h2>
          <p>Browse the collection and return here when you are ready.</p>
          <Link className="button button-dark" href="/shop">
            Browse the shop <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="cart-page-list terms-card glass">
          {lines.map(line => (
            <div className="cart-line" key={line.product.slug}>
              <img src={line.product.image} alt="" />
              <div className="line-copy">
                <strong>{line.product.name}</strong>
                <span>{money(line.product.price)}</span>
                <div className="qty">
                  <button
                    aria-label={`Decrease ${line.product.name} quantity`}
                    onClick={() => onChange(line.product.slug, -1)}
                  >
                    −
                  </button>
                  <span>{line.quantity}</span>
                  <button
                    aria-label={`Increase ${line.product.name} quantity`}
                    onClick={() => onChange(line.product.slug, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <strong>{money(line.product.price * line.quantity)}</strong>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
          <button className="button button-dark full" onClick={onCheckout}>
            Continue to checkout <ArrowRight size={16} />
          </button>
        </div>
      )}
    </main>
  );
}

function CheckoutPage({
  lines,
  onBack,
}: {
  lines: CartLine[];
  onBack: () => void;
}) {
  const total = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0
  );
  return (
    <main className="checkout-page container">
      <button className="back-link" onClick={onBack}>
        <ChevronLeft size={16} /> Back to cart
      </button>
      <div className="checkout-layout">
        <div className="checkout-form">
          <div className="section-kicker">Checkout</div>
          <h1>
            Almost <em>there.</em>
          </h1>
          <p className="muted">
            Complete your details and the Club will prepare your order.
          </p>
          <div className="form-grid">
            <label>
              <span className="sr-only">First name</span>
              <input placeholder="First name" autoComplete="given-name" />
            </label>
            <label>
              <span className="sr-only">Last name</span>
              <input placeholder="Last name" autoComplete="family-name" />
            </label>
            <label className="full-span">
              <span className="sr-only">Email address</span>
              <input
                className="full-span"
                placeholder="Email address"
                type="email"
                autoComplete="email"
              />
            </label>
            <label className="full-span">
              <span className="sr-only">Delivery or collection address</span>
              <input
                className="full-span"
                placeholder="Delivery or collection address"
                autoComplete="street-address"
              />
            </label>
          </div>
          <div className="payment-choice">
            <span className="eyebrow">Payment</span>
            <div className="payment-card">
              <img src={yocoUrl} alt="Yoco" />
              <span>Secure checkout with Yoco</span>
              <span className="payment-dot" />
            </div>
          </div>
          <button
            className="button button-dark full"
            onClick={() => alert("Checkout is ready for Yoco payment handoff.")}
          >
            Place order · {money(total)} <ArrowRight size={16} />
          </button>
          <p className="detail-fineprint">
            This preview includes the full checkout experience. Connect your
            Yoco account to process live payments.
          </p>
        </div>
        <aside className="checkout-summary glass">
          <span className="eyebrow">Your order</span>
          {lines.map(line => (
            <div className="summary-line" key={line.product.slug}>
              <span>
                {line.product.name} × {line.quantity}
              </span>
              <strong>{money(line.product.price * line.quantity)}</strong>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
          <p className="compliance-note">
            18+ · CBD-focused · under 0.001% THC
          </p>
        </aside>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <img src={logoUrl} alt="The Honeycomb Club" className="footer-logo" />
          <p className="footer-note">
            A South African first.
            <br />A premium cannabis experience.
          </p>
        </div>
        <div>
          <span className="eyebrow">Visit us</span>
          <p>
            Shop LF33, Menlyn Park Shopping Centre
            <br />
            Pretoria, 0063
          </p>
        </div>
        <div>
          <span className="eyebrow">Open hours</span>
          <p>
            Mon–Thu 9am–8pm
            <br />
            Fri & Sat 9am–9pm
            <br />
            Sunday 9am–6pm
          </p>
        </div>
        <div>
          <span className="eyebrow">Follow</span>
          <div className="socials">
            <a
              href="https://www.instagram.com/thehoneycombclubza/"
              aria-label="Follow The Honeycomb Club on Instagram"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={15} strokeWidth={1.8} aria-hidden="true" />
            </a>
            <a
              href="https://wa.me/27673418785"
              aria-label="Contact The Honeycomb Club on WhatsApp"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={15} strokeWidth={1.8} aria-hidden="true" />
            </a>
            <a
              href="https://www.facebook.com/theHoneycombClubZA"
              aria-label="Follow The Honeycomb Club on Facebook"
              target="_blank"
              rel="noreferrer"
            >
              <Facebook size={15} strokeWidth={1.8} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© The Honeycomb Club</span>
        <div>
          <Link href="/terms">Terms & Conditions</Link>
          <span>CBD · non-psychoactive · under 0.001% THC</span>
        </div>
      </div>
    </footer>
  );
}

export default function Storefront() {
  const [location, navigate] = useLocation();
  const [matchProduct, params] = useRoute("/product/:slug");
  const [greetingDone, setGreetingDone] = useState(() => {
    if (window.location.pathname !== "/") return true;
    return window.sessionStorage.getItem("thc-greeting-seen") === "yes";
  });
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      return JSON.parse(window.localStorage.getItem("thc-cart") || "[]");
    } catch {
      return [];
    }
  });
  const age = useStoredAgeGate();
  useScrollBabble(location);
  useEffect(() => {
    window.localStorage.setItem("thc-cart", JSON.stringify(lines));
  }, [lines]);
  const add = (product: Product) =>
    setLines(current => {
      const found = current.find(l => l.product.slug === product.slug);
      return found
        ? current.map(l =>
            l.product.slug === product.slug
              ? { ...l, quantity: l.quantity + 1 }
              : l
          )
        : [...current, { product, quantity: 1 }];
    });
  const change = (slug: string, delta: number) =>
    setLines(current =>
      current.flatMap(l =>
        l.product.slug === slug
          ? l.quantity + delta > 0
            ? [{ ...l, quantity: l.quantity + delta }]
            : []
          : [l]
      )
    );
  const activeProduct = matchProduct
    ? products.find(p => p.slug === params?.slug)
    : undefined;
  const page = location.split("?")[0];
  const finishGreeting = () => {
    window.sessionStorage.setItem("thc-greeting-seen", "yes");
    setGreetingDone(true);
  };
  const content =
    matchProduct && !activeProduct ? (
      <main className="content-page container account-page">
        <div className="content-hero">
          <div className="section-kicker">The Club</div>
          <h1>
            Product not
            <br />
            <em>found.</em>
          </h1>
          <p className="lede">
            That product is not in the current collection. Browse the full shop
            to find another considered pick.
          </p>
          <Link className="button button-dark" href="/shop">
            Browse the shop <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    ) : activeProduct ? (
      <ProductPage product={activeProduct} onAdd={add} />
    ) : page === "/shop" ? (
      <ShopPage onAdd={add} />
    ) : page === "/about" ? (
      <AboutPage />
    ) : page === "/contact" ? (
      <ContactPage />
    ) : page === "/terms" ? (
      <TermsPage />
    ) : page === "/cart" ? (
      <CartPage
        lines={lines}
        onChange={change}
        onCheckout={() => navigate("/checkout")}
      />
    ) : page === "/checkout" ? (
      lines.length ? (
        <CheckoutPage lines={lines} onBack={() => setDrawer(true)} />
      ) : (
        <CartPage
          lines={lines}
          onChange={change}
          onCheckout={() => navigate("/shop")}
        />
      )
    ) : page === "/account" ? (
      <main className="content-page container account-page">
        <div className="content-hero">
          <div className="section-kicker">Your Club account</div>
          <h1>
            Keep it
            <br />
            <em>personal.</em>
          </h1>
          <p className="lede">
            Sign in to view your orders and keep your favourites close.
          </p>
          <a className="button button-dark" href="/api/oauth/login">
            Continue to account <ArrowRight size={16} />
          </a>
        </div>
      </main>
    ) : (
      <HomePage onAdd={add} />
    );
  return (
    <div className="site-app">
      {page === "/" && !greetingDone && (
        <GreetingIntro onDone={finishGreeting} />
      )}
      <SiteHeader
        cartCount={lines.reduce((sum, l) => sum + l.quantity, 0)}
        onCart={() => setDrawer(true)}
        onSearch={() => setSearch(true)}
      />
      {content}
      <Footer />
      {drawer && (
        <CartDrawer
          lines={lines}
          onClose={() => setDrawer(false)}
          onChange={change}
          onCheckout={() => {
            setDrawer(false);
            navigate("/checkout");
          }}
        />
      )}
      {search && <SearchModal onClose={() => setSearch(false)} />}
      {!age.verified && <AgeGate onConfirm={age.confirm} />}
    </div>
  );
}
