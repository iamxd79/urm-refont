'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slug';

/** ⌘K search for the docs. Opens with ⌘K / Ctrl+K, "/", or any element that calls openSearch(). */
export type Item = { href: string; title: string; nav?: string; section: string; product: string; text: string; heads: string[] };
export const openSearch = () => window.dispatchEvent(new Event('docs:search'));
export const DOT: Record<string, string> = { urm: '#d7b067', rage: '#ff3d3d', hestia: '#ff7a2e', circle: '#5d93f0', eco: '#b0bfd6' };

export default function CommandK({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  useEffect(() => {
    const show = () => { setOpen(true); setQ(''); setSel(0); };
    const key = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest('input,textarea,[contenteditable]');
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); show(); }
    };
    window.addEventListener('docs:search', show); window.addEventListener('keydown', key);
    return () => { window.removeEventListener('docs:search', show); window.removeEventListener('keydown', key); };
  }, []);
  useEffect(() => { if (open) { setTimeout(() => input.current?.focus(), 10); document.body.style.overflow = 'hidden'; } else document.body.style.overflow = ''; }, [open]);

  const res = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return items.filter((i) => ['/docs/earn', '/docs/urm/fountain', '/docs/urm/cdp', '/docs/rage', '/docs/contracts'].includes(i.href)).map((it) => ({ it, head: undefined as string | undefined, snip: '' }));
    return items.map((it) => {
      const title = it.title.toLowerCase().includes(t) ? 3 : 0;
      const head = it.heads.find((h) => h.toLowerCase().includes(t));
      const i = it.text.toLowerCase().indexOf(t);
      const snip = i >= 0 ? (i > 40 ? '…' : '') + it.text.slice(Math.max(0, i - 40), i + 90) + '…' : '';
      return { it, head, snip, score: title + (head ? 2 : 0) + (i >= 0 ? 1 : 0) };
    }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);
  }, [q, items]);
  const go = (r: (typeof res)[number]) => { setOpen(false); router.push(r.it.href + (r.head ? '#' + slugify(r.head) : '')); };

  if (!open) return null;
  return createPortal(
    <div className="ck-wrap" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="ck glass-solid glass-rim" role="dialog" aria-modal="true" aria-label="Search the docs">
        <div className="ck-in">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.4" fill="none" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
          <input ref={input} autoFocus value={q} placeholder="Search the docs" aria-label="Search the docs" role="combobox" aria-expanded aria-controls="ck-res" aria-activedescendant={res[sel] ? `ck-${sel}` : undefined}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, res.length - 1)); } if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); } if (e.key === 'Enter' && res[sel]) go(res[sel]); if (e.key === 'Escape') setOpen(false); }} />
          <button type="button" className="ck-esc" onClick={() => setOpen(false)}>esc</button>
        </div>
        <p className="ck-h">{q.trim().length < 2 ? 'Popular' : res.length ? 'Results' : `Nothing found for “${q}”`}</p>
        <ul id="ck-res" role="listbox">
          {res.map((r, i) => (
            <li key={r.it.href + (r.head || '')} id={`ck-${i}`} role="option" aria-selected={i === sel}>
              <button type="button" onMouseEnter={() => setSel(i)} onClick={() => go(r)}>
                <i style={{ background: DOT[r.it.product] }} />
                <span><small>{r.it.section}</small><b>{r.it.title}{r.head ? ` › ${r.head}` : ''}</b>{r.snip && <em>{r.snip}</em>}</span>
                <kbd aria-hidden="true">↵</kbd>
              </button>
            </li>
          ))}
        </ul>
        <p className="ck-foot"><kbd>↑</kbd><kbd>↓</kbd> to move · <kbd>↵</kbd> to open · <kbd>esc</kbd> to close</p>
      </div>
    </div>, document.body);
}
