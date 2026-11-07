---
title: The Fortress
description: How the peg holds. One contract owns the liquidity and defends both sides.
section: Under the hood
order: 3
product: urm
---
## The idea

Most stablecoins rely on a company holding dollars. $URM relies on a contract. The Fortress owns $URM's liquidity, so it can act directly on the pool when the price moves away from $1.

## Defending both sides

::diagram fortress

- **Below $1:** the Fortress uses USDC to buy $URM back toward the peg. The room it has left right now: {{urm.usdcRoom}}.
- **Above $1:** the Fortress sells $URM into the pool to bring the price down. Room left right now: {{urm.urmRoom}} $URM.

## The keeper

An automated keeper checks the peg every 1.5 to 2 hours and triggers a defense step when one is needed. You can see when it last had to step in on the [$URM page](/urm).

## Towers

Towers are contracts registered with the Fortress that add to its defense. The CDP's position USDC sits in towers. {{urm.towers}} are registered right now.

## Where the money comes from

The Fortress earns from pool fees and protocol profit, and from CDP interest. So far the CDP has paid {{cdp.paid}} $URM to the Fortress. Part of these earnings fund [Fountain](/docs/urm/fountain)'s yield.

## Check it yourself

Every number on the [$URM dashboard](/urm) is read from the contracts and refreshed every minute. The Fortress address is on [Contracts](/docs/contracts), and the audit is linked from the [$URM page](/urm).
