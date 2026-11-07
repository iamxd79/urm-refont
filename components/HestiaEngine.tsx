'use client';
import { useRef } from 'react';
import Countdown from './Countdown';
import { useInView, useReducedMotion, useMedia } from './motion/useInView';

/**
 * HESTIA's Chaos Engine, visualised: pool fees fill the USDC reserve (Smoke Fees),
 * the reserve buys HESTIA and burns it (Hestia's rage). Live fill, live timers.
 */
type P = { usdc: number; cap: number; nextSmoke?: string; nextRage?: string; interval?: string; burnedPct: number };
type L = { w: number; h: number; pool: [number, number]; tank: [number, number, number, number]; fire: [number, number]; p1: string; p2: string; m: [number, number][]; lab: [number, number, string, string?][] };

const WIDE: L = { w: 1000, h: 330, pool: [130, 165], tank: [410, 50, 180, 230], fire: [850, 165], p1: 'M210 165 H410', p2: 'M590 165 H770', m: [[310, 120], [500, 30], [680, 120]], lab: [[130, 290, 'Pool fees'], [500, 316, 'USDC reserve'], [850, 290, 'Buy + burn']] };
const TALL: L = { w: 420, h: 820, pool: [210, 90], tank: [120, 260, 180, 230], fire: [210, 680], p1: 'M210 168 V260', p2: 'M210 490 V600', m: [[262, 214], [330, 290], [262, 546]], lab: [[194, 222, 'Pool fees', 'end'], [210, 312, 'Reserve'], [194, 556, 'Buy + burn', 'end']] };

function Art({ L, k, id, motion }: { L: L; k: number; id: string; motion: boolean }) {
  const [tx, ty, tw, th] = L.tank;
  const level = Math.max(ty + 22, ty + th - th * k);
  return (
    <svg viewBox={`0 0 ${L.w} ${L.h}`} width="100%" aria-hidden="true">
      <path d={L.p1} stroke="#5a1a52" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d={L.p2} stroke="#5a1a52" strokeWidth="14" strokeLinecap="round" fill="none" />
      {/* pool: two overlapping tokens */}
      <g>
        <circle cx={L.pool[0] - 36} cy={L.pool[1]} r="50" fill="#2775ca" />
        <text x={L.pool[0] - 52} y={L.pool[1] + 15} textAnchor="middle" className="he-usd">$</text>
        <circle cx={L.pool[0] + 34} cy={L.pool[1]} r="50" fill="#3a0838" stroke="#ff7a2e" strokeWidth="4" />
        <image href="/assets/hestia.png" x={L.pool[0] + 8} y={L.pool[1] - 26} width="52" height="52" />
      </g>
      {/* reserve tank */}
      <clipPath id={`${id}-t`}><rect x={tx} y={ty} width={tw} height={th} rx="30" /></clipPath>
      <rect x={tx} y={ty} width={tw} height={th} rx="30" fill="#1a0219" />
      <g clipPath={`url(#${id}-t)`}>
        <g className="he-liquid" style={{ transformOrigin: `0 ${ty + th}px` }}>
          <rect x={tx} y={level + 8} width={tw} height={th} fill="#2775ca" />
          <path className="he-wave" d={`M${tx - 200} ${level + 10} q25 -12 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V${ty + th} H${tx - 200} Z`} fill="#3d8be0" />
        </g>
      </g>
      <rect x={tx} y={ty} width={tw} height={th} rx="30" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="3" />
      <path d={`M${tx + 30} ${ty + 4} H${tx + tw - 30}`} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".6" />
      <text x={tx + tw / 2} y={ty + th / 2 + 12} textAnchor="middle" className="he-pct">{Math.round(k * 100)}%</text>
      {/* the fire */}
      <g transform={`translate(${L.fire[0] - 60} ${L.fire[1] - 82})`}>
        <ellipse cx="60" cy="148" rx="44" ry="8" fill="#ff7a2e" opacity=".35" />
        <g className="he-flame">
          <path d="M60 6 C76 34 104 52 100 92 C97 124 80 142 60 142 C40 142 22 126 20 96 C18 70 34 58 40 40 C46 56 52 60 56 62 C54 40 52 24 60 6 Z" fill="#ff3d3d" />
          <path className="he-f2" d="M62 40 C74 60 88 74 86 100 C84 122 74 134 60 134 C46 134 36 124 35 104 C34 86 44 78 48 64 C52 74 56 78 60 80 C58 66 56 54 62 40 Z" fill="#ff7a2e" />
          <path className="he-f3" d="M60 78 C68 92 76 100 74 114 C73 126 67 132 60 132 C53 132 47 126 46 116 C45 106 50 100 54 92 C56 98 58 100 60 102 C59 94 58 86 60 78 Z" fill="#ffb627" />
        </g>
      </g>
      {/* flow */}
      {motion && <g className="he-flow">
        {[0, 1.05].map((b) => <circle key={'a' + b} r="8" fill="#5fa8ff"><animateMotion dur="2.1s" begin={`${b}s`} repeatCount="indefinite" path={L.p1} /></circle>)}
        {[0.3, 1.3].map((b) => <circle key={'b' + b} r="8" fill="#ffb627"><animateMotion dur="2s" begin={`${b}s`} repeatCount="indefinite" path={L.p2} /></circle>)}
      </g>}
      {L.lab.map(([x, y, s, a]) => <text key={s} x={x} y={y} textAnchor={(a as any) || 'middle'} className="he-t">{s}</text>)}
      {L.m.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="17" fill="#ff7a2e" /><text x={x} y={y + 7} textAnchor="middle" className="he-n">{i + 1}</text></g>)}
    </svg>
  );
}

export default function HestiaEngine({ usdc, cap, nextSmoke, nextRage, interval, burnedPct }: P) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const motion = !useReducedMotion() && seen;
  const wide = useMedia('(min-width: 701px)');
  const k = cap > 0 && isFinite(usdc) ? Math.min(1, Math.max(0, usdc / cap)) : 0;
  const money = (v: number) => '$' + (isFinite(v) ? v.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—');
  return (
    <div ref={ref} className="he card glass-rim" data-in={seen ? '1' : undefined}>
      <div role="img" aria-label={`Pool fees fill a USDC reserve, now ${money(usdc)} of ${money(cap)}. The reserve buys HESTIA and burns it. ${burnedPct.toFixed(2)}% of supply burned so far.`}>
        {wide !== false && <div className="he-wide"><Art L={WIDE} k={k} id="hew" motion={motion && wide === true} /></div>}
        {wide !== true && <div className="he-tall"><Art L={TALL} k={k} id="het" motion={motion && wide === false} /></div>}
      </div>
      <ol className="he-chips">
        <li><i>1</i><span>Smoke Fees{interval ? `, every ${interval}` : ''}</span><b><Countdown to={nextSmoke} /></b></li>
        <li><i>2</i><span>USDC reserve</span><b>{money(usdc)} <small>of {money(cap)}</small></b></li>
        <li><i>3</i><span>Next Hestia&apos;s rage</span><b><Countdown to={nextRage} /></b></li>
      </ol>
    </div>
  );
}
