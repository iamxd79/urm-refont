import type { Metadata } from 'next';

/** Per-page share metadata: Open Graph (Facebook, LinkedIn, Telegram, Discord, WhatsApp, Slack) and X cards.
 *  The card image itself comes from the opengraph-image.png / twitter-image.png next to each page. */
export function seo({ title, description, handle = '@URMdollar' }: { title: string; description: string; handle?: string }): Metadata {
  const full = `${title} | URM ecosystem`;
  return {
    title,
    description,
    openGraph: { title: full, description, siteName: 'URM ecosystem', type: 'website', locale: 'en_US' },
    twitter: { card: 'summary_large_image', title: full, description, site: '@URMdollar', creator: handle },
  };
}
