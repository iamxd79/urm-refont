import { api } from './api';
import { num, usd, bps, n } from './fmt';

/** Live values the docs can quote with {{key}}. Refreshed with the page (60s). */
export async function docsVars(): Promise<Record<string, string>> {
  const [home, urm, fort, cdp, rbp, otc, hes, cir, mine, temple] = await Promise.all([
    api('home/overview'), api('urm/overview'), api('urm/fortress'), api('urm/cdp'), api('rage/buying-protocol'), api('rage/otc'),
    api('hestia/overview'), api('circle/overview'), api('hestia/mine'), api('circle/temple'),
  ]);
  const fs = fort?.fortressState || {}, fo = fs.fountainState || fort?.fountainState || {}, cfg = rbp?.config || {};
  const days = (s: any) => num(n(s) / 86400);
  const col = (sym: string) => (cdp?.tokens || []).find((t: any) => t.symbol === sym) || {};
  const hp = n(cfg.hestiaPercent);
  return {
    'urm.price': '$' + num(fort?.urmPrice ?? urm?.price, 4),
    'urm.supply': num(urm?.supply?.circulating),
    'urm.defense': usd(fs.overview?.totalDefense),
    'urm.towers': num(fs.towers?.length ?? 6),
    'urm.usdcRoom': usd(fs.pegDefenseRoom?.usdcLeft),
    'urm.urmRoom': num(fs.pegDefenseRoom?.urmLeft),
    'fountain.target': bps(fo.config?.yieldRate, 0),
    'fountain.effective': bps(fo.effectiveRate),
    'fountain.withdrawFee': bps(fo.config?.withdrawFee),
    'fountain.depositFee': bps(fo.config?.depositFee),
    'fountain.window': num(fo.windowRemaining),
    'fountain.share': num(fo.toAssets, 4),
    'fountain.staked': num(fo.totalAssets),
    'cdp.rate': bps(cdp?.currentInterestRate),
    'cdp.util': bps(cdp?.utilization, 0),
    'cdp.available': num(cdp?.urmBorrowable),
    'cdp.rage': `${num(col('RAGE').minCollateralRatio)}x to ${num(col('RAGE').maxCollateralRatio)}x`,
    'cdp.hestia': `${num(col('HESTIA').minCollateralRatio)}x to ${num(col('HESTIA').maxCollateralRatio)}x`,
    'cdp.circle': `${num(col('CIRCLE').minCollateralRatio)}x to ${num(col('CIRCLE').maxCollateralRatio)}x`,
    'cdp.paid': num(cdp?.urmCdpPaidToFortress),
    'rage.price': '$' + num(home?.rage ?? rbp?.rbpView?.price, 2),
    'rage.fmv': '$' + num(rbp?.rbpView?.fmv, 2),
    'rage.backing': num(rbp?.rbpView?.backingPerShare, 4),
    'rage.hestiaPct': isFinite(hp) ? num(hp) + '%' : '—',
    'rage.circlePct': isFinite(hp) ? num(100 - hp) + '%' : '—',
    'rage.mintDelay': days(cfg.mintDelay),
    'rage.claimDelay': days(cfg.claimDelay),
    'rage.claimFee': num(cfg.claimFee) + '%',
    'rage.adp': num(cfg.adpPercent) + '%',
    'rage.bonus': num(cfg.investorBonus) + '%',
    'rage.min': usd(cfg.minInvest), 'rage.max': usd(cfg.maxInvest),
    'rage.treasury': usd(rbp?.rbpView?.activeAssetsUsdcValue),
    'otc.min': num(otc?.config?.bonusMin) + '%', 'otc.max': num(otc?.config?.bonusMax) + '%',
    'hestia.burned': num(hes?.supply?.burned), 'hestia.burnedPct': num(hes?.supply?.burnedPercent, 2) + '%',
    'hestia.reserve': usd(hes?.reserve?.usdc), 'hestia.cap': usd(hes?.chaosAutomator?.usdcCapacity), 'hestia.smoke': hes?.chaosAutomator?.smokeInterval || '—',
    'circle.burned': num(cir?.supply?.burned), 'circle.burnedPct': num(cir?.supply?.burnedPercent, 2) + '%',
    'circle.liqRatio': num(cir?.liquidity?.marketCapRatio, 2) + '%', 'circle.weth': num(cir?.cctp?.weth, 4),
    'mine.sellLimit': num(mine?.state?.hestiaSellLimit, 2), 'temple.sellLimit': num(temple?.state?.circleSellLimit, 2),
  };
}
