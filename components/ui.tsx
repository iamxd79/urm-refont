import type { ReactNode } from 'react';

export function Hero({ img, alt, children }: { img: string; alt: string; children: ReactNode }) {
  return (
    <>
      <div className="scene"><img src={img} alt={alt} /></div>
      <section className="wrap hero-over"><div className="hero-block">{children}</div></section>
    </>
  );
}
export function Steps({ items }: { items: { t?: string; d: string }[] }) {
  return (
    <div className="steps">
      {items.map((s, i) => (
        <div key={i} className="step"><span className="n">{i + 1}</span>{s.t && <h3>{s.t}</h3>}<p style={s.t ? undefined : { color: 'var(--text)', marginTop: 14, fontSize: 17 }}>{s.d}</p></div>
      ))}
    </div>
  );
}
export function Stats({ items }: { items: { v: ReactNode; l: string; c?: string }[] }) {
  return (
    <section className="band"><div className="wrap stats">
      {items.map((s) => <div key={s.l} className="stat"><b style={s.c ? { color: s.c } : undefined}>{s.v}</b><span>{s.l}</span></div>)}
    </div></section>
  );
}
export function Tiles({ items }: { items: { v: ReactNode; l: string }[] }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(170px,100%),1fr))', gap: 12 }}>
      {items.map((s) => <div key={s.l} className="tile"><b>{s.v}</b><span>{s.l}</span></div>)}
    </div>
  );
}
/** Plain stacked bar with a legend. Solid colours only. */
export function SupplyBar({ parts }: { parts: { label: string; value: number; color: string }[] }) {
  const total = parts.reduce((a, p) => a + (isFinite(p.value) ? p.value : 0), 0) || 1;
  return (
    <>
      <div className="bar" role="img" aria-label={parts.map((p) => `${p.label} ${Math.round(p.value).toLocaleString('en-US')}`).join(', ')} style={{ height: 22, gap: 3 }}>
        {parts.map((p) => <div key={p.label} style={{ width: `${(p.value / total) * 100}%`, background: p.color }} />)}
      </div>
      <div className="legend">{parts.map((p) => <span key={p.label}><i style={{ background: p.color }} />{p.label} <b>{Math.round(p.value).toLocaleString('en-US')}</b></span>)}</div>
    </>
  );
}
export function Faq({ items }: { items: [string, string][] }) {
  return (
    <div className="faq card" style={{ padding: 0, marginTop: 32 }}>
      {items.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
    </div>
  );
}
