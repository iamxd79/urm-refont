import Link from 'next/link';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { bps, num } from '@/lib/fmt';

export const revalidate = 60;
export const metadata = { title: 'Risks' };

export default async function Risks() {
  const [f, cdp, r] = await Promise.all([api('urm/fortress'), api('urm/cdp'), api('rage/buying-protocol')]);
  const fs = f?.fountainState || {}, cfg = r?.config || {};
  const days = (s: any) => Math.round(Number(s) / 86400);
  const items: [string, string, string][] = [
    ['Everything', 'Smart contracts can fail', 'Audits lower the risk, they don’t remove it. A bug, an exploit or a problem in a protocol we depend on (Uniswap, Peapods, Base itself) can lose funds. ULTRAROUND and the Temple audit reports are still being published.'],
    ['URM', 'The peg can break', 'URM is defended by onchain backing and an automated keeper, not by dollars in a bank. In a sharp sell-off the defense can run out of room and URM can trade below $1 for a while, or for good.'],
    ['Fountain', 'The yield is a target', `Fountain targets ${bps(fs.config?.yieldRate, 0)} a year, paid by the Fortress from pool fees and protocol profit. When profit is low the real rate drops: it is ${bps(fs.effectiveRate)} today. Withdrawals cost ${bps(fs.config?.withdrawFee)} and are limited to what is withdrawable at that moment (${num(fs.windowRemaining)} URM right now).`],
    ['CDP', 'Borrowing costs and collateral risk', `Borrowing costs ${bps(cdp?.currentInterestRate)} a year today and the rate moves with utilization. Your collateral is RAGE, HESTIA or ULTRAROUND, all volatile. Read how positions are settled in the CDP docs before you borrow, because you can lose collateral. Using the CDP to chase Fountain yield loses money while the borrow rate is above the yield.`],
    ['RAGE', 'Volatile, with exit delays', `RAGE is backed by HESTIA and ULTRAROUND, both volatile. Minting waits ${days(cfg.mintDelay)} days, claims wait ${days(cfg.claimDelay)} days and pay a ${num(cfg.claimFee)}% fee. Asset Decline Protection limits but does not remove losses. The market price can sit above or below fair value.`],
    ['HESTIA, ULTRAROUND', 'Small, volatile tokens', 'Burns cut supply, they don’t set a price floor. Both tokens can drop fast, and liquidity can be thin when you want out.'],
    ['Mine, Temple', 'A game between players', 'Rewards come from other players and change as people join, compound and sell. Players who stop compounding lose share. Sells are capped by a limit. You can get back less than you put in.'],
    ['Coming next', 'Not live, can change', 'Black Card, The line and Confluence are in review. Terms, dates and rewards can change or be dropped before launch.'],
  ];
  return (
    <div className="page">
      <section className="wrap" style={{ paddingTop: 72 }}>
        <h1 className="h1">Read this<br /><span className="acc">before you deposit.</span></h1>
        <p className="lead">Plain English, no small print. If something here doesn&apos;t sit right with you, don&apos;t deposit. Nothing on this site is financial advice.</p>
      </section>
      <section className="wrap sec">
        <div className="grid2">
          {items.map(([tag, t, d]) => (
            <article key={t} className="card glass-rim">
              <span className="acc" style={{ fontSize: 'var(--fs-footnote)', fontWeight: 700, letterSpacing: 1.5 }}>{tag.toUpperCase()}</span>
              <h2 className="h3" style={{ marginTop: 8 }}>{t}</h2>
              <p className="muted" style={{ lineHeight: 1.6, marginBottom: 0 }}>{d}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="wrap sec">
        <div className="cream glass-rim" style={{ padding: 36 }}>
          <h2 className="h3">What we do about it</h2>
          <ul style={{ lineHeight: 1.9, fontSize: 'var(--fs-body)', paddingLeft: 22 }}>
            <li>Audits for URM, Fountain, the CDP, RAGE, HESTIA and the Hestia Mine</li>
            <li>Every contract verified on Basescan, every number on this site read live from the chain</li>
            <li>Connecting a wallet only reads balances. It never moves funds.</li>
          </ul>
          <div className="row" style={{ marginTop: 8 }}><Link className="chip chip-ink" href="/#trust">Audits and contracts</Link><a className="chip chip-line" href="https://ultraroundmoney.gitbook.io/ultraroundmoney/">Read the docs</a></div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
