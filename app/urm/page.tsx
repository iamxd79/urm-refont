import { seo } from '@/lib/seo';
import UrmCharts from '@/components/UrmCharts';
import PageBg from '@/components/PageBg';
import Link from 'next/link';
import Footer from '@/components/Footer';
import AutoRefresh from '@/components/AutoRefresh';
import Check, { addr } from '@/components/Check';
import PegFortress from '@/components/PegFortress';
import { Hero, Stats, SupplyBar } from '@/components/ui';
import CountUp from '@/components/motion/CountUp';
import { api } from '@/lib/api';
import { num, usd, bps, ago, n, legacy } from '@/lib/fmt';
import { C, TOKENS } from '@/lib/tokens';
import { URM_TABS } from '@/lib/tabs';

export const revalidate = 60;
export const metadata = seo({ title: '$URM stablecoin', description: 'A dollar stablecoin built like a fortress: onchain peg defense backed by RAGE, HESTIA and ULTRAROUND. Only on Base.', handle: '@URMdollar' });

const pegDate = (d: any) => { const t = Date.parse(d); return isFinite(t) ? new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : '—'; };

export default async function Urm() {
  const [o, f, cdp, home] = await Promise.all([api('urm/overview'), api('urm/fortress'), api('urm/cdp'), api('home/overview')]);
  const fs = f?.fortressState || {}, ov = fs.overview || {}, fo = f?.fountainState || {};
  const price = n(f?.urmPrice ?? o?.price);
  const known = Number.isFinite(price);
  const onPeg = known && Math.abs(price - 1) <= 0.01;
  const hestiaDef = n(fs.hestiaBalance) * n(home?.hestia), circleDef = n(fs.circleBalance) * n(home?.circle);
  const defense = [
    { label: 'USDC', value: n(fs.nftUsdc), color: '#5fd39a' },
    { label: 'RAGE', value: n(ov.rageDefense), color: '#ff3d3d' },
    { label: 'CDP', value: n(ov.towerUsdc), color: '#d7b067' },
    { label: 'HESTIA', value: hestiaDef, color: '#ff7a2e' },
    { label: 'ULTRAROUND', value: circleDef, color: '#5d93f0' },
  ];
  const sup = o?.supply || {};
  return (
    <div className="page has-bg">
      <PageBg img="/hero/statue-wide.jpg" color="#041857" wide />
      <AutoRefresh />
      <Hero img="/hero/statue-wide.jpg" bg="#041857" pos="100% 50%" mpos="84% 50%" row>
        <div className="split">
          <div className="main">
            <h1 className="h1">A stablecoin built like <span className="acc">a fortress.</span></h1>
            <p className="lead">$URM holds its dollar peg with automatic onchain defense, backed by RAGE, HESTIA and ULTRAROUND. Only on Base.</p>
            <div className="row" style={{ marginTop: 'var(--s-8)' }}>
              <Link className="btn btn-primary btn-lg" href="/urm/fountain">Earn with Fountain</Link>
              <Link className="btn btn-outline btn-lg" href="/urm/cdp">Borrow with the CDP</Link>
              <a className="btn btn-outline btn-lg" href="https://app.uniswap.org/swap?chain=base&outputCurrency=0xf0e3349f00972475a5d16721796091aa3b997837">Buy $URM</a>
            </div>
          </div>
          <div className="side cream glass-rim" style={{ padding: 'var(--s-8)' }}>
            <b className="eyebrow">PEG CHECK</b>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', marginTop: 'var(--s-3)' }}>
              <span className="pill" style={{ background: !known ? '#4c6892' : onPeg ? '#2e7d50' : '#b3261e', color: '#fff' }}>{!known ? 'Checking' : onPeg ? 'On peg' : 'Off peg'}</span>
              <b style={{ fontSize: 'var(--fs-title1)' }}>${num(price, 3)}</b><span className="muted">$URM price</span>
            </div>
            <p className="muted" style={{ margin: '20px 0 0', fontWeight: 600 }}>Total defense</p>
            <p style={{ margin: '2px 0 12px', fontSize: 'var(--fs-title1)', fontWeight: 800 }}>{usd(ov.totalDefense)}</p>
            <SupplyBar parts={defense} />
            <p className="muted" style={{ fontSize: 'var(--fs-subhead)', margin: '16px 0 0' }}>The keeper checks the peg every 1.5 to 2 hours. Last time it had to step in: {pegDate(fs.state?.lastPegDefense)}.</p>
          </div>
        </div>
      </Hero>
      <Stats items={[{ v: usd(o?.marketCap), l: 'market cap' }, { v: usd(o?.liquidity?.value), l: 'total liquidity' }, { v: num(sup.included), l: 'backed supply' }, { v: num(fs.towers?.length ?? 6), l: 'registered towers' }]} />

      <section className="wrap sec">
        <h2 className="h2">How the peg holds.</h2>
        <p className="punch">One contract owns the liquidity and defends both sides.</p>
        <div className="card glass-rim" style={{ marginTop: 'var(--s-8)' }}>
          <PegFortress price={price} towers={n(fs.towers?.length ?? 6)} usdcRoom={usd(fs.pegDefenseRoom?.usdcLeft)} urmRoom={num(fs.pegDefenseRoom?.urmLeft) + ' $URM'} defense={usd(ov.totalDefense)} lastStep={pegDate(fs.state?.lastPegDefense)} />
        </div>
      </section>

      <section className="wrap sec grid2">
        <article className="cream glass-rim" style={{ padding: 'var(--s-8)' }}>
          <b className="eyebrow">EARN</b>
          <h3 className="h3" style={{ marginTop: 'var(--s-2)' }}>Fountain URM</h3>
          <p style={{ lineHeight: 1.5 }}>Deposit $URM, get fURM. Each fURM is worth more $URM every day. Withdraw anytime, to $URM or USDC.</p>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(96px,1fr))', gap: 'var(--s-3)' }}>
            <div className="tile"><b>{bps(fo.config?.yieldRate, 0)}</b><span>target APY</span></div>
            <div className="tile"><b>{num(fo.totalAssets)}</b><span>$URM staked</span></div>
            <div className="tile"><b>{num(fo.toAssets, 4)}</b><span>$URM per fURM</span></div>
          </div>
          <Link href="/urm/fountain" className="btn btn-ink btn-lg btn-block" style={{ marginTop: 'var(--s-5)' }}>Open Fountain</Link>
        </article>
        <article className="card glass-rim" style={{ padding: 'var(--s-8)' }}>
          <b className="eyebrow">BORROW</b>
          <h3 className="h3" style={{ marginTop: 'var(--s-2)' }}>URM CDP</h3>
          <p style={{ lineHeight: 1.5 }}>Lock RAGE, HESTIA or ULTRAROUND and mint $URM against it. Your position is an NFT you can settle, unwind or transfer anytime.</p>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(96px,1fr))', gap: 'var(--s-3)' }}>
            <div className="tile" style={{ background: 'var(--bg)' }}><b>{bps(cdp?.currentInterestRate)}</b><span>yearly rate</span></div>
            <div className="tile" style={{ background: 'var(--bg)' }}><b>{num(cdp?.urmBorrowable)}</b><span>$URM to borrow</span></div>
            <div className="tile" style={{ background: 'var(--bg)' }}><b>{num(cdp?.positionCount)}</b><span>open positions</span></div>
          </div>
          <Link href="/urm/cdp" className="btn btn-primary btn-lg btn-block" style={{ marginTop: 'var(--s-5)' }}>Open a position</Link>
        </article>
      </section>

      <section className="wrap sec" id="chart">
        <h2 className="h2">Charts.</h2>
        <p className="punch">The defenses behind the peg, over time. Refreshed daily.</p>
        <div style={{ marginTop: 'var(--s-8)' }}><UrmCharts rows={f?.charts || []} /></div>
      </section>
      <section className="wrap sec">
        <h2 className="h2">Dashboard.</h2>
        <p className="punch">Every number, live from the contracts.</p>
        <div className="card glass-rim" style={{ marginTop: 'var(--s-8)' }}>
          <b className="eyebrow" style={{ marginBottom: 'var(--s-4)' }}>Circulating $URM, {num(sup.circulating)}</b>
          <SupplyBar parts={[{ label: 'Fortress', value: n(sup.fortress), color: '#d7b067' }, { label: 'Towers', value: n(sup.tower), color: '#b0bfd6' }, { label: 'Liquidity pools', value: n(sup.pools), color: '#5d93f0' }, { label: 'Holders', value: n(sup.holders), color: '#f3f0e7' }, { label: 'Ecosystem', value: n(sup.ecosystem), color: '#ff7a2e' }]} />
        </div>
        <div className="grid" style={{ marginTop: 'var(--s-8)', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 'var(--s-5)' }}>
          <div><h3 className="h3" style={{ fontSize: 'var(--fs-title3)', marginBottom: 'var(--s-3)' }}>Where the supply sits</h3><ul className="list">
            {[['Circulating', sup.circulating], ['Fortress', sup.fortress], ['Flanking pool', sup.flankingPool], ['Towers', sup.tower], ['Holders', sup.holders], ['Main pool', sup.mainPool], ['RAGE pool', sup.ragePool], ['Initial supply', sup.initial]].map(([k, v]) => <li key={k}><span className="k">{k}</span><strong><CountUp text={num(v)} /></strong></li>)}
          </ul></div>
          <div><h3 className="h3" style={{ fontSize: 'var(--fs-title3)', marginBottom: 'var(--s-3)' }}>Defense</h3><ul className="list">
            {[['Soft defense', usd(ov.softDefense)], ['Hard defense', usd(ov.hardDefense)], ['Defense surplus', usd(ov.totalDefenseSurplus)], ['Counter defense', usd(ov.counterDefense)], ['Below-peg room', usd(fs.pegDefenseRoom?.usdcLeft)], ['Above-peg room', num(fs.pegDefenseRoom?.urmLeft) + ' $URM'], ['Liquidity to market cap', num(o?.liquidity?.marketCapRatio, 2) + '%']].map(([k, v]) => <li key={k}><span className="k">{k}</span><strong><CountUp text={String(v)} /></strong></li>)}
          </ul></div>
          <div><h3 className="h3" style={{ fontSize: 'var(--fs-title3)', marginBottom: 'var(--s-3)' }}>Fountain and CDP</h3><ul className="list">
            {[['Fountain staked', num(fo.totalAssets)], ['Fountain interest per day', num(fo.interestPerDay, 2)], ['Fountain idle supply', num(fo.urmIdle)], ['CDP borrowed', num(cdp?.urmDebt)], ['CDP interest per day', num(cdp?.urmCdpInterestPerDay, 2)], ['CDP paid to the Fortress', num(cdp?.urmCdpPaidToFortress)]].map(([k, v]) => <li key={k}><span className="k">{k}</span><strong><CountUp text={String(v)} /></strong></li>)}
          </ul></div>
        </div>
      </section>

      <Check links={[{ label: 'Whitepaper', href: legacy('/urm/whitepaper.pdf'), strong: true }, { label: 'Audit', href: legacy('/urm/audit.pdf'), strong: true }, addr('$URM token', TOKENS.URM, true), addr('Fortress', C.fortress), { label: 'DefiLlama', href: 'https://defillama.com/protocol/urm' }, { label: 'Dextools', href: 'https://www.dextools.io/app/base/pair-explorer/0x63b531588398cd17297d571e17688d31cc182075' }]} />
      <Footer name="URM" />
    </div>
  );
}
