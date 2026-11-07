import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AutoRefresh from '@/components/AutoRefresh';
import { api } from '@/lib/api';
import { C, TOKENS } from '@/lib/tokens';
import { DataRain, OrbPulse } from '@/components/HeroLive';
import PageBg from '@/components/PageBg';
import { num, usd, pct, bps, short, n, legacy } from '@/lib/fmt';

export const revalidate = 60;

export default async function Home() {
  const [f, rb, h, c, u] = await Promise.all([api('urm/fortress'), api('rage/buying-protocol'), api('hestia/overview'), api('circle/overview'), api('urm/overview')]);
  const fs = f?.fountainState || {};
  const yieldPct = Number(fs.config?.yieldRate) / 100;
  const ex = 1000;
  const ov = f?.fortressState?.overview || {};
  const price = n(f?.urmPrice ?? u?.price);
  const words = [
    `$${num(price, 3)}`, 'PEG OK', `DEFENSE ${usd(ov.totalDefense)}`, `fURM ${num(fs.toAssets, 4)}`, `APY ${pct(yieldPct, 0)}`,
    `RAGE FMV $${num(rb?.rbpView?.fmv, 2)}`, `BACKING ${num(rb?.rbpView?.backingPerShare, 3)}`, `TREASURY ${usd(rb?.rbpView?.activeAssetsUsdcValue)}`,
    `HESTIA BURNED ${pct(h?.supply?.burnedPercent)}`, `CIRCLE BURNED ${pct(c?.supply?.burnedPercent)}`, `MCAP ${usd(u?.marketCap)}`, 'BASE', '$1.00',
  ];
  const checkedAt = Date.now();
  const cards = [
    { id: 'urm', href: '/urm/fountain', theme: 'cream', name: 'URM Fountain', tag: 'Stablecoin yield', text: 'Deposit URM, get fURM. Your fURM count stays the same while each one is worth more URM every day.', big: pct(yieldPct, 0), small: 'target APY', cta: 'Open Fountain', logo: null },
    { id: 'rage', href: '/rage', theme: 'rage', name: 'RAGE', tag: 'Volatility harvesting', text: 'Backed by a treasury of HESTIA and ULTRAROUND. When RAGE trades above fair value, the premium goes back into the backing.', big: num(rb?.rbpView?.backingPerShare, 3), small: 'backing per share', cta: 'Open RAGE', logo: '/assets/rage.png' },
    { id: 'hestia', href: '/hestia', theme: 'hestia', name: 'HESTIA', tag: 'Deflationary store of value', text: 'Paired to USDC on Base. The Chaos Engine builds a reserve from fees, then buys HESTIA and burns it.', big: pct(h?.supply?.burnedPercent), small: 'of supply burned', cta: 'Open HESTIA', logo: '/assets/hestia.png' },
    { id: 'circle', href: '/circle', theme: 'circle', name: 'ULTRAROUND', tag: '$CIRCLE, burns on every sell', text: 'No transaction tax. Pool fees fuel the burn, so supply only goes one way.', big: num(c?.supply?.burned), small: 'CIRCLE burned', cta: 'Open ULTRAROUND', logo: '/assets/ultraround.png' },
  ];
  return (
    <div className="page has-bg">
      <AutoRefresh />
      <Nav />
      <PageBg img="/hero/statue-wide.jpg" color="#022596" wide>
        <OrbPulse price={price} checkedAt={checkedAt} defense={usd(ov.totalDefense)} />
        <DataRain words={words} />
      </PageBg>
      <section className="phero" aria-labelledby="hero-h">
        <div className="wrap phero-copy">
          <h1 id="hero-h" className="h1">Onchain money that works while <span className="acc">you sleep.</span></h1>
          <p className="lead">A stablecoin built like a fortress, a treasury that harvests volatility, and two tokens that only get scarcer. All on Base.</p>
          <div className="row" style={{ marginTop: 32, gap: 12 }}>
            <Link className="btn btn-sun btn-lg" href="/urm/fountain">Start with Fountain</Link>
            <a className="btn btn-outline btn-lg" href="#trust">Read the audit</a>
          </div>
          <p className="readout peg-m glass-clear"><span><b>PEG CHECK</b> ${num(price, 3)} · {Math.abs(price - 1) <= 0.01 ? 'on peg' : 'off peg'}</span></p>
          <p className="sr">URM peg check: ${num(price, 3)}. Total defense {usd(ov.totalDefense)}.</p>
        </div>
      </section>
      <section className="band"><div className="wrap stats">
        <div className="stat"><b style={{ color: '#d7b067' }}>{num(fs.toAssets, 4)}</b><span>fURM share price</span></div>
        <div className="stat"><b style={{ color: '#ff3d3d' }}>{num(rb?.rbpView?.backingPerShare, 3)}</b><span>RAGE backing per share</span></div>
        <div className="stat"><b style={{ color: '#ff7a2e' }}>{pct(h?.supply?.burnedPercent)}</b><span>of HESTIA burned</span></div>
        <div className="stat"><b style={{ color: '#5d93f0' }}>{pct(c?.supply?.burnedPercent)}</b><span>of CIRCLE burned</span></div>
      </div></section>
      <section className="wrap sec">
        <div className="split">
          <div className="main">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
              <h2 className="h2" id="news">Latest</h2>
              <a className="tap" href="https://x.com/URMdollar" style={{ fontWeight: 700 }}>All updates on X</a>
            </div>
            <div className="news" style={{ marginTop: 24 }}>
              <Link href="/urm/fountain"><time>Oct 12</time><span><strong>Fountain URM is live.</strong> <span className="muted">Deposit URM, get fURM, earn a yield paid by the Fortress.</span></span></Link>
              <Link href="/urm/cdp"><time>Aug 27</time><span><strong>The URM CDP is live.</strong> <span className="muted">Lock collateral and mint URM against it.</span></span></Link>
              <Link href="/rage#next"><time>Soon</time><span><strong>Black Card is in review.</strong> <span className="muted">Lock an option, harvest the premium. Details on the RAGE page.</span></span></Link>
            </div>
          </div>
          <div className="side cream glass-rim" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <b className="eyebrow">FOUNTAIN PREVIEW</b>
              <span className="pill" style={{ background: 'var(--ink)', color: 'var(--accent)' }}>{pct(yieldPct, 0)} target APY</span>
            </div>
            <p className="muted" style={{ margin: '20px 0 0', fontWeight: 600 }}>If you deposit</p>
            <p style={{ margin: '4px 0 0', fontSize: 'var(--fs-title1)', fontWeight: 800 }}>{num(ex)} URM</p>
            <div className="grid" style={{ marginTop: 14, gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 }}>
              <div className="tile"><span>In 6 months</span><b>{num(ex * (1 + yieldPct / 200))} URM</b></div>
              <div className="tile"><span>In 12 months</span><b>{num(ex * (1 + yieldPct / 100))} URM</b></div>
            </div>
            <ul className="list" style={{ marginTop: 12 }}>
              <li><span className="k">You receive</span><strong>about {num(ex * Number(fs.depositShares), 1)} fURM</strong></li>
              <li><span className="k">Deposit / withdraw fee</span><strong>{bps(fs.config?.depositFee, 0)} / {bps(fs.config?.withdrawFee)}</strong></li>
              <li><span className="k">Withdraw</span><strong>anytime, to URM or USDC</strong></li>
            </ul>
            <Link href="/urm/fountain" className="btn btn-ink btn-lg btn-block" style={{ marginTop: 16 }}>Go to Fountain</Link>
            <p className="muted" style={{ fontSize: 'var(--fs-footnote)', textAlign: 'center', margin: '10px 0 0' }}>Target rate, not a promise. <Link href="/risks" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Read the risks</Link></p>
          </div>
        </div>
      </section>
      <section className="wrap sec">
        <h2 className="h2">Four engines.</h2>
        <p className="punch">One ecosystem feeding itself.</p>
        <div className="grid" style={{ marginTop: 40, gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 20 }}>
          {cards.map((k) => (
            <article key={k.id} data-theme={k.theme === 'cream' ? undefined : k.theme} className={k.theme === 'cream' ? 'cream' : 'card'} style={{ background: k.theme === 'cream' ? undefined : 'var(--bg)', boxShadow: k.theme === 'circle' ? 'inset 0 0 0 1px var(--line)' : undefined, borderRadius: 'var(--r-lg)', padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {k.logo ? <img src={k.logo} alt="" width={60} height={60} /> : <span style={{ width: 60, height: 60, borderRadius: 999, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="44" height="44" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46.4" fill="none" stroke="#b0bfd6" strokeWidth="7.2" /><circle cx="50" cy="50" r="27.8" fill="none" stroke="#b0bfd6" strokeWidth="7.65" /><circle cx="50" cy="50" r="16.5" fill="#f1ebdd" /></svg></span>}
                <div><h3 className="h3">{k.name}</h3><span className="muted" style={{ fontSize: 'var(--fs-subhead)', fontWeight: 600 }}>{k.tag}</span></div>
              </div>
              <p style={{ margin: 0, fontSize: 'var(--fs-body)', lineHeight: 1.5 }}>{k.text}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '2px 10px' }}><span style={{ fontSize: 'var(--fs-display)', fontWeight: 800, color: k.theme === 'cream' ? undefined : 'var(--accent)' }}>{k.big}</span><span className="muted" style={{ fontWeight: 600 }}>{k.small}</span></div>
              <Link href={k.href} className={'btn btn-block ' + (k.theme === 'cream' ? 'btn-ink' : 'btn-primary')} style={{ marginTop: 'auto' }}>{k.cta}</Link>
            </article>
          ))}
        </div>
      </section>
      <section id="trust" className="wrap sec">
        <div className="cream glass-rim" style={{ padding: 'clamp(24px,4vw,48px)' }}>
          <h2 className="h2">Before you connect.</h2>
          <p className="punch" style={{ color: 'var(--inkSub)' }}>Don&apos;t trust us. Check everything.</p>
          <div className="grid" style={{ marginTop: 36, gap: 28 }}>
            <div><h3 className="h3" style={{ fontSize: 'var(--fs-title3)' }}>Read before you sign</h3><p className="muted" style={{ lineHeight: 1.5 }}>Connecting only reads your address and balances. It never moves funds.</p></div>
            <div><h3 className="h3" style={{ fontSize: 'var(--fs-title3)' }}>Audited and verified</h3><p className="muted" style={{ lineHeight: 1.5 }}>Audit reports, verified code on Basescan, Fountain listed on DefiLlama.</p></div>
            <div><h3 className="h3" style={{ fontSize: 'var(--fs-title3)' }}>Leave anytime</h3><p className="muted" style={{ lineHeight: 1.5 }}>Withdraw from Fountain whenever you want, to URM or USDC. {bps(fs.config?.withdrawFee)} withdraw fee.</p></div>
          </div>
          <div className="grid2" style={{ marginTop: 28 }}>
            <div className="white" style={{ overflowX: 'auto' }}>
              <p className="muted" style={{ margin: 0, padding: '14px 14px 4px', fontSize: 'var(--fs-footnote)', letterSpacing: 1.5, fontWeight: 700 }}>CONTRACTS ON BASE</p>
              <table className="ctable" aria-label="Contracts on Base"><tbody>
                {[['URM token', TOKENS.URM, true], ['URM Fortress', C.fortress, false], ['Fountain', C.fountain, false], ['URM CDP', C.cdp, false], ['RAGE', C.rage, true], ['HESTIA', C.hestia, true], ['ULTRAROUND', C.circle, true]].map(([l, a, t]) => (
                  <tr key={l as string}><td><b>{l as string}</b></td><td className="mono">{short(a as string)}</td><td><a href={`https://basescan.org/${t ? 'token' : 'address'}/${a}`} style={{ color: 'var(--ink)', textDecoration: 'underline', fontWeight: 700 }}>Basescan</a></td></tr>
                ))}
              </tbody></table>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p className="eyebrow" style={{ margin: 0 }}>AUDITS AND PAPERS</p>
              {[['URM audit', '/urm/audit.pdf'], ['Fountain audit', '/urm/fountain-audit.pdf'], ['CDP audit', '/urm/cdp-audit.pdf'], ['RAGE audit', '/rage/audit.pdf'], ['HESTIA audit', '/hestia/audit.pdf'], ['Hestia Mine audit', '/hestia/mine-audit.pdf']].map(([l, p]) => <a key={l} className="chip chip-line" href={legacy(p)}>{l}</a>)}
              <Link className="chip chip-ink" href="/risks">Read the risks</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="wrap sec">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div><h2 className="h2">New to crypto?</h2><p className="punch">From your card to onchain yield in four taps.</p></div>
          <Link className="btn btn-primary btn-lg" href="/earn">Start with Earn</Link>
        </div>
        <div className="steps">
          {[['Passkey wallet', 'Face ID or a fingerprint. No seed phrase to write down.'], ['Buy USDC', 'With a card or Apple Pay. 0.2% gateway fee, shown before you confirm.'], ['Swap to URM', 'One tap on Base. Gas is covered for you.'], ['Deposit', `Into Fountain, at a ${pct(yieldPct, 0)} target APY. Withdraw anytime.`]].map(([t, d], i) => <div key={t} className="step"><span className="n">{i + 1}</span><h3>{t}</h3><p>{d}</p></div>)}
        </div>
      </section>
      <Footer />
    </div>
  );
}
