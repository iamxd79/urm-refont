---
title: The Buying Protocol
description: Invest USDC, mint RAGE at fair value, claim when you want out. The ones who leave pay the ones who stay.
section: Invest
order: 2
product: rage
---
## Investing

1. Invest between {{rage.min}} and {{rage.max}} in USDC per transaction.
2. The protocol buys HESTIA and ULTRAROUND ({{rage.hestiaPct}} / {{rage.circlePct}}) and locks them in the treasury.
3. You get an option that turns into RAGE at fair value after {{rage.mintDelay}} days.
4. Investors get a {{rage.bonus}} bonus on the underlying tokens.

## Fair value and backing

Fair value is what the treasury says one RAGE is worth. Backing per RAGE is {{rage.backing}} right now. When RAGE trades above fair value, the premium flows into the backing, which raises fair value for every holder.

## Claiming

Want out? Claim your RAGE for its share of the backing.

- Claims wait {{rage.claimDelay}} days.
- A {{rage.claimFee}} claim fee stays in the protocol and raises backing per share for everyone who stays.

## Asset Decline Protection

Asset Decline Protection is set at {{rage.adp}} today. It limits how much a drop in HESTIA and ULTRAROUND hits you. It doesn't remove the risk.

> **Risk:** RAGE is backed by volatile tokens, and both minting and claiming involve waiting. The market price can sit above or below fair value. Read the [risks](/risks).

[Invest in RAGE](/rage)
