import Link from 'next/link';
import FountainPreview from '@/components/FountainPreview';
import ProductLogo from '@/components/ProductLogo';
import Footer from '@/components/Footer';
import AutoRefresh from '@/components/AutoRefresh';
import { api } from '@/lib/api';
import { C, TOKENS } from '@/lib/tokens';
import { DataRain, OrbPulse } from '@/components/HeroLive';
import PageBg from '@/components/PageBg';
import CountUp from '@/components/motion/CountUp';
import PhoneDemo from '@/components/PhoneDemo';
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
    `$${num(price, 3)}`, Math.abs(price - 1) <= 0.01 ? 'PEG OK' : '', `DEFENSE ${usd(ov.totalDefense)}`, `fURM ${num(fs.toAssets, 4)}`, `APY ${pct(yieldPct, 0)}`,
    `RAGE FMV $${num(rb?.rbpView?.fmv, 2)}`, `BACKING ${num(rb?.rbpView?.backingPerShare, 3)}`, `TREASURY ${usd(rb?.rbpView?.activeAssetsUsdcValue)}`,
    `HESTIA BURNED ${pct(h?.supply?.burnedPercent)}`, `ULTRAROUND BURNED ${pct(c?.supply?.burnedPercent)}`, `MCAP ${usd(u?.marketCap)}`, 'BASE',
  ].filter((w) => w && !w.includes('—'));
  const checkedAt = Date.now();
  const cards = [
    { id: 'urm', href: '/urm', theme: 'cream', name: '$URM', tag: 'The ecosystem stablecoin', text: 'A dollar built like a fortress, defended onchain. Earn on it in Fountain, or mint it against your tokens in the CDP.', big: pct(yieldPct, 0), small: 'target APY in Fountain', cta: 'Open URM', logo: null },
    { id: 'rage', href: '/rage', theme: 'rage', name: 'RAGE', tag: 'Volatility harvesting', text: 'Backed by a treasury of HESTIA and ULTRAROUND. When RAGE trades above fair value, the premium goes back into the backing.', big: num(rb?.rbpView?.backingPerShare, 3), small: 'backing per share', cta: 'Open RAGE', logo: '/assets/rage.png' },
    { id: 'hestia', href: '/hestia', theme: 'hestia', name: 'HESTIA', tag: 'Deflationary store of value', text: 'Paired to USDC on Base. The Chaos Engine builds a reserve from fees, then buys HESTIA and burns it.', big: pct(h?.supply?.burnedPercent), small: 'of supply burned', cta: 'Open HESTIA', logo: '/assets/hestia.png' },
    { id: 'circle', href: '/ultraround', theme: 'circle', name: 'ULTRAROUND', tag: 'Burns on every sell', text: 'No transaction tax. Pool fees fuel the burn, so supply only goes one way.', big: num(c?.supply?.burned), small: 'ULTRAROUND burned', cta: 'Open ULTRAROUND', logo: '/assets/ultraround.png' },
  ];
  return (
    <div className="page has-bg">
      <AutoRefresh />
      <PageBg img="/hero/statue-wide.jpg" color="#041857" wide>
        <OrbPulse price={price} checkedAt={checkedAt} defense={usd(ov.totalDefense)} />
        <DataRain words={words} />
      </PageBg>
      <section className="phero" aria-labelledby="hero-h">
        <div className="wrap phero-copy">
          <h1 id="hero-h" className="h1">Onchain money that works while <span className="acc">you sleep.</span></h1>
          <p className="lead">URM is a community-driven ecosystem that builds stores of value on Base: the $URM stablecoin, a treasury that harvests volatility, and two tokens that only get scarcer.</p>
          <div className="row" style={{ marginTop: 'var(--s-8)', gap: 'var(--s-3)' }}>
            <Link className="btn btn-sun btn-lg" href="/urm/fountain">Start with Fountain</Link>
            <a className="btn btn-outline btn-lg" href="#trust">Read the audit</a>
          </div>
          <p className="readout peg-m glass-clear"><span><b>PEG CHECK</b> {Number.isFinite(price) ? `$${num(price, 3)} · ${Math.abs(price - 1) <= 0.01 ? 'on peg' : 'off peg'}` : 'checking…'}</span><span className="sub">Defense {usd(ov.totalDefense)} · re-checked every minute</span></p>
          <p className="sr">$URM peg check: ${num(price, 3)}. Total defense {usd(ov.totalDefense)}.</p>
        </div>
      </section>
      <section className="band"><div className="wrap stats">
        <div className="stat"><b style={{ color: '#d7b067' }}><CountUp text={num(fs.toAssets, 4)} /></b><span>fURM share price</span></div>
        <div className="stat"><b style={{ color: '#ff3d3d' }}><CountUp text={num(rb?.rbpView?.backingPerShare, 3)} /></b><span>RAGE backing per share</span></div>
        <div className="stat"><b style={{ color: '#ff7a2e' }}><CountUp text={pct(h?.supply?.burnedPercent)} /></b><span>of HESTIA burned</span></div>
        <div className="stat"><b style={{ color: '#5d93f0' }}><CountUp text={pct(c?.supply?.burnedPercent)} /></b><span>of ULTRAROUND burned</span></div>
      </div></section>
      <section className="wrap sec">
        <div className="split">
          <div className="main">
            <div className="latest-head">
              <h2 className="h2" id="news">Latest</h2>
              <a className="latest-x" href="https://x.com/URMdollar"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg>All updates on X</a>
            </div>
            <ol className="latest">
              {[
                { href: '/urm/fountain', when: 'Oct 12', status: 'Live', logo: 'urm', t: 'Fountain URM is live', d: 'Deposit $URM, get fURM, earn a yield paid by the Fortress.' },
                { href: '/urm/cdp', when: 'Aug 27', status: 'Live', logo: 'urm', t: 'The URM CDP is live', d: 'Lock RAGE, HESTIA or ULTRAROUND and mint $URM against it.' },
                { href: '/rage#next', when: 'Next', status: 'Soon', logo: 'rage', t: 'Black Card is in review', d: 'Lock an option, harvest the premium. Details on the RAGE page.' },
              ].map((n) => (
                <li key={n.t}>
                  <Link href={n.href} className="latest-row">
                    <span className="latest-when"><time>{n.when}</time><em data-s={n.status}>{n.status}</em></span>
                    <span className="latest-logo"><ProductLogo id={n.logo} size={36} /></span>
                    <span className="latest-txt"><strong>{n.t}</strong><span>{n.d}</span></span>
                    <svg className="latest-go" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                </li>
              ))}
            </ol>
            <div className="latest-follow">
              <span className="eyebrow">Follow the engines</span>
              <div className="latest-handles">
                {[['urm', 'URMdollar'], ['rage', 'therageprotocol'], ['hestia', 'HestiaOnBase'], ['circle', 'UltraRoundMoney']].map(([id, h]) => (
                  <a key={h} href={`https://x.com/${h}`} className="latest-handle"><ProductLogo id={id} size={24} />@{h}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="side"><FountainPreview apy={yieldPct} shareRate={Number(fs.depositShares)} depositFee={bps(fs.config?.depositFee, 0)} withdrawFee={bps(fs.config?.withdrawFee)} /></div>
        </div>
      </section>
      <section className="wrap sec">
        <h2 className="h2">One ecosystem. Four engines.</h2>
        <p className="punch">Each one feeds the others.</p>
        <div className="grid" style={{ marginTop: 'var(--s-10)', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 'var(--s-5)' }}>
          {cards.map((k) => (
            <article key={k.id} data-theme={k.theme === 'cream' ? undefined : k.theme} className={k.theme === 'cream' ? 'cream' : 'card'} style={{ background: k.theme === 'cream' ? undefined : 'var(--bg)', boxShadow: k.theme === 'circle' ? 'inset 0 0 0 1px var(--line)' : undefined, borderRadius: 'var(--r-lg)', padding: 'var(--s-8)', display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
                {k.logo ? <img src={k.logo} alt="" width={52} height={52} /> : <span style={{ width: 52, height: 52, flex: 'none', borderRadius: 999, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="44" height="44" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46.4" fill="none" stroke="#b0bfd6" strokeWidth="7.2" /><circle cx="50" cy="50" r="27.8" fill="none" stroke="#b0bfd6" strokeWidth="7.65" /><circle cx="50" cy="50" r="16.5" fill="#f1ebdd" /></svg></span>}
                <div style={{ minWidth: 0 }}><h3 className="h3" style={{ fontSize: 'var(--fs-title2)' }}>{k.name}</h3><span className="muted" style={{ fontSize: 'var(--fs-subhead)', fontWeight: 600 }}>{k.tag}</span></div>
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
          <div className="grid" style={{ marginTop: 'var(--s-8)', gap: 'var(--s-8)' }}>
            <div><h3 className="h3" style={{ fontSize: 'var(--fs-title3)' }}>Read before you sign</h3><p className="muted" style={{ lineHeight: 1.5 }}>Connecting only reads your address and balances. It never moves funds.</p></div>
            <div><h3 className="h3" style={{ fontSize: 'var(--fs-title3)' }}>Audited and verified</h3><p className="muted" style={{ lineHeight: 1.5 }}>Audit reports, verified code on Basescan, Fountain listed on DefiLlama.</p></div>
            <div><h3 className="h3" style={{ fontSize: 'var(--fs-title3)' }}>Leave anytime</h3><p className="muted" style={{ lineHeight: 1.5 }}>Withdraw from Fountain whenever you want, to $URM or USDC. {bps(fs.config?.withdrawFee)} withdraw fee.</p></div>
          </div>
          <div className="grid2" style={{ marginTop: 'var(--s-8)' }}>
            <div className="white" style={{ overflowX: 'auto' }}>
              <p className="muted" style={{ margin: 0, padding: '14px 14px 4px', fontSize: 'var(--fs-footnote)', letterSpacing: 1.5, fontWeight: 700 }}>CONTRACTS ON BASE</p>
              <table className="ctable" aria-label="Contracts on Base"><tbody>
                {[['$URM token', TOKENS.URM, true], ['URM Fortress', C.fortress, false], ['Fountain', C.fountain, false], ['URM CDP', C.cdp, false], ['RAGE', C.rage, true], ['HESTIA', C.hestia, true], ['ULTRAROUND', C.circle, true]].map(([l, a, t]) => (
                  <tr key={l as string}><td><b>{l as string}</b></td><td className="mono">{short(a as string)}</td><td><a href={`https://basescan.org/${t ? 'token' : 'address'}/${a}`} style={{ color: 'var(--ink)', textDecoration: 'underline', fontWeight: 700 }}>Basescan</a></td></tr>
                ))}
              </tbody></table>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
              <p className="eyebrow" style={{ margin: 0 }}>AUDITS AND PAPERS</p>
              {[['$URM audit', '/urm/audit.pdf'], ['Fountain audit', '/urm/fountain-audit.pdf'], ['CDP audit', '/urm/cdp-audit.pdf'], ['RAGE audit', '/rage/audit.pdf'], ['HESTIA audit', '/hestia/audit.pdf'], ['Hestia Mine audit', '/hestia/mine-audit.pdf']].map(([l, p]) => <a key={l} className="chip chip-line" href={legacy(p)}>{l}</a>)}
              <Link className="chip chip-ink" href="/risks">Read the risks</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="wrap sec">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--s-4)' }}>
          <div><h2 className="h2">New to crypto?</h2><p className="punch">From your card to onchain yield in four taps.</p></div>
          <Link className="btn btn-primary btn-lg" href="/earn">Start with Earn</Link>
        </div>
        <PhoneDemo apy={pct(yieldPct, 0)} steps={[{ t: 'Passkey wallet', d: 'Face ID or a fingerprint. No seed phrase to write down.' }, { t: 'Buy USDC', d: 'With a card or Apple Pay. 0.2% gateway fee, shown before you confirm.' }, { t: 'Swap to $URM', d: 'One tap on Base. Gas is covered for you.' }, { t: 'Deposit', d: `Into Fountain, at a ${pct(yieldPct, 0)} target APY. Withdraw anytime.` }]} />
      </section>
      <Footer />
    </div>
  );
}
