'use client';
import { useEffect } from 'react';

/**
 * Pauses every animated diagram while it's off screen: CSS animations via data-off,
 * SVG path motion via pauseAnimations(). Picks up diagrams added later (client navigation).
 */
const ROOTS = '.bf,.he,.cbl,.ml,.otcm,.pd,.yc,.pf,.cdps,.sw,.hring,.doc-diagram';

export default function MotionGovernor() {
  useEffect(() => {
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const el = e.target as HTMLElement;
      if (e.isIntersecting) delete el.dataset.off; else el.dataset.off = '1';
      el.querySelectorAll('svg').forEach((s) => { try { e.isIntersecting ? s.unpauseAnimations() : s.pauseAnimations(); } catch {} });
    }), { rootMargin: '120px 0px' });
    const scan = () => document.querySelectorAll(ROOTS).forEach((el) => { if (!seen.has(el)) { seen.add(el); io.observe(el); } });
    scan();
    let t = 0;
    const mo = new MutationObserver(() => { clearTimeout(t); t = window.setTimeout(scan, 150); });
    mo.observe(document.body, { childList: true, subtree: true });
    // the wallpaper is fixed, so "in view" means: still near the top of the page
    const pbg = () => document.querySelectorAll<HTMLElement>('.pbg').forEach((el) => { if (window.scrollY > window.innerHeight * 1.1) el.dataset.off = '1'; else delete el.dataset.off; });
    window.addEventListener('scroll', pbg, { passive: true }); pbg();
    return () => { io.disconnect(); mo.disconnect(); clearTimeout(t); window.removeEventListener('scroll', pbg); };
  }, []);
  return null;
}
