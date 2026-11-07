import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AutoRefresh from '@/components/AutoRefresh';
import ConnectButton from '@/components/ConnectButton';
import Check, { addr } from '@/components/Check';
import { api } from '@/lib/api';
import { num, usd, pct, bps } from '@/lib/fmt';
import { C } from '@/lib/tokens';

export const revalidate = 60;

export default async function Home() {
  const [f, rb, h, c, u] = await Promise.all([api('urm/fortress'), api('rage/buying-protocol'), api('hestia/overview'), api('circle/overview'), api('urm/overview')]);
  const fs = f?.fountainState || {};
  const yieldPct = Number(fs.config?.yieldRate) / 100;
  const ex = 1000;
  const cards = [
    { id: 'urm', href: '/urm/fountain', theme: 'cream', name: 'URM Fountain', tag: 'Stablecoin yield', text: 'Deposit URM, get fURM. Your fURM count stays the same while each one is worth more URM every day.', big: pct(yieldPct, 0), small: 'target APY', cta: 'Open Fountain', logo: null },
    { id: 'rage', href: '/rage', theme: 'rage', name: 'RAGE', tag: 'Volatility harvesting', text: 'Backed by a treasury of HESTIA and ULTRAROUND. When RAGE trades above fair value, the premium goes back into the backing.', big: num(rb?.rbpView?.backingPerShare, 3), small: 'backing per share', cta: 'Open RAGE', logo: '/assets/rage.png' },
    { id: 'hestia', href: '/hestia', theme: 'hestia', name: 'HESTIA', tag: 'Deflationary store of value', text: 'Paired to USDC on Base. The Chaos Engine builds a reserve from fees, then buys HESTIA and burns it.', big: pct(h?.supply?.burnedPercent), small: 'of supply burned', cta: 'Open HESTIA', logo: '/assets/hestia.png' },
    { id: 'circle', href: '/circle', theme: 'circle', name: 'ULTRAROUND', tag: '$CIRCLE, burns on every sell', text: 'No transaction tax. Pool fees fuel the burn, so supply only goes one way.', big: num(c?.supply?.burned), small: 'CIRCLE burned', cta: 'Open ULTRAROUND', logo: '/assets/ultraround.png' },
  ];
  return (
    <div className="page">
      <AutoRefresh />
      <Nav />
      <section className="wrap" style={{ padding: '88px 24px 72px' }}>
        <div className="split" style={{ alignItems: 'center', gap: 56 }}>
          <div className="main">
            <h1 className="h1">Onchain money<br />that works while<br />you sleep.</h1>
            <p className="lead">A stablecoin with real yield, a treasury that harvests volatility, and two tokens that only get scarcer.</p>
            <div className="row" style={{ marginTop: 36, gap: 14 }}>
              <Link className="btn btn-primary btn-lg" href="/urm/fountain">Start with Fountain</Link>
              <a className="btn btn-outline btn-lg" href="#trust">Read the audit</a>
            </div>
          </div>
          <div className="side cream glass" style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <b className="muted" style={{ fontSize: 14, letterSpacing: 1.5 }}>FOUNTAIN PREVIEW</b>
              <span className="pill" style={{ background: 'var(--ink)', color: 'var(--accent)' }}>{pct(yieldPct, 0)} target APY</span>
            </div>
            <p className="muted" style={{ margin: '24px 0 0', fontWeight: 600 }}>If you deposit</p>
            <p style={{ margin: '4px 0 0', fontSize: 40, fontWeight: 800 }}>{num(ex)} URM</p>
            <div className="grid" style={{ marginTop: 16, gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 }}>
              <div className="tile"><span>In 6 months</span><b>{num(ex * (1 + yieldPct / 200))} URM</b></div>
              <div className="tile"><span>In 12 months</span><b>{num(ex * (1 + yieldPct / 100))} URM</b></div>
            </div>
            <ul className="list" style={{ marginTop: 14 }}>
              <li><span className="k">You receive</span><strong>about {num(ex * Number(fs.depositShares), 1)} fURM</strong></li>
              <li><span className="k">Deposit / withdraw fee</span><strong>{bps(fs.config?.depositFee, 0)} / {bps(fs.config?.withdrawFee)}</strong></li>
              <li><span className="k">Paid by</span><strong>the Fortress</strong></li>
            </ul>
            <Link href="/urm/fountain" className="btn btn-ink btn-lg btn-block" style={{ marginTop: 18 }}>Go to Fountain</Link>
          </div>
        </div>
      </section>
      <section className="band"><div className="wrap stats">
        <div className="stat"><b style={{ color: '#d7b067' }}>{num(fs.toAssets, 4)}</b><span>fURM share price</span></div>
        <div className="stat"><b style={{ color: '#ff3d3d' }}>{num(rb?.rbpView?.backingPerShare, 3)}</b><span>RAGE backing per share</span></div>
        <div className="stat"><b style={{ color: '#ff7a2e' }}>{pct(h?.supply?.burnedPercent)}</b><span>of HESTIA burned</span></div>
        <div className="stat"><b style={{ color: '#5d93f0' }}>{pct(c?.supply?.burnedPercent)}</b><span>of CIRCLE burned</span></div>
      </div></section>
      <section className="wrap sec">
        <h2 className="h2">Four engines.</h2>
        <p className="punch">One ecosystem feeding itself.</p>
        <div className="grid" style={{ marginTop: 40, gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 20 }}>
          {cards.map((k) => (
            <article key={k.id} data-theme={k.theme === 'cream' ? undefined : k.theme} className={k.theme === 'cream' ? 'cream' : 'card'} style={{ background: k.theme === 'cream' ? undefined : 'var(--bg)', boxShadow: k.theme === 'circle' ? 'inset 0 0 0 1px var(--line)' : undefined, borderRadius: 28, padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {k.logo ? <img src={k.logo} alt="" width={60} height={60} /> : <span style={{ width: 60, height: 60, borderRadius: 999, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="44" height="44" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46.4" fill="none" stroke="#b0bfd6" strokeWidth="7.2" /><circle cx="50" cy="50" r="27.8" fill="none" stroke="#b0bfd6" strokeWidth="7.65" /><circle cx="50" cy="50" r="16.5" fill="#f1ebdd" /></svg></span>}
                <div><h3 className="h3">{k.name}</h3><span className="muted" style={{ fontSize: 15, fontWeight: 600 }}>{k.tag}</span></div>
              </div>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5 }}>{k.text}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}><span style={{ fontSize: 48, fontWeight: 800, color: k.theme === 'cream' ? undefined : 'var(--accent)' }}>{k.big}</span><span className="muted" style={{ fontWeight: 600 }}>{k.small}</span></div>
              <Link href={k.href} className={'btn btn-block ' + (k.theme === 'cream' ? 'btn-ink' : 'btn-primary')} style={{ marginTop: 'auto' }}>{k.cta}</Link>
            </article>
          ))}
        </div>
      </section>
      <section id="trust" className="wrap sec">
        <div className="cream glass" style={{ padding: 'clamp(24px,4vw,48px)' }}>
          <h2 className="h2">Before you connect.</h2>
          <p className="punch" style={{ color: 'var(--inkSub)' }}>Don&apos;t trust us. Check everything.</p>
          <div className="grid" style={{ marginTop: 36, gap: 28 }}>
            <div><h3 className="h3" style={{ fontSize: 22 }}>Read before you sign</h3><p className="muted" style={{ lineHeight: 1.5 }}>Connecting only reads your address and balances. It never moves funds.</p></div>
            <div><h3 className="h3" style={{ fontSize: 22 }}>Audited and verified</h3><p className="muted" style={{ lineHeight: 1.5 }}>Audit reports, verified code on Basescan, Fountain listed on DefiLlama.</p></div>
            <div><h3 className="h3" style={{ fontSize: 22 }}>Leave anytime</h3><p className="muted" style={{ lineHeight: 1.5 }}>Withdraw from Fountain whenever you want, to URM or USDC. {bps(fs.config?.withdrawFee)} withdraw fee.</p></div>
          </div>
          <div className="row" style={{ marginTop: 28, gap: 10 }}>
            {[addr('URM', '0xf0e3349f00972475a5d16721796091aa3b997837', true), addr('Fortress', C.fortress), addr('Fountain', C.fountain), addr('CDP', C.cdp), addr('RAGE', C.rage, true), addr('HESTIA', C.hestia, true), addr('ULTRAROUND', C.circle, true)].map((l) => <a key={l.href} href={l.href} className="chip chip-line">{l.label}</a>)}
            <a className="chip chip-ink" href="https://ultraroundmoney.com/urm/audit.pdf">URM audit</a>
          </div>
        </div>
      </section>
      <section className="wrap sec">
        <div className="card glass" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
          <div><h2 className="h3">New to crypto?</h2><p className="muted" style={{ margin: '6px 0 0' }}>From your card to onchain yield in four taps. Market cap of URM today: {usd(u?.marketCap)}.</p></div>
          <div className="row"><Link className="btn btn-primary" href="/earn">Start with Earn</Link><ConnectButton className="btn btn-outline" /></div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
