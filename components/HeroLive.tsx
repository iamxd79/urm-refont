'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Live layers on top of the hero photo:
 * - a glyph rain built only from real numbers pulled from the URM API
 * - the URM ring as a reticle that pulses every time the data is re-checked
 * Solid colours only. Respects reduced motion (rain and spin stop, ring stays).
 */
export function DataRain({ words }: { words: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const COLORS = ['#ffffff', '#ffffff', '#b9c8ff'];
    const pool = (words.length ? words : ['$1.00']).filter((x) => x && x.trim());
    let w = 0, h = 0, fs = 13, cols: { x: number; y: number; speed: number; len: number; text: string; color: string; on: boolean; off: number }[] = [];
    // one whole value per column, never a slice of one
    const pick = () => pool[Math.floor(Math.random() * pool.length)].replace(/\s+/g, ' ');
    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fs = w < 700 ? 11 : 13;
      const n = Math.floor(w / (fs * 2.4));
      cols = Array.from({ length: n }, (_, i) => ({
        x: i * fs * 2.4 + 4, y: Math.random() * h, speed: 0.25 + Math.random() * 0.5,
        len: 0, text: '', color: COLORS[Math.floor(Math.random() * COLORS.length)],
        on: Math.random() < (w < 700 ? 0.14 : 0.22), off: 0,
      }));
      cols.forEach((c) => { c.text = pick(); c.len = c.text.length; });
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = `600 ${fs}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = 'top';
      for (const c of cols) {
        if (!c.on) continue;
        const head = Math.floor(c.y / fs);
        for (let k = 0; k < c.len; k++) {
          const row = head - (c.len - 1 - k);
          if (row < 0) continue;
          const ch = c.text[k];
          if (!ch || ch === ' ') continue;
          ctx.fillStyle = k === c.len - 1 ? '#ff5a2e' : c.color;
          ctx.fillText(ch, c.x, row * fs);
        }
      }
    };
    let raf = 0, last = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - last < 33) return;
      last = t;
      for (const c of cols) {
        if (!c.on) continue;
        c.y += c.speed * fs * 0.35;
        if (c.y - c.len * fs > h) { c.y = -Math.random() * h * 0.5; c.text = pick(); c.len = c.text.length; }
      }
      draw();
    };
    setup(); draw();
    const ro = new ResizeObserver(() => { setup(); draw(); });
    ro.observe(cv);
    // only run while the hero is actually on screen
    let shown = true;
    const vis = () => { cancelAnimationFrame(raf); if (!document.hidden && !still && shown) raf = requestAnimationFrame(tick); };
    const onScroll = () => { const s2 = window.scrollY < window.innerHeight * 0.9; if (s2 !== shown) { shown = s2; vis(); } };
    document.addEventListener('visibilitychange', vis);
    window.addEventListener('scroll', onScroll, { passive: true });
    vis();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener('visibilitychange', vis); window.removeEventListener('scroll', onScroll); };
  }, [words]);
  return <canvas ref={ref} className="rain" aria-hidden="true" />;
}

export function OrbPulse({ price, checkedAt, defense }: { price: number; checkedAt: number; defense: string }) {
  const [pulse, setPulse] = useState(0);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setPulse((p) => p + 1);
  }, [checkedAt]);
  const known = Number.isFinite(price);
  const onPeg = known && Math.abs(price - 1) <= 0.01;
  const state = !known ? 'checking…' : onPeg ? 'on peg' : 'off peg';
  return (
    <div className="orb" role="img" aria-label={known ? `Peg check: $URM at ${price.toFixed(3)} dollars, ${state}. Total defense ${defense}.` : 'Peg check: loading live data'}>
      <span className="orb-ring" aria-hidden="true" />
      <span key={pulse} className={'orb-ping' + (pulse ? ' go' : '')} aria-hidden="true" />
      <div className="readout glass-clear" aria-hidden="true">
        <span><b>PEG CHECK</b> {known ? `$${price.toFixed(3)} · ` : ''}{state}</span>
        <span className="sub">Defense {defense} · re-checked every minute</span>
      </div>
    </div>
  );
}
