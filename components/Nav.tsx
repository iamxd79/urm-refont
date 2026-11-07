import Link from 'next/link';
import Logo from './Logo';
import ConnectButton from './ConnectButton';
import MobileMenu from './MobileMenu';

export const ITEMS = [
  { href: '/urm', label: 'URM', key: 'urm' },
  { href: '/rage', label: 'RAGE', key: 'rage' },
  { href: '/hestia', label: 'HESTIA', key: 'hestia' },
  { href: '/circle', label: 'ULTRAROUND', key: 'circle' },
  { href: '/earn', label: 'Earn', key: 'earn' },
];
export const DOCS = 'https://ultraroundmoney.gitbook.io/ultraroundmoney/';
export type Tab = { href: string; label: string };

export default function Nav({ active, tabs, current, overlay }: { active?: string; tabs?: Tab[]; current?: string; overlay?: boolean }) {
  return (
    <header className={'nav' + (overlay ? ' nav-over' : '')}>
      <nav className="navbar lg" aria-label="Main">
        <Link href="/" className="brand" aria-label="URM home">
          <Logo /><span>URM</span>
        </Link>
        <div className="navlinks">
          {ITEMS.map((i) => (
            <Link key={i.key} href={i.href} aria-current={active === i.key ? 'page' : undefined}>{i.label}</Link>
          ))}
          <a href={DOCS}>Docs</a>
        </div>
        <span className="basechip"><img src="/assets/base.png" alt="" width={18} height={18} />Base</span>
        <div className="navcta"><ConnectButton /></div>
        <MobileMenu items={ITEMS} active={active} docs={DOCS} />
      </nav>
      {tabs && (
        <div className="wrap navtabs">
          <div className="seg lg" role="navigation" aria-label="Section">
            {tabs.map((t) => <Link key={t.href} href={t.href} aria-current={current === t.href ? 'page' : undefined}>{t.label}</Link>)}
          </div>
        </div>
      )}
    </header>
  );
}
