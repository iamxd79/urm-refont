/** Flat single-colour line chart, server-rendered SVG. */
export default function Sparkline({ values, color = 'var(--accent)', height = 200, label }: { values: number[]; color?: string; height?: number; label: string }) {
  const v = values.filter((x) => isFinite(x));
  if (v.length < 2) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="muted">No chart data yet</div>;
  const min = Math.min(...v), max = Math.max(...v), W = 600, H = height, pad = 8;
  const pts = v.map((x, i) => `${(i / (v.length - 1)) * (W - pad * 2) + pad},${H - pad - ((x - min) / (max - min || 1)) * (H - pad * 2)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={label} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
