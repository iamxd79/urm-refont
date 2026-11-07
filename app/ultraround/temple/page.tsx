import { seo } from '@/lib/seo';
import MinePage from '@/components/MinePage';
import { addr } from '@/components/Check';
import { api } from '@/lib/api';
import { num } from '@/lib/fmt';
import { legacy } from '@/lib/fmt';
import { C } from '@/lib/tokens';
import { CIRCLE_TABS } from '@/lib/tabs';

export const revalidate = 60;
export const metadata = seo({ title: 'Ultraround Temple', description: 'Become a cult leader. Summon templars with ULTRAROUND, compound or claim your rewards.', handle: '@UltraRoundMoney' });

export default async function Temple() {
  const [t, leaders] = await Promise.all([api('circle/temple'), api('circle/cult-leaders')]);
  const s = t?.state || {};
  return (
    <MinePage theme="circle" active="circle" tabs={CIRCLE_TABS} current="/ultraround/temple" title="Ultraround Temple"
      lead="Buy templars with ULTRAROUND, then compound or sell your rewards. Leaders who compound often take shares from the ones who don't."
      punch="Become a cult leader." token="ULTRAROUND" balKey="ULTRAROUND" unit="templars" unitOne="templar" verbs={['Summon', 'Compound', 'Sell']}
      leader="Leader" leaders="cult leaders" pTok="pod tokens" st={s} tvl={t?.tvl} podLiquidity={t?.podLiquidity} rows={Array.isArray(leaders) ? leaders : []}
      shareKey="templarShare" perOneKey="circleForOnePercent" sellLimitKey="circleSellLimit" roiKey="templeRoi" app={legacy('/circle/temple')} connectLabel="Connect wallet to pray"
      how={[['Summon templars', 'Spend ULTRAROUND to build your following. More templars, bigger share of the daily rewards.'], ['Compound', 'Turn rewards into more templars. Active leaders gain shares from quiet ones.'], ['Sell', `Cash out rewards up to the sell limit, currently ${num(s.circleSellLimit)} ULTRAROUND.`], ['Peapods yield', `The temple farms volatility on Peapods. 1 ULTRAROUND is worth ${num(s.pTknRate, 3)} pod tokens today.`], ['Liquidity drip', `The multisig drips ecosystem ULTRAROUND into the temple. ${num(s.liquidityDrip)} so far.`], ['Referral link', 'Every leader gets a link to bring new followers.']]}
      links={[addr('Temple', C.temple), { label: 'ULTRAROUND pod on Peapods', href: `https://peapods.finance/pod/8453/${C.pCircle}` }, { label: 'Dune', href: 'https://dune.com/ultraround_money/circle' }]}
      footName="ULTRAROUND" x="UltraRoundMoney" />
  );
}
