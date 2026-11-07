import PageBg from './PageBg';
import ActionBar from './ActionBar';
import Footer from './Footer';
import AutoRefresh from './AutoRefresh';
import Check, { type Link as L } from './Check';
import { MinerPanel } from './Panels';
import ShowAll from './ShowAll';
import ShareWheel from './ShareWheel';
import MineLoop from './MineLoop';
import { Tiles } from './ui';
import { num, usd, ago, short, n } from '@/lib/fmt';
import type { Tab } from '@/lib/nav';

type Cfg = {
  theme: string; active: string; tabs: Tab[]; current: string; title: string; lead: string; punch: string;
  token: string; balKey: string; unit: string; unitOne: string; verbs: [string, string, string]; leader: string; leaders: string; pTok: string;
  st: any; tvl: any; podLiquidity: any; rows: any[]; shareKey: string; app: string; connectLabel: string;
  how: [string, string][]; links: L[]; footName: string; x: string; sellLimitKey: string; perOneKey: string; roiKey: string;
};

export default function MinePage(c: Cfg) {
  const s = c.st || {};
  const rows = [...c.rows].sort((a, b) => parseFloat(b[c.shareKey]) - parseFloat(a[c.shareKey]));
  const opened = s.launchTimestamp ? new Date(s.launchTimestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '—';
  return (
    <div className="page has-bg" data-theme={c.theme} data-dim={c.theme === 'circle' ? '1' : undefined}>
      <PageBg img={c.theme === 'hestia' ? '/hero/hestia-v2.jpg' : '/hero/circle.jpg'} color={c.theme === 'hestia' ? '#2a0527' : '#030303'} pos={c.theme === 'hestia' ? '85% 40%' : '70% 50%'} mpos={c.theme === 'hestia' ? '70% 30%' : '80% 40%'} />
      <AutoRefresh />
      <section className="wrap" style={{ paddingTop: 'var(--s-16)' }}>
        <div className="split">
          <div className="main">
            <h1 className="h1">{c.title}</h1>
            <p className="lead">{c.lead}</p>
            <p className="punch">{c.punch}</p>
            <div style={{ marginTop: 'var(--s-8)' }}>
              <Tiles items={[
                { v: num(s[c.token === 'HESTIA' ? 'hestiaPodsBalance' : 'circlePodsBalance']), l: `${c.token} in the ${c.token === 'HESTIA' ? 'mine' : 'temple'}` },
                { v: num(s.dailyValueOnePercent, 2), l: `daily ${c.token} per 1% of ${c.unit}` },
                { v: num(s[c.perOneKey], 2), l: `${c.token} to own 1%` },
                { v: num(s.totalBurn), l: `${c.token} burned so far` },
                { v: num(s.pTknRate, 3), l: `${c.pTok} per ${c.token}` },
                { v: num(s.walletCount), l: c.leaders },
              ]} />
            </div>
          </div>
          <div className="side" id="act">
            <MinerPanel token={c.token} balKey={c.balKey} unit={c.unit} verbs={c.verbs} perOne={n(s[c.perOneKey])} dailyPerOne={n(s.dailyValueOnePercent)} sellLimit={n(s[c.sellLimitKey])} app={c.app} connectLabel={c.connectLabel} />
          </div>
        </div>
      </section>
      <section className="wrap sec">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 'var(--s-2)' }}><h2 className="h2">Leaderboard</h2><span className="muted">Live, refreshed every minute</span></div>
        {rows.length > 0 && <ShareWheel table={c.theme} unit={c.unit} rows={rows.map((r) => ({ wallet: r.wallet, share: parseFloat(r[c.shareKey]) || 0, label: short(r.wallet) }))} />}
        <ShowAll total={rows.length} label={c.leaders}>
        <div className="tbl glass-rim" data-sharetable={c.theme} style={{ marginTop: 'var(--s-6)' }}>
          <table>
            <thead><tr><th>{c.leader}</th><th>Share of {c.unit}</th><th>Daily rewards</th><th>Sold so far</th><th>Last move</th></tr></thead>
            <tbody>{rows.map((r, i) => <tr key={r.wallet} data-wallet={r.wallet} className={i >= 10 ? 'more' : undefined}><td className="mono tcell-title">{short(r.wallet)}</td><td data-label={`Share of ${c.unit}`}><b>{r[c.shareKey]}</b></td><td data-label="Daily rewards">{num(r.estimatedDailyValue, 2)}</td><td data-label="Sold so far">{num(r.sellTotal, 2)}</td><td data-label="Last move" className="muted">{ago(r.lastTx)}</td></tr>)}</tbody>
          </table>
          {rows.length === 0 && <p className="muted" style={{ padding: 'var(--s-4)', margin: 0 }}>No {c.leaders} yet.</p>}
        </div>
        </ShowAll>
      </section>
      <section className="wrap sec">
        <h2 className="h2">How it works.</h2>
        <MineLoop theme={c.theme === 'hestia' ? 'hestia' : 'circle'} token={c.token} crew={c.unit} balance={num(s[c.token === 'HESTIA' ? 'hestiaPodsBalance' : 'circlePodsBalance'])} sellLimit={num(s[c.sellLimitKey])} />
        <div className="steps">{c.how.map(([t, d], i) => <div key={t} className="step"><span className="n sm">{i + 1}</span><h3 style={{ marginTop: 0 }}>{t}</h3><p>{d}</p></div>)}</div>
      </section>
      <Check links={c.links} note={`Opened ${opened} · TVL ${usd(c.tvl)} · liquidity ${usd(c.podLiquidity)} · contract speed ${s[c.roiKey] ?? '—'}`} />
      <ActionBar label={c.verbs[0]} note={c.title} />
      <Footer name={c.footName} x={c.x} />
    </div>
  );
}
