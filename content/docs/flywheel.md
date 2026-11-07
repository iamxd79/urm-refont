---
title: How it fits together
description: Four tokens, one loop. Each one covers a weakness of the others so the system keeps working in any market.
section: Start here
order: 3
---
## The problems it's built to avoid

- **Tokens fighting each other.** Several tokens usually split the same liquidity and attention.
- **Depending on people behaving perfectly.** Many treasury models only work if everyone keeps buying or holding.
- **Deflation that stalls.** Burns paid by trading fees slow down exactly when volume drops.

## Who does what

| Token | Role |
|---|---|
| ULTRAROUND | Volume-driven deflation. Every trade earns fees that end up burned. |
| HESTIA | Stability. Paired to USDC, builds a dollar reserve, and can feed ULTRAROUND when its volume is low. |
| RAGE | Demand. Every investment force-buys HESTIA and ULTRAROUND, in bull or bear markets. |
| $URM | The stable layer. A dollar defended by all three, with yield in Fountain and borrowing in the CDP. |

## The loop

1. People trade HESTIA. Pool fees build its USDC reserve.
2. The HESTIA Chaos Engine burns HESTIA, and can send extra to ULTRAROUND's engine to keep its burns going.
3. More ULTRAROUND activity means more fees and more burns.
4. RAGE investments buy HESTIA and ULTRAROUND, currently split {{rage.hestiaPct}} / {{rage.circlePct}}.
5. Higher HESTIA and ULTRAROUND prices raise RAGE's fair value. Yield on the wrapped backing grows the treasury.
6. People who leave RAGE pay a claim fee that stays with those who stay.
7. Burns shrink the supply of HESTIA and ULTRAROUND, and the loop starts again.

$URM sits on top: its peg defense is backed by RAGE, HESTIA and ULTRAROUND, and CDP borrowers pay interest that funds the Fortress and Fountain.

## What's planned

More Chaos Engines, an AI agent running the HESTIA engine in a later phase, cross-chain expansion, and new products built from the same pieces. None of these are live yet, and plans can change.
