'use client';
import { useEffect, useState } from 'react';
export default function Countdown({ to, done = 'due now' }: { to?: string | number | null; done?: string }) {
  const target = typeof to === 'number' ? to * 1000 : to ? Date.parse(to) : NaN;
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  if (!isFinite(target)) return <>—</>;
  if (now === null) return <>…</>;
  let s = Math.floor((target - now) / 1000);
  if (s <= 0) return <>{done}</>;
  const d = Math.floor(s / 86400); s %= 86400;
  const h = Math.floor(s / 3600); s %= 3600;
  const m = Math.floor(s / 60); s %= 60;
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{d > 0 ? `${d}d ` : ''}{String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</span>;
}
