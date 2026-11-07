---
title: The ULTRAROUND Chaos Engine
description: The Circular Burn Loop. Pool fees in, ULTRAROUND burned, with a burn rate that speeds up when the market turns.
section: Under the hood
order: 5
product: circle
---
## The Circular Burn Loop

::diagram burn-loop

1. The protocol provides ULTRAROUND and WETH liquidity in a Uniswap v3 pool on Base. The position is held as an NFT.
2. Every trade in that pool pays a normal swap fee, part of which goes to the protocol's position.
3. The Chaos Engine regularly collects those fees, in WETH and ULTRAROUND.
4. Collected ULTRAROUND goes to the burn address, gone for good.
5. 90% of the collected WETH goes back into the pool to power more trading. 10% pays for gas and maintenance through the deployer wallet. It never goes to individuals.

Right now {{circle.weth}} WETH is waiting in the engine.

## Cause Chaos

The Chaos Engine watches price and market conditions and changes the burn rate:

- **When the price falls**, it can call `causeChaos`. Stored WETH is released into rapid back-and-forth trades that generate fees and extra burns, pushing back against sell pressure.
- **When the price rises**, burns slow down so more fees are saved for later defense.

So every sell adds fees that end up burned, and the engine works hardest when the market is weakest.

## The Chaos Automator

A back-end service runs the engine onchain, on schedule. You can see burns per day and the last Cause Chaos on the [ULTRAROUND page](/ultraround).

## When volume is low

Fee-funded burns slow down when nobody trades. That's the gap HESTIA covers: see [HESTIA and ULTRAROUND](/docs/hestia/flywheel).
