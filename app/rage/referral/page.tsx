import { Brand } from '@/components/ProductLogo';
import PageBg from '@/components/PageBg';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AutoRefresh from '@/components/AutoRefresh';
import { RefLink } from '@/components/Panels';
import { api } from '@/lib/api';
import { num, ago, short } from '@/lib/fmt';
import { RAGE_TABS } from '@/lib/tabs';

export const revalidate = 60;
export const metadata = { title: 'Rage Referral' };

export default async function Referral() {
  const r = await api('rage/referral');
  const pc = r?.percent ?? 5;
  const rows = ((r?.referral || []) as any[]).map((x) => ({ addr: x[0], name: x[1], last: x[2], count: x[3], invested: num(x[4], 2), unpaid: num(x[5], 2), paid: num(x[6], 2), inv: Number(x[4]) || 0 })).sort((a, b) => b.inv - a.inv);
  return (
    <div className="page has-bg" data-theme="rage">
      <PageBg img="/hero/rage.jpg" color="#270630" pos="85% 40%" mpos="72% 30%" />
      <AutoRefresh />
      <Nav active="rage" tabs={RAGE_TABS} current="/rage/referral" />
      <section className="wrap" style={{ paddingTop: 56 }}>
        <div className="split">
          <div className="main">
            <Brand id="rage" ticker="$RAGE" sub="Referral program" />
            <h1 className="h1">Bring investors.<br /><span className="acc">Earn {pc}%.</span></h1>
            <p className="lead">Share your link. When someone invests USDC in RAGE through it, you earn {pc}% of what they invest, paid every month in RAGE.</p>
            <ul className="list" style={{ marginTop: 32 }}>
              <li><span className="k">Commission</span><strong>{pc}% of USDC invested</strong></li>
              <li><span className="k">Paid in</span><strong>RAGE, every month</strong></li>
              <li><span className="k">Counts</span><strong>Invest on the Rage app</strong></li>
              <li><span className="k">Review</span><strong>Monthly. Fake or self-referrals get canceled.</strong></li>
            </ul>
          </div>
          <div className="side"><RefLink rows={rows.map(({ addr, invested, unpaid, paid }) => ({ addr, invested, unpaid, paid }))} /></div>
        </div>
      </section>
      <section className="wrap sec">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}><h2 className="h2">Referrers</h2><span className="muted">{rows.length} registered</span></div>
        <div className="tbl glass-rim" style={{ marginTop: 24 }}>
          <table>
            <thead><tr><th>Referrer</th><th>Invested through them</th><th>Unpaid</th><th>Paid</th><th>Last</th></tr></thead>
            <tbody>{rows.map((x) => <tr key={x.addr}><td className="tcell-title"><b>{x.name || 'anon'}</b> <span className="mono muted" style={{ fontSize: 'var(--fs-footnote)' }}>{short(x.addr)}</span></td><td data-label="Invested through them">${x.invested} · {x.count} invest{x.count === 1 ? '' : 's'}</td><td data-label="Unpaid">${x.unpaid}</td><td data-label="Paid">${x.paid}</td><td data-label="Last" className="muted">{x.inv > 0 ? ago(x.last) : '—'}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <Footer name="RAGE" x="therageprotocol" />
    </div>
  );
}
