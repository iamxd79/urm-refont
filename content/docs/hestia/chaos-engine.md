---
nav: HESTIA engine
title: The Hestia Chaos Engine
description: Two ways to burn, one USDC reserve, and an Automator that tunes it all.
section: Under the hood
order: 7
product: hestia
---
## Two ways to shrink the supply

### Direct burns

The engine uses its USDC reserve to buy HESTIA on the market and send it to the burn address. It works best when the price dips, because the same dollars buy and burn more HESTIA. That's why HESTIA's engine is called the buyer of last resort.

### Liquidity contraction

From time to time, the engine pulls a small slice of HESTIA and USDC out of the main pool:

- the HESTIA it pulls is burned;
- the USDC goes to the reserve, or, if the reserve is full, buys and burns more HESTIA.

Repeated over time, this shrinks the tradable supply and grows the reserve.

## Smoke Fees and Hestia's rage

::diagram hestia-engine

These are the engine's two moves:

- **Smoke Fees** collect pool fees into the USDC reserve, or send them to fund ULTRAROUND's Chaos Engine. They run every {{hestia.smoke}}.
- **Hestia's rage** burns part of her sell-side liquidity while adding the same buying pressure. It can switch to a regenerative mode.

The reserve holds {{hestia.reserve}} of a {{hestia.cap}} capacity right now. Live countdowns for both moves are on the [HESTIA page](/hestia).

## The Automator

The engine doesn't fully give up control. An Automator role can tune a few settings:

| Setting | What it controls |
|---|---|
| Liquidity reduction rate | How much liquidity Hestia's rage removes |
| Burn vs reserve ratios | How collected tokens and USDC split between burning, the reserve and ULTRAROUND |
| Timing | How often each move can run |
| Reserve capacity | How much USDC stays on hand for future buy-and-burns |

The team oversees the Automator for now. In a later phase, the plan is to hand it to an AI agent that runs the engine and talks with the community.
