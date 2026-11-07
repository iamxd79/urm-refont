'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import CommandK, { DOT, openSearch, type Item } from './CommandK';

/** Floating glass sidebar for the docs, grouped by what you want to do. On phones: a sticky bar and a sheet. */
const ICON: Record<string, string> = {
  'Start here': 'M12 3l2.2 5.6L20 9.3l-4.5 3.9L17 19l-5-3.1L7 19l1.5-5.8L4 9.3l5.8-.7z',
  Earn: 'M12 3c3.5 4.5 6 7.8 6 11a6 6 0 0 1-12 0c0-3.2 2.5-6.5 6-11z',
  Borrow: 'M8 11V8a4 4 0 0 1 8 0v3M6 11h12v9H6z',
  Invest: 'M4 18l6-6 4 4 6-8M15 8h5v5',
  'Under the hood': 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',
  Reference: 'M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4zM5 16a4 4 0 0 1 4-4h10',
};
const EXTRA = [{ href: '/risks', title: 'Risks', section: 'Reference', product: 'eco' }];

function Tree({ items, path, onGo }: { items: Item[]; path: string; onGo?: () => void }) {
  const all = [...items, ...EXTRA] as (Item | (typeof EXTRA)[number])[];
  const sections = [...new Set(all.map((i) => i.section))];
  return (
    <nav aria-label="Docs" className="dtree">
      {sections.map((s) => (
        <div key={s} className="dtree-sec">
          <p className="dtree-h"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d={ICON[s]} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>{s}</p>
          <ul>{all.filter((i) => i.section === s).map((i) => (
            <li key={i.href}><Link href={i.href} onClick={onGo} aria-current={path === i.href ? 'page' : undefined}><i style={{ background: DOT[i.product] }} />{i.title}</Link></li>
          ))}</ul>
        </div>
      ))}
    </nav>
  );
}

function SearchPill() {
  return (
    <button type="button" className="dpill" onClick={openSearch}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.4" fill="none" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
      <span>Search the docs</span><kbd>⌘K</kbd>
    </button>
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
      <CommandK items={items} />
      <aside className="dside glass-regular glass-rim"><SearchPill /><Tree items={items} path={path} /></aside>
      <div className="dbar glass-regular">
        <button type="button" className="dbar-btn" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="dsheet">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <span><small>{cur?.section || 'Docs'}</small>{cur?.title || 'Menu'}</span>
        </button>
        <button type="button" className="dbar-search" onClick={openSearch} aria-label="Search the docs">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.4" fill="none" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </button>
      </div>
      {open && typeof document !== 'undefined' && createPortal(
        <div className="dsheet-wrap" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div id="dsheet" className="dsheet glass-solid" role="dialog" aria-modal="true" aria-label="Docs menu">
            <div className="dsheet-top"><b>Docs</b><button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Close</button></div>
            <Tree items={items} path={path} onGo={() => setOpen(false)} />
          </div>
        </div>, document.body)}
    </>
  );
}
