import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AutoRefresh from '@/components/AutoRefresh';
import Check, { addr } from '@/components/Check';
import { CdpPanel, YourPosition } from '@/components/Panels';
import { Steps, Tiles } from '@/components/ui';
import { api } from '@/lib/api';
import { num, bps, n, legacy } from '@/lib/fmt';
import { C } from '@/lib/tokens';
import { URM_TABS } from '@/lib/tabs';

export const revalidate = 60;
export const metadata = { title: 'URM CDP' };

export default async function Cdp() {
  const [c, h] = await Promise.all([api('urm/cdp'), api('home/overview')]);
  const price: Record<string, number> = { RAGE: n(h?.rage), HESTIA: n(h?.hestia), CIRCLE: n(h?.circle), ULTRAROUND: n(h?.circle) };
  const cols = (c?.tokens || []).map((t: any) => ({ symbol: t.symbol === 'CIRCLE' ? 'ULTRAROUND' : t.symbol, price: price[t.symbol] ?? n(t.collateralValue) / n(t.collateralBalance), min: n(t.minCollateralRatio), max: n(t.maxCollateralRatio) }));
  const util = n(c?.utilization) / 100;
  return (
    <div className="page">
      <AutoRefresh />
      <Nav active="urm" tabs={URM_TABS} current="/urm/cdp" />
      <section className="wrap" style={{ paddingTop: 56 }}>
        <div className="split">
          <div className="main">
            <h1 className="h1">URM CDP</h1>
            <p className="lead">Lock RAGE, HESTIA or ULTRAROUND and mint URM against it. Borrow at a fixed collateral ratio, or leverage in one transaction. Your position is an NFT you can settle, unwind or transfer anytime.</p>
            <div style={{ marginTop: 32 }}>
              <Tiles items={[{ v: bps(c?.currentInterestRate), l: 'yearly interest' }, { v: num(c?.urmBorrowable), l: 'URM available' }, { v: bps(c?.utilization, 0), l: 'utilization' }, { v: num(c?.urmDebt), l: 'URM borrowed' }, { v: num(c?.borrowCapacity), l: 'max capacity' }, { v: num(c?.positionCount), l: 'open positions' }]} />
            </div>
            <div className="bar" style={{ marginTop: 20, background: 'var(--panel)' }} role="img" aria-label={`${num(util)}% of borrow capacity in use`}><div style={{ width: `${Math.min(100, util)}%`, background: 'var(--accent)' }} /></div>
            <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>{num(util)}% of the borrow capacity is in use.</p>
            <div style={{ marginTop: 28 }}>
              <YourPosition items={[{ label: 'Position NFTs', key: 'CDP' }, { label: 'RAGE', key: 'RAGE' }, { label: 'HESTIA', key: 'HESTIA' }, { label: 'ULTRAROUND', key: 'ULTRAROUND' }]} />
            </div>
          </div>
          <div className="side"><CdpPanel cols={cols} rate={n(c?.currentInterestRate) / 100} app={legacy('/urm/cdp')} /></div>
        </div>
      </section>
      <section className="wrap sec grid2">
        <div className="card glass"><h2 className="h3">Borrow</h2><p className="punch" style={{ fontSize: 24 }}>Liquidity without selling.</p><p className="muted" style={{ lineHeight: 1.5 }}>Lock your tokens, mint URM at a fixed ratio, keep your upside. Repay to get your collateral back.</p></div>
        <div className="card glass"><h2 className="h3">Leverage</h2><p className="punch" style={{ fontSize: 24 }}>More exposure, one transaction.</p><p className="muted" style={{ lineHeight: 1.5 }}>The minted URM buys more of your collateral in the same transaction. Bigger upside, bigger downside. Unwind anytime.</p></div>
      </section>
      <section className="wrap sec">
        <h2 className="h2">How it works.</h2>
        <Steps items={[{ d: 'Pick RAGE, HESTIA or ULTRAROUND and lock it.' }, { d: `Mint URM. Interest builds daily, ${num(c?.urmCdpInterestPerDay, 2)} URM a day across all positions right now.` }, { d: 'Settle, unwind or transfer your NFT whenever you want.' }]} />
      </section>
      <Check links={[{ label: 'CDP audit', href: legacy('/urm/cdp-audit.pdf'), strong: true }, addr('CDP', C.cdp), addr('Position NFT', C.cdpNft, true), addr('RAGE collateral', C.colRage), addr('HESTIA collateral', C.colHestia), addr('ULTRAROUND collateral', C.colCircle)]} />
      <Footer />
    </div>
  );
}
