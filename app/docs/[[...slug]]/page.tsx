import Link from 'next/link';
import { notFound } from 'next/navigation';
import Md from '@/components/docs/Md';
import Toc from '@/components/docs/Toc';
import ThemeSetter from '@/components/docs/ThemeSetter';
import SearchHero from '@/components/docs/SearchHero';
import ProductLogo from '@/components/ProductLogo';
import { allDocs, getDoc, headings, diagramsIn, SECTIONS } from '@/lib/docs';
import { docsVars } from '@/lib/docsVars';
import { docsDiagrams } from '@/lib/docsDiagrams';
import { seo } from '@/lib/seo';

export const revalidate = 60;
export const dynamicParams = false;
export function generateStaticParams() { return allDocs().map((d) => ({ slug: d.slug.length ? d.slug : undefined })); }
export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const d = getDoc(params.slug || []);
  return d ? seo({ title: d.slug.length ? `${d.title} · Docs` : 'Docs', description: d.description }) : {};
}

const PRODUCTS = [
  { id: 'urm', theme: undefined, name: '$URM', tag: 'The ecosystem stablecoin', stat: 'urm.price', statL: 'price', href: '/docs/urm' },
  { id: 'rage', theme: 'rage', name: 'RAGE', tag: 'Backed by HESTIA and ULTRAROUND', stat: 'rage.fmv', statL: 'fair value', href: '/docs/rage' },
  { id: 'hestia', theme: 'hestia', name: 'HESTIA', tag: 'Store of value, buyer of last resort', stat: 'hestia.burnedPct', statL: 'burned', href: '/docs/hestia' },
  { id: 'circle', theme: 'circle', name: 'ULTRAROUND', tag: 'Burns on every sell, no tax', stat: 'circle.burnedPct', statL: 'burned', href: '/docs/ultraround' },
];
const TASKS: Record<string, string> = { Earn: 'Put $URM, HESTIA or ULTRAROUND to work.', Borrow: 'Mint $URM against your tokens.', Invest: 'Get RAGE at fair value or with a bonus.', 'Under the hood': 'How the peg, the burns and the loop work.' };

export default async function DocPage({ params }: { params: { slug?: string[] } }) {
  const doc = getDoc(params.slug || []);
  if (!doc) notFound();
  const [vars, diagrams] = await Promise.all([docsVars(), docsDiagrams(diagramsIn(doc.body))]);
  const all = allDocs(); const i = all.findIndex((d) => d.href === doc.href);
  const prev = all[i - 1], next = all[i + 1];
  const hs = headings(doc.body);
  const home = doc.slug.length === 0;
  return (
    <>
      <ThemeSetter product={doc.product} />
      <article className={home ? 'dmain wide' : 'dmain'}>
        {home ? (
          <>
            <header className="dhub-hero">
              <p className="eyebrow">Docs</p>
              <h1 className="dtitle big">Everything about <span className="acc">the URM ecosystem.</span></h1>
              <p className="dlead">Plain English, live numbers from the contracts, and the same diagrams you see on the site.</p>
              <SearchHero />
            </header>
            <div className="dhub-products">
              {PRODUCTS.map((p) => (
                <Link key={p.id} href={p.href} className="dhub-card glass-rim" data-theme={p.theme}>
                  <span className="dhub-logo"><ProductLogo id={p.id} size={52} /></span>
                  <b>{p.name}</b><span className="muted">{p.tag}</span>
                  <span className="dhub-stat"><strong>{vars[p.stat]}</strong> {p.statL}</span>
                </Link>
              ))}
            </div>
            <h2 className="dhub-h">What do you want to do?</h2>
            <div className="dhub-tasks">
              {SECTIONS.filter((s) => TASKS[s]).map((s) => (
                <div key={s} className="dhub-task card glass-rim">
                  <b>{s}</b><span className="muted">{TASKS[s]}</span>
                  <ul>{all.filter((d) => d.section === s).slice(0, 4).map((d) => <li key={d.href}><Link href={d.href}>{d.title}</Link></li>)}</ul>
                </div>
              ))}
            </div>
            <div className="dbody"><Md body={doc.body} vars={vars} diagrams={diagrams} /></div>
          </>
        ) : (
          <>
            <header className="dhead">
              <span className="dhead-logo"><ProductLogo id={doc.product === 'eco' ? 'eco' : doc.product} size={44} /></span>
              <div>
                <p className="dcrumb"><Link href="/docs">Docs</Link><span>/</span>{doc.section}</p>
                <h1 className="dtitle">{doc.title}</h1>
              </div>
            </header>
            {doc.description && <p className="dlead">{doc.description}</p>}
            <div className="dbody"><Md body={doc.body} vars={vars} diagrams={diagrams} /></div>
          </>
        )}
        <p className="dlive muted"><span className="live">Highlighted</span> numbers are live from the contracts, refreshed every minute.</p>
        <nav className="dpager" aria-label="Previous and next">
          {prev ? <Link href={prev.href} className="card glass-rim"><small>← {prev.section}</small><b>{prev.title}</b></Link> : <span />}
          {next ? <Link href={next.href} className="card glass-rim next"><small>{next.section} →</small><b>{next.title}</b></Link> : <span />}
        </nav>
      </article>
      {!home && <aside className="dright"><Toc items={hs} /></aside>}
    </>
  );
}
