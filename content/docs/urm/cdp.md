---
title: CDP
description: Lock RAGE, HESTIA or ULTRAROUND and mint $URM against it. Liquidity without selling.
section: Borrow
order: 1
product: urm
---
## Two ways to use it

::diagram cdp

- **Borrow:** lock your tokens, mint $URM, keep your upside. Repay to get your collateral back.
- **Leverage:** the $URM you mint buys more of your collateral in the same transaction. Bigger upside, bigger downside.

Every position is an NFT. You can settle it, unwind it or transfer it whenever you want.

## Collateral

| Collateral | Collateral ratio |
|---|---|
| RAGE | {{cdp.rage}} |
| HESTIA | {{cdp.hestia}} |
| ULTRAROUND | {{cdp.circle}} |

The ratio is your collateral value divided by the $URM you mint. At 3x, $300 of collateral mints about $100 of $URM. The app shows the exact amount before you sign.

## Interest

Borrowing costs {{cdp.rate}} a year right now. The rate moves with utilization ({{cdp.util}} today), and interest builds daily. CDP interest goes to the Fortress, which supports the peg and funds Fountain.

{{cdp.available}} $URM is available to borrow right now.

> **Risk:** your collateral is volatile. If its value falls, you can lose it when positions are settled. Read how settlement works and the [risks](/risks) before you borrow.

[Open a position](/urm/cdp)
