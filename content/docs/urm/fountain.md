---
title: Fountain
description: Deposit $URM, get fURM. Your fURM count stays the same while each one is worth more $URM every day.
section: $URM
order: 3
---
## How it works

1. Deposit $URM into Fountain.
2. You receive fURM, a share of the vault.
3. The Fortress pays interest into the vault every day, so each fURM is worth more $URM over time. Right now 1 fURM = {{fountain.share}} $URM.
4. Withdraw anytime, back to $URM or to USDC.

No claiming and no rebasing. Your fURM balance never changes. Its value does.

## The numbers

| | Live |
|---|---|
| Target yield | {{fountain.target}} a year |
| Effective yield so far | {{fountain.effective}} |
| $URM deposited | {{fountain.staked}} |
| Deposit fee | {{fountain.depositFee}} |
| Withdrawal fee | {{fountain.withdrawFee}} |
| Withdrawable right now | {{fountain.window}} $URM |

**Target** is the rate the Fortress aims for. **Effective** is what the vault has actually paid over its life. When protocol profit is low, the real rate drops below the target.

## Withdrawal window

Withdrawals are limited to what's withdrawable at that moment. If the window is used up, wait for it to refill.

## Don't loop it

Borrowing $URM in the CDP to deposit in Fountain loses money while the borrow rate ({{cdp.rate}}) is above the yield.

> **Risk:** the yield is a target, not a promise, and it depends on the $URM peg holding. Read the [risks](/risks).

[Open Fountain](/urm/fountain)
