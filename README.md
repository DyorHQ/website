# DyorHQ — website

The landing page for **DyorHQ**, the RWA HQ for social trading: a self-custodial app on Monad
for swapping tokens, trading perps, launching coins and collecting moments.

## What this is

A single-page, dependency-free static site — no build step, no runtime network requests
(fonts are self-hosted, icons are inline SVG). Every product visual is a real screenshot of the
DyorHQ iOS app; everything else (the frosted holographic glass cards, the dark 3D rooms, the
chrome-ribbon pill, the giant masked type) is drawn in plain CSS.

Six screens, in order: light hero with a fan of glass cards → dark tiled room with the phone →
bento grid of the four products → dark floor scene with the positions slab → giant "DyorHQ"
type that reveals the scene through its letters as you scroll → email capture.

## Files

- **`index.html`** — the page. All copy and content live here.
- **`css/tokens.css`** — colours, holographic palette, glass, radii, easing, shadows, fonts.
- **`css/site.css`** — base layer: reset, type (light 300 / bold 700 mixing), nav, section
  layouts and card placement, footer, the iPhone frame.
- **`css/holo.css`** — the frosted glass cards and the 3D-looking shapes inside them, the
  holographic pills, the dark glass bar, the small glass glyphs.
- **`css/scene.css`** — the dark rooms (tiled wall, concrete floor, arrow sculptures), the
  tilted slab device, and the pinned scene + masked giant type.
- **`css/bento.css`** — the bento grid and its four tile looks.
- **`css/motion.css` + `js/motion.js`** — word-by-word headline, card fly-ins and idle float,
  staggered reveals, the pill morph, mouse parallax and the email form. IntersectionObserver
  only (no scroll listeners); everything is visible without JS and under reduced motion.
- **`assets/`** — brand wordmark, real app screens (`screens/`), venue logos (`brand/venues/`),
  bundled OFL fonts (Manrope, IBM Plex Mono).

## Run locally

```bash
python3 -m http.server 4173
```

Then open http://127.0.0.1:4173.

## Notes

- The email form has no backend yet: Submit opens the visitor's mail client with a message to
  team@dyorhq.fun. Swap `[data-capture]` in `js/motion.js` for a real endpoint when there is one.
- "Open app" links to the in-page scene until there is an App Store / web-app URL.
- App screens show the real app with example market data. Nothing here is investment advice or
  an offer to trade. DyorHQ is self-custodial: only you hold your keys.
