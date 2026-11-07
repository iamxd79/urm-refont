'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CommandK, { DOT, openSearch, type Item } from './CommandK';

/**
 * Docs navigation. Desktop: a floating glass panel whose sections fold (only "Start here" and the
 * section you're in start open). Phones: a sticky bar that opens the same list in a sheet.
 */
const ICON: Record<string, string> = {
  'Start here': 'M12 3l2.2 5.6L20 9.3l-4.5 3.9L17 19l-5-3.1L7 19l1.5-5.8L4 9.3l5.8-.7z',
  Earn: 'M12 3c3.5 4.5 6 7.8 6 11a6 6 0 0 1-12 0c0-3.2 2.5-6.5 6-11z',
  Borrow: 'M8 11V8a4 4 0 0 1 8 0v3M6 11h12v9H6z',
  Invest: 'M4 18l6-6 4 4 6-8M15 8h5v5',
  'Under the hood': 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',
  Reference: 'M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4zM5 16a4 4 0 0 1 4-4h10',
};
const GROUP: Record<string, string> = { eco: 'Ecosystem', urm: '$URM', rage: 'RAGE', hestia: 'HESTIA', circle: 'ULTRAROUND' };
const EXTRA: Item[] = [{ href: '/risks', title: 'Risks', section: 'Reference', product: 'eco', text: '', heads: [] }];

/** ⌘K on Apple devices, Ctrl K everywhere else. */
function useShortcut() {
  const [k, setK] = useState('Ctrl K');
  useEffect(() => { const p = (navigator as any).userAgentData?.platform || navigator.platform || ''; if (/mac|iphone|ipad/i.test(p)) setK('⌘K'); }, []);
  return k;
}

function Tree({ items, path, onGo, id }: { items: Item[]; path: string; onGo?: () => void; id: string }) {
  const all = [...items, ...EXTRA];
  const sections = [...new Set(all.map((i) => i.section))];
  const here = all.find((i) => i.href === path)?.section;
  const [open, setOpen] = useState<Record<string, boolean>>({});
  // the section you're in always opens when you land on a page
  useEffect(() => { if (here) setOpen((o) => ({ ...o, [here]: true })); }, [here]);
  const isOpen = (s: string) => open[s] ?? (s === (here || 'Start here'));
  return (
    <nav aria-label="Docs" className="dtree">
      {sections.map((s) => {
        const list = all.filter((i) => i.section === s);
        const multi = new Set(list.map((i) => i.product)).size > 2;
        const on = isOpen(s);
        return (
          <div key={s} className="dtree-sec" data-open={on ? '1' : undefined}>
            <button type="button" className="dtree-h" aria-expanded={on} aria-controls={`${id}-${s}`} onClick={() => setOpen((o) => ({ ...o, [s]: !on }))}>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d={ICON[s]} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>{s}</span>
              {!on && list.some((i) => i.href === path) && <i className="dtree-dot" aria-hidden="true" />}
              <svg className="dtree-chev" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className="dtree-body" id={`${id}-${s}`}>
              <ul>{list.map((i, k) => (
                <li key={i.href}>
                  {multi && list[k - 1]?.product !== i.product && <span className="dtree-sub"><i style={{ background: DOT[i.product] }} />{GROUP[i.product]}</span>}
                  <Link href={i.href} onClick={onGo} tabIndex={on ? undefined : -1} aria-current={path === i.href ? 'page' : undefined}>{!multi && <i style={{ background: DOT[i.product] }} />}{i.nav || i.title}</Link>
                </li>
              ))}</ul>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

function SearchPill({ onOpen }: { onOpen?: () => void }) {
  const k = useShortcut();
  return (
    <button type="button" className="dpill" onClick={() => { onOpen?.(); openSearch(); }}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.4" fill="none" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
      <span>Search the docs</span><kbd>{k}</kbd>
    </button>
  );
}

/** Scroll the current page's link into the middle of a scrolling list, if it's out of view. */
function reveal(box: HTMLElement | null) {
  const cur = box?.querySelector('a[aria-current=page]') as HTMLElement | null;
  if (!box || !cur) return;
  const b = box.getBoundingClientRect(), c = cur.getBoundingClientRect();
  if (c.top < b.top + 8 || c.bottom > b.bottom - 8) box.scrollTop += c.top - b.top - b.height / 2 + c.height / 2;
}

export default function DocsNav({ items }: { items: Item[] }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const cur = items.find((i) => i.href === path);

  useEffect(() => { const t = setTimeout(() => reveal(scroller.current), 60); return () => clearTimeout(t); }, [path]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  // sheet: show where you are, move focus in, keep Tab inside, give focus back on close
  useEffect(() => {
    if (!open) return;
    const el = sheet.current; if (!el) return;
    requestAnimationFrame(() => { reveal(el); (el.querySelector('a[aria-current=page]') as HTMLElement | null || el.querySelector('button') as HTMLElement | null)?.focus({ preventScroll: true }); });
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab') return;
      const f = [...el.querySelectorAll<HTMLElement>('a[href]:not([tabindex="-1"]),button')].filter((x) => x.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('keydown', key); opener.current?.focus({ preventScroll: true }); };
  }, [open]);

  return (
    <>
      <CommandK items={items} />
      <aside className="dside glass-regular glass-rim">
        <div className="dside-top" data-scrolled={scrolled ? '1' : undefined}><SearchPill /></div>
        <div className="dside-scroll" ref={scroller} onScroll={(e) => setScrolled((e.target as HTMLElement).scrollTop > 2)}><Tree items={items} path={path} id="dt" /></div>
      </aside>
      <div className="dbar glass-regular">
        <button type="button" ref={opener} className="dbar-btn" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="dsheet">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <span><small>{cur?.section || 'Docs'}</small>{cur?.nav || cur?.title || 'Menu'}</span>
        </button>
        <button type="button" className="dbar-search" onClick={openSearch} aria-label="Search the docs">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.4" fill="none" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </button>
      </div>
      {open && typeof document !== 'undefined' && createPortal(
        <div className="dsheet-wrap" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div id="dsheet" ref={sheet} className="dsheet glass-solid" role="dialog" aria-modal="true" aria-label="Docs menu">
            <div className="dsheet-top"><b>Docs</b><button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>Close</button></div>
            <SearchPill onOpen={() => setOpen(false)} />
            <Tree items={items} path={path} onGo={() => setOpen(false)} id="ds" />
          </div>
        </div>, document.body)}
    </>
  );
}
