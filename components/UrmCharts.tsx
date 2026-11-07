'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from './motion/useInView';

/**
 * $URM history, from the Fortress's daily snapshots (/urm/fortress → charts).
 * Row: [USDC, CDP, RAGE, HESTIA+ULTRAROUND, total defense, backed supply, Fortress yield, CDP borrowed, CDP capacity, unix time]
 */
type Row = (string | number | null)[];
type S = { label: string; color: string; i: number };
const PL = 48, PR = 12, PT = 14, PB = 28;
const fmt = (v: number) => (Math.abs(v) >= 1000 ? (v / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 }) + 'k' : v.toLocaleString('en-US', { maximumFractionDigits: 0 }));
const full = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 0 });
const day = (t: number) => new Date(t * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

function Chart({ rows, series, stacked, title, note, unit }: { rows: Row[]; series: S[]; stacked?: boolean; title: string; note: string; unit: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const [hi, setHi] = useState<number | null>(null);
  // draw at the real pixel width so axis text stays 12px on every screen
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(640);
  useEffect(() => { const el = box.current; if (!el) return; const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.round(e.contentRect.width)))); ro.observe(el); return () => ro.disconnect(); }, []);
  const H = W < 420 ? 200 : 240;
  // skip days with no reading for this chart (and the all-zero day before the CDP opened)
  const data = useMemo(() => rows.filter((r) => series.some((s) => r[s.i] !== null) && series.some((s) => Number(r[s.i]) > 0)), [rows, series]);
  const n = data.length;
  const t0 = Number(data[0]?.[9]), t1 = Number(data[n - 1]?.[9]);
  const x = (t: number) => PL + ((t - t0) / Math.max(1, t1 - t0)) * (W - PL - PR);
  const val = (r: Row, k: number) => {
    if (!stacked) return Number(r[series[k].i] ?? NaN);
    let s = 0; for (let j = 0; j <= k; j++) s += Number(r[series[j].i] ?? 0); return s;
  };
  const raw = Math.max(1, ...data.map((r) => Math.max(...series.map((_, k) => val(r, k)).filter(isFinite))));
  // round the top of the scale to a clean number, split in two even steps
  const mag = Math.pow(10, Math.floor(Math.log10(raw / 2))); const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((st) => st * 2 >= raw * 1.04) || mag * 10;
  const max = step * 2;
  const y = (v: number) => PT + (1 - v / max) * (H - PT - PB);
  const line = (k: number) => data.filter((r) => isFinite(val(r, k))).map((r, j) => `${j ? 'L' : 'M'}${x(Number(r[9])).toFixed(1)} ${y(val(r, k)).toFixed(1)}`).join(' ');
  const area = (k: number) => {
    const top = data.map((r) => `${x(Number(r[9])).toFixed(1)} ${y(val(r, k)).toFixed(1)}`);
    const bot = data.map((r) => `${x(Number(r[9])).toFixed(1)} ${y(k ? val(r, k - 1) : 0).toFixed(1)}`).reverse();
    return `M${top.join(' L')} L${bot.join(' L')} Z`;
  };
  const ticks = [0, step, max];
  const pick = (e: React.PointerEvent<SVGSVGElement>) => {
    const b = e.currentTarget.getBoundingClientRect(); const px = ((e.clientX - b.left) / b.width) * W;
    let best = 0, d = Infinity; data.forEach((r, j) => { const dd = Math.abs(x(Number(r[9])) - px); if (dd < d) { d = dd; best = j; } }); setHi(best);
  };
  const cur = hi !== null ? data[hi] : data[n - 1];
  if (n < 2) return null;
  return (
    <figure ref={ref} className="uc card glass-rim" data-in={seen ? '1' : undefined}>
      <figcaption><b>{title}</b><span>{note}</span></figcaption>
      <div className="uc-read">
        <span className="uc-date">{hi !== null ? day(Number(cur[9])) : 'Latest'}</span>
        {series.map((s) => <span key={s.label} className="uc-val"><i style={{ background: s.color }} />{s.label}<b>{cur[s.i] === null ? '—' : full(Number(cur[s.i]))}{unit}</b></span>)}
      </div>
      <div ref={box}><svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`${title}. ${series.map((s) => `${s.label} now ${full(Number(data[n - 1][s.i] ?? 0))}${unit}`).join(', ')}. From ${day(t0)} to ${day(t1)}.`}
        onPointerMove={pick} onPointerLeave={() => setHi(null)}>
        {ticks.map((v) => <g key={v}><line x1={PL} x2={W - PR} y1={y(v)} y2={y(v)} className="uc-grid" /><text x={PL - 8} y={y(v) + 4} textAnchor="end" className="uc-ax">{fmt(v)}</text></g>)}
        {(W < 420 ? [0, n - 1] : [0, Math.floor((n - 1) / 2), n - 1]).map((j) => <text key={j} x={x(Number(data[j][9]))} y={H - 8} textAnchor={j === 0 ? 'start' : j === n - 1 ? 'end' : 'middle'} className="uc-ax">{day(Number(data[j][9]))}</text>)}
        <g className="uc-plot">
          {stacked
            ? series.map((s, k) => <path key={s.label} d={area(k)} fill={s.color} />).reverse()
            : series.map((s, k) => <path key={s.label} d={line(k)} fill="none" stroke={s.color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" pathLength={1} className="uc-line" />)}
        </g>
        {hi !== null && <g>
          <line x1={x(Number(cur[9]))} x2={x(Number(cur[9]))} y1={PT} y2={H - PB} className="uc-cross" />
          {series.map((s, k) => isFinite(val(cur, k)) && <circle key={s.label} cx={x(Number(cur[9]))} cy={y(val(cur, k))} r="5" fill={s.color} stroke="#0d1b33" strokeWidth="2" />)}
        </g>}
      </svg></div>
    </figure>
  );
}

export default function UrmCharts({ rows }: { rows: Row[] }) {
  if (!Array.isArray(rows) || rows.length < 2) return <p className="muted">Charts are loading from the Fortress. Check back in a minute.</p>;
  return (
    <div className="uc-grid2">
      <Chart rows={rows} title="Total defense vs backed supply" note="What the Fortress can draw on, against the $URM it stands behind. The gap is the defense surplus." unit=""
        series={[{ label: 'Total defense', color: '#d7b067', i: 4 }, { label: 'Backed supply', color: '#b0bfd6', i: 5 }]} />
      <Chart rows={rows} stacked title="Defense, by what carries it" note="The same defense split into its four bands." unit=""
        series={[{ label: 'USDC', color: '#5fd39a', i: 0 }, { label: 'CDP', color: '#d7b067', i: 1 }, { label: 'RAGE', color: '#ff3d3d', i: 2 }, { label: 'HESTIA + ULTRAROUND', color: '#ff7a2e', i: 3 }]} />
      <Chart rows={rows} title="Fortress yield" note="Cumulative $URM kept by the Fortress as real yield, from pool fees and tower payments." unit=" $URM"
        series={[{ label: 'Yield kept', color: '#5fd39a', i: 6 }]} />
      <Chart rows={rows} title="CDP borrowed vs capacity" note="$URM minted against collateral, against the most the CDP can lend. Starts when the CDP opened." unit=" $URM"
        series={[{ label: 'Borrowed', color: '#d7b067', i: 7 }, { label: 'Capacity', color: '#b0bfd6', i: 8 }]} />
    </div>
  );
}
