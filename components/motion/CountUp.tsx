'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from './useInView';

/**
 * Counts a formatted number up from zero the first time it's seen, keeping its exact format
 * ("$811,885", "52.78%", "1.0064", "13,230 URM"). Non-numeric text renders as is.
 */
export default function CountUp({ text, ms = 1100 }: { text: string; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref);
  const reduced = useReducedMotion();
  const m = String(text).match(/^(.*?)(-?[\d,]+(?:\.\d+)?)(.*)$/);
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!m || !seen || reduced) { setOut(text); return; }
    const [, pre, numStr, post] = m;
    const target = parseFloat(numStr.replace(/,/g, ''));
    const dec = (numStr.split('.')[1] || '').length;
    const comma = numStr.includes(',') || target >= 1000;
    const fmt = (v: number) => (comma ? v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : v.toFixed(dec));
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      const e = 1 - Math.pow(1 - k, 4); // ease-out quart
      setOut(pre + fmt(target * e) + post);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, reduced, text]);
  // reserve the final width so nothing jumps while counting
  return <span ref={ref} className="countup" data-final={text}><span aria-hidden="true">{seen && !reduced ? out : text}</span><span className="sr">{text}</span></span>;
}
