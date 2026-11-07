'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { slugify } from '@/lib/slug';

/** Sidebar + search for the docs. On phones it lives in a sheet opened from a sticky bar. */
export type Item = { href: string; title: string; section: string; text: string; heads: string[] };

function Search({ items, onGo }: { items: Item[]; onGo?: () => void }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === '/' && !(e.target as HTMLElement)?.closest('input,textarea')) { e.preventDefault(); ref.current?.focus(); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, []);
  const res = useMemo(() => {
    const t = q.trim().toLowerCase(); if (t.length < 2) return [];
    return items.map((it) => {
      const title = it.title.toLowerCase().includes(t) ? 3 : 0;
      const head = it.heads.find((h) => h.toLowerCase().includes(t));
      const i = it.text.toLowerCase().indexOf(t);
      const score = title + (head ? 2 : 0) + (i >= 0 ? 1 : 0);
      const snip = i >= 0 ? (i > 40 ? '…' : '') + it.text.slice(Math.max(0, i - 40), i + 80) + '…' : '';
      return { it, score, head, snip };
    }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);
  }, [q, items]);
  const go = (r: (typeof res)[number]) => { location.assign(r.it.href + (r.head ? '#' + slugify(r.head) : '')); setQ(''); onGo?.(); };
  return (
    <div className="dsearch" role="search">
      <label className="sr" htmlFor="dq">Search the docs</label>
      <input id="dq" ref={ref} type="text" inputMode="search" enterKeyHint="search" placeholder="Search the docs" value={q} autoComplete="off"
        onChange={(e) => { setQ(e.target.value); setSel(0); }}
        onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, res.length - 1)); } if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); } if (e.key === 'Enter' && res[sel]) go(res[sel]); if (e.key === 'Escape') setQ(''); }}
        aria-controls="dq-res" aria-expanded={res.length > 0} role="combobox" aria-activedescendant={res[sel] ? `dq-${sel}` : undefined} />
      {!q && <kbd aria-hidden="true">/</kbd>}
      {q.trim().length >= 2 && (
        <ul id="dq-res" className="dsearch-res glass-solid" role="listbox">
          {res.length === 0 && <li className="muted dsearch-none">Nothing found for “{q}”.</li>}
          {res.map((r, i) => (
            <li key={r.it.href} id={`dq-${i}`} role="option" aria-selected={i === sel}>
              <button type="button" onMouseEnter={() => setSel(i)} onClick={() => go(r)}>
                <span className="dsearch-sec">{r.it.section}</span><b>{r.it.title}{r.head ? ` › ${r.head}` : ''}</b>{r.snip && <span className="dsearch-snip">{r.snip}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Tree({ items, path, onGo }: { items: Item[]; path: string; onGo?: () => void }) {
  const sections = [...new Set(items.map((i) => i.section))];
  return (
    <nav aria-label="Docs" className="dtree">
      {sections.map((s) => (
        <div key={s} className="dtree-sec">
          <p className="dtree-h">{s}</p>
          <ul>{items.filter((i) => i.section === s).map((i) => (
            <li key={i.href}><Link href={i.href} onClick={onGo} aria-current={path === i.href ? 'page' : undefined}>{i.title}</Link></li>
          ))}</ul>
        </div>
      ))}
    </nav>
  );
}

export default function DocsNav({ items }: { items: Item[] }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const cur = items.find((i) => i.href === path);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  return (
    <>
      <aside className="dside"><Search items={items} /><Tree items={items} path={path} /></aside>
      <div className="dbar glass-regular">
        <button type="button" className="dbar-btn" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="dsheet">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <span><small>{cur?.section || 'Docs'}</small>{cur?.title || 'Menu'}</span>
        </button>
      </div>
      {open && typeof document !== 'undefined' && createPortal(
        <div className="dsheet-wrap" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div id="dsheet" className="dsheet glass-solid" role="dialog" aria-modal="true" aria-label="Docs menu">
            <div className="dsheet-top"><b>Docs</b><button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Close</button></div>
            <Search items={items} onGo={() => setOpen(false)} />
            <Tree items={items} path={path} onGo={() => setOpen(false)} />
          </div>
        </div>, document.body)}
    </>
  );
}
