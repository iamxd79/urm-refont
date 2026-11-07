'use client';
import { useEffect, useState } from 'react';

/**
 * RAGE, visualised: USDC splits into HESTIA and ULTRAROUND (real config split), both feed the treasury,
 * premiums drop in from above, and 6% of every claim loops back. Two layouts: wide and tall (phones).
 */
type P = { hestiaPct: number; treasury: string; backing: string; premium: number; claimFee: number };
type L = {
  w: number; h: number; usdc: [number, number]; split: [number, number]; hj: [number, number]; cj: [number, number]; vault: [number, number, number, number];
  pIn: string; pH: string; pC: string; pHV: string; pCV: string; prem: string; exit: string; loop: string;
  lab: Record<string, [number, number, 'start' | 'middle' | 'end']>; marks: [number, number][]; short?: boolean;
};
const WIDE: L = {
  w: 1000, h: 440, usdc: [90, 220], split: [250, 220], hj: [520, 110], cj: [520, 330], vault: [720, 100, 180, 240],
  pIn: 'M136 220 H250', pH: 'M250 220 C330 220 360 110 450 110', pC: 'M250 220 C330 220 360 330 450 330',
  pHV: 'M590 110 C660 110 670 180 720 180', pCV: 'M590 330 C660 330 670 260 720 260',
  prem: 'M810 18 V100', exit: 'M900 300 C940 300 950 330 990 330', loop: 'M960 322 C980 390 900 400 880 340',
  lab: { usdc: [90, 296, 'middle'], h: [520, 34, 'middle'], c: [520, 420, 'middle'], prem: [790, 74, 'end'], exit: [992, 316, 'end'], loop: [930, 420, 'middle'] },
  marks: [[250, 180], [840, 60], [612, 150], [968, 372]],
};
const TALL: L = {
  w: 420, h: 880, usdc: [210, 70], split: [210, 200], hj: [110, 330], cj: [310, 330], vault: [120, 520, 180, 220],
  pIn: 'M210 116 V200', pH: 'M210 200 C210 250 110 230 110 270', pC: 'M210 200 C210 250 310 230 310 270',
  pHV: 'M110 390 C110 460 170 470 170 520', pCV: 'M310 390 C310 460 250 470 250 520',
  prem: 'M340 430 C340 470 300 500 290 520', exit: 'M210 740 V800', loop: 'M210 800 C210 850 330 850 300 742',
  lab: { usdc: [210, 146, 'middle'], h: [110, 258, 'middle'], c: [310, 258, 'middle'], prem: [404, 420, 'end'], exit: [196, 826, 'end'], loop: [340, 864, 'middle'] },
  marks: [[246, 196], [372, 470], [58, 300], [252, 800]], short: true,
};

