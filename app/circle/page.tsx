import PageBg from '@/components/PageBg';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AutoRefresh from '@/components/AutoRefresh';
import Check, { addr } from '@/components/Check';
import { YourPosition } from '@/components/Panels';
import { Hero, Stats, SupplyBar, Faq } from '@/components/ui';
import { api } from '@/lib/api';
import { num, usd, bps, n, legacy, ago } from '@/lib/fmt';
import { C } from '@/lib/tokens';
import { CIRCLE_TABS } from '@/lib/tabs';

export const revalidate = 60;
export const metadata = { title: 'ULTRAROUND' };

export default async function Circle() {
  const [c, t, cdp] = await Promise.all([api('circle/overview'), api('circle/temple'), api('urm/cdp')]);
  const s = c?.supply || {}, ch = c?.chaosAutomator || {};
  const other = n(s.urm) + n(s.urmCdp) + n(s.temple) + n(s.ecosystem);
  return (
    <div className="page has-bg" data-theme="circle">
      <PageBg img="/hero/circle.jpg" color="#030303" pos="70% 50%" mpos="80% 40%" />
      <AutoRefresh />
      <Nav active="circle" tabs={CIRCLE_TABS} current="/circle" />
      <Hero img="/hero/circle.jpg" bg="#030303" pos="70% 50%" mpos="80% 60%">
        <div className="split">
          <div className="main">
            <h1 className="h1">Burns on<br /><span className="acc">every sell.</span></h1>
            <p className="lead">ULTRAROUND ($CIRCLE) is an autonomous, deflationary ETH proxy on Base. Its Chaos Engine burns supply with pool fees, with no transaction tax.</p>
            <div className="row" style={{ marginTop: 32 }}>
              <a className="btn btn-primary btn-lg" href={`https://app.uniswap.org/swap?chain=base&outputCurrency=${C.circle}`}>Buy ULTRAROUND</a>
              <Link className="btn btn-outline btn-lg" href="/circle/temple">Enter the Temple</Link>
            </div>
          </div>
          <div className="side card glass-rim">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><b className="eyebrow">BURNED FOREVER</b><span className="pill" style={{ background: 'var(--accent)', color: 'var(--onAccent)' }}>Live</span></div>
            <p style={{ margin: '10px 0 0', fontSize: 'var(--fs-display)', fontWeight: 800 }} className="acc">{num(s.burnedPercent, 2)}%</p>
            <p className="muted" style={{ margin: 0 }}>{num(s.burned)} of 1,000,000 ULTRAROUND</p>
            <ul className="list" style={{ marginTop: 16, background: 'var(--bg)' }}>
              <li><span className="k">Burns per day</span><strong>{num(ch.burnPerDay)}</strong></li>
              <li><span className="k">Last Cause Chaos</span><strong>{ago(ch.lastBurn)}</strong></li>
            </ul>
          </div>
        </div>
      </Hero>
      <Stats items={[{ v: '$' + num(c?.price, 2), l: 'price' }, { v: usd(c?.marketCap), l: 'market cap' }, { v: num(c?.liquidity?.marketCapRatio, 2) + '%', l: 'liquidity to market cap' }, { v: num(c?.holders), l: 'holders' }]} />
      <section className="wrap sec">
        <h2 className="h2">The fire and the tech.</h2>
        <p className="punch">The highest liquidity ratio on Base, with no tax.</p>
        <div className="steps">
          {[['Cause Chaos', 'The Chaos Engine collects pool fees, swaps the WETH back and forth, and burns ULTRAROUND.'], ['High liquidity', 'Thanks to the engine, ULTRAROUND holds one of the highest liquidity ratios for a coin its size.'], ['Chaos Automator', 'A back-end service that runs the engine onchain, on schedule.'], ['Community funded', "Marketing and development are paid for by the community through URM's multisig."]].map(([a, b]) => <div key={a} className="step"><h3 style={{ marginTop: 0 }}>{a}</h3><p>{b}</p></div>)}
        </div>
      </section>
      <section className="wrap sec">
        <h2 className="h2">Where the supply sits.</h2>
        <div className="card glass-rim" style={{ marginTop: 28 }}>
          <SupplyBar parts={[{ label: 'Holders', value: n(s.holders), color: '#dfe9fb' }, { label: 'Liquidity pools', value: n(s.pools), color: '#5d93f0' }, { label: 'Burned', value: n(s.burned), color: '#ff7a2e' }, { label: 'Locked in RAGE', value: n(s.rage), color: '#ff3d3d' }, { label: 'URM, CDP, Temple and ecosystem', value: other, color: '#d7b067' }]} />
        </div>
        <div className="grid2" style={{ marginTop: 20 }}>
          <article className="cream glass-rim" style={{ padding: 28 }}><h3 className="h3">Ultraround Temple</h3><p style={{ lineHeight: 1.5 }}>Become a cult leader. Stake ULTRAROUND, summon templars, compound or claim your rewards.</p>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}><div className="tile"><b>{num(t?.state?.circlePodsBalance)}</b><span>ULTRAROUND in the temple</span></div><div className="tile"><b>{num(t?.state?.walletCount)}</b><span>cult leaders</span></div></div>
            <Link className="btn btn-ink btn-block" style={{ marginTop: 16 }} href="/circle/temple">Start praying</Link></article>
          <article className="card glass-rim"><h3 className="h3">URM CDP</h3><p style={{ lineHeight: 1.5 }}>Lock ULTRAROUND as collateral and mint URM against it. Liquidity without selling.</p>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}><div className="tile" style={{ background: 'var(--bg)' }}><b>{num(s.urmCdp)}</b><span>ULTRAROUND in CDP</span></div><div className="tile" style={{ background: 'var(--bg)' }}><b>{bps(cdp?.currentInterestRate)}</b><span>yearly rate</span></div></div>
            <Link className="btn btn-primary btn-block" style={{ marginTop: 16 }} href="/urm/cdp">Open a position</Link></article>
        </div>
        <div style={{ marginTop: 20 }}><YourPosition items={[{ label: 'ULTRAROUND in wallet', key: 'ULTRAROUND' }, { label: 'Worth today', key: 'ULTRAROUND', unit: 'USD', mult: n(c?.price) }]} /></div>
      </section>
      <section className="wrap sec">
        <h2 className="h2">The engine.</h2>
        <ul className="list" style={{ marginTop: 28 }}>
          <li><span className="k">Main pool liquidity</span><strong>{usd(c?.liquidity?.mainValue)}</strong></li>
          <li><span className="k">Total liquidity</span><strong>{usd(c?.liquidity?.value)}</strong></li>
          <li><span className="k">Main liquidity to market cap</span><strong>{num(c?.liquidity?.mainMarketCapRatio, 2)}%</strong></li>
          <li><span className="k">WETH waiting in the engine</span><strong>{num(c?.cctp?.weth, 4)}</strong></li>
          <li><span className="k">Owned by RAGE / URM</span><strong>{num(s.ragePercent, 2)}% / {num(s.urmPercent, 2)}%</strong></li>
        </ul>
      </section>
      <section className="wrap sec">
        <h2 className="h2">Questions.</h2>
        <Faq items={[
          ['What is the Ultraround Chaos Engine?', 'A controller contract that runs the deflation. It collects pool fees, swaps the WETH back and forth, and burns ULTRAROUND, with no tax on your trades.'],
          ['How does RAGE make ULTRAROUND stronger?', '20% of every RAGE investment buys ULTRAROUND, wraps it into pCircle on Peapods and locks it as backing.'],
          ['What is the Ultraround Temple?', 'A staking contract inspired by BNBMiner, with a Peapods integration. Buy templars with ULTRAROUND, then compound or sell your rewards.'],
          ['Why Base?', 'The engine trades constantly. Base keeps those fees tiny, so the burn stays profitable.'],
        ]} />
      </section>
      <Check links={[{ label: 'Whitepaper', href: legacy('/circle/whitepaper.pdf'), strong: true }, { label: 'Game theory', href: legacy('/circle/gametheory.pdf'), strong: true }, addr('ULTRAROUND', C.circle, true), addr('Chaos Engine', C.circleChaos), { label: 'Dune', href: 'https://dune.com/ultraround_money/circle' }, { label: 'CoinMarketCap', href: 'https://coinmarketcap.com/currencies/ultraround-money' }]} />
      <Footer name="ULTRAROUND" x="UltraRoundMoney" />
    </div>
  );
}
