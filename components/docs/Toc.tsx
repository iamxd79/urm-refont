'use client';
import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/docs';

/** "On this page", with the section you're reading lit up. */
export default function Toc({ items }: { items: Heading[] }) {
  const [on, setOn] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setOn(vis[0].target.id);
    }, { rootMargin: '-90px 0px -65% 0px' });
    els.forEach((e) => io.observe(e)); return () => io.disconnect();
  }, [items]);
  if (items.length < 2) return null;
  return (
    <nav className="dtoc" aria-label="On this page">
      <p className="dtree-h">On this page</p>
      <ul>{items.map((h) => <li key={h.id} className={h.level === 3 ? 'sub' : undefined}><a href={`#${h.id}`} aria-current={on === h.id ? 'location' : undefined}>{h.text}</a></li>)}</ul>
    </nav>
  );
}
