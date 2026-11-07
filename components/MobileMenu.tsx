'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ConnectButton from './ConnectButton';

export default function MobileMenu({ items, active, docs }: { items: { href: string; label: string; key: string }[]; active?: string; docs: string }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [open]);
  return (
    <div className="mm">
      <button type="button" className="mm-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mm-panel" onClick={() => setOpen(!open)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <div id="mm-panel" className="mm-panel">
          <nav aria-label="Mobile">
            {items.map((i) => <Link key={i.key} href={i.href} aria-current={active === i.key ? 'page' : undefined}>{i.label}</Link>)}
            <a href={docs}>Docs</a>
            <Link href="/risks">Risks</Link>
          </nav>
          <ConnectButton block className="btn btn-primary btn-lg" />
          <p className="muted" style={{ fontSize: 13, textAlign: 'center', margin: 0 }}>All contracts on Base. Connecting never moves funds.</p>
        </div>
      )}
    </div>
  );
}
