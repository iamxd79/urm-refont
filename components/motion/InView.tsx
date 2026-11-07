'use client';
import { useRef, type ReactNode, type CSSProperties } from 'react';
import { useInView } from './useInView';

/** Wrapper that flips data-in="1" once scrolled into view, so CSS can play entrance motion. */
export default function InView({ children, className, style, as: Tag = 'div' }: { children: ReactNode; className?: string; style?: CSSProperties; as?: any }) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref as any);
  return <Tag ref={ref} className={'iv ' + (className || '')} style={style} data-in={seen ? '1' : undefined}>{children}</Tag>;
}
