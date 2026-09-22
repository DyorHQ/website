# DyorHQ landing page — build-from-scratch-to-deployment prompt (Replit)

> Paste everything under the line into Replit's AI Agent. First read **§0 Assets you must
> upload** — five real screenshots and the wordmark cannot be generated; without them the
> build will be incomplete. Fonts and venue logos can be fetched by the agent.

---

You are building the marketing landing page for **DyorHQ** — a self-custodial crypto app on
**Monad** for four things in one account: **Swap** tokens (best-price routing), trade **Perps**
(live order book), **Launch** coins (bonding curve), and collect **Moments** (mint media as NFTs
and earn). Tagline: "The RWA HQ for social trading." Brand accent is Monad purple `#836EF9`, but
the page's signature look is **frosted holographic glass** on a cool off-white canvas, with two
dark 3D "room" scenes cut in. Ship a single-page site and deploy it as a Replit Static Deployment.

## Non-negotiable quality bar
- **Premium, not "AI-generated."** No stock gradients on plain rectangles. Glass must read as
  frosted, translucent and lit; the dark scenes must read as real 3D rooms. If a section wouldn't
  look at home next to top-tier product design (Stripe, Linear, Arc), keep refining.
- **Dependency-free static site.** Plain HTML + CSS + vanilla JS. No framework, no bundler, no npm
  packages, no CDN scripts. Every visual except the real screenshots/logos is drawn in CSS
  (layered radial/conic/linear gradients, `filter: blur()`, `mix-blend-mode`, masks). Self-host
  fonts; **zero runtime third-party requests.**
- **Honest content.** Use the real app screenshots for product UI. Never draw fake app UI in
  HTML/CSS to stand in for a screen. Copy must be true for a self-custodial app: no fake
  testimonials, no invented pricing, no "FDIC"/custody claims. "Not investment advice; only you
  hold your keys."
- **Accessible & robust:** WCAG AA contrast, keyboard-reachable controls with visible focus, works
  with JavaScript disabled and under `prefers-reduced-motion`, and **no horizontal overflow** at
  375 / 768 / 1440 px. **No `scroll`/`wheel` event listeners** — use IntersectionObserver and CSS.

## 0. Assets you must upload (cannot be generated)
Put these in the repo before/while building. If one is missing, render a clean **empty labeled
device frame** in its place and list it as a TODO — do NOT fabricate app UI.
- `assets/screens/hero.png` — the app **Home** screen (portfolio). Used in the hero cards + scenes.
- `assets/screens/perps.png`, `assets/screens/swap.png`, `assets/screens/launch-empty.png`,
  `assets/screens/moments.png` — the other four app screens (portrait, ~1178×2560).
- `assets/brand/wordmark.png` — the "DyorHQ" wordmark (dark; the CSS inverts it on dark backgrounds).
- Favicons in `assets/brand/` (`favicon-32.png`, `favicon-64.png`, `apple-touch-icon.png`).

## Assets you should fetch
- **Fonts (self-host as woff2 under `assets/fonts/`, OFL):** Manrope (weights 300–800) and IBM Plex
  Mono (400 + 500/600). Download from Google Fonts / the IBM Plex GitHub release and include the
  OFL license files. Do not hotlink Google Fonts at runtime.
- **Venue logos → `assets/brand/venues/` (each project's official app icon):** Monad (monad.xyz,
  `/apple-touch-icon.png` — purple squircle), Perpl (perpl.xyz `/assets/webclip*.svg` — black mark),
  Uniswap (uniswap.org `/favicon.png` — pink unicorn), Kuru (kuru.io `/favicon-144x144.png` — green
  "K"), Monday Trade (monday.trade `/favicon/webclip.png` — lavender cup).

## 1. Tech + file structure
```
index.html
css/tokens.css   # colors, holographic palette, glass, radii, easing, shadows, @font-face; light+dark
css/site.css     # reset, type, nav, section layouts, card PLACEMENT, footer, iPhone device frame
css/holo.css     # frosted glass cards + the 3D shapes inside them, holographic pills, glass bar, glyphs
css/scene.css    # dark rooms (tiled wall, concrete floor, arrow sculptures), the slab device, giant masked type
css/bento.css    # the bento grid + tile looks
css/motion.css   # animation hidden-states + keyframes (paired with motion.js)
js/motion.js     # one strict-mode IIFE: reveals, word-split headline, card fly-ins, pill morph, parallax, theme toggle
assets/fonts/ assets/screens/ assets/brand/ assets/brand/venues/ assets/photo/
```

