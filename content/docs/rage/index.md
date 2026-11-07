---
title: RAGE
description: A token backed by a treasury of HESTIA and ULTRAROUND. When RAGE trades above fair value, the premium goes back into the backing.
section: Invest
order: 1
product: rage
---
## What it is

RAGE takes the treasury model made famous by MicroStrategy and ETH Strategy and rebuilds it onchain, with no company and no debt. Every RAGE investment buys the backing assets, HESTIA and ULTRAROUND, so RAGE is the ecosystem's demand engine: it buys in good markets and bad ones.

Right now: market price {{rage.price}}, fair value {{rage.fmv}}, treasury {{rage.treasury}}.

## What backs it

::diagram backing

Every investment splits into {{rage.hestiaPct}} HESTIA and {{rage.circlePct}} ULTRAROUND. Both are wrapped on Peapods Finance as Peapods pods, where they earn yield from market volatility, and locked in the treasury.

## The four pieces

- **Yield-earning backing.** The wrapped tokens earn from volatility, which grows the treasury.
- **Asset Decline Protection.** Limits how much a fall in HESTIA and ULTRAROUND hits RAGE holders. It reduces losses, it doesn't remove them.
- **Delayed claims.** Minting and claiming both wait, which slows bank runs.
- **Accretive dilution.** New RAGE is minted at fair value, and anything paid above it raises backing for everyone already in.

## Supply

RAGE has no fixed supply and no team allocation. New RAGE is minted when people invest. In practice its supply is limited by its backing: HESTIA and ULTRAROUND keep burning, so there's less and less to back new RAGE with.

## Three ways to get RAGE

| Way | How | Price |
|---|---|---|
| [Invest](/docs/rage/buying-protocol) | Mint new RAGE with USDC | Fair value, after a short wait |
| [Rage OTC](/docs/rage/otc) | Trade HESTIA, ULTRAROUND or $URM | Fair value plus a bonus |
| Market | Swap on Base | Market price, premium included |
