# The Honeycomb Club — implementation plan

## Product scope

A polished responsive South African CBD retail storefront using the real Honeycomb Club content and catalog from the live site. The experience includes a home page, shop with category filters and search, product detail views, cart drawer, checkout flow, account prompt, contact page, about page, terms page, Yoco badge, 18+ age gate, compliance messaging, real product imagery, a sticky-note visitor comment board with an `/api/comments` REST endpoint, and the supplied Honeycombcollage.pdf as the visual reference.

## Design

### Design movement

**Botanical glassmorphism / boutique apothecary retail** — a calm, premium wellness storefront that pairs warm timber, smoked glass, blurred foliage, and editorial product still life.

### Core principles

- Make the product catalog feel curated rather than crowded: large imagery, compact metadata, and generous breathing room.
- Let glass, leaf texture, and warm wood carry the visual story while the interface stays highly legible.
- Use direct, respectful, compliance-aware language with no medical or health promises.
- Make every interaction feel quiet and deliberate: subtle transforms, clear state feedback, and no decorative motion that competes with shopping.

### Color philosophy

Forest green is the brand anchor and signals grounded trust. Sage and misty off-white keep the site airy, while oak and cream bring the warmth of the Menlyn Park retail environment. Near-black green is reserved for contrast moments and legal/compliance bands.

### Layout paradigm

A layered editorial canvas: the hero uses an offset glass panel over drifting foliage, the catalog uses a generous asymmetrical split between filters and products, and content sections alternate between full-bleed botanical moments and quiet cream surfaces.

### Signature elements

1. Frosted glass panels with 1px light borders and a soft botanical blur behind them.
2. A layered vertical glass strip used as a divider between brand story and commerce.
3. Rounded product cards with editorial image crops and small uppercase category markers.

### Interaction philosophy

Motion communicates place and state. Use custom ease-out for entrances and buttons, ease-in-out for slow drift, and avoid animating frequent or keyboard-driven actions. Cart and age-gate transitions are short and spatially anchored. Hover effects are pointer-gated and reduced-motion users receive gentler opacity changes.

### Animation

Use transform and opacity only for UI transitions. Use `cubic-bezier(0.23, 1, 0.32, 1)` for enter/exit, `cubic-bezier(0.77, 0, 0.175, 1)` for drift, and 150–250ms for controls. Hero foliage drifts slowly as a marketing explanation of the botanical / glass relationship; product cards stagger by 50ms on first reveal.

### Typography system

Avenir first, then Avenir Next, Nunito Sans, Montserrat, sans-serif. Large headings use a light weight with tight line-height and generous letter spacing. UI labels are bold, uppercase, and small. Body copy stays at a relaxed 1.6 line-height.

### Brand essence

A South African-first CBD retail club making premium, low-THC cannabis approachable, legal, and beautifully presented. **Grounded, refined, welcoming.**

### Brand voice

Headlines are concise and assured. CTAs are active but never pushy.

- “A South African 1st”
- “A calmer way to browse.”

### Wordmark & logo

Use the supplied Honeycomb Club logo exactly as provided. Do not redraw, recolour, or recreate it.

### Signature brand color

Deep forest green `#1F3D2B`.

## Project structure

- `client/src/App.tsx` — route wiring and global providers.
- `client/src/pages/Storefront.tsx` — the responsive site shell, page sections, filters, cart, checkout, and modals.
- `client/src/data/products.ts` — the real live-site product catalog, categories, prices, and imagery.
- `client/src/index.css` — design tokens, glassmorphism surfaces, responsive layout, and motion rules.
- `server/_core/index.ts` — health, OAuth, platform, and sanitized visitor comments REST endpoints.
- `public/manus-routes.json` — declared page routes for the managed preview.
- `app.config.ts` — platform project logo metadata.

## Implementation notes

The current build uses local React state for the shopping flow, so the preview is immediately interactive without requiring payment credentials. Yoco is represented as the requested payment brand badge and checkout handoff affordance. Account remains a clear entry point to the platform-auth flow rather than a fake credential form.

The comment board uses local React state for optimistic updates and loads/posts through `/api/comments`. The Preview/server implementation keeps up to 30 sanitized notes in memory, applies a honeypot and ten-second per-IP rate limit, and is intentionally easy to replace with a persistent REST, Firebase, or Supabase adapter later. The board uses smaller notes in a denser grid with the transparent Honeycomb logo as a low-contrast watermark behind them. Note colors and rotations are persisted in each API response; all board motion uses transform/opacity and collapses to a fade/instant placement under reduced motion.
