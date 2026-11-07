import PageBg from '@/components/PageBg';
import Footer from '@/components/Footer';
import AutoRefresh from '@/components/AutoRefresh';
import Check, { addr } from '@/components/Check';
import FountainPanel from '@/components/FountainPanel';
import { YourPosition } from '@/components/Panels';
import { Steps, Tiles } from '@/components/ui';
import YieldCounter from '@/components/YieldCounter';
import { api } from '@/lib/api';
import { num, bps, n, legacy } from '@/lib/fmt';
import { C, TOKENS } from '@/lib/tokens';
import { URM_TABS } from '@/lib/tabs';

export const revalidate = 60;
export const metadata = { title: 'Fountain URM' };

export default async function Fountain() {
  const f = await api('urm/fortress');
  const s = f?.fountainState || {}, cfg = s.config || {};
  const toAssets = n(s.toAssets);
  return (
    <div className="page has-bg">
      <PageBg img="/hero/fountain.jpg" color="#0a1a8a" pos="50% 50%" mpos="50% 50%" />
      <AutoRefresh />
      <section className="wrap" style={{ paddingTop: 56 }}>
        <div className="split">
          <div className="main">
            <h1 className="h1">Fountain URM</h1>
            <p className="lead">Deposit URM, get fURM. Your fURM count stays the same while each one is worth more URM every day.</p>
            <div style={{ marginTop: 32 }}>
              <Tiles items={[{ v: bps(cfg.yieldRate), l: 'target yield' }, { v: bps(s.effectiveRate), l: 'effective yield' }, { v: num(toAssets, 4), l: 'URM per fURM' }, { v: num(s.totalAssets), l: 'URM staked' }, { v: num(s.totalShares), l: 'fURM supply' }, { v: num(s.yieldCapacity), l: 'URM capacity left' }]} />
            </div>
            <p className="muted" style={{ fontSize: 'var(--fs-subhead)', marginTop: 14 }}>Effective yield is what the vault paid over its life so far. Target is the rate the Fortress aims for.</p>
            <div style={{ marginTop: 28 }}>
              <YourPosition items={[{ label: 'Your fURM', key: 'fURM' }, { label: 'Worth today', key: 'fURM', unit: 'URM', mult: toAssets }, { label: 'URM in wallet', key: 'URM' }]} />
            </div>
          </div>
          <div className="side">
            <FountainPanel depositShares={n(s.depositShares)} redeemAssets={n(s.redeemAssets)} toAssets={toAssets} yieldRate={n(cfg.yieldRate) / 100} depositFee={n(cfg.depositFee) / 100} withdrawFee={n(cfg.withdrawFee) / 100} windowRemaining={n(s.windowRemaining)} app={legacy('/urm/fountain')} />
          </div>
        </div>
      </section>
      <section className="band" style={{ marginTop: 64 }}><div className="wrap stats">
        <div className="stat"><b>{num(s.interestPerDay, 2)} URM</b><span>paid out per day</span></div>
        <div className="stat"><b>{num(s.state?.totalInterest, 2)} URM</b><span>yield paid so far</span></div>
        <div className="stat"><b>{num(s.windowRemaining)} URM</b><span>withdrawable right now</span></div>
        <div className="stat"><b>{bps(cfg.depositFee, 0)} / {bps(cfg.withdrawFee)}</b><span>deposit / withdraw fee</span></div>
      </div></section>
      <section className="wrap sec">
        <h2 className="h2">Your URM works<br /><span className="acc">the night shift.</span></h2>
        <p className="punch">No claiming. No rebasing. It just grows.</p>
        <div className="card glass-rim" style={{ marginTop: 32 }}>
          <YieldCounter toAssets={toAssets} interestPerDay={n(s.interestPerDay)} totalShares={n(s.totalShares)} yieldRate={n(cfg.yieldRate) / 100} />
        </div>
      </section>
      <section className="wrap sec">
        <h2 className="h2">How it works.</h2>
        <Steps items={[{ t: 'Deposit URM', d: 'No deposit fee. You get fURM, a share of the vault.' }, { t: 'The Fortress pays the yield', d: 'From pool fees and protocol profit. The share price climbs. No claiming, no rebasing.' }, { t: 'Withdraw anytime', d: `To URM or USDC, with a ${bps(cfg.withdrawFee)} fee, up to what's withdrawable right now.` }]} />
      </section>
      <Check links={[{ label: 'Fountain audit', href: legacy('/urm/fountain-audit.pdf'), strong: true }, addr('Fountain', C.fountain), addr('Fortress', C.fortress), addr('URM token', TOKENS.URM, true), { label: 'DefiLlama pool', href: 'https://defillama.com/yields/pool/cab80e81-b20e-53eb-8f92-b20c89ebb4a5' }]} />
      <Footer name="URM" />
    </div>
  );
}
