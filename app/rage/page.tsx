import { Brand } from '@/components/ProductLogo';
import PageBg from '@/components/PageBg';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AutoRefresh from '@/components/AutoRefresh';
import Sparkline from '@/components/Sparkline';
import { YourPosition } from '@/components/Panels';
import { Hero, Stats, Steps } from '@/components/ui';
import { api } from '@/lib/api';
import { num, usd, bps, n, legacy, short } from '@/lib/fmt';
import { C } from '@/lib/tokens';
import { RAGE_TABS } from '@/lib/tabs';

export const revalidate = 60;
export const metadata = { title: 'RAGE' };

export default async function Rage() {
  const [r, cdp, o] = await Promise.all([api('rage/buying-protocol'), api('urm/cdp'), api('urm/fortress')]);
  const v = r?.rbpView || {}, cfg = r?.config || {};
  const prem = (n(v.price) / n(v.fmv) - 1) * 100;
  const rows: any[] = [...(r?.charts || [])].sort((a, b) => n(a[11]) - n(b[11]));
  const bps30 = rows.map((x) => n(x[3]));
  const days = (s: any) => Math.round(n(s) / 86400);
  const contracts = [
    ['RAGE token', C.rage, `${num(v.activeSupply)} active RAGE`, `https://basescan.org/token/${C.rage}`, 'Basescan'],
    ['Rage Buying Protocol', C.rbp, 'Invest, mint and claims', `https://basescan.org/address/${C.rbp}`, 'Basescan'],
    ['Chaos Engine', C.rageChaos, 'Protocol operations', `https://basescan.org/address/${C.rageChaos}`, 'Basescan'],
    ['Rage OTC', C.rageOtc, 'Ecosystem supply auction', `https://basescan.org/address/${C.rageOtc}`, 'Basescan'],
    ['pHestia pod', C.pHestia, `${num(v.activeHestia)} HESTIA in backing`, `https://peapods.finance/pod/8453/${C.pHestia}`, 'Peapods'],
    ['pCircle pod', C.pCircle, `${num(v.activeCircle)} ULTRAROUND in backing`, `https://peapods.finance/pod/8453/${C.pCircle}`, 'Peapods'],
  ];
  return (
    <div className="page has-bg" data-theme="rage">
      <PageBg img="/hero/rage.jpg" color="#270630" pos="85% 40%" mpos="72% 30%" />
      <AutoRefresh />
      <Nav active="rage" tabs={RAGE_TABS} current="/rage" />
      <Hero img="/hero/rage.jpg" bg="#270630" pos="100% 40%" mpos="70% 30%">
        <div className="split">
          <div className="main">
            <Brand id="rage" ticker="$RAGE" sub="Volatility harvesting" />
            <h1 className="h1">Volatility in.<br /><span className="acc">Backing up.</span></h1>
            <p className="lead">A token backed by a treasury of HESTIA and ULTRAROUND. When RAGE trades above fair value, the premium goes back into the backing.</p>
            <div className="row" style={{ marginTop: 32 }}>
              <a className="btn btn-primary btn-lg" href="#invest">Invest with USDC</a>
              <a className="btn btn-outline btn-lg" href="#how">How it works</a>
            </div>
          </div>
          <div className="side card glass-rim" style={{ background: 'var(--panel)' }}>
            <b className="eyebrow">TREASURY CHECK</b>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
              <div className="tile" style={{ background: 'var(--bg)' }}><span>Fair market value</span><b>${num(v.fmv, 2)}</b></div>
              <div className="tile" style={{ background: 'var(--bg)' }}><span>Market price</span><b>${num(v.price, 2)}</b></div>
            </div>
            <ul className="list" style={{ marginTop: 10, background: 'var(--bg)' }}>
              <li><span className="k">Premium over FMV</span><strong style={{ color: 'var(--accent2)' }}>{prem >= 0 ? '+' : ''}{num(prem, 2)}%</strong></li>
              <li><span className="k">Inside every RAGE</span><strong>{num(v.underlyingHestia, 2)} HESTIA · {num(v.underlyingCircle, 2)} ULTRAROUND</strong></li>
              <li><span className="k">Split</span><strong>{bps(v.underlyingHestiaPercent)} / {bps(v.underlyingCirclePercent)}</strong></li>
              <li><span className="k">Backing per share</span><strong>{num(v.backingPerShare, 3)}</strong></li>
            </ul>
          </div>
        </div>
      </Hero>
      <Stats items={[{ v: usd(v.activeAssetsUsdcValue), l: 'in the treasury' }, { v: num(v.activeSupply), l: 'active RAGE' }, { v: usd(r?.state?.totalInvest), l: 'invested through the protocol' }, { v: num(cfg.claimFee) + '%', l: 'of every claim stays for holders' }]} />

      <section className="wrap sec" id="how">
        <h2 className="h2">How the backing grows.</h2>
        <p className="punch">Every action adds to it.</p>
        <Steps items={[
          { t: 'Invest', d: `${num(cfg.hestiaPercent ?? 80)}% buys HESTIA, ${100 - n(cfg.hestiaPercent ?? 80)}% buys ULTRAROUND. Both get wrapped into pHestia and pCircle on Peapods and locked.` },
          { t: 'Harvest premiums', d: 'Only the Rage protocol mints at fair value. When RAGE trades above it, the premium goes into the backing.' },
          { t: 'Earn yield', d: 'pToken yield from Peapods flows into the treasury automatically, around the clock.' },
          { t: 'Reward the ones who stay', d: `Every claim pays a ${num(cfg.claimFee)}% fee that stays in the protocol. The ones who leave pay the ones who stay.` },
        ]} />
        <div className="card glass-rim" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}><b>Backing per share</b><span className="muted">since launch · now {num(v.backingPerShare, 4)}</span></div>
          <div style={{ marginTop: 14 }}><Sparkline values={bps30} label="RAGE backing per share over time" height={220} /></div>
        </div>
      </section>

      <section className="wrap sec" id="invest">
        <h2 className="h2">Three ways in.</h2>
        <div className="grid" style={{ marginTop: 36, gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 20 }}>
          <article className="cream glass-rim" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 className="h3">Invest with USDC</h3>
            <p style={{ margin: 0, lineHeight: 1.5 }}>Mint new RAGE at fair value, straight from the protocol.</p>
            <p style={{ margin: 0, fontWeight: 700 }}>Right now, investing is {num(r?.investProfitability, 2)}% better than buying on the market.</p>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}><li>{num(cfg.investorBonus)}% bonus on the underlying tokens</li><li>Asset Decline Protection caps the downside at {100 - n(cfg.adpPercent)}%</li><li>Mint after a {days(cfg.mintDelay)}-day wait</li></ul>
            <a className="btn btn-ink btn-lg btn-block" style={{ marginTop: 'auto' }} href={legacy('/rage')} target="_blank" rel="noreferrer">Invest with USDC</a>
            <Link className="tap" href="/risks" style={{ color: 'var(--ink)', justifyContent: 'center', textDecoration: 'underline' }}>Read the risks</Link>
          </article>
          <article className="card glass-rim" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}><h3 className="h3">Rage OTC</h3><span className="badge">Limited supply</span></div>
            <p style={{ margin: 0, lineHeight: 1.5 }}>Trade HESTIA, ULTRAROUND or URM for RAGE from ecosystem supply, at a fair price plus a bonus.</p>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8, color: 'var(--sub)' }}><li>The bonus grows over time</li><li>The supply doesn&apos;t</li><li>Pay with tokens you already hold</li></ul>
            <Link className="btn btn-primary btn-lg btn-block" style={{ marginTop: 'auto' }} href="/rage/otc">Open Rage OTC</Link>
          </article>
          <article className="card glass-rim" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 className="h3">Buy on the market</h3>
            <p style={{ margin: 0, lineHeight: 1.5 }}>Already trading on Base. Fast in, but you pay the market price, premium included.</p>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8, color: 'var(--sub)' }}><li>No wait</li><li>Compare market price with FMV first</li></ul>
            <a className="btn btn-outline btn-lg btn-block" style={{ marginTop: 'auto' }} href={`https://app.uniswap.org/swap?chain=base&outputCurrency=${C.rage}`}>See the pool</a>
          </article>
        </div>
        <div style={{ marginTop: 24 }}><YourPosition items={[{ label: 'RAGE in wallet', key: 'RAGE' }, { label: 'Worth at FMV', key: 'RAGE', unit: 'USD', mult: n(v.fmv) }, { label: 'USDC ready to invest', key: 'USDC' }]} /></div>
      </section>

      <section className="wrap sec grid2">
        <div className="card glass-rim">
          <h2 className="h2" style={{ fontSize: 'clamp(30px,3.4vw,44px)' }}>Leaving? Here&apos;s how.</h2>
          <p className="punch" style={{ fontSize: 'var(--fs-title2)' }}>The ones who leave pay the ones who stay.</p>
          <ol style={{ margin: '20px 0 0', paddingLeft: 22, lineHeight: 2, fontSize: 'var(--fs-body)' }}><li>Reserve a claim and lock in your payout</li><li>Wait {days(cfg.claimDelay)} days</li><li>Redeem for HESTIA and ULTRAROUND</li></ol>
          <p className="muted">A {num(cfg.claimFee)}% claim fee stays in the protocol and raises backing per share.</p>
        </div>
        <div className="card glass-rim">
          <h2 className="h2" style={{ fontSize: 'clamp(30px,3.4vw,44px)' }}>The full stack.</h2>
          <p className="punch" style={{ fontSize: 'var(--fs-title2)' }}>Liquidity without selling.</p>
          <div className="row" style={{ marginTop: 20 }}>{['Lock RAGE in the CDP', 'Mint URM', 'Hold or deposit in Fountain'].map((t, i) => <span key={t} className="pill" style={{ background: 'var(--accent2)', color: '#000', fontSize: 'var(--fs-subhead)', padding: '10px 16px' }}>{i + 1}. {t}</span>)}</div>
          <p style={{ marginTop: 20, lineHeight: 1.5 }}><b>Know the cost.</b> <span className="muted">Borrowing is {bps(cdp?.currentInterestRate)} a year today, and Fountain targets {bps(o?.fountainState?.config?.yieldRate, 0)}. Use the CDP for liquidity, not as a yield loop.</span></p>
          <Link href="/urm/cdp" className="btn btn-outline">Open the CDP</Link>
        </div>
      </section>

      <section className="wrap sec" id="next">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
          <div><h2 className="h2">Coming next.</h2><p className="punch">Lock more. Float less. Harvest more.</p></div>
          <p className="muted" style={{ margin: 0 }}>Not live yet. Details may change.</p>
        </div>
        <article className="card glass-rim" style={{ marginTop: 32, padding: 0, overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}>
          <img src="/assets/black-card.png" alt="The URM Black Card, a black metal card with the URM ring logo and a gold chip" style={{ flex: '1 1 300px', minWidth: 0, width: '100%', maxWidth: 640, aspectRatio: '1280/853', objectFit: 'cover', display: 'block' }} />
          <div style={{ flex: '1 1 340px', padding: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}><h3 className="h3">Black Card</h3><span className="badge">In review</span></div>
            <p style={{ margin: 0, fontSize: 'var(--fs-body)', lineHeight: 1.5 }}>The front door. Open to anyone who locks an option, with no extra requirements.</p>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9, color: 'var(--sub)' }}><li>Harvests the premium when demand shows up</li><li>Auto Saver keeps it compounding</li><li>Every new option buys reserves for the treasury</li></ul>
          </div>
        </article>
        <div className="grid2" style={{ marginTop: 20 }}>
          <article className="card glass-rim"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h3 className="h3">The line</h3><span className="badge">In review</span></div><p style={{ lineHeight: 1.5 }}>The Priority Vault. Lock spot RAGE before Black Card launches to hold your place for the 0% loan.</p><p className="muted" style={{ margin: 0 }}>First in line, first loans turned on. You can leave before launch.</p></article>
          <article className="card glass-rim"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h3 className="h3">Confluence</h3><span className="badge">In review</span></div><p style={{ lineHeight: 1.5 }}>Add liquidity and earn Tributaries points. When rewards go live, they count back to the day you started.</p><p className="muted" style={{ margin: 0 }}>Waiting means earning less.</p></article>
        </div>
        <p className="muted" style={{ marginTop: 20 }}>Launch dates drop first on <a href="https://x.com/therageprotocol">@therageprotocol</a>.</p>
      </section>

      <section className="wrap sec" id="trust">
        <h2 className="h2">Check the backing yourself.</h2>
        <p className="punch">Every token in the treasury is onchain.</p>
        <div className="tbl glass-rim" style={{ marginTop: 28 }}>
          <p className="muted" style={{ margin: 0, padding: '16px 18px 0', fontSize: 'var(--fs-footnote)', letterSpacing: 1.5, fontWeight: 700 }}>RAGE CONTRACTS ON BASE</p>
          <table aria-label="RAGE contracts on Base">
            <thead><tr><th>Contract</th><th>Address</th><th>Role</th><th><span className="sr">Link</span></th></tr></thead>
            <tbody>{contracts.map(([a, b, c, d, e]) => <tr key={a}><td className="tcell-title"><b>{a}</b></td><td data-label="Address" className="mono">{short(b)}</td><td data-label="Role" className="muted">{c}</td><td className="tcell-link"><a href={d}>{e}</a></td></tr>)}</tbody>
          </table>
        </div>
        <div className="row" style={{ marginTop: 20 }}><a className="chip chip-ink" style={{ background: 'var(--cream)', color: 'var(--ink)' }} href={legacy('/rage/audit.pdf')}>RAGE audit</a><a className="chip" style={{ boxShadow: 'inset 0 0 0 2px var(--text)', color: 'var(--text)' }} href={legacy('/rage/whitepaper.pdf')}>Whitepaper</a></div>
      </section>
      <Footer name="RAGE" x="therageprotocol" />
    </div>
  );
}
