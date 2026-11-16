import { num, ago } from '@/lib/fmt';
import type { Burn } from '@/lib/chain';

/** Latest burns by a Chaos Engine: the last five, the rest behind a toggle, and a link to the full history. */
export default function BurnFeed({ token, burns, all }: { token: string; burns: Burn[]; all: string }) {
  if (!burns.length) return null;
  const row = (b: Burn) => (
    <li key={b.tx}>
      <span className="k">{ago(b.at)}</span>
      <a href={`https://basescan.org/tx/${b.tx}`} target="_blank" rel="noreferrer" className="burn-amt"><strong>{num(b.amount, 2)} {token}</strong> <span aria-hidden>↗</span></a>
    </li>
  );
  const first = burns.slice(0, 5), rest = burns.slice(5, 20);
  return (
    <div className="card glass-rim burn-feed">
      <div className="burn-head"><b className="eyebrow">Latest burns</b><span className="muted">Burned forever, by the Chaos Engine</span></div>
      <ul className="list">{first.map(row)}</ul>
      {rest.length > 0 && (
        <details className="more"><summary>Show {rest.length} more</summary><ul className="list">{rest.map(row)}</ul></details>
      )}
      <a className="burn-all" href={all} target="_blank" rel="noreferrer">Every burn on Basescan →</a>
    </div>
  );
}
