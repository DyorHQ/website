# DyorHQ — website

The official landing page for **DyorHQ**, the RWA HQ for social trading: a self-custodial
mobile app on Monad for launching stock-backed coins, copying on-chain traders, and trading
perps and swaps.

## What this is

A single-page, dependency-free static site. Every visual is built from the DyorHQ design
system and the real iOS app UI — the same Home, Trade (Swap / Perps), Launch, Moments and
Strategy screens the app ships, rendered as interactive iPhone mockups.

- **`index.html`** — the page.
- **`css/tokens.css`** — the design tokens (mirrors the app's `design-tokens.css`): monochrome
  canvas, Bodoni Moda / Manrope / IBM Plex Mono, and the Monad-purple accent the iOS app uses.
- **`css/site.css`** — landing-page layout and components.
- **`css/phone.css`** — the iPhone mockups that reproduce the app screens.
- **`js/main.js`** — theme (system default, choice persisted locally), navigation, scroll
  reveals, the Swap/Perps toggle and the interactive leverage ruler.
- **`js/icons.js`** — inline SVG icon set.
- **`assets/`** — brand wordmark and monogram, bundled OFL fonts, and token logos.

No build step and no runtime network requests: fonts are self-hosted, icons are inline.

## Run locally

```bash
python3 -m http.server 4173
```

Then open http://127.0.0.1:4173.

## Design system

The identity is the editorial DyorHQ wordmark and D/Q monogram, a monochrome palette
(`#F7F7F5` / `#18191B`), and a single interactive accent — Monad purple `#836EF9`. Positive
and negative values always carry a sign, never colour alone. Fonts are bundled under
`assets/fonts` with their SIL Open Font License files.

## Notes

Market data and app previews on the page are illustrative. Nothing here is investment advice
or an offer to trade.

## Hero photograph

`assets/photo/hero-hand.jpg` is a composite: a photograph from Unsplash
(photo id `1717390758666-97dc77ef7a8c`, free for commercial use under the Unsplash
License) with a real screenshot of the DyorHQ iOS app perspective-mapped onto the
phone's screen. The screen inherits the photograph's own light falloff, so it reads
as a real photo of the app rather than a pasted mockup. The photo's background is
warmed to `#F2EEE7` to match the hero card exactly, which is why there is no seam.
