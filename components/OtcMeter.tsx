'use client';
import { useRef } from 'react';
import Countdown from './Countdown';
import { useInView } from './motion/useInView';

/**
 * Rage OTC, visualised. Top: the live bonus on the 1%→20% track (or the last trade when sold out).
 * Bottom: a looping demo of one round — the bonus climbs until someone buys, then resets.
 */
type P = { active: boolean; bonus: number; min: number; max: number; last: number; next: number | null };

export default function OtcMeter({ active, bonus, min, max, last, next }: P) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const span = Math.max(1, max - min);
  const at = (v: number) => Math.min(1, Math.max(0, (v - min) / span));
  const live = active ? at(bonus) : at(last);
  const ticks = [min, ...[5, 10, 15].filter((v) => v > min + 1 && v < max - 1), max];
  return (
    <div ref={ref} className="otcm card glass-rim" data-in={seen ? '1' : undefined}>
      <div className="otcm-head">
        <b className="eyebrow">{active ? 'Bonus right now' : 'Last round closed at'}</b>
        <span className="pill" style={active ? { background: 'var(--accent)', color: 'var(--onAccent)' } : { background: 'var(--bg)' }}>{active ? 'Live' : 'Sold out'}</span>
      </div>
      <p className="otcm-big"><span className="acc">{(active ? bonus : last).toFixed(active ? 2 : 0)}%</span><small> bonus on top of fair value</small></p>
      <div className="otcm-track" role="img" aria-label={`Bonus track from ${min}% to ${max}%. ${active ? `Now at ${bonus.toFixed(2)}%.` : `Last trade at ${last}%.`}`}>
        <div className="otcm-fill" style={{ ['--k' as any]: live }} />
        <div className="otcm-knobrail" style={{ ['--k' as any]: live }}><span className="otcm-knob" /></div>
      </div>
      <div className="otcm-ticks" aria-hidden="true">{ticks.map((t) => <span key={t} style={{ left: `${at(t) * 100}%` }}>{t}%</span>)}</div>
      {!active && <p className="muted otcm-note">Next drop {next ? <>in <b style={{ color: 'var(--text)' }}><Countdown to={next} done="any moment now" /></b></> : 'soon'}. Announced on X first.</p>}

      <div className="otcm-demo" aria-hidden="true">
        <span className="eyebrow otcm-demolabel">How a round plays out</span>
        <div className="otcm-track sm">
          <div className="otcm-fill loop" />
          <div className="otcm-knobrail loop"><span className="otcm-knob" /><span className="otcm-buy">Bought</span></div>
        </div>
        <div className="otcm-phases"><span className="ph1">Bonus climbs while nobody buys</span><span className="ph2">Someone takes it</span><span className="ph3">Next round starts low</span></div>
      </div>
    </div>
  );
}
