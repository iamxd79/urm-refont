import PageBg from '@/components/PageBg';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AutoRefresh from '@/components/AutoRefresh';
import Countdown from '@/components/Countdown';
import Check, { addr } from '@/components/Check';
import { OtcPanel } from '@/components/Panels';
import { Steps } from '@/components/ui';
import { api } from '@/lib/api';
import { num, n, legacy, ago } from '@/lib/fmt';
import { C } from '@/lib/tokens';
import { RAGE_TABS } from '@/lib/tabs';

export const revalidate = 60;
export const metadata = { title: 'Rage OTC' };

export default async function Otc() {
  const [o, r, h] = await Promise.all([api('rage/otc'), api('rage/buying-protocol'), api('home/overview')]);
  const fmv = n(r?.rbpView?.fmv);
  const active = !!o?.active;
  const raw = n(o?.dateNext);
  const next = isFinite(raw) && raw * 1000 > Date.now() ? raw : NaN;
  const nextDate = isFinite(next) ? new Date(next * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' }) : null;
  return (
    <div className="page has-bg" data-theme="rage">
      <PageBg img="/hero/rage.jpg" color="#270630" pos="85% 40%" mpos="72% 30%" />
      <AutoRefresh />
      <Nav active="rage" tabs={RAGE_TABS} current="/rage/otc" />
      <section className="wrap" style={{ paddingTop: 56 }}>
        <div className="split">
          <div className="main">
            <h1 className="h1">Rage OTC</h1>
            <p className="lead">Trade HESTIA, ULTRAROUND or URM for RAGE from ecosystem supply, at a fair price plus a bonus.</p>
            <p className="punch">The bonus grows. The supply doesn&apos;t.</p>
            <div className="grid" style={{ marginTop: 32, gridTemplateColumns: 'repeat(auto-fit,minmax(min(200px,100%),1fr))', gap: 12 }}>
              <div className="tile"><span>Bonus right now</span><b className="acc">{active ? num(o?.bonusCurrent, 2) + '%' : '—'}</b></div>
              <div className="tile"><span>{active ? 'RAGE left in this round' : 'Round status'}</span><b>{active ? num(o?.rageBalance) : 'Sold out'}</b></div>
              <div className="tile"><span>Fair market value</span><b>${num(fmv, 2)}</b></div>
              <div className="tile"><span>Bonus range</span><b>{num(o?.config?.bonusMin)}% to {num(o?.config?.bonusMax)}%</b></div>
            </div>
            {!active && (
              <div className="cream glass" style={{ marginTop: 24, padding: 28 }}>
                <b className="muted" style={{ fontSize: 13, letterSpacing: 1.5 }}>THIS ROUND IS EMPTY</b>
                <h2 className="h3" style={{ marginTop: 8 }}>All sold out.{nextDate ? ` Next drop ${nextDate}.` : ''}</h2>
                <p className="muted" style={{ margin: '8px 0 0' }}>{nextDate ? <>Next drop in <b style={{ color: 'var(--ink)' }}><Countdown to={next} done="any moment now" /></b>. </> : 'Next drop is coming soon. '}Drops get announced on X first.</p>
                <a className="btn btn-ink" style={{ marginTop: 16 }} href="https://x.com/therageprotocol">Follow @therageprotocol</a>
              </div>
            )}
            <ul className="list" style={{ marginTop: 24 }}>
              <li><span className="k">Trades so far</span><strong>{num(o?.state?.txCount)}</strong></li>
              <li><span className="k">RAGE sold through OTC</span><strong>{num(o?.state?.rageOutputAmount)} + {num(o?.state?.rageOutputBonus, 1)} bonus</strong></li>
              <li><span className="k">Value paid in</span><strong>${num(o?.state?.inputValue)}</strong></li>
              <li><span className="k">Last trade</span><strong>{ago(o?.lastTx?.timestamp)} · {num(o?.lastTx?.bonus)}% bonus</strong></li>
            </ul>
          </div>
          <div className="side"><OtcPanel prices={{ HESTIA: n(h?.hestia), ULTRAROUND: n(h?.circle), URM: n(h?.urm) }} fmv={fmv} bonus={active ? n(o?.bonusCurrent) : n(o?.config?.bonusMin)} app={legacy('/rage/otc')} /></div>
        </div>
      </section>
      <section className="wrap sec">
        <h2 className="h2">How it works.</h2>
        <p className="punch">A reverse Dutch auction.</p>
        <Steps items={[{ d: 'The ecosystem puts RAGE up for sale at fair value.' }, { d: 'The bonus on top grows every moment nobody buys.' }, { d: 'Wait for a bigger bonus, or buy before someone else does.' }]} />
      </section>
      <Check links={[{ label: 'RAGE audit', href: legacy('/rage/audit.pdf'), strong: true }, addr('Rage OTC', C.rageOtc), addr('Rage Depot', C.rageDepot), addr('RAGE token', C.rage, true), { label: 'Whitepaper', href: legacy('/rage/whitepaper.pdf') }]} />
      <Footer name="RAGE" x="therageprotocol" />
    </div>
  );
}
