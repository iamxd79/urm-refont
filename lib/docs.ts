import fs from 'fs';
import path from 'path';

/**
 * Docs live as Markdown in /content/docs (one file per page, nested folders = nested URLs).
 * Frontmatter: title, description, section, order. Live numbers: {{key}} placeholders, filled from the API.
 */
type Doc = { slug: string[]; href: string; title: string; nav?: string; description: string; section: string; order: number; product: string; body: string };

const ROOT = path.join(process.cwd(), 'content/docs');
export const SECTIONS = ['Start here', 'Earn', 'Borrow', 'Invest', 'Under the hood', 'Reference'];

function walk(dir: string, base: string[] = []): Doc[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory()) return walk(path.join(dir, e.name), [...base, e.name]);
    if (!e.name.endsWith('.md')) return [];
    const raw = fs.readFileSync(path.join(dir, e.name), 'utf8');
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
    const meta: Record<string, string> = {};
    (m?.[1] || '').split('\n').forEach((l) => { const i = l.indexOf(':'); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
    const name = e.name.replace(/\.md$/, '');
    const slug = name === 'index' ? base : [...base, name];
    return [{ slug, href: '/docs' + (slug.length ? '/' + slug.join('/') : ''), title: meta.title || name, nav: meta.nav || undefined, description: meta.description || '', section: meta.section || 'Start here', order: Number(meta.order || 99), product: meta.product || 'eco', body: m ? raw.slice(m[0].length) : raw }];
  });
}

let cache: Doc[] | null = null;
export function allDocs(): Doc[] {
  if (cache && process.env.NODE_ENV === 'production') return cache;
  const docs = walk(ROOT).sort((a, b) => SECTIONS.indexOf(a.section) - SECTIONS.indexOf(b.section) || a.order - b.order);
  cache = docs;
  return docs;
}
export const getDoc = (slug: string[] = []) => allDocs().find((d) => d.slug.join('/') === slug.join('/'));

export type Heading = { id: string; text: string; level: 2 | 3 };
import { slugify } from './slug';
export function headings(body: string): Heading[] {
  return body.split('\n').flatMap((l) => {
    const m = l.match(/^(##|###) (.+)$/);
    return m ? [{ id: slugify(m[2]), text: m[2].replace(/[`*]/g, ''), level: m[1].length as 2 | 3 }] : [];
  });
}
/** Plain text for search. */
export const plain = (body: string) => body.replace(/\{\{[^}]+\}\}/g, '').replace(/^\s*(-|\d+\.)\s+/gm, '').replace(/[*`]/g, '').replace(/^\|[\s:|-]+\|$/gm, '').replace(/[#>|]/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ' ').trim();

/** Diagram names a doc asks for with `::diagram name`. */
export const diagramsIn = (body: string) => [...body.matchAll(/^::diagram ([\w-]+)\s*$/gm)].map((m) => m[1]);
