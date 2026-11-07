'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ProductLogo from './ProductLogo';
import ConnectButton from './ConnectButton';
import MobileMenu from './MobileMenu';
import { DOCS, GLOBAL, PRODUCTS, productFor, type Stats } from '@/lib/nav';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * One nav for the whole site that becomes each product's own nav:
 * logo, tint, sub-page tabs, live stat and main action morph as you move between products.
 * Compacts on scroll, hides while scrolling down, comes back on scroll up.
 */
export default function SmartNav({ stats }: { stats: Stats }) {
  const path = usePathname() || '/';
  const product = productFor(path);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [sw, setSw] = useState(false);

  // scroll behaviour
  useEffect(() => {
    let last = window.scrollY, raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY, d = y - last;
        setCompact(y > 40);
        if (document.body.style.overflow === 'hidden') { last = y; return; }
        if (d > 8 && y > 240) setHidden(true);
        else if (d < -6 || y < 120) setHidden(false);
        last = y;
      });
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);
  useEffect(() => { setHidden(false); setSw(false); }, [path]);

  // sliding active pill for the product tabs
  const tabsRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  useIso(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>('[aria-current=page]');
    setPill(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
  }, [path, product?.key]);

  // live stat pulse when the value changes
  const stat = product ? stats[product.key] : null;
  const prevStat = useRef(stat?.value);
  const [pulse, setPulse] = useState(0);
  useEffect(() => { if (stat?.value && prevStat.current && stat.value !== prevStat.current) setPulse((p) => p + 1); prevStat.current = stat?.value; }, [stat?.value]);

  // close the switcher on outside click / Escape
  const swRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sw) return;
    const c = (e: MouseEvent) => { if (!swRef.current?.contains(e.target as Node)) setSw(false); };
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setSw(false);
    document.addEventListener('mousedown', c); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', c); document.removeEventListener('keydown', k); };
  }, [sw]);

  const tabs = product?.tabs ?? [];
  const activeTab = tabs.filter((t) => path === t.href || (t.href !== product?.base && path.startsWith(t.href))).sort((a, b) => b.href.length - a.href.length)[0]?.href ?? product?.base;

  return (
    <header className="nav" data-theme={product?.theme} data-compact={compact} data-hidden={hidden}>
      <nav className="navbar glass-regular" aria-label="Main">
        <Link href="/" className="brand" aria-label="URM ecosystem home">
          <ProductLogo id="eco" size={product ? 30 : 38} />
          {!product && <span>URM<em> ecosystem</em></span>}
        </Link>

        {product ? (
          <>
            <span className="crumb" aria-hidden="true">/</span>
            <Link key={product.key} href={product.base} className="prodbrand">
              <ProductLogo id={product.key} size={30} />
              <span>{product.name}</span>
            </Link>
            {tabs.length > 0 && (
              <div className="navseg" ref={tabsRef} role="navigation" aria-label={`${product.name} pages`}>
                {pill && <span className="navseg-pill" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} aria-hidden="true" />}
                {tabs.map((t) => <Link key={t.href} href={t.href} aria-current={activeTab === t.href ? 'page' : undefined}>{t.label}</Link>)}
              </div>
            )}
          </>
        ) : (
          <div className="navlinks">
            {GLOBAL.map((i) => (
              <Link key={i.key} href={i.href} aria-current={path.startsWith(i.href) ? 'page' : undefined}>{i.key !== 'earn' && <ProductLogo id={i.key} size={20} />}{i.label}</Link>
            ))}
            <a href={DOCS}>Docs</a>
          </div>
        )}

        <div className="navright">
          {stat && (
            <span key={pulse} className={'livechip' + (pulse ? ' pulse' : '')} title="Live, refreshed every minute">
              <i aria-hidden="true" />{stat.label} <b>{stat.value}</b>
            </span>
          )}
          {product && (
            <div className="switch" ref={swRef}>
              <button type="button" className="switch-btn" aria-expanded={sw} aria-haspopup="true" onClick={() => setSw(!sw)}>
                Ecosystem
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {sw && (
                <div className="switch-pop glass-solid" role="menu">
                  <Link href="/" role="menuitem"><ProductLogo id="eco" size={26} />URM ecosystem</Link>
                  {PRODUCTS.map((p) => (
                    <Link key={p.key} href={p.base} role="menuitem" aria-current={p.key === product.key ? 'page' : undefined}>
                      <ProductLogo id={p.key} size={26} />{p.name}
                      {stats[p.key] && <em>{stats[p.key]!.value}</em>}
                    </Link>
                  ))}
                  <Link href="/earn" role="menuitem">Earn</Link>
                  <a href={DOCS} role="menuitem">Docs</a>
                  <Link href="/risks" role="menuitem">Risks</Link>
                </div>
              )}
            </div>
          )}
          {product ? (
            <>
              <Link key={'cta-' + product.key} href={product.cta.href} className="btn btn-primary navcta prodcta">{product.cta.label}</Link>
              <span className="navcta"><ConnectButton compact /></span>
            </>
          ) : (
            <span className="navcta"><ConnectButton /></span>
          )}
          <MobileMenu items={GLOBAL} active={product?.key} docs={DOCS} product={product} theme={product?.theme} />
        </div>
      </nav>

      {product && tabs.length > 0 && (
        <div className="navtabs-m">
          <div className="seg glass-regular" role="navigation" aria-label={`${product.name} pages`}>
            {tabs.map((t) => <Link key={t.href} href={t.href} aria-current={activeTab === t.href ? 'page' : undefined}>{t.label}</Link>)}
          </div>
        </div>
      )}
    </header>
  );
}
