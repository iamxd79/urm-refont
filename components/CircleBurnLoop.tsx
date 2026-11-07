'use client';
import { useRef } from 'react';
import { useInView, useReducedMotion } from './motion/useInView';

/**
 * ULTRAROUND's Chaos Engine, visualised: WETH and ULTRAROUND orbit through the engine (Cause Chaos),
 * and every turn throws embers into the burned slice of the supply ring, which draws to the live %.
 */
type P = { burnedPct: number; burned: string; weth: string; perDay: string; last: string };
const R = 120, CIRC = 2 * Math.PI * R;

export default function CircleBurnLoop({ burnedPct, burned, weth, perDay, last }: P) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const motion = !useReducedMotion() && seen;
  const k = isFinite(burnedPct) ? Math.min(1, Math.max(0, burnedPct / 100)) : 0;
  // embers land on the leading edge of the burned arc (arc starts at 12 o'clock, clockwise)
  const a = -Math.PI / 2 + 2 * Math.PI * k;
  const land = [160 + R * Math.cos(a - 0.12), 160 + R * Math.sin(a - 0.12)];
  return (
    <div ref={ref} className="cbl card glass-rim" data-in={seen ? '1' : undefined}>
      <div className="cbl-grid">
        <figure className="cbl-cell" aria-label="The engine swaps WETH and ULTRAROUND back and forth, collecting fees">
          <svg viewBox="0 0 320 320" width="100%" aria-hidden="true">
            <circle cx="160" cy="160" r="112" fill="none" stroke="#1d1d1d" strokeWidth="18" />
            <circle cx="160" cy="160" r="112" fill="none" stroke="#2a2a2a" strokeWidth="2" />
            {/* the engine core */}
            <circle cx="160" cy="160" r="62" fill="#111" stroke="rgba(255,255,255,.3)" strokeWidth="3" />
            <g className="cbl-gear">
              {Array.from({ length: 8 }).map((_, i) => <rect key={i} x="154" y="88" width="12" height="18" rx="4" fill="#5d93f0" transform={`rotate(${i * 45} 160 160)`} />)}
            </g>
            <image href="/assets/ultraround.png" x="128" y="128" width="64" height="64" />
            {/* the two tokens orbiting */}
            <g className="cbl-orbit">
              <g transform="translate(160 48)"><g className="cbl-tok"><circle r="26" fill="#627eea" /><path d="M0 -16 L10 1 L0 7 L-10 1 Z" fill="#fff" /><path d="M0 10 L10 4 L0 17 L-10 4 Z" fill="#fff" opacity=".8" /></g></g>
              <g transform="translate(160 272)"><g className="cbl-tok"><circle r="26" fill="#000" stroke="#5d93f0" strokeWidth="3" /><circle r="13" fill="none" stroke="#dfe9fb" strokeWidth="4" /></g></g>
            </g>
            <path className="cbl-arrow" d="M244 90 a112 112 0 0 1 20 40" stroke="#dfe9fb" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M268 124 l-4 10 l-8 -8" stroke="#dfe9fb" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path className="cbl-arrow" d="M76 230 a112 112 0 0 1 -20 -40" stroke="#dfe9fb" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M52 196 l4 -10 l8 8" stroke="#dfe9fb" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <figcaption><b>Cause Chaos</b><span>WETH ⇄ ULTRAROUND, fees in</span></figcaption>
        </figure>

        <div className="cbl-link" aria-hidden="true"><span /><span /><span /></div>

        <figure className="cbl-cell" aria-label={`${burnedPct.toFixed(2)}% of the 1,000,000 ULTRAROUND supply burned`}>
          <svg viewBox="0 0 320 320" width="100%" aria-hidden="true">
            <circle cx="160" cy="160" r={R} fill="none" stroke="#1d2433" strokeWidth="34" />
            <circle className="cbl-burn" cx="160" cy="160" r={R} fill="none" stroke="#ff7a2e" strokeWidth="34" strokeDasharray={`${CIRC * k} ${CIRC}`} transform="rotate(-90 160 160)" style={{ ['--c' as any]: CIRC * k }} />
            <circle cx="160" cy="160" r={R + 17} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
            <circle cx="160" cy="160" r={R - 17} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
            {motion && <g className="cbl-embers">
              {[0, 1, 2, 3].map((i) => (
                <circle key={i} r={5 - i * 0.6} fill={i % 2 ? '#ffb627' : '#ff3d3d'}>
                  <animateMotion dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite" path={`M-10 ${150 + i * 8} C 60 ${120 - i * 12}, ${land[0] - 40} ${land[1] - 60}, ${land[0]} ${land[1]}`} />
                </circle>
              ))}
            </g>}
            <text x="160" y="164" textAnchor="middle" className="cbl-pct">{burnedPct.toFixed(2)}%</text>
            <text x="160" y="196" textAnchor="middle" className="cbl-sub">burned forever</text>
          </svg>
          <figcaption><b>{burned}</b><span>of 1,000,000 ULTRAROUND</span></figcaption>
        </figure>
      </div>
      <ul className="he-chips cbl-chips">
        <li><span>WETH waiting in the engine</span><b>{weth}</b></li>
        <li><span>Burns per day</span><b>{perDay}</b></li>
        <li><span>Last Cause Chaos</span><b>{last}</b></li>
      </ul>
    </div>
  );
}
