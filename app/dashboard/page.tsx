import type { ReactNode } from 'react';
import { seo } from '@/lib/seo';
import AutoRefresh from '@/components/AutoRefresh';
import Footer from '@/components/Footer';
import ProductLogo from '@/components/ProductLogo';
import { api } from '@/lib/api';
import { num, usd, bps, n } from '@/lib/fmt';

export const revalidate = 60;
export const metadata = seo({ title: 'URM live', description: 'The URM ecosystem at a glance: prices of $URM, RAGE, HESTIA and ULTRAROUND, the $URM peg and what defends it, Fountain, the CDP and the burns. Live from the chain.', handle: '@URMdollar' });

/* ---------- small SVG pieces (geometric, solid colours, no gradients) ---------- */
function Spark({ series, w = 520, h = 120, colors }: { series: number[][]; w?: number; h?: number; colors: string[] }) {
  const all = series.flat().filter(isFinite);
  if (all.length < 2) return null;
  const lo = Math.min(...all), hi = Math.max(...all), pad = 6;
  const y = (v: number) => pad + (h - 2 * pad) * (1 - (v - lo) / (hi - lo || 1));
  return (
    <svg className="lv-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
      <line x1="0" y1={h - 1} x2={w} y2={h - 1} stroke="rgba(176,191,214,.25)" strokeWidth="1" />
      {series.map((s, i) => {
        const pts = s.map((v, k) => `${((k / (s.length - 1)) * w).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
        const last = s[s.length - 1];
        return (
          <g key={i}>
            <polyline points={pts} fill="none" stroke={colors[i]} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <circle cx={w} cy={y(last)} r="4" fill={colors[i]} />
          </g>
        );
      })}
    </svg>
  );
}
function Ring({ pct, color, logo }: { pct: number; color: string; logo: string }) {
  const r = 46, c = 2 * Math.PI * r, p = Math.max(0, Math.min(100, pct || 0));
  return (
    <div className="lv-ring">
      <svg viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1b2f57" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(c * p) / 100} ${c}`} transform="rotate(-90 60 60)" />
      </svg>
      <span className="lv-ring-logo"><ProductLogo id={logo} size={44} /></span>
    </div>
  );
}
function PegBar({ price }: { price: number }) {
  // position of the price inside a ±1% band around $1
  const x = Math.max(0, Math.min(1, (price - 0.99) / 0.02));
  return (
    <div className="lv-peg" aria-label={`price within the peg band`}>
      <div className="lv-peg-track"><span className="lv-peg-mid" /><span className="lv-peg-dot" style={{ left: `${x * 100}%` }} /></div>
      <div className="lv-peg-scale"><span>$0.99</span><span>$1.00</span><span>$1.01</span></div>
    </div>
  );
}
function Meter({ value, max, color }: { value: number; max: number; color: string }) {
  const p = Math.max(0, Math.min(1, value / (max || 1)));
  return <div className="lv-meter"><span style={{ width: `${p * 100}%`, background: color }} /></div>;
}
function Card({ logo, title, className = '', children }: { logo: string; title: string; className?: string; children: ReactNode }) {
  return (
    <section className={'lv-card ' + className}>
      <header className="lv-card-head"><ProductLogo id={logo} size={26} /><h2>{title}</h2></header>
      {children}
    </section>
  );
}
const Stat = ({ l, v, s, big, accent }: { l: string; v: ReactNode; s?: ReactNode; big?: boolean; accent?: boolean }) => (
  <div className={'lv-stat' + (big ? ' big' : '')}>
    <div className="lv-l">{l}</div>
    <div className={'lv-v' + (accent ? ' acc' : '')}>{v}</div>
    {s && <div className="lv-s">{s}</div>}
  </div>
);

export default async function Live() {
  const [home, urm, fort, cdp, rbp, hes, cir] = await Promise.all([
    api('home/overview'), api('urm/overview'), api('urm/fortress'), api('urm/cdp'), api('rage/buying-protocol'), api('hestia/overview'), api('circle/overview'),
  ]);
  const fs = fort?.fortressState || {}, ov = fs.overview || {}, fo = fort?.fountainState || fs.fountainState || {};
  const rv = rbp?.rbpView || {};
  const price = n(fort?.urmPrice ?? urm?.price);
  const backed = n(urm?.supply?.included), defense = n(ov.totalDefense), ratio = defense / backed;
  const ragePrice = n(home?.rage ?? rv.price), fmv = n(rv.fmv), prem = (ragePrice / fmv - 1) * 100;
  const share = n(fo.toAssets);
  const fc: any[][] = Array.isArray(fort?.charts) ? fort.charts : [];
  const rc: any[][] = Array.isArray(rbp?.charts) ? rbp.charts : [];
  const defSeries = fc.map((r) => n(r[4])), supSeries = fc.map((r) => n(r[5]));
  const fmvSeries = rc.map((r) => n(r[0])), pxSeries = rc.map((r) => n(r[4]));
  const sgn = (x: number, d = 2) => (isFinite(x) ? `${x >= 0 ? '+' : '−'}${num(Math.abs(x), d)}%` : '—');

  return (
    <div className="page">
      <AutoRefresh />
      <section className="wrap lv-wrap">
        <div className="lv-top">
          <div>
            <h1 className="lv-h1">URM, by the numbers.</h1>
            <div className="lv-prices">
              {([['urm', '$URM', home?.urm ?? price, 4], ['rage', 'RAGE', ragePrice, 2], ['hestia', 'HESTIA', home?.hestia ?? hes?.price, 2], ['circle', 'ULTRAROUND', home?.circle ?? cir?.price, 2]] as [string, string, any, number][]).map(([id, l, v, d]) => (
                <span key={id} className="lv-price"><ProductLogo id={id} size={22} /><span className="lv-price-l">{l}</span><b>{isFinite(n(v)) ? '$' + num(v, d) : '—'}</b></span>
              ))}
            </div>
          </div>
          <img className="lv-eco" src="/assets/urm-eco.png" alt="URM ecosystem" width={56} height={56} />
        </div>

        <div className="lv-bento">
          <Card logo="urm" title="$URM peg" className="span-7">
            <div className="lv-row">
              <Stat big l="Price" v={isFinite(price) ? '$' + num(price, 4) : '—'} s={sgn((price - 1) * 100) + ' vs $1'} />
              <Stat big accent l="Defense ratio" v={isFinite(ratio) ? num(ratio, 2) + 'x' : '—'} s={`${usd(defense)} behind ${num(backed)} $URM`} />
            </div>
            {defSeries.length > 2 && (
              <div className="lv-chart">
                <div className="lv-legend"><span><i style={{ background: '#d7b067' }} />Total defense</span><span><i style={{ background: '#6f88b2' }} />Backed supply</span></div>
                <Spark series={[defSeries, supSeries]} colors={['#d7b067', '#6f88b2']} />
              </div>
            )}
          </Card>

          <Card logo="earn" title="Fountain" className="span-5">
            <Stat big accent l="fURM share price" v={num(share, 4)} s={`$URM per fURM · ${sgn((share - 1) * 100)} since launch`} />
            <div>
              <div className="lv-split"><span className="lv-l">Effective yield vs target</span><span className="lv-l">{bps(fo.effectiveRate)} / {bps(fo.config?.yieldRate, 0)}</span></div>
              <Meter value={n(fo.effectiveRate)} max={n(fo.config?.yieldRate)} color="#d7b067" />
            </div>
            <div className="lv-grid2">
              <Stat l="Withdrawable now" v={num(fo.windowRemaining)} s="$URM" />
              <Stat l="Fees" v={`${bps(fo.config?.depositFee, 0)} in`} s={`${bps(fo.config?.withdrawFee)} out`} />
              <Stat l="Staked" v={num(fo.totalAssets)} s="$URM" />
              <Stat l="Paid in per day" v={num(fo.interestPerDay, 2)} s="$URM" />
            </div>
          </Card>

          <Card logo="urm" title="CDP" className="span-4">
            <Stat big l="$URM borrowed" v={num(cdp?.urmDebt)} s={`${num(cdp?.positionCount)} open positions`} />
            <div className="lv-l lv-mt">Utilization · {bps(cdp?.utilization, 0)}</div>
            <Meter value={n(cdp?.urmDebt)} max={n(cdp?.borrowCapacity)} color="#d7b067" />
            <div className="lv-cols">
              <div className="lv-cols-head"><span>Collateral</span><span>Locked</span><span>Min ratio</span></div>
              {(cdp?.tokens || []).map((t: any) => (
                <div key={t.symbol} className="lv-col-row">
                  <span className="lv-col-name"><ProductLogo id={t.symbol === 'CIRCLE' ? 'circle' : t.symbol.toLowerCase()} size={22} />{t.symbol === 'CIRCLE' ? 'ULTRAROUND' : t.symbol}</span>
                  <span>{usd(t.collateralValue)}</span>
                  <span>{num(t.minCollateralRatio)}x</span>
                </div>
              ))}
            </div>
            <div className="lv-grid2">
              <Stat l="Borrow rate" v={bps(cdp?.currentInterestRate)} s="a year" />
              <Stat l="Paid to Fortress" v={num(cdp?.urmCdpPaidToFortress)} s="$URM" />
            </div>
          </Card>

          <Card logo="rage" title="RAGE" className="span-4">
            <div className="lv-row">
              <Stat big l="Price" v={isFinite(ragePrice) ? '$' + num(ragePrice, 2) : '—'} />
              <Stat big l="Fair value" v={isFinite(fmv) ? '$' + num(fmv, 2) : '—'} />
            </div>
            <span className={'lv-chip' + (prem < 0 ? ' neg' : '')}>{sgn(prem)} to fair value</span>
            {fmvSeries.length > 2 && (
              <div className="lv-chart sm">
                <div className="lv-legend"><span><i style={{ background: '#ff5a4d' }} />Price</span><span><i style={{ background: '#f3f0e7' }} />Fair value</span></div>
                <Spark series={[pxSeries, fmvSeries]} colors={['#ff5a4d', '#f3f0e7']} h={150} />
              </div>
            )}
            <div className="lv-grid2">
              <Stat l="Backing per share" v={num(rv.backingPerShare, 4)} />
              <Stat l="Treasury" v={usd(rv.activeAssetsUsdcValue)} />
            </div>
          </Card>

          <Card logo="eco" title="Burned forever" className="span-4">
            <div className="lv-burns">
              <div className="lv-burn">
                <Ring pct={n(hes?.supply?.burnedPercent)} color="#ff8a3c" logo="hestia" />
                <Stat l="HESTIA" v={isFinite(n(hes?.supply?.burnedPercent)) ? num(hes?.supply?.burnedPercent, 2) + '%' : '—'} s={`${num(hes?.supply?.burned)} of 1,000,000`} />
              </div>
              <div className="lv-burn">
                <Ring pct={n(cir?.supply?.burnedPercent)} color="#5d93f0" logo="circle" />
                <Stat l="ULTRAROUND" v={isFinite(n(cir?.supply?.burnedPercent)) ? num(cir?.supply?.burnedPercent, 2) + '%' : '—'} s={`${num(cir?.supply?.burned)} of 1,000,000`} />
              </div>
            </div>
            <div className="lv-grid2">
              <Stat l="HESTIA locked in RAGE" v={num(hes?.supply?.rage)} s={isFinite(n(hes?.supply?.ragePercent)) ? num(hes?.supply?.ragePercent, 2) + '% of supply' : undefined} />
              <Stat l="ULTRAROUND locked in RAGE" v={num(cir?.supply?.rage)} s={isFinite(n(cir?.supply?.ragePercent)) ? num(cir?.supply?.ragePercent, 2) + '% of supply' : undefined} />
            </div>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
