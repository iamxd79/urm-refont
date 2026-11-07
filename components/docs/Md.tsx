import Link from 'next/link';
import type { ReactNode } from 'react';
import { slugify } from '@/lib/slug';

/**
 * Small Markdown renderer for the docs: headings, paragraphs, lists, tables, callouts (> **Note** …),
 * code, links, bold, inline code, and {{live}} values. Kept tiny on purpose: no dependency.
 */
type Vars = Record<string, string>;

function inline(s: string, vars: Vars, k = 'i'): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\{\{([\w.]+)\}\}|\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0, m: RegExpExecArray | null, n = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const key = `${k}${n++}`;
    if (m[1]) out.push(<span key={key} className="live" title="Live from the contracts">{vars[m[1]] ?? '—'}</span>);
    else if (m[2]) out.push(<strong key={key}>{inline(m[2], vars, key)}</strong>);
    else if (m[3]) out.push(<code key={key}>{m[3]}</code>);
    else {
      const href = m[5], text = inline(m[4], vars, key);
      out.push(href.startsWith('/') && !href.endsWith('.pdf') ? <Link key={key} href={href}>{text}</Link> : <a key={key} href={href} target="_blank" rel="noreferrer">{text}</a>);
    }
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

export default function Md({ body, vars }: { body: string; vars: Vars }) {
  const lines = body.replace(/\r/g, '').split('\n');
  const out: ReactNode[] = [];
  let i = 0, k = 0;
  const key = () => 'b' + k++;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^(##|###) (.+)$/))) {
      const id = slugify(m[2]); const H = m[1] === '##' ? 'h2' : 'h3';
      out.push(<H key={key()} id={id} className="doc-h"><a href={`#${id}`} aria-hidden="true" tabIndex={-1} className="doc-anchor">#</a>{inline(m[2], vars)}</H>);
      i++; continue;
    }
    if (l.startsWith('```')) {
      const buf: string[] = []; i++;
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
      i++; out.push(<pre key={key()} className="doc-code"><code>{buf.join('\n')}</code></pre>); continue;
    }
    if (l.startsWith('>')) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) buf.push(lines[i++].replace(/^>\s?/, ''));
      const t = buf.join(' ');
      const kind = /^\*\*(Risk|Warning)/i.test(t) ? 'warn' : /^\*\*Team review/i.test(t) ? 'review' : 'note';
      out.push(<aside key={key()} className={`doc-callout ${kind}`}><p>{inline(t, vars)}</p></aside>); continue;
    }
    if (l.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) { if (!/^\|[\s:|-]+\|$/.test(lines[i])) rows.push(lines[i].split('|').slice(1, -1).map((c) => c.trim())); i++; }
      const [head, ...body2] = rows;
      out.push(
        <div key={key()} className="doc-table"><table>
          <thead><tr>{head.map((c, j) => <th key={j}>{inline(c, vars)}</th>)}</tr></thead>
          <tbody>{body2.map((r, ri) => <tr key={ri}>{r.map((c, j) => <td key={j} data-label={head[j]}>{inline(c, vars)}</td>)}</tr>)}</tbody>
        </table></div>
      ); continue;
    }
    if (/^(\d+\.|-) /.test(l)) {
      const ordered = /^\d+\./.test(l); const items: string[] = [];
      while (i < lines.length && /^(\d+\.|-) /.test(lines[i])) { items.push(lines[i].replace(/^(\d+\.|-) /, '')); i++; while (i < lines.length && /^ {2,}\S/.test(lines[i])) items[items.length - 1] += ' ' + lines[i++].trim(); }
      const L = ordered ? 'ol' : 'ul';
      out.push(<L key={key()} className="doc-list">{items.map((t, j) => <li key={j}>{inline(t, vars)}</li>)}</L>); continue;
    }
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#|>|\||```|\d+\. |- )/.test(lines[i])) buf.push(lines[i++]);
    out.push(<p key={key()}>{inline(buf.join(' '), vars)}</p>);
  }
  return <>{out}</>;
}
