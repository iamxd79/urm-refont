import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AutoRefresh from '@/components/AutoRefresh';
import Check, { addr } from '@/components/Check';
import { Hero, Stats, SupplyBar } from '@/components/ui';
import { api } from '@/lib/api';
import { num, usd, bps, ago, n, legacy } from '@/lib/fmt';
import { C, TOKENS } from '@/lib/tokens';
import { URM_TABS } from '@/lib/tabs';

export const revalidate = 60;
export const metadata = { title: 'URM stablecoin' };

export default async function Urm() {
  const [o, f, cdp, home] = await Promise.all([api('urm/overview'), api('urm/fortress'), api('urm/cdp'), api('home/overview')]);
  const fs = f?.fortressState || {}, ov = fs.overview || {}, fo = f?.fountainState || {};
  const price = n(f?.urmPrice ?? o?.price);
  const onPeg = Math.abs(price - 1) <= 0.01;
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
    <div className="page">
      <AutoRefresh />
      <Nav active="urm" tabs={URM_TABS} current="/urm" />
      <Hero img="/assets/urm_fortress_wide.svg" alt="A fortress on a hill">
        <div className="split">
          <div className="main">
            <h1 className="h1">A stablecoin built like <span className="acc">a fortress.</span></h1>
            <p className="lead">URM holds its dollar peg with automatic onchain defense, backed by RAGE, HESTIA and ULTRAROUND. Only on Base.</p>
            <div className="row" style={{ marginTop: 32 }}>
              <Link className="btn btn-primary btn-lg" href="/urm/fountain">Earn with Fountain</Link>
              <Link className="btn btn-outline btn-lg" href="/urm/cdp">Borrow with the CDP</Link>
              <a className="btn btn-outline btn-lg" href="https://app.uniswap.org/swap?chain=base&outputCurrency=0xf0e3349f00972475a5d16721796091aa3b997837">Buy URM</a>
            </div>
          </div>
          <div className="side cream glass" style={{ padding: 28 }}>
            <b className="muted" style={{ fontSize: 13, letterSpacing: 1.5 }}>PEG CHECK</b>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
              <span className="pill" style={{ background: onPeg ? '#2e7d50' : '#b3261e', color: '#fff' }}>{onPeg ? 'On peg' : 'Off peg'}</span>
              <b style={{ fontSize: 40 }}>${num(price, 3)}</b><span className="muted">URM price</span>
            </div>
            <p className="muted" style={{ margin: '20px 0 0', fontWeight: 600 }}>Total defense</p>
            <p style={{ margin: '2px 0 12px', fontSize: 40, fontWeight: 800 }}>{usd(ov.totalDefense)}</p>
            <SupplyBar parts={defense} />
            <p className="muted" style={{ fontSize: 14, margin: '16px 0 0' }}>The keeper checks the peg every 1.5 to 2 hours. Last defense: {ago(fs.state?.lastPegDefense)}.</p>
          </div>
        </div>
      </Hero>
      <div style={{ height: 48 }} />
      <Stats items={[{ v: usd(o?.marketCap), l: 'market cap' }, { v: usd(o?.liquidity?.value), l: 'total liquidity' }, { v: num(sup.included), l: 'backed supply' }, { v: num(fs.towers?.length ?? 6), l: 'registered towers' }]} />

      <section className="wrap sec">
        <h2 className="h2">How the peg holds.</h2>
        <p className="punch">One contract owns the liquidity and defends both sides.</p>
        <div className="steps">
          {[['The Fortress', 'One protocol-owned contract issues URM, owns the liquidity and stays within an onchain backing limit.'], ['Peg defense', 'An automated keeper reads the price and defends the peg in both directions.'], ['Towers', `Up to 9 towers plug into the Fortress to extend backing and share yield. ${fs.towers?.length ?? 6} are live.`], ['Real yield', 'Paid from pool fees and protocol profit. Never from printing new tokens.']].map(([t, d]) => <div key={t} className="step"><h3 style={{ marginTop: 0 }}>{t}</h3><p>{d}</p></div>)}
        </div>
      </section>

      <section className="wrap sec grid2">
        <article className="cream glass" style={{ padding: 32 }}>
          <b className="muted" style={{ fontSize: 13, letterSpacing: 1.5 }}>EARN</b>
          <h3 className="h3" style={{ marginTop: 8 }}>Fountain URM</h3>
          <p style={{ lineHeight: 1.5 }}>Deposit URM, get fURM. Each fURM is worth more URM every day. Withdraw anytime, to URM or USDC.</p>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(96px,1fr))', gap: 10 }}>
            <div className="tile"><b>{bps(fo.config?.yieldRate, 0)}</b><span>target APY</span></div>
            <div className="tile"><b>{num(fo.totalAssets)}</b><span>URM staked</span></div>
            <div className="tile"><b>{num(fo.toAssets, 4)}</b><span>URM per fURM</span></div>
          </div>
          <Link href="/urm/fountain" className="btn btn-ink btn-lg btn-block" style={{ marginTop: 20 }}>Open Fountain</Link>
        </article>
        <article className="card glass" style={{ padding: 32 }}>
          <b className="muted" style={{ fontSize: 13, letterSpacing: 1.5 }}>BORROW</b>
          <h3 className="h3" style={{ marginTop: 8 }}>URM CDP</h3>
          <p style={{ lineHeight: 1.5 }}>Lock RAGE, HESTIA or ULTRAROUND and mint URM against it. Your position is an NFT you can settle, unwind or transfer anytime.</p>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(96px,1fr))', gap: 10 }}>
            <div className="tile" style={{ background: 'var(--bg)' }}><b>{bps(cdp?.currentInterestRate)}</b><span>yearly rate</span></div>
            <div className="tile" style={{ background: 'var(--bg)' }}><b>{num(cdp?.urmBorrowable)}</b><span>URM to borrow</span></div>
            <div className="tile" style={{ background: 'var(--bg)' }}><b>{num(cdp?.positionCount)}</b><span>open positions</span></div>
          </div>
          <Link href="/urm/cdp" className="btn btn-primary btn-lg btn-block" style={{ marginTop: 20 }}>Open a position</Link>
        </article>
      </section>

      <section className="wrap sec">
        <h2 className="h2">Dashboard.</h2>
        <p className="punch">Every number, live from the contracts.</p>
        <div className="grid" style={{ marginTop: 32, gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 20 }}>
          <div><h3 className="h3" style={{ fontSize: 21, marginBottom: 12 }}>Where the supply sits</h3><ul className="list">
            {[['Circulating', sup.circulating], ['Fortress', sup.fortress], ['Flanking pool', sup.flankingPool], ['Towers', sup.tower], ['Holders', sup.holders], ['Main pool', sup.mainPool], ['RAGE pool', sup.ragePool], ['Initial supply', sup.initial]].map(([k, v]) => <li key={k}><span className="k">{k}</span><strong>{num(v)}</strong></li>)}
          </ul></div>
          <div><h3 className="h3" style={{ fontSize: 21, marginBottom: 12 }}>Defense</h3><ul className="list">
            {[['Soft defense', usd(ov.softDefense)], ['Hard defense', usd(ov.hardDefense)], ['Defense surplus', usd(ov.totalDefenseSurplus)], ['Counter defense', usd(ov.counterDefense)], ['Below-peg room', usd(fs.pegDefenseRoom?.usdcLeft)], ['Above-peg room', num(fs.pegDefenseRoom?.urmLeft) + ' URM'], ['Liquidity to market cap', num(o?.liquidity?.marketCapRatio, 2) + '%']].map(([k, v]) => <li key={k}><span className="k">{k}</span><strong>{v}</strong></li>)}
          </ul></div>
          <div><h3 className="h3" style={{ fontSize: 21, marginBottom: 12 }}>Fountain and CDP</h3><ul className="list">
            {[['Fountain staked', num(fo.totalAssets)], ['Fountain interest per day', num(fo.interestPerDay, 2)], ['Fountain idle supply', num(fo.urmIdle)], ['CDP borrowed', num(cdp?.urmDebt)], ['CDP interest per day', num(cdp?.urmCdpInterestPerDay, 2)], ['CDP paid to the Fortress', num(cdp?.urmCdpPaidToFortress)]].map(([k, v]) => <li key={k}><span className="k">{k}</span><strong>{v}</strong></li>)}
          </ul></div>
        </div>
      </section>

      <Check links={[{ label: 'Whitepaper', href: legacy('/urm/whitepaper.pdf'), strong: true }, { label: 'Audit', href: legacy('/urm/audit.pdf'), strong: true }, addr('URM token', TOKENS.URM, true), addr('Fortress', C.fortress), { label: 'DefiLlama', href: 'https://defillama.com/protocol/urm' }, { label: 'Dextools', href: 'https://www.dextools.io/app/base/pair-explorer/0x63b531588398cd17297d571e17688d31cc182075' }]} />
      <Footer />
    </div>
  );
}
