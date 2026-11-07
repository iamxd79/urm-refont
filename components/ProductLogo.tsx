/** The real project logos. URM is drawn as SVG so it stays crisp at any size. */
const SRC: Record<string, string> = { rage: '/assets/rage.png', hestia: '/assets/hestia.png', circle: '/assets/ultraround.png' };
export const NAMES: Record<string, string> = { urm: 'URM', rage: 'RAGE', hestia: 'HESTIA', circle: 'ULTRAROUND' };

export default function ProductLogo({ id, size = 24, alt = '' }: { id: string; size?: number; alt?: string }) {
  if (id === 'urm' || id === 'earn') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className="plogo">
        <circle cx="50" cy="50" r="50" fill="#0d1b33" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="#b0bfd6" strokeWidth="7" />
        <circle cx="50" cy="50" r="21" fill="none" stroke="#b0bfd6" strokeWidth="7.4" />
        <circle cx="50" cy="50" r="12.5" fill="#f1ebdd" />
      </svg>
    );
  }
  return <img className="plogo" src={SRC[id]} alt={alt} width={size} height={size} />;
}

/** Logo + name + ticker, shown above each product page title. */
export function Brand({ id, ticker, sub }: { id: string; ticker?: string; sub?: string }) {
  return (
    <div className="brand-badge">
      <ProductLogo id={id} size={56} />
      <div>
        <b>{NAMES[id] ?? id}</b>
        {(ticker || sub) && <span>{ticker && <em>{ticker}</em>}{sub}</span>}
      </div>
    </div>
  );
}
