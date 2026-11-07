'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from './motion/useInView';
import CountUp from './motion/CountUp';

/**
 * HESTIA's burn, geometric: the supply ring draws itself to the burned share,
 * and pulses whenever the burned total goes up.
 */
const R = 120, C = 2 * Math.PI * R;
export default function HestiaRing({ burned, pct }: { burned: number; pct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const prev = useRef(burned);
  const [pulse, setPulse] = useState(0);
  useEffect(() => { if (burned > prev.current) setPulse((p) => p + 1); prev.current = burned; }, [burned]);
  const k = isFinite(pct) ? Math.min(1, Math.max(0, pct / 100)) : 0;
  const a = -Math.PI / 2 + 2 * Math.PI * k;
  return (
    <div ref={ref} className="hring card glass-rim" data-in={seen ? '1' : undefined}>
      <svg viewBox="0 0 320 320" width="100%" role="img" aria-label={`${pct.toFixed(2)}% of the 1,000,000 HESTIA supply burned`}>
        <circle cx="160" cy="160" r={R} fill="none" stroke="#3a0838" strokeWidth="34" />
        <circle className="hring-arc" cx="160" cy="160" r={R} fill="none" stroke="#ff7a2e" strokeWidth="34" strokeDasharray={`${C * k} ${C}`} transform="rotate(-90 160 160)" style={{ ['--c' as any]: C * k }} />
        <circle cx="160" cy="160" r={R + 17} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
        <circle cx="160" cy="160" r={R - 17} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
        <g key={pulse} className={'hring-tip' + (pulse ? ' flare' : '')} style={{ transformOrigin: `${160 + R * Math.cos(a)}px ${160 + R * Math.sin(a)}px` }}>
          <circle cx={160 + R * Math.cos(a)} cy={160 + R * Math.sin(a)} r="14" fill="#ffb627" />
          <circle cx={160 + R * Math.cos(a)} cy={160 + R * Math.sin(a)} r="6" fill="#fff" />
        </g>
        <image href="/assets/hestia.png" x="128" y="96" width="64" height="64" />
      </svg>
      <div className="hring-copy">
        <b className="acc"><CountUp text={pct.toFixed(2) + '%'} /></b>
        <span>{Math.round(burned).toLocaleString('en-US')} of 1,000,000 HESTIA burned forever</span>
      </div>
    </div>
  );
}
