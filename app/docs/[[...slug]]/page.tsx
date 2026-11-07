import Link from 'next/link';
import { notFound } from 'next/navigation';
import Md from '@/components/docs/Md';
import Toc from '@/components/docs/Toc';
import { allDocs, getDoc, headings } from '@/lib/docs';
import { docsVars } from '@/lib/docsVars';
import { seo } from '@/lib/seo';

export const revalidate = 60;
export const dynamicParams = false;
export function generateStaticParams() { return allDocs().map((d) => ({ slug: d.slug.length ? d.slug : undefined })); }
export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const d = getDoc(params.slug || []);
  return d ? seo({ title: d.slug.length ? `${d.title} · Docs` : 'Docs', description: d.description }) : {};
}

export default async function DocPage({ params }: { params: { slug?: string[] } }) {
  const doc = getDoc(params.slug || []);
  if (!doc) notFound();
  const vars = await docsVars();
  const all = allDocs(); const i = all.findIndex((d) => d.href === doc.href);
  const prev = all[i - 1], next = all[i + 1];
  const hs = headings(doc.body);
  return (
    <>
      <article className="dmain">
        <p className="eyebrow">{doc.section}</p>
        <h1 className="dtitle">{doc.title}</h1>
        {doc.description && <p className="dlead">{doc.description}</p>}
        <div className="dbody"><Md body={doc.body} vars={vars} /></div>
        <p className="dlive muted"><span className="live">Highlighted</span> numbers are live from the contracts, refreshed every minute.</p>
        <nav className="dpager" aria-label="Previous and next">
          {prev ? <Link href={prev.href} className="card glass-rim"><small>Previous</small><b>{prev.title}</b></Link> : <span />}
          {next ? <Link href={next.href} className="card glass-rim next"><small>Next</small><b>{next.title}</b></Link> : <span />}
        </nav>
      </article>
      <aside className="dright"><Toc items={hs} /></aside>
    </>
  );
}
