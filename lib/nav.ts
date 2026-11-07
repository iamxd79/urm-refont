import { URM_TABS, RAGE_TABS, HESTIA_TABS, CIRCLE_TABS } from './tabs';

export type Tab = { href: string; label: string };
export type Product = { key: 'urm' | 'rage' | 'hestia' | 'circle'; base: string; name: string; theme?: string; tabs: Tab[]; cta: { label: string; href: string }; stat: string };

/** Each product's own nav identity. The nav morphs into this when you enter the product. */
export const PRODUCTS: Product[] = [
  { key: 'urm', base: '/urm', name: '$URM', tabs: URM_TABS, cta: { label: 'Deposit', href: '/urm/fountain' }, stat: 'peg' },
  { key: 'rage', base: '/rage', name: 'RAGE', theme: 'rage', tabs: RAGE_TABS, cta: { label: 'Invest', href: '/rage#invest' }, stat: 'price' },
  { key: 'hestia', base: '/hestia', name: 'HESTIA', theme: 'hestia', tabs: HESTIA_TABS, cta: { label: 'Mine', href: '/hestia/mine' }, stat: 'burned' },
  { key: 'circle', base: '/ultraround', name: 'ULTRAROUND', theme: 'circle', tabs: CIRCLE_TABS, cta: { label: 'Temple', href: '/ultraround/temple' }, stat: 'burned' },
];
export const GLOBAL = [
  { href: '/urm', label: '$URM', key: 'urm' },
  { href: '/rage', label: 'RAGE', key: 'rage' },
  { href: '/hestia', label: 'HESTIA', key: 'hestia' },
  { href: '/ultraround', label: 'ULTRAROUND', key: 'circle' },
  { href: '/earn', label: 'Earn', key: 'earn' },
];
export const DOCS = '/docs';
export const productFor = (path: string) => PRODUCTS.find((p) => path === p.base || path.startsWith(p.base + '/'));
export type Stats = Record<'urm' | 'rage' | 'hestia' | 'circle', { label: string; value: string } | null>;
