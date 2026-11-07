'use client';
import { useRef } from 'react';
import { useInView, useReducedMotion, useMedia } from './motion/useInView';

/**
 * Mine / Temple, visualised. Markers 1–6 match the cards below:
 * 1 deposit (locked) hires the crew · 2 compound grows it · 3 sell exits, capped
 * 4 Peapods yield and 5 the multisig drip fill the contract · 6 referrals bring new players.
 */
type P = { theme: 'hestia' | 'circle'; token: string; crew: string; balance: string; sellLimit: string };
type Pt = [number, number];
type L = {
  w: number; h: number; player: Pt; crew: [number, number, number, number]; tank: [number, number, number, number]; pod: Pt; drip: Pt; fresh: Pt;
  dep: string; share: string; rew: string; comp: string; sell: string; podIn: string; dripIn: string; ref: string;
  m: Pt[]; lab: [number, number, string, ('start' | 'middle' | 'end')?][]; big?: boolean;
};

const WIDE: L = {
  w: 1080, h: 470, player: [170, 250], crew: [360, 190, 220, 120], tank: [740, 110, 200, 260], pod: [840, 44], drip: [1030, 240], fresh: [470, 52],
  dep: 'M216 250 H360', share: 'M580 250 H740', rew: 'M760 370 C 640 460, 300 460, 196 292', comp: 'M150 206 C 160 120, 320 120, 380 190', sell: 'M124 250 H34',
  podIn: 'M840 76 V110', dripIn: 'M998 240 H940', ref: 'M470 80 V190',
  m: [[288, 222], [236, 132], [80, 222], [882, 92], [972, 210], [506, 136]],
  lab: [[170, 330, 'You'], [470, 342, '@crew'], [840, 400, 'Contract balance'], [796, 52, 'Peapods yield', 'end'], [1030, 300, 'Multisig'], [56, 288, 'Sell', 'middle'], [470, 446, 'Rewards, every second']],
};
const TALL: L = {
  w: 440, h: 1000, player: [220, 780], crew: [110, 480, 220, 120], tank: [120, 150, 200, 240], pod: [80, 66], drip: [360, 70], fresh: [44, 430],
  dep: 'M220 734 V600', share: 'M220 390 V480', rew: 'M320 340 C 430 420, 430 700, 266 770', comp: 'M176 800 C 60 800, 50 640, 110 586', sell: 'M220 826 V930',
  podIn: 'M100 92 L156 150', dripIn: 'M340 100 L284 150', ref: 'M58 456 L110 500',
  m: [[252, 668], [62, 704], [252, 884], [40, 120], [400, 120], [20, 480]],
  lab: [[220, 975, 'Sell'], [220, 0, ''], [220, 425, 'Contract balance'], [80, 30, 'Peapods'], [360, 30, 'Multisig'], [300, 862, 'You', 'start'], [392, 668, 'Rewards', 'end']],
  big: true,
};

function Figure({ x, y, c, templar, cls }: { x: number; y: number; c: string; templar: boolean; cls?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}><g className={cls}>
      {templar
        ? <><path d="M-13 18 L0 -14 L13 18 Z" fill={c} /><circle cy="-6" r="7" fill="#0f1c33" /></>
        : <><rect x="-12" y="0" width="24" height="18" rx="8" fill={c} /><circle cy="-6" r="9" fill="#ffd9b8" /><path d="M-10 -8 a10 10 0 0 1 20 0 Z" fill={c} /><circle cy="-13" r="2.6" fill="#fff" /></>}
    </g></g>
  );
}

