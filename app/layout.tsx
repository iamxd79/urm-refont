import type { Metadata } from 'next';
import MotionGovernor from '@/components/motion/MotionGovernor';
import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/components/Providers';
import { api } from '@/lib/api';
import SmartNav from '@/components/SmartNav';
import { num, pct } from '@/lib/fmt';
import type { Stats } from '@/lib/nav';

const inter = localFont({ src: './fonts/Inter.woff2', variable: '--font-inter', weight: '100 900', display: 'swap' });
const grotesk = localFont({ src: './fonts/SpaceGrotesk.woff2', variable: '--font-grotesk', weight: '300 700', display: 'swap' });

const site = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(site),
  openGraph: { title: 'URM ecosystem', description: 'URM (Ultra Round Money) is a community-driven ecosystem that builds stores of value on Base.', siteName: 'URM ecosystem', type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image', title: 'URM ecosystem', description: 'Community-driven stores of value on Base: $URM, RAGE, HESTIA, ULTRAROUND.', site: '@URMdollar', creator: '@URMdollar' },
  title: { default: 'URM ecosystem', template: '%s | URM ecosystem' },
  description: 'URM (Ultra Round Money) is a community-driven ecosystem that builds stores of value on Base: the $URM stablecoin, RAGE, HESTIA and ULTRAROUND.',
  robots: process.env.NEXT_PUBLIC_PREVIEW_BANNER === '0' ? undefined : { index: false, follow: false },
};

export const revalidate = 60;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const preview = process.env.NEXT_PUBLIC_PREVIEW_BANNER !== '0';
  const [live, f, rb, h, c] = await Promise.all([api('home/overview'), api('urm/fortress'), api('rage/buying-protocol'), api('hestia/overview'), api('circle/overview')]);
  const ok = (v: any) => v !== null && v !== undefined && Number.isFinite(Number(v));
  const stats: Stats = {
    urm: ok(f?.urmPrice) ? { label: 'Peg', value: '$' + num(f.urmPrice, 3) } : null,
    rage: ok(rb?.rbpView?.price) ? { label: 'Price', value: '$' + num(rb.rbpView.price, 2) } : null,
    hestia: ok(h?.supply?.burnedPercent) ? { label: 'Burned', value: pct(h.supply.burnedPercent) } : null,
    circle: ok(c?.supply?.burnedPercent) ? { label: 'Burned', value: pct(c.supply.burnedPercent) } : null,
  };
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body>
        {preview && <div className="preview" role="note">Preview of the new ultraroundmoney.com · live data from the contracts</div>}
        {!live && <div className="datawarn" role="status">Live data is catching up. Numbers will fill in on the next refresh, usually within a minute.</div>}
        <a className="skip" href="#main">Skip to content</a><Providers><MotionGovernor />
          <SmartNav stats={stats} />
          <main id="main" tabIndex={-1}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
