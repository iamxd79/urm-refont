# ultraroundmoney.com, the new site

Next.js 14 (App Router) + wagmi + viem. Every number comes live from the URM API (`api.ultraroundmoney.com`), refreshed every 60 seconds. Wallet connect is real: Coinbase Wallet / passkey, any browser wallet, and WalletConnect when a project id is set. Connecting only reads balances.

For now, deposit, invest, borrow, mine and swap buttons open the current URM app in a new tab, where users sign as usual. Native transaction flows come next, after review.

## Pages

| Route | Page |
| --- | --- |
| `/` | Homepage |
| `/urm`, `/urm/fountain`, `/urm/cdp` | URM stablecoin, Fountain, CDP |
| `/rage`, `/rage/otc`, `/rage/referral` | RAGE, Rage OTC, Referral |
| `/hestia`, `/hestia/mine` | HESTIA, Hestia Mine |
| `/circle`, `/circle/temple` | ULTRAROUND, Ultraround Temple |
| `/earn` | Earn (card to yield) |

## Run it

```bash
npm install
npm run dev        # live data from the API
npm run mock       # offline, uses the fixtures in /mock
```

## Deploy on Vercel

1. Push this folder to GitHub.
2. vercel.com/new, import the repo. Framework: Next.js. No build settings to change.
3. Env vars (all optional), see `.env.example`:
   - `NEXT_PUBLIC_WC_PROJECT_ID` turns on WalletConnect (free id from cloud.reown.com)
   - `NEXT_PUBLIC_BASE_RPC` a private Base RPC (Alchemy, QuickNode). Default is the public one.
   - `NEXT_PUBLIC_LEGACY_APP_URL` where action buttons go. Default `https://ultraroundmoney.com`.
   - `NEXT_PUBLIC_PREVIEW_BANNER=0` hides the preview bar and lets search engines index the site. Leave it unset while the team reviews.
4. Deploy. Every push to `main` redeploys.

## Where things live

- `lib/api.ts` server-side fetch from the URM API (no CORS issues, cached 60s)
- `lib/tokens.ts` every contract address
- `components/Panels.tsx` the interactive panels (OTC, CDP, Mine/Temple, swap, referral, your position)
- `components/ConnectModal.tsx` wallet connect
- `app/globals.css` design tokens per product (`data-theme="rage|hestia|circle"`)

Design rules: solid colours only, no gradients, glass only on borders, no dashed lines. Space Grotesk for punch lines, Inter for everything else.

## Design system

Everything lives in `app/globals.css`, in this order: tokens, base, type, layout, glass, components, navigation, heroes, motion.

- **Type scale:** `--fs-caption` 12 · `--fs-footnote` 13 · `--fs-subhead` 15 · `--fs-callout` 16 · `--fs-body` 17 · `--fs-title3` · `--fs-title2` · `--fs-title1` · `--fs-display`, plus fluid `--fs-h1/h2/h3`. In components use `fontSize: 'var(--fs-…)'`, never a raw number.
- **Hierarchy:** `.eyebrow` (caps label) → `.h1`/`.h2` → `.punch` (Space Grotesk) → `.lead` → body → `.muted` footnotes. One `h1` per page, `h2` per section, `h3` per card.
- **Space:** 4pt grid, `--s-1` (4) to `--s-22` (88). `--gutter` and `--section` shrink on phones.
- **Radius (concentric):** `--r-xs` 12 · `--r-sm` 16 · `--r-md` 20 · `--r-lg` 28 · `--r-xl` 32 · `--r-pill`. An inner shape uses the outer radius minus its padding.
- **Glass effect** (mirrors SwiftUI `.glassEffect()`):
  - `.glass-regular`: floating chrome (nav, tabs)
  - `.glass-clear`: small chips on photos (brand badge, peg readout)
  - `.glass-solid`: menus over content
  - `.glass-interactive`: add to a glass control for the spring press
  - `.glass-rim`: solid card with a `--glass-rim` (3px) refracting edge

  Tints come from `--glass-tint*` per product theme, and everything falls back to solid with *Reduce transparency*.
- **Breakpoints:** 400 (small phones), 720 (phones), 860 (tables stack), 900 (mobile nav and heroes), 1100 (nav compacts).
