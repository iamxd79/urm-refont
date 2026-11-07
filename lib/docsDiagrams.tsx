import type { ReactNode } from 'react';
import { api } from './api';
import { num, usd, ago, n } from './fmt';
import PegFortress from '@/components/PegFortress';
import YieldCounter from '@/components/YieldCounter';
import CdpSlider from '@/components/CdpSlider';
import BackingFlow from '@/components/BackingFlow';
import OtcMeter from '@/components/OtcMeter';
import HestiaEngine from '@/components/HestiaEngine';
import CircleBurnLoop from '@/components/CircleBurnLoop';
import MineLoop from '@/components/MineLoop';
import PhoneDemo from '@/components/PhoneDemo';
import { bps } from './fmt';

/** The site's animated diagrams, ready to drop into a doc with `::diagram name`. Only the ones a page uses are fetched. */
export async function docsDiagrams(names: string[]): Promise<Record<string, ReactNode>> {
  if (!names.length) return {};
  const need = (k: string) => names.includes(k);
  const [home, fort, cdp, rbp, otc, hes, cir, mine] = await Promise.all([
    need('cdp') ? api('home/overview') : null,
    need('fortress') || need('yield') || need('phone') ? api('urm/fortress') : null,
    need('cdp') ? api('urm/cdp') : null,
    need('backing') ? api('rage/buying-protocol') : null,
    need('otc') ? api('rage/otc') : null,
    need('hestia-engine') ? api('hestia/overview') : null,
    need('burn-loop') ? api('circle/overview') : null,
    need('mine') ? api('hestia/mine') : null,
  ]);
  const out: Record<string, ReactNode> = {};
  const fs = fort?.fortressState || {}, fo = fort?.fountainState || {}, ov = fs.overview || {};
  const pegDate = (d: any) => { const t = Date.parse(d); return isFinite(t) ? new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : '—'; };
  if (need('fortress')) out.fortress = <PegFortress price={n(fort?.urmPrice)} towers={n(fs.towers?.length ?? 6)} usdcRoom={usd(fs.pegDefenseRoom?.usdcLeft)} urmRoom={num(fs.pegDefenseRoom?.urmLeft) + ' $URM'} defense={usd(ov.totalDefense)} lastStep={pegDate(fs.state?.lastPegDefense)} />;
  if (need('yield')) out.yield = <YieldCounter toAssets={n(fo.toAssets)} interestPerDay={n(fo.interestPerDay)} totalShares={n(fo.totalShares)} yieldRate={n(fo.config?.yieldRate) / 100} />;
  if (need('cdp')) {
    const price: Record<string, number> = { RAGE: n(home?.rage), HESTIA: n(home?.hestia), CIRCLE: n(home?.circle) };
    const cols = (cdp?.tokens || []).map((t: any) => ({ symbol: t.symbol === 'CIRCLE' ? 'ULTRAROUND' : t.symbol, price: price[t.symbol] ?? n(t.collateralValue) / n(t.collateralBalance), min: n(t.minCollateralRatio), max: n(t.maxCollateralRatio) }));
    out.cdp = <CdpSlider cols={cols} />;
  }
  if (need('backing')) {
    const v = rbp?.rbpView || {}, cfg = rbp?.config || {};
    out.backing = <BackingFlow hestiaPct={n(cfg.hestiaPercent ?? 80)} treasury={usd(v.activeAssetsUsdcValue)} backing={num(v.backingPerShare, 3)} premium={(n(v.price) / n(v.fmv) - 1) * 100} claimFee={n(cfg.claimFee)} />;
  }
  if (need('otc')) {
    const raw = n(otc?.dateNext); const next = isFinite(raw) && raw * 1000 > Date.now() ? raw : null;
    out.otc = <OtcMeter active={!!otc?.active} bonus={n(otc?.bonusCurrent)} min={n(otc?.config?.bonusMin) || 1} max={n(otc?.config?.bonusMax) || 20} last={n(otc?.lastTx?.bonus) || 0} next={next} />;
  }
  if (need('hestia-engine')) { const ch = hes?.chaosAutomator || {}; out['hestia-engine'] = <HestiaEngine usdc={n(hes?.reserve?.usdc)} cap={n(ch.usdcCapacity)} nextSmoke={ch.nextSmokeTime} nextRage={ch.nextRageTime} interval={ch.smokeInterval} burnedPct={n(hes?.supply?.burnedPercent)} />; }
  if (need('burn-loop')) { const ch = cir?.chaosAutomator || {}; out['burn-loop'] = <CircleBurnLoop burnedPct={n(cir?.supply?.burnedPercent)} burned={num(cir?.supply?.burned)} weth={num(cir?.cctp?.weth, 4)} perDay={num(ch.burnPerDay)} last={ago(ch.lastBurn)} />; }
  if (need('mine')) out.mine = <MineLoop theme="hestia" token="HESTIA" crew="miners" balance={num(mine?.state?.hestiaPodsBalance)} sellLimit={num(mine?.state?.hestiaSellLimit)} />;
  if (need('phone')) out.phone = <PhoneDemo apy={bps(fo.config?.yieldRate, 0)} steps={[{ t: 'Passkey wallet', d: 'Face ID or a fingerprint.' }, { t: 'Buy USDC', d: 'Card or Apple Pay, 0.2% fee.' }, { t: 'Swap to $URM', d: 'One tap, gas covered.' }, { t: 'Deposit', d: 'Into Fountain. Withdraw anytime.' }]} />;
  return out;
}
