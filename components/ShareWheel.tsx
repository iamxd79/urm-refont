'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from './motion/useInView';

/**
 * Leaderboard as a wheel: each top wallet's share of miners/templars, the rest grouped.
 * Draws on when seen; hovering a slice lights its table row and the other way round.
 */
type Row = { wallet: string; share: number; label: string };
const COLORS = ['var(--accent)', '#e6cfe2', '#ff3d3d', '#5d93f0', '#5fd39a', '#d7b067'];
const R = 100, C = 2 * Math.PI * R;

export default function ShareWheel({ rows, unit, table }: { rows: Row[]; unit: string; table: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const [hl, setHl] = useState<string | null>(null);
  const top = rows.filter((r) => r.share > 0).slice(0, 6);
  const rest = Math.max(0, 100 - top.reduce((a, r) => a + r.share, 0));
  const parts = [...top.map((r, i) => ({ ...r, color: COLORS[i % COLORS.length] })), ...(rest > 0.05 ? [{ wallet: 'others', share: rest, label: 'Everyone else', color: '#8a90a6' }] : [])];
  let acc = 0;
  const segs = parts.map((p, i) => { const s = { ...p, from: acc, i }; acc += p.share; return s; });

  // two-way hover sync with the table rows (data-wallet)
  useEffect(() => {
    const t = document.querySelector(`[data-sharetable="${table}"]`);
    if (!t) return;
    const over = (e: Event) => { const tr = (e.target as HTMLElement).closest('tr[data-wallet]'); setHl(tr ? tr.getAttribute('data-wallet') : null); };
    const out = () => setHl(null);
    t.addEventListener('mouseover', over); t.addEventListener('mouseleave', out);
    return () => { t.removeEventListener('mouseover', over); t.removeEventListener('mouseleave', out); };
  }, [table]);
  useEffect(() => {
    document.querySelectorAll(`[data-sharetable="${table}"] tr[data-wallet]`).forEach((tr) => tr.classList.toggle('hl', tr.getAttribute('data-wallet') === hl));
  }, [hl, table]);

  const cur = segs.find((s) => s.wallet === hl);
  return (
    <div ref={ref} className="sw card glass-rim" data-in={seen ? '1' : undefined}>
      <svg viewBox="0 0 240 240" className="sw-ring" role="img" aria-label={`Share of ${unit}: ${parts.map((p) => `${p.label} ${p.share.toFixed(2)}%`).join(', ')}`}>
        <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="28" />
        {segs.map((s) => (
          <circle key={s.wallet} cx="120" cy="120" r={R} fill="none" stroke={s.color} strokeWidth={hl === s.wallet ? 36 : 28}
            strokeDasharray={`${Math.max(0, (s.share / 100) * C - 3)} ${C}`} transform={`rotate(${-90 + (s.from / 100) * 360} 120 120)`}
            className="sw-seg" style={{ ['--d' as any]: `${s.i * 90}ms`, ['--len' as any]: (s.share / 100) * C, opacity: hl && hl !== s.wallet ? 0.35 : 1 }}
            onMouseEnter={() => setHl(s.wallet)} onMouseLeave={() => setHl(null)} />
        ))}
        <text x="120" y="118" textAnchor="middle" className="sw-big">{cur ? cur.share.toFixed(2) + '%' : (top[0]?.share ?? 0).toFixed(2) + '%'}</text>
        <text x="120" y="142" textAnchor="middle" className="sw-sub">{cur ? cur.label : 'biggest share'}</text>
      </svg>
      <ul className="sw-legend">
        {segs.map((s) => (
          <li key={s.wallet} data-on={hl === s.wallet ? '1' : undefined} onMouseEnter={() => setHl(s.wallet)} onMouseLeave={() => setHl(null)}>
            <i style={{ background: s.color }} /><span className={s.wallet === 'others' ? '' : 'mono'}>{s.label}</span><b>{s.share.toFixed(2)}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
