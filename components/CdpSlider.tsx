'use client';
import { useState } from 'react';

/**
 * CDP, visualised: pick a collateral and a value, see the lock vs the URM it can mint.
 * Mint range = value / max ratio … value / min ratio. Leverage shows the minted URM buying more collateral.
 * An estimate: the app shows the exact amount before you sign.
 */
type Col = { symbol: string; price: number; min: number; max: number };
const STOPS = [100, 250, 500, 1000, 2500, 5000, 10000];
const f = (v: number, d = 0) => (isFinite(v) ? v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) : '—');

export default function CdpSlider({ cols }: { cols: Col[] }) {
  const [sym, setSym] = useState(cols[0]?.symbol || 'RAGE');
  const [i, setI] = useState(3);
  const [lev, setLev] = useState(false);
  const c = cols.find((x) => x.symbol === sym) || cols[0];
  if (!c) return null;
  const value = STOPS[i];
  const lo = value / Math.max(c.max, 1), hi = value / Math.max(c.min, 1);
  const extra = lev ? hi : 0; // minted $URM buys more collateral (best case, before fees)
  const tall = value + extra; // biggest column, sets the scale
  const sc = (v: number) => Math.max(0.02, v / tall);
  return (
    <div className="cdps card glass-rim">
      <div className="cdps-ctrl">
        <div className="seg" role="group" aria-label="Collateral">
          {cols.map((x) => <button key={x.symbol} type="button" aria-pressed={x.symbol === sym} onClick={() => setSym(x.symbol)}>{x.symbol}</button>)}
        </div>
        <label className="cdps-range">
          <span>You lock <b>${f(value)}</b> of {sym} <small className="muted">≈ {f(value / (c.price || 1), 2)} {sym}</small></span>
          <input type="range" min={0} max={STOPS.length - 1} step={1} value={i} onChange={(e) => setI(+e.target.value)} aria-valuetext={`$${f(value)}`} style={{ ['--p' as any]: `${(i / (STOPS.length - 1)) * 100}%` }} />
        </label>
        <div className="seg" role="group" aria-label="Mode">
          <button type="button" aria-pressed={!lev} onClick={() => setLev(false)}>Borrow</button>
          <button type="button" aria-pressed={lev} onClick={() => setLev(true)}>Leverage</button>
        </div>
      </div>

      <div className="cdps-stage" aria-live="polite">
        <div className="cdps-col">
          <div className="cdps-bar">
            <i className="cdps-blk lock" style={{ transform: `scaleY(${sc(value)})` }} />
            <i className="cdps-blk more" style={{ transform: `translateY(${-sc(value) * 100}%) scaleY(${lev ? sc(extra) : 0})` }} />
          </div>
          <b>${f(tall)}</b><span>{lev ? `${sym} exposure` : `${sym} locked`}</span>
        </div>
        <div className="cdps-mid" aria-hidden="true">
          <span className="cdps-rail"><i /><i /><i /></span>
          <span>{c.min}x to {c.max}x</span>
          {lev && <svg className="cdps-loop" viewBox="0 0 120 60" width="120"><path d="M104 14 C104 54 16 54 16 22" stroke="#e8ba67" strokeWidth="4" strokeLinecap="round" fill="none" /><path d="M8 30 L16 18 L24 30" stroke="#e8ba67" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>}
        </div>
        <div className="cdps-col">
          <div className="cdps-bar">
            <i className="cdps-blk range" style={{ transform: `scaleY(${sc(hi)})` }} />
            <i className="cdps-blk urm" style={{ transform: `scaleY(${sc(lo)})` }} />
          </div>
          <b>{f(lo)} to {f(hi)}</b><span>$URM you can mint</span>
          <span className="cdps-key"><span><i className="k1" />at {c.max}x</span><span><i className="k2" />up to, at {c.min}x</span></span>
        </div>
      </div>
      <p className="muted cdps-note">{lev ? `Leverage: the minted $URM buys more ${sym} in the same transaction, up to about $${f(extra)} more exposure before fees. Bigger upside, bigger downside.` : `Borrow: keep your ${sym}, take $URM to use now. Repay to unlock.`} Estimate only. The app shows the exact amount before you sign.</p>
    </div>
  );
}
