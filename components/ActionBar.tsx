'use client';
import { useEffect, useState } from 'react';

/**
 * Phones only: the page's main action, one tap away at the bottom of the screen.
 * Tapping it scrolls to the action panel. It hides while that panel (or the footer) is on screen.
 */
export default function ActionBar({ label, target = '#act', note }: { label: string; target?: string; note?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const panel = document.querySelector(target);
    const foot = document.querySelector('footer');
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => seen.set(e.target, e.isIntersecting));
      setShow(![...seen.values()].some(Boolean) && window.scrollY > 40);
    });
    [panel, foot].forEach((el) => el && io.observe(el));
    const on = () => setShow(![...seen.values()].some(Boolean) && window.scrollY > 40);
    window.addEventListener('scroll', on, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', on); };
  }, [target]);
  const go = () => {
    const el = document.querySelector(target) as HTMLElement | null; if (!el) return;
    el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => (el.querySelector('input,button') as HTMLElement | null)?.focus({ preventScroll: true }), 500);
  };
  return (
    <div className="abar glass-regular glass-rim" data-show={show ? '1' : undefined} aria-hidden={!show}>
      {note && <span className="abar-note">{note}</span>}
      <button type="button" className="btn btn-primary" onClick={go} tabIndex={show ? 0 : -1}>{label}</button>
    </div>
  );
}
