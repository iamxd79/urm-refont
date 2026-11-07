import Link from 'next/link';
import Logo from './Logo';
import ConnectButton from './ConnectButton';

const ITEMS = [
  { href: '/urm', label: 'URM', key: 'urm' },
  { href: '/rage', label: 'RAGE', key: 'rage' },
  { href: '/hestia', label: 'HESTIA', key: 'hestia' },
  { href: '/circle', label: 'ULTRAROUND', key: 'circle' },
  { href: '/earn', label: 'Earn', key: 'earn' },
];
export type Tab = { href: string; label: string };

export default function Nav({ active, tabs, current }: { active?: string; tabs?: Tab[]; current?: string }) {
  return (
    <header style={{ borderBottom: '1px solid var(--line)', background: 'var(--bg)' }}>
      <nav className="wrap" aria-label="Main" style={{ display: 'flex', alignItems: 'center', gap: '16px 28px', flexWrap: 'wrap', paddingTop: 16, paddingBottom: 16 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text)' }}>
          <Logo /><span style={{ fontWeight: 800, fontSize: 22 }}>URM</span>
        </Link>
        <div className="navlinks" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 26px', flex: '1 1 360px', fontSize: 15, fontWeight: 500 }}>
          {ITEMS.map((i) => (
            <Link key={i.key} href={i.href} aria-current={active === i.key ? 'page' : undefined}
              style={active === i.key ? { color: 'var(--accent)', fontWeight: 700, borderBottom: '2px solid var(--accent)', paddingBottom: 3 } : { color: 'var(--text)' }}>{i.label}</Link>
          ))}
          <a href="https://ultraroundmoney.gitbook.io/ultraroundmoney/" style={{ color: 'var(--text)' }}>Docs</a>
        </div>
        <ConnectButton />
      </nav>
      {tabs && (
        <div className="wrap" style={{ paddingBottom: 14 }}>
          <div className="seg glass" role="navigation" aria-label="Section">
            {tabs.map((t) => <Link key={t.href} href={t.href} aria-current={current === t.href ? 'page' : undefined}>{t.label}</Link>)}
          </div>
        </div>
      )}
    </header>
  );
}