function Art({ L, p, motion, id }: { L: L; p: P; motion: boolean; id: string }) {
  const acc = p.theme === 'hestia' ? '#ff7a2e' : '#5d93f0';
  const deep = p.theme === 'hestia' ? '#3a0838' : '#0f1c33';
  const rail = p.theme === 'hestia' ? '#5a1a52' : '#1d2f55';
  const logo = p.theme === 'hestia' ? '/assets/hestia.png' : '/assets/ultraround.png';
  const templar = p.theme === 'circle';
  const [cx, cy, cw, ch] = L.crew, [tx, ty, tw, th] = L.tank;
  const tc: Pt = [tx + tw / 2, ty + th / 2];
  const coin = (path: string, fill: string, begin: number, dur: number, r = 9) => (
    <circle r={r} fill={fill} stroke={deep} strokeWidth="2"><animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} /></circle>
  );
  const arrowEnd = (d: string, color: string) => <path d={d} stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
  const slots = Array.from({ length: 8 }, (_, i) => [cx + 30 + (i % 4) * 53, cy + 38 + Math.floor(i / 4) * 50] as Pt);
  const fs = L.big ? 'ml-t big' : 'ml-t';
  return (
    <svg viewBox={`0 0 ${L.w} ${L.h}`} width="100%" aria-hidden="true">
      {/* rails */}
      {[L.dep, L.share, L.podIn, L.dripIn, L.ref].map((d) => <path key={d} d={d} stroke={rail} strokeWidth="12" strokeLinecap="round" fill="none" />)}
      <path d={L.rew} stroke={acc} strokeWidth="5" strokeLinecap="round" fill="none" opacity=".55" />
      <path d={L.comp} stroke="#e8ba67" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d={L.sell} stroke="#e6cfe2" strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* contract balance tank */}
      <clipPath id={`${id}-t`}><rect x={tx} y={ty} width={tw} height={th} rx="30" /></clipPath>
      <rect x={tx} y={ty} width={tw} height={th} rx="30" fill="#0b0b12" />
      <g clipPath={`url(#${id}-t)`} className="ml-liquid">
        <rect x={tx} y={ty + th * 0.38 + 8} width={tw} height={th} fill={acc} opacity=".85" />
        <path className="he-wave" d={`M${tx - 200} ${ty + th * 0.38 + 10} q25 -12 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V${ty + th} H${tx - 200} Z`} fill={acc} />
      </g>
      <image href={logo} x={tc[0] - 34} y={ty + 24} width="68" height="68" />
      <text x={tc[0]} y={ty + th - 70} textAnchor="middle" className="ml-num">{p.balance}</text>
      <text x={tc[0]} y={ty + th - 40} textAnchor="middle" className="ml-sub">{p.token}</text>
      <rect x={tx} y={ty} width={tw} height={th} rx="30" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="3" />
      <path d={`M${tx + 30} ${ty + 4} H${tx + tw - 30}`} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".6" />

      {/* crew */}
      <rect x={cx} y={cy} width={cw} height={ch} rx="24" fill={deep} stroke="rgba(255,255,255,.25)" strokeWidth="2" />
      {slots.map(([x, y], i) => <Figure key={i} x={x} y={y} c={acc} templar={templar} cls={i >= 5 ? `ml-join j${i - 4}` : undefined} />)}

      {/* you */}
      <circle cx={L.player[0]} cy={L.player[1]} r="44" fill={deep} stroke={acc} strokeWidth="4" />
      <circle cx={L.player[0]} cy={L.player[1] - 10} r="12" fill="#f3f0e7" />
      <path d={`M${L.player[0] - 20} ${L.player[1] + 24} a20 18 0 0 1 40 0 Z`} fill="#f3f0e7" />

      {/* newcomer via referral */}
      <circle cx={L.fresh[0]} cy={L.fresh[1]} r="26" fill={deep} stroke="#5fd39a" strokeWidth="3" className="ml-fresh" />
      <circle cx={L.fresh[0]} cy={L.fresh[1] - 6} r="7" fill="#5fd39a" />
      <path d={`M${L.fresh[0] - 12} ${L.fresh[1] + 13} a12 11 0 0 1 24 0 Z`} fill="#5fd39a" />

      {/* Peapods pod */}
      <g transform={`translate(${L.pod[0]} ${L.pod[1]})`}>
        <ellipse rx="34" ry="20" fill="#2e7d50" /><circle cx="-14" r="7" fill="#7fe0a8" className="ml-pea" /><circle r="7" fill="#7fe0a8" className="ml-pea p2" /><circle cx="14" r="7" fill="#7fe0a8" className="ml-pea p3" />
      </g>
      {/* multisig vault */}
      <g transform={`translate(${L.drip[0]} ${L.drip[1]})`}>
        <rect x="-28" y="-28" width="56" height="56" rx="14" fill="#d7b067" /><circle r="12" fill="none" stroke="#3a2a0c" strokeWidth="4" /><path d="M0 -12 V-4 M0 4 V12 M-12 0 H-4 M4 0 H12" stroke="#3a2a0c" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* arrowheads */}
      {L.big ? <>
        {arrowEnd('M208 614 L220 600 L232 614', '#e8ba67')}{arrowEnd('M208 916 L220 930 L232 916', '#e6cfe2')}
      </> : <>
        {arrowEnd('M346 238 L360 250 L346 262', '#e8ba67')}{arrowEnd('M48 238 L34 250 L48 262', '#e6cfe2')}
      </>}

      {motion && (
        <g>
          {coin(L.dep, '#f3f0e7', 0, 2.2, 8)}
          {[0, 1.6].map((b) => <g key={b}>{coin(L.rew, acc, b, 3.2, 8)}</g>)}
          {coin(L.comp, '#e8ba67', 0.4, 2.4, 8)}
          {coin(L.sell, '#e6cfe2', 1.2, 2.4, 7)}
          {coin(L.podIn, '#7fe0a8', 0.2, 1.4, 7)}
          {coin(L.dripIn, '#d7b067', 0, 1.8, 7)}
          {coin(L.ref, '#5fd39a', 1, 2.6, 7)}
        </g>
      )}

      {L.lab.filter((l) => l[2]).map(([x, y, s, a]) => <text key={s} x={x} y={y} textAnchor={a || 'middle'} className={fs}>{s === '@crew' ? p.crew[0].toUpperCase() + p.crew.slice(1) : s}</text>)}
      {L.m.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="17" fill={acc} /><text x={x} y={y + 7} textAnchor="middle" className="ml-n">{i + 1}</text></g>)}
    </svg>
  );
}

export default function MineLoop(p: P) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const reduced = useReducedMotion();
  const motion = seen && !reduced;
  const wide = useMedia('(min-width: 701px)');
  return (
    <div ref={ref} className="ml card glass-rim" data-in={seen ? '1' : undefined} role="img"
      aria-label={`You deposit ${p.token} to hire ${p.crew}; the deposit stays locked. Your ${p.crew} earn a share of the contract balance (${p.balance} ${p.token}) every second. Compound rewards into more ${p.crew}, or sell them up to the sell limit of ${p.sellLimit} ${p.token}. Peapods yield and a multisig drip refill the balance, and referrals bring new players.`}>
      {wide !== false && <div className="ml-wide"><Art L={WIDE} p={p} motion={motion && wide === true} id="mlw" /></div>}
      {wide !== true && <div className="ml-tall"><Art L={TALL} p={p} motion={motion && wide === false} id="mlt" /></div>}
    </div>
  );
}
