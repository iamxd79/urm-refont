import MinePage from '@/components/MinePage';
import { addr } from '@/components/Check';
import { api } from '@/lib/api';
import { num, legacy } from '@/lib/fmt';
import { C } from '@/lib/tokens';
import { HESTIA_TABS } from '@/lib/tabs';

export const revalidate = 60;
export const metadata = { title: 'Hestia Mine' };

export default async function Mine() {
  const [m, chiefs] = await Promise.all([api('hestia/mine'), api('hestia/mining-chiefs')]);
  const s = m?.state || {};
  return (
    <MinePage theme="hestia" active="hestia" tabs={HESTIA_TABS} current="/hestia/mine" title="The Hestia Mine"
      lead="Buy miners with HESTIA, then compound or sell your rewards. Chiefs who compound often take shares from the ones who don't."
      punch="Become a mining chief." token="HESTIA" balKey="HESTIA" unit="miners" unitOne="miner" verbs={['Buy miners', 'Compound', 'Sell']}
      leader="Chief" leaders="mining chiefs" pTok="pHestia" st={s} tvl={m?.tvl} podLiquidity={m?.podLiquidity} rows={Array.isArray(chiefs) ? chiefs : []}
      shareKey="minerShare" perOneKey="hestiaForOnePercent" sellLimitKey="hestiaSellLimit" roiKey="mineRoi" app={legacy('/hestia/mine')} connectLabel="Connect wallet to mine"
      how={[['Buy miners', 'Spend HESTIA to hire your crew. More miners, bigger share of the daily rewards.'], ['Compound', 'Turn rewards into more miners. Frequent compounders gain shares from less active chiefs.'], ['Sell', `Cash out rewards up to the sell limit, currently ${num(s.hestiaSellLimit)} HESTIA.`], ['Peapods yield', `The mine farms volatility as pHestia on Peapods. 1 HESTIA is worth ${num(s.pTknRate, 3)} pHestia today.`], ['Liquidity drip', `The multisig drips ecosystem HESTIA into the mine. ${num(s.liquidityDrip)} so far.`], ['Referral link', 'Every chief gets a link. Bring new chiefs to the mine.']]}
      links={[{ label: 'Mine audit', href: legacy('/hestia/mine-audit.pdf'), strong: true }, addr('Mine', C.mine), { label: 'pHestia on Peapods', href: `https://peapods.finance/pod/8453/${C.pHestia}` }, { label: 'Blog post', href: 'https://medium.com/@traderxd79/the-hestia-miner-bda9f4a50fd1' }, { label: 'Dune', href: 'https://dune.com/ultraround_money/hestia' }]}
      footName="HESTIA" x="HestiaOnBase" />
  );
}
