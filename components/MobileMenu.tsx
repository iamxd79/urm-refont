'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ConnectButton from './ConnectButton';
import ProductLogo from './ProductLogo';

import type { Product } from '@/lib/nav';

export default function MobileMenu({ items, active, docs, product, theme }: { items: { href: string; label: string; key: string }[]; active?: string; docs: string; product?: Product; theme?: string }) {
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState(84);
  const btn = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => (document.querySelector('#mm-panel a') as HTMLElement | null)?.focus());
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; btn.current?.focus(); };
  }, [open]);
  return (
    <div className="mm">
      <button ref={btn} type="button" className="mm-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mm-panel" onClick={(e) => { const nb = (e.currentTarget.closest('.navbar') as HTMLElement | null)?.getBoundingClientRect(); if (nb) setTop(Math.round(nb.bottom + 8)); setOpen(!open); }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && createPortal(
        <div id="mm-panel" className="mm-panel glass-solid" style={{ top }} data-theme={theme}>
          <nav aria-label="Mobile">
            {items.map((i) => <Link key={i.key} href={i.href} aria-current={active === i.key ? 'page' : undefined}>{i.key !== 'earn' && <ProductLogo id={i.key} size={28} />}{i.label}</Link>)}
            <a href={docs}>Docs</a>
            <Link href="/risks">Risks</Link>
          </nav>
          {product && <Link href={product.cta.href} className="btn btn-outline btn-lg btn-block">{product.cta.label}</Link>}
          <ConnectButton block className="btn btn-primary btn-lg" />
          <p className="muted" style={{ fontSize: 'var(--fs-footnote)', textAlign: 'center', margin: 0 }}>All contracts on Base. Connecting never moves funds.</p>
        </div>,
        document.body
      )}
    </div>
  );
}
