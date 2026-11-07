import type { ReactNode } from 'react';
import DocsNav from '@/components/docs/DocsNav';
import Footer from '@/components/Footer';
import { allDocs, headings, plain } from '@/lib/docs';

export default function DocsLayout({ children }: { children: ReactNode }) {
  const items = allDocs().map((d) => ({ href: d.href, title: d.title, nav: d.nav, section: d.section, product: d.product, text: plain(d.body).slice(0, 4000), heads: headings(d.body).map((h) => h.text) }));
  return (
    <div className="page docs">
      <div className="wrap dgrid">
        <DocsNav items={items} />
        {children}
      </div>
      <Footer />
    </div>
  );
}
