import { Brand } from '@/components/ProductLogo';
import PageBg from '@/components/PageBg';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AutoRefresh from '@/components/AutoRefresh';
import BurnFire from '@/components/BurnFire';
import Countdown from '@/components/Countdown';
import Check, { addr } from '@/components/Check';
import { YourPosition } from '@/components/Panels';
import { Hero, Stats, SupplyBar, Faq } from '@/components/ui';
import { api } from '@/lib/api';
import { num, usd, bps, n, legacy } from '@/lib/fmt';
import { C } from '@/lib/tokens';
import { HESTIA_TABS } from '@/lib/tabs';

export const revalidate = 60;
export const metadata = { title: 'HESTIA' };

export default async function Hestia() {
  const [h, m, cdp] = await Promise.all([api('hestia/overview'), api('hestia/mine'), api('urm/cdp')]);
  const s = h?.supply || {}, ch = h?.chaosAutomator || {};
  const other = n(s.urm) + n(s.urmCdp) + n(s.mine) + n(s.ecosystem);
  return (
    <div className="page has-bg" data-theme="hestia">
      <PageBg img="/hero/hestia.jpg" color="#2a0527" pos="85% 40%" mpos="70% 30%" />
      <AutoRefresh />
      <Nav active="hestia" tabs={HESTIA_TABS} current="/hestia" />
      <Hero img="/hero/hestia.jpg" bg="#2a0527" pos="100% 40%" mpos="68% 35%">
        <div className="split">
          <div className="main">
            <Brand id="hestia" ticker="$HESTIA" sub="Deflationary store of value" />
            <h1 className="h1">Become<br /><span className="acc">ultra rare.</span></h1>
            <p className="lead">A highly deflationary store of value, paired to USDC on Base. The Hestia Chaos Engine burns supply and acts as the buyer of last resort.</p>
            <div className="row" style={{ marginTop: 32 }}>
              <a className="btn btn-primary btn-lg" href={`https://app.uniswap.org/swap?chain=base&outputCurrency=${C.hestia}`}>Buy HESTIA</a>
              <Link className="btn btn-outline btn-lg" href="/hestia/mine">Start mining</Link>
            </div>
          </div>
          <div className="side card glass">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><b className="muted" style={{ fontSize: 13, letterSpacing: 1.5 }}>BURNED FOREVER</b><span className="pill" style={{ background: 'var(--accent)', color: 'var(--onAccent)' }}>Live</span></div>
            <p style={{ margin: '10px 0 0', fontSize: 56, fontWeight: 800 }} className="acc">{num(s.burnedPercent, 2)}%</p>
            <p className="muted" style={{ margin: 0 }}>{num(s.burned)} of 1,000,000 HESTIA</p>
            <ul className="list" style={{ marginTop: 16, background: 'var(--bg)' }}>
              <li><span className="k">Next Smoke Fees</span><strong><Countdown to={ch.nextSmokeTime} /></strong></li>
              <li><span className="k">Next Hestia&apos;s rage</span><strong><Countdown to={ch.nextRageTime} /></strong></li>
            </ul>
            <a href="#fire" className="btn btn-primary btn-block" style={{ marginTop: 16 }}>Watch her burn</a>
          </div>
        </div>
      </Hero>
      <Stats items={[{ v: '$' + num(h?.price, 2), l: 'price' }, { v: usd(h?.marketCap), l: 'market cap' }, { v: usd(h?.liquidity?.value), l: 'total liquidity' }, { v: num(h?.holders), l: 'holders' }]} />

      <section className="wrap sec" id="fire">
        <div className="split" style={{ alignItems: 'center' }}>
          <div className="main">
            <h2 className="h2">The fire and the tech.</h2>
            <p className="punch">Where DeFi meets meme.</p>
            <div className="grid" style={{ marginTop: 28, gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))' }}>
              {[["Hestia's rage", 'Burns part of her sell-side liquidity while adding the same buying pressure. Can switch to regenerative mode.'], ['Smoke Fees', "Pool fees grow her USDC reserve, or fund ULTRAROUND's Chaos Engine."], ['AI agent', 'In a later phase, an AI agent will own the Chaos Engine and talk with the community.'], ['Community', 'Fair launch, no team allocation. 100% funded and built by the community.']].map(([t, d]) => <div key={t} className="step"><h3 style={{ marginTop: 0 }}>{t}</h3><p>{d}</p></div>)}
            </div>
          </div>
          <div className="side"><BurnFire burned={n(s.burned)} /><p className="muted" style={{ textAlign: 'center', fontSize: 14 }}>The fire flares every time the burned total goes up.</p></div>
        </div>
      </section>

      <section className="wrap sec">
        <h2 className="h2">Where the supply sits.</h2>
        <div className="card glass" style={{ marginTop: 28 }}>
          <SupplyBar parts={[{ label: 'Burned', value: n(s.burned), color: '#ff7a2e' }, { label: 'Holders', value: n(s.holders), color: '#ffb627' }, { label: 'Locked in RAGE', value: n(s.rage), color: '#ff3d3d' }, { label: 'Liquidity pools', value: n(s.pools), color: '#e6cfe2' }, { label: 'URM, CDP, Mine and ecosystem', value: other, color: '#d7b067' }]} />
        </div>
        <div className="grid2" style={{ marginTop: 20 }}>
          <article className="cream glass" style={{ padding: 28 }}><h3 className="h3">The Hestia Mine</h3><p style={{ lineHeight: 1.5 }}>Become a mining chief. Stake HESTIA, hire your crew, compound or sell your rewards.</p>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}><div className="tile"><b>{num(m?.state?.hestiaPodsBalance)}</b><span>HESTIA in the mine</span></div><div className="tile"><b>{num(m?.state?.walletCount)}</b><span>mining chiefs</span></div></div>
            <Link className="btn btn-ink btn-block" style={{ marginTop: 16 }} href="/hestia/mine">Start mining</Link></article>
          <article className="card glass"><h3 className="h3">URM CDP</h3><p style={{ lineHeight: 1.5 }}>Lock HESTIA as collateral and mint URM against it. Liquidity without selling.</p>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}><div className="tile" style={{ background: 'var(--bg)' }}><b>{num(s.urmCdp)}</b><span>HESTIA locked in CDP</span></div><div className="tile" style={{ background: 'var(--bg)' }}><b>{bps(cdp?.currentInterestRate)}</b><span>yearly rate</span></div></div>
            <Link className="btn btn-primary btn-block" style={{ marginTop: 16 }} href="/urm/cdp">Open a position</Link></article>
        </div>
        <div style={{ marginTop: 20 }}><YourPosition items={[{ label: 'HESTIA in wallet', key: 'HESTIA' }, { label: 'Worth today', key: 'HESTIA', unit: 'USD', mult: n(h?.price) }]} /></div>
      </section>

      <section className="wrap sec">
        <h2 className="h2">The engine.</h2>
        <ul className="list" style={{ marginTop: 28 }}>
          <li><span className="k">Hestia&apos;s strength</span><strong>{usd(h?.strength?.value)}</strong></li>
          <li><span className="k">USDC reserve</span><strong>{usd(h?.reserve?.usdc)} of {usd(ch.usdcCapacity)}</strong></li>
          <li><span className="k">Main pool liquidity</span><strong>{usd(h?.liquidity?.mainValue)}</strong></li>
          <li><span className="k">Liquidity to market cap</span><strong>{num(h?.liquidity?.marketCapRatio, 2)}%</strong></li>
          <li><span className="k">Owned by RAGE / URM</span><strong>{num(s.ragePercent, 2)}% / {num(s.urmPercent, 2)}%</strong></li>
          <li><span className="k">Smoke Fees run every</span><strong>{ch.smokeInterval || '—'}</strong></li>
        </ul>
      </section>

      <section className="wrap sec">
        <h2 className="h2">Questions.</h2>
        <Faq items={[
          ['What is the Hestia Chaos Engine?', "A controller contract that sets her burn rate. It grows a USDC reserve from trading fees and by pulling liquidity from the main pool, then uses it to buy and burn HESTIA. It's the buyer of last resort."],
          ['How does RAGE make HESTIA stronger?', '80% of every RAGE investment buys HESTIA, wraps it into pHestia on Peapods and locks it as backing.'],
          ['What is the Hestia Mine?', 'A staking contract inspired by BNBMiner, with a Peapods integration. Buy miners with HESTIA, then compound or sell your rewards.'],
          ['Why Base?', 'The engine runs on fees. On mainnet, gas would eat the profit. On Base it stays tiny, which is also why HESTIA has no transaction tax.'],
          ['How does HESTIA help ULTRAROUND?', "Smoke Fees can fund ULTRAROUND's Chaos Engine, pushing its burn rate up when its own volume is low."],
          ['Will HESTIA become an AI agent?', "That's the plan for a later phase: an AI agent owns the Chaos Engine and engages with the community."],
        ]} />
      </section>
      <Check links={[{ label: 'Audit', href: legacy('/hestia/audit.pdf'), strong: true }, { label: 'Whitepaper', href: legacy('/hestia/whitepaper.pdf'), strong: true }, addr('HESTIA', C.hestia, true), addr('Chaos Engine', C.hestiaChaos), { label: 'Dune', href: 'https://dune.com/ultraround_money/hestia' }, { label: 'CoinGecko', href: 'https://www.coingecko.com/en/coins/hestia' }]} />
      <Footer name="HESTIA" x="HestiaOnBase" />
    </div>
  );
}
