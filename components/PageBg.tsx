'use client';
import Image from 'next/image';
import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Fixed photo background behind the whole page, like an iOS wallpaper.
 * Sharp at the top; as you scroll it cross-fades to a pre-blurred, darker copy
 * so the glass content on top stays readable.
 */
export default function PageBg({ img, color, pos = '70% 50%', mpos = '70% 50%', wide, children }: { img: string; color: string; pos?: string; mpos?: string; wide?: boolean; children?: ReactNode }) {
  const blur = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const set = () => {
      raf = 0;
      const h = window.innerHeight;
      const t = Math.min(1, Math.max(0, (window.scrollY - h * 0.12) / (h * 0.55)));
      if (blur.current) blur.current.style.opacity = String(t);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(set); };
    set();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
  const blurSrc = img.replace(/\.jpg$/, '-blur.jpg');
  return (
    <div className={'pbg' + (wide ? ' pbg-wide' : '')} aria-hidden="true" style={{ ['--pbgc' as any]: color, ['--pos' as any]: pos, ['--mpos' as any]: mpos }}>
      {wide ? (
        <>
          <div className="pbg-art">
            <Image src={img} alt="" fill priority sizes="300vw" />
            {children}
          </div>
          <div className="pbg-m"><Image src={img.replace('-wide', '')} alt="" fill sizes="100vw" /></div>
          <div className="pbg-blur" ref={blur}>
            <div className="pbg-art"><Image src={blurSrc} alt="" fill sizes="300vw" /></div>
            <div className="pbg-m"><Image src={blurSrc.replace('-wide', '')} alt="" fill sizes="100vw" /></div>
          </div>
        </>
      ) : (
        <>
          <div className="pbg-layer"><Image src={img} alt="" fill priority sizes="100vw" /></div>
          {children}
          <div className="pbg-blur" ref={blur}><Image src={blurSrc} alt="" fill sizes="100vw" /></div>
        </>
      )}
    </div>
  );
}
