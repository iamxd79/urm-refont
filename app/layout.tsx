import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/components/Providers';
import { api } from '@/lib/api';

const inter = localFont({ src: './fonts/Inter.woff2', variable: '--font-inter', weight: '100 900', display: 'swap' });
const grotesk = localFont({ src: './fonts/SpaceGrotesk.woff2', variable: '--font-grotesk', weight: '300 700', display: 'swap' });

const site = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(site),
  openGraph: { siteName: 'URM ecosystem', type: 'website' },
  twitter: { card: 'summary_large_image', site: '@URMdollar' },
  title: { default: 'URM ecosystem', template: '%s | URM ecosystem' },
  description: 'A stablecoin built like a fortress, a treasury that harvests volatility, and two tokens that only get scarcer. On Base.',
  robots: process.env.NEXT_PUBLIC_PREVIEW_BANNER === '0' ? undefined : { index: false, follow: false },
};

export const revalidate = 60;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const preview = process.env.NEXT_PUBLIC_PREVIEW_BANNER !== '0';
  const live = await api('home/overview');
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body>
        {preview && <div className="preview" role="note">Preview of the new ultraroundmoney.com · live data from the contracts</div>}
        {!live && <div className="datawarn" role="status">Live data is catching up. Numbers will fill in on the next refresh, usually within a minute.</div>}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
