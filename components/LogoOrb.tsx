'use client';
import { useRef } from 'react';
import ProductLogo, { NAMES } from './ProductLogo';

/** Glass medallion around the project logo. Floats gently, tilts toward the pointer. */
export default function LogoOrb({ id }: { id: string; ticker?: string; sub?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current; if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-y * 18).toFixed(1)}deg`);
    el.style.setProperty('--ry', `${(x * 18).toFixed(1)}deg`);
  };
  const leave = () => { ref.current?.style.setProperty('--rx', '0deg'); ref.current?.style.setProperty('--ry', '0deg'); };
  return (
    <div className="orbmed" onPointerMove={move} onPointerLeave={leave}>
      <div className="orbmed-tilt" ref={ref}>
        <div className="orbmed-glass">
          <ProductLogo id={id} size={76} alt={NAMES[id] ?? id} />
        </div>
      </div>
    </div>
  );
}