function Diagram({ L, p, motion, id }: { L: L; p: P; motion: boolean; id: string }) {
  const [vx, vy, vw, vh] = L.vault;
  const jar = (c: [number, number], logo: string, color: string, k: string) => (
    <g key={k}>
      <rect x={c[0] - 70} y={c[1] - 60} width="140" height="120" rx="26" fill="#3a0838" />
      <rect x={c[0] - 70} y={c[1] + 4} width="140" height="56" rx="0" fill={color} opacity=".9" clipPath={`url(#${id}-jar${k})`} />
      <clipPath id={`${id}-jar${k}`}><rect x={c[0] - 70} y={c[1] - 60} width="140" height="120" rx="26" /></clipPath>
      <image href={logo} x={c[0] - 30} y={c[1] - 46} width="60" height="60" />
      <rect x={c[0] - 70} y={c[1] - 60} width="140" height="120" rx="26" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="3" />
      <path d={`M${c[0] - 42} ${c[1] - 56} H${c[0] + 42}`} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".6" />
      {motion && <circle cx={c[0] + 44} cy={c[1] - 34} r="5" fill="#5fd39a" className="bf-spark" />}
    </g>
  );
  const coin = (path: string, fill: string, begin: number, dur = 2.4, r = 9) => (
    <circle r={r} fill={fill} stroke="#260326" strokeWidth="2">
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
    </circle>
  );
  const t = (k: string, s: string, cls = 'bf-t', extra?: React.ReactNode) => <text x={L.lab[k][0]} y={L.lab[k][1]} textAnchor={L.lab[k][2]} className={cls}>{s}{extra}</text>;
  return (
    <svg viewBox={`0 0 ${L.w} ${L.h}`} width="100%" role="img" aria-label={`USDC invested in RAGE splits ${p.hestiaPct}% into HESTIA and ${100 - p.hestiaPct}% into ULTRAROUND, both locked in the treasury (${p.treasury}). Premiums above fair value add to it, and ${p.claimFee}% of every claim stays. Backing per RAGE: ${p.backing}.`}>
      {/* rails */}
      {[L.pIn, L.pH, L.pC, L.pHV, L.pCV].map((d) => <path key={d} d={d} fill="none" stroke="#5a1a5a" strokeWidth="10" strokeLinecap="round" />)}
      <path d={L.prem} fill="none" stroke="#e8ba67" strokeWidth="4" strokeLinecap="round" />
      <path d={L.exit} fill="none" stroke="#7a2b6f" strokeWidth="6" strokeLinecap="round" />
      <path d={L.loop} fill="none" stroke="#ff3d3d" strokeWidth="4" strokeLinecap="round" />
      {/* USDC */}
      <circle cx={L.usdc[0]} cy={L.usdc[1]} r="46" fill="#2775ca" />
      <circle cx={L.usdc[0]} cy={L.usdc[1]} r="36" fill="none" stroke="#fff" strokeWidth="3" />
      <text x={L.usdc[0]} y={L.usdc[1] + 14} textAnchor="middle" className="bf-usd">$</text>
      {t('usdc', 'USDC in')}
      <circle cx={L.split[0]} cy={L.split[1]} r="12" fill="#e8ba67" />
      {jar(L.hj, '/assets/hestia.png', '#ff7a2e', 'h')}
      {jar(L.cj, '/assets/ultraround.png', '#5d93f0', 'c')}
      {t('h', L.short ? `${p.hestiaPct}% HESTIA` : `${p.hestiaPct}% buys HESTIA`, L.short ? 'bf-t sm' : 'bf-t')}
      {t('c', L.short ? `${100 - p.hestiaPct}% ULTRAROUND` : `${100 - p.hestiaPct}% buys ULTRAROUND`, L.short ? 'bf-t sm' : 'bf-t')}
      {/* treasury vault */}
      <rect x={vx} y={vy} width={vw} height={vh} rx="30" fill="#1a0219" />
      <rect x={vx} y={vy + vh * 0.42} width={vw} height={vh * 0.58} fill="#ff3d3d" clipPath={`url(#${id}-vault)`} className="bf-fill" />
      <clipPath id={`${id}-vault`}><rect x={vx} y={vy} width={vw} height={vh} rx="30" /></clipPath>
      <rect x={vx} y={vy} width={vw} height={vh} rx="30" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="3" />
      <path d={`M${vx + 30} ${vy + 4} H${vx + vw - 30}`} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".6" />
      <text x={vx + vw / 2} y={vy + 40} textAnchor="middle" className="bf-eye">TREASURY</text>
      <text x={vx + vw / 2} y={vy + 78} textAnchor="middle" className="bf-big">{p.treasury}</text>
      <text x={vx + vw / 2} y={vy + vh - 52} textAnchor="middle" className="bf-big2">{p.backing}</text>
      <text x={vx + vw / 2} y={vy + vh - 26} textAnchor="middle" className="bf-small">backing per RAGE</text>
      {t('prem', L.short ? '+premium' : p.premium > 0 ? `+${p.premium.toFixed(2)}% premium` : '+premium above fair value', 'bf-t gold')}
      {t('exit', 'claims')}
      {t('loop', `${p.claimFee}% stays`, 'bf-t red')}
      {/* numbered markers, matched by the captions below */}
      {L.marks.map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r="15" fill="#ff3d3d" /><text x={x} y={y + 6} textAnchor="middle" className="bf-n">{i + 1}</text></g>
      ))}
      {/* moving value */}
      {motion && (
        <g>
          {[0, 0.6, 1.2, 1.8].map((b) => <g key={'h' + b}>{coin(joinPaths(L.pIn, L.pH), '#ff7a2e', b)}</g>)}
          {coin(joinPaths(L.pIn, L.pC), '#5d93f0', 0.3)}
          {[0.2, 1.4].map((b) => <g key={'v' + b}>{coin(L.pHV, '#e8ba67', b, 1.8, 7)}</g>)}
          {coin(L.pCV, '#e8ba67', 0.9, 1.8, 7)}
          {p.premium > 0 && coin(L.prem, '#e8ba67', 0, 1.6, 6)}
          {coin(L.exit, '#e6cfe2', 0.5, 2, 6)}
          {coin(L.loop, '#ff3d3d', 1.5, 2, 5)}
        </g>
      )}
    </svg>
  );
}

/** Join two path strings into one continuous motion path (second starts where the first ends). */
function joinPaths(a: string, b: string) {
  return a + ' ' + b.replace(/^M\s*[\d.]+\s+[\d.]+\s*/, 'L' + b.match(/^M\s*([\d.]+\s+[\d.]+)/)![1] + ' ');
}

export default function BackingFlow(p: P) {
  const [motion, setMotion] = useState(false);
  useEffect(() => { setMotion(!window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  return (
    <div className="bf">
      <div className="bf-wide"><Diagram L={WIDE} p={p} motion={motion} id="bfw" /></div>
      <div className="bf-tall"><Diagram L={TALL} p={p} motion={motion} id="bft" /></div>
    </div>
  );
}