## 2. Design system (tokens.css)
- **Type:** display + body = **Manrope**; figures/labels = **IBM Plex Mono**. Headlines MIX
  weights in one line: light (300) + bold (700). A `✱` star glyph replaces an "o" (e.g. "in ✱ne
  app.") with a visually-hidden real "o" and an `aria-label` on the `<h1>` so it reads "one".
- **Light tokens:** `--canvas:#F3F3F6; --surface:#FFFFFF; --ink:#0F0F14; --text-2:#4A4A56;
  --text-3:#6E6E7C; --line:rgb(15 15 20/.12); --pill-bg:#0F0F14; --pill-fg:#FFFFFF;`
- **Dark scenes (same in both themes):** `--dark:#0D0D11; --dark-2:#15151A; --tile:#1A1A20;
  --tile-hi:#262630; --floor:#2A2A31; --floor-hi:#3A3A43; --arrow:#B9B9C4; --on-dark:#F4F4F8;`
- **Holographic palette:** `--holo-pink:#FF5C9C; --holo-blue:#4F7BFF; --holo-deep:#1E3CFF;
  --holo-orange:#FF7A2F; --holo-purple:#9B7BFF; --holo-cyan:#3AD8F6; --holo-ice:#DCE7FF;`
- **Glass:** translucent white face + `backdrop-filter: blur(18px) saturate(1.7)`, a bright top-left
  highlight, a hairline edge, an inner shadow bottom-right. Provide an `@supports not` fallback.
- **Radii:** card 22px, tile 24px, pill 999px, phone bezel 16.5%. **Easing:** `--ease-out:
  cubic-bezier(.16,1,.3,1)`.
- **Adaptive light/dark:** default light; support `prefers-color-scheme: dark` AND a `[data-theme]`
  toggle. In dark mode the canvas goes deep indigo (`#0F0E17`) with light text, BUT frosted glass
  cards and frosted tiles keep a white face with **dark ink** (re-scope `--ink`/`--surface` on those
  elements), the dark scenes are unchanged, and the giant-type cover stays **light** so the masked
  letters still read. No-flash inline `<script>` in `<head>` applies the saved theme before paint.

## 3. The six screens (in order)
1. **Hero (light).** Five frosted glass cards fanned diagonally from upper-left to lower-right, each
   tilted in 3D via per-card CSS custom props (`--x/--y/--z/--rz/--rx/--ry`) on a `perspective`
   parent. Inside each card, iridescent 3D-looking shapes (glass cubes, chrome spheres with rim
   light + specular, glossy rings, banded stripes) partly clipped by the card edge, built from
   layered gradients + blur + blend modes. Each card carries real DyorHQ data (portfolio US$ total,
   BTC perps, MON→USDC swap, launch curve, moments price). Left: a mono-caps chip
   (`✱ SPOT · PERPS · LAUNCH · MOMENTS`), the headline **"Everything on Monad, in ✱ne app."**
   (light + bold), then a row of three tiny glass glyphs with 2-line caps labels (Self-custodial /
   Best-price routing / One account) and a scroll cue. A faint giant "DYOR" watermark sits behind.
2. **Dark tiled room.** A charcoal wall of large bevelled square tiles, a concrete ledge along the
   bottom, and two huge pale-grey downward-arrow sculptures rising from the floor. The real Home
   screen stands centered in a premium iPhone frame (top cropped by the section). A frosted glass
   pill bar floats above it: `↑ Swap · ↓ Perps · ···`. Text left "Let's / learn / **more**", right
   "✱ / about / **DyorHQ**".
3. **Bento grid (light).** Three columns, seven tiles: a tall deep-blue holographic tile
   **"4 venues routed"** with the five real venue logos; frosted white ribbon tiles **"Best-price
   swaps"** and **"Self-custodial"**; dark tiles holding the real **perps**, **swap** and **moments**
   screens (phones cropped by the tile, caption bottom-left); a **"4-in-1 / One account"** stat tile
   with the swap screen peeking from a corner; a grey **"Moments · collect & earn"** tile with glass
   shapes. Tiles stagger in.
4. **Dark concrete-floor scene.** A receding tiled concrete floor; a tilted glossy near-black "slab"
   device (perspective + rotateX/rotateZ) showing a **Positions / Activity** list (dot · label ·
   value rows); the phone standing at the right. Text "Open / **DyorHQ**".
5. **Giant masked type.** A **sticky** pinned scene (the screen-4 room) with a full-viewport layer
   above it whose huge bold **"DyorHQ"** letters are cut out of a canvas-colored plate via an SVG
   `<mask>`, so the dark scene shows **through the letters** as the plate scrolls up over the stuck
   scene. Drive it with the natural sticky-cover (no scroll listeners); enhance with CSS
   `animation-timeline: scroll()/view()` where supported, with a static fallback. Under
   reduced-motion, keep the final look, no animation. The cover stays light in dark mode.
6. **Email capture (light).** Two glass cards fanning at the top; headline "Enter / **your mail**";
   a very wide iridescent **chrome-ribbon holographic pill** that morphs open from a circle when it
   enters view; an email input + dark **Submit** pill; a small pill bottom-left. Submit has no
   backend — validate and open `mailto:team@dyorhq.fun?subject=DyorHQ%20updates&body=<email>`, swap
   the button to "Opening mail…" for 2s, and show a fallback line with the address.

## 4. Navigation + footer
- Fixed, minimal nav: wordmark left; on the right a **theme toggle** (sun/moon) and an **"Open app"**
  pill (links to the in-page CTA / `#open` until there's a real app URL). No top rail, no menu.
- Nav ink color follows what's under it — white over the dark scenes, dark over the light giant
  plate, theme default elsewhere — computed with an **IntersectionObserver** on the nav's top band
  (do NOT use `mix-blend-mode`; it garbles over colored tiles). Toggle hidden when JS is off.
- Footer: wordmark, a few links (Product, About, X, email), and one honest legal line.

## 5. Motion (motion.js, one IIFE + motion.css)
- First line: add class `js` to `<html>`; scope every hidden state in motion.css under `html.js` AND
  `@media (prefers-reduced-motion: no-preference)`, so the page is fully visible without JS and for
  reduced-motion users.
- **Reveals** via IntersectionObserver (add `.in`, unobserve). Reveal a whole dark `.scene` as one
  unit so its sticky/pinned children (phone, slab) don't get stuck hidden. Hero plays on load.
- **Headline:** split visible text into per-word spans in place (preserve `<b>`, the star, the
  hidden "o"); stagger fade-up.
- **Cards:** fly in with the Web Animations API on the independent `translate`/`rotate`/`scale`
  properties so the CSS placement `transform` is never overwritten; then a gentle infinite float.
  Skip the blur keyframe and the float on `(pointer: coarse)`.
- **Pill:** measure its height into a custom prop, animate width from a circle to full when revealed.
- **Parallax:** on fine pointers, move the hero card container a few px with rAF easing (never the
  cards' own transforms).
- **Theme toggle:** flip `[data-theme]`, persist to `localStorage`, label it with the mode it
  switches to.
- Absolutely no `window` scroll/wheel listeners anywhere.

## 6. Acceptance checklist (verify before deploying)
- [ ] All six screens match §3; glass and dark scenes look premium, not generic.
- [ ] Real screenshots present (no fabricated app UI); five venue logos load.
- [ ] Light AND dark both correct; glass keeps dark ink in dark mode; giant letters still read.
- [ ] `<h1>` reads "Everything on Monad, in one app." to screen readers.
- [ ] No horizontal overflow at 375 / 768 / 1440; every control keyboard-reachable with a focus ring.
- [ ] Page fully visible with JS disabled and under reduced-motion; no `scroll`/`wheel` listeners.
- [ ] No console errors, no 404s, no runtime third-party requests (fonts self-hosted).

## 7. Run on Replit + deploy
This is a static site, so serve the files directly.

**Dev preview** — add a `.replit` at the repo root:
```
run = "python3 -m http.server 5000 --bind 0.0.0.0"
entrypoint = "index.html"

[[ports]]
localPort = 5000
externalPort = 80

[deployment]
deploymentTarget = "static"
publicDir = "."
```
Press **Run**; the webview serves `index.html`. (Any static server on `0.0.0.0:5000` works — e.g.
`npx --yes serve -l 5000` — but Python needs no install.)

**Deploy** — click **Deploy** → choose **Static** (no build command; **public directory = `.`**, the
folder with `index.html`). Static deployments are the cheapest tier and perfect here. After it goes
live, optionally add the custom domain **dyorhq.fun** under the deployment's **Settings → Domains**
and follow Replit's DNS instructions. (If the `.replit` `[deployment]` block is ignored by the
current UI, just set Type = Static and public dir = `.` in the Deploy dialog — that is the reliable
path.)

**Done when:** the Deploy dialog shows a live `*.replit.app` URL serving the page, the acceptance
checklist passes on that URL, and (optional) the custom domain resolves.
