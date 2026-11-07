'use client';
import { useEffect, useState, type RefObject } from 'react';

/** True once the element has scrolled into view (fires once). */
export function useInView(ref: RefObject<Element>, margin = '0px 0px -12% 0px') {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el || seen) return;
    if (!('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, seen]);
  return seen;
}

/** Respect the system "reduce motion" setting. */
export function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(m.matches);
    const on = () => setR(m.matches);
    m.addEventListener?.('change', on);
    return () => m.removeEventListener?.('change', on);
  }, []);
  return r;
}

/** Matches a media query after mount (undefined during SSR, so both layouts can render until we know). */
export function useMedia(q: string) {
  const [m, setM] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    const mq = window.matchMedia(q); setM(mq.matches);
    const on = () => setM(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, [q]);
  return m;
}
