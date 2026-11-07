'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * A live flame floating in HESTIA's gaze, pinned to a point of the cover-fitted wallpaper.
 * Flickers all the time; flares and throws embers whenever the burned total goes up.
 */
type P = { burned: number; img: [number, number]; at: [number, number]; pos: [number, number]; mpos: [number, number]; size?: number };

export default function HestiaFlame({ burned, img, at, pos, mpos, size = 150 }: P) {
  const [box, setBox] = useState<{ x: number; y: number; s: number } | null>(null);
  const prev = useRef(burned);
  const [flare, setFlare] = useState(0);

  useEffect(() => {
    const place = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const [px, py] = vw <= 900 ? mpos : pos;
      const s = Math.max(vw / img[0], vh / img[1]);
      const w = img[0] * s, h = img[1] * s;
      const x = (vw - w) * px + at[0] * s, y = (vh - h) * py + at[1] * s;
      const d = Math.max(70, size * s);
      // stay clear of the headline copy and the screen edges
      const main = document.querySelector('.pho .main');
      const ink = (e: HTMLElement) => { const r = document.createRange(); r.selectNodeContents(e); return r.getBoundingClientRect(); };
      const parts = main ? [...main.querySelectorAll<HTMLElement>('h1, .lead, .row > *')].map(ink) : [];
      const right = Math.max(0, ...parts.map((r) => r.right));
      const top = Math.min(...parts.map((r) => r.top)), bottom = Math.max(...parts.map((r) => r.bottom));
      const clash = parts.length > 0 && x - d / 2 < right + 16 && y + d * 0.7 > top && y - d * 0.7 < bottom;
      const off = x - d / 2 < 8 || x + d / 2 > vw - 8;
      setBox(clash || off ? null : { x, y, s });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [img, at, pos, mpos, size]);

  useEffect(() => {
    if (burned > prev.current) setFlare((f) => f + 1);
    prev.current = burned;
  }, [burned]);

  if (!box) return null;
  const d = Math.max(70, size * box.s);
  return (
    <div className="hflame" style={{ left: box.x, top: box.y, width: d, height: d * 1.25 }} aria-hidden="true">
      <div key={flare} className={'hflame-body' + (flare ? ' flare' : '')}>
        <svg viewBox="0 0 120 150" width="100%" height="100%">
          <ellipse cx="60" cy="140" rx="30" ry="6" fill="#ff7a2e" opacity=".35" className="hf-glow" />
          <path className="hf hf1" d="M60 6 C76 34 104 52 100 92 C97 124 80 142 60 142 C40 142 22 126 20 96 C18 70 34 58 40 40 C46 56 52 60 56 62 C54 40 52 24 60 6 Z" fill="#ff3d3d" />
          <path className="hf hf2" d="M62 40 C74 60 88 74 86 100 C84 122 74 134 60 134 C46 134 36 124 35 104 C34 86 44 78 48 64 C52 74 56 78 60 80 C58 66 56 54 62 40 Z" fill="#ff7a2e" />
          <path className="hf hf3" d="M60 78 C68 92 76 100 74 114 C73 126 67 132 60 132 C53 132 47 126 46 116 C45 106 50 100 54 92 C56 98 58 100 60 102 C59 94 58 86 60 78 Z" fill="#ffb627" />
          <path d="M44 70 C40 84 40 96 44 104" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".45" />
        </svg>
        {flare > 0 && <span className="hf-embers">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ ['--i' as any]: i }} />)}</span>}
      </div>
      <span className="hf-spark s1" /><span className="hf-spark s2" /><span className="hf-spark s3" />
    </div>
  );
}
