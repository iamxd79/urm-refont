'use client';
import { useEffect, useState } from 'react';

/**
 * URM peg, visualised: the Fortress (URM ring) at the centre, 9 tower slots around it (live ones lit),
 * a keeper orbiting and pulsing on each check, and a price gauge with the live needle.
 */
type P = { price: number; towers: number; slots?: number; usdcRoom: string; urmRoom: string; defense: string; lastStep: string };

const C = 300, CY = 230, R = 172;
const lo = 0.98, hi = 1.02, gx0 = 90, gx1 = 510, gy = 488;
const gx = (v: number) => gx0 + ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * (gx1 - gx0);

export default function PegFortress({ price, towers, slots = 9, usdcRoom, urmRoom, defense, lastStep }: P) {
  const [motion, setMotion] = useState(false);
  useEffect(() => { setMotion(!window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  const known = Number.isFinite(price);
  const onPeg = known && Math.abs(price - 1) <= 0.01;
  const nx = known ? gx(price) : gx(1);
  return (
    <div className="pf">
      <svg viewBox="0 0 600 560" width="100%" role="img" aria-label={`URM peg defense. Price ${known ? '$' + price.toFixed(3) : 'loading'}, ${onPeg ? 'inside' : 'outside'} the 1% band. ${towers} of ${slots} towers live. Total defense ${defense}.`}>
        {/* orbit + keeper */}
        <circle cx={C} cy={CY} r="128" fill="none" stroke="#23385c" strokeWidth="2" />
        <g className={motion ? 'pf-orbit' : undefined} style={{ transformOrigin: `${C}px ${CY}px` }}>
          <circle cx={C} cy={CY - 128} r="11" fill="#5fd39a" stroke="#0d1b33" strokeWidth="3" />
        </g>
        {motion && <circle cx={C} cy={CY} r="96" fill="none" stroke="#5fd39a" strokeWidth="3" className="pf-ping" style={{ transformOrigin: `${C}px ${CY}px` }} />}
        {/* towers */}
        {Array.from({ length: slots }).map((_, i) => {
          const a = (-90 + i * (360 / slots)) * (Math.PI / 180);
          const x = C + R * Math.cos(a), y = CY + R * Math.sin(a);
          const on = i < towers;
          return (
            <g key={i} transform={`translate(${x - 18} ${y - 24})`}>
              <rect x="0" y="8" width="36" height="40" rx="7" fill={on ? '#d7b067' : '#0d1b33'} stroke={on ? 'rgba(255,255,255,.5)' : '#2c4470'} strokeWidth="2" />
              <rect x="0" y="0" width="10" height="12" rx="3" fill={on ? '#d7b067' : '#2c4470'} /><rect x="13" y="0" width="10" height="12" rx="3" fill={on ? '#d7b067' : '#2c4470'} /><rect x="26" y="0" width="10" height="12" rx="3" fill={on ? '#d7b067' : '#2c4470'} />
              {on && <path d="M6 12 H30" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".7" />}
            </g>
          );
        })}
        {/* the Fortress: URM ring */}
        <circle cx={C} cy={CY} r="96" fill="#0d1b33" stroke="rgba(255,255,255,.3)" strokeWidth="3" />
        <path d={`M${C - 54} ${CY - 78} A96 96 0 0 1 ${C + 54} ${CY - 78}`} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".55" />
        <circle cx={C} cy={CY} r="70" fill="none" stroke="#b0bfd6" strokeWidth="12" />
        <circle cx={C} cy={CY} r="42" fill="none" stroke="#b0bfd6" strokeWidth="12.6" />
        <circle cx={C} cy={CY} r="25" fill="#f1ebdd" />
        {/* gauge */}
        <rect x={gx0} y={gy - 8} width={gx1 - gx0} height="16" rx="8" fill="#172a4a" />
        <rect x={gx(0.99)} y={gy - 8} width={gx(1.01) - gx(0.99)} height="16" rx="8" fill="#2e7d50" />
        {[0.98, 0.99, 1, 1.01, 1.02].map((v) => (
          <g key={v}>
            <rect x={gx(v) - 1.5} y={gy + 12} width="3" height="10" fill="#4c6892" />
            <text x={gx(v)} y={gy + 44} textAnchor="middle" className="pf-s">${v.toFixed(2)}</text>
          </g>
        ))}
        <g className="pf-needle" style={{ transform: `translateX(${nx}px)` }}>
          <path d={`M0 ${gy - 14} l-12 -20 h24 Z`} fill={!known ? '#4c6892' : onPeg ? '#f3f0e7' : '#ff6b6b'} />
          <text x="0" y={gy - 44} textAnchor="middle" className="pf-b">{known ? `$${price.toFixed(3)}` : 'checking…'}</text>
        </g>
      </svg>
      <div className="pf-copy">
        <div className="pf-item"><span className="pf-dot" style={{ background: '#5fd39a' }} /><div><b>Keeper on patrol</b><p>Reads the price every 1.5 to 2 hours. Last time it had to step in: {lastStep}.</p></div></div>
        <div className="pf-item"><span className="pf-dot" style={{ background: '#2e7d50' }} /><div><b>Below the peg, it buys</b><p>The Fortress spends USDC to buy URM back. Room right now: <strong>{usdcRoom}</strong>.</p></div></div>
        <div className="pf-item"><span className="pf-dot" style={{ background: '#ff6b6b' }} /><div><b>Above the peg, it sells</b><p>The Fortress sells URM into demand. Room right now: <strong>{urmRoom}</strong>.</p></div></div>
        <div className="pf-item"><span className="pf-dot" style={{ background: '#d7b067' }} /><div><b>{towers} of {slots} towers live</b><p>Each tower extends the backing and shares the yield. Total defense: <strong>{defense}</strong>.</p></div></div>
      </div>
    </div>
  );
}
