'use client';
import { useEffect, useState } from 'react';
import { num, ago } from '@/lib/fmt';
import { C } from '@/lib/tokens';

type Burn = { at: string; amount: number; tx: string; src: string };
const BS = 'https://base.blockscout.com/api/v2/tokens/';
const BURN_TO = /^0x0{40}$|^0x0{36}dead$/i;

/** Where a burn came from, from the sender's verified contract name or the method called. */
function source(x: any): string {
  const n = String(x?.from?.name || ''), m = String(x?.method || '');
  if (/smoke/i.test(m)) return 'Smoke fees';
  if (/Chaos|CCTP/i.test(n) || /rage|chaos/i.test(m)) return 'Chaos Engine';
  if (/Mine/i.test(n)) return 'Mine sell tax';
  if (/Temple/i.test(n)) return 'Temple sell tax';
  return 'Burn';
}

/** Every transfer of the token to the zero or dead address, newest first, read page by page in the browser. */
async function load(token: string, onPage: (b: Burn[]) => void) {
  const out: Burn[] = [];
  let q = '';
  for (let i = 0; i < 6 && out.length < 20; i++) {
    const j = await fetch(`${BS}${token}/transfers${q}`).then((r) => r.json());
    if (!j?.items) break;
    for (const x of j.items as any[])
      if (BURN_TO.test(x?.to?.hash || '')) out.push({ at: x.timestamp, amount: Number(x.total?.value) / 1e18, tx: x.transaction_hash, src: source(x) });
    onPage(out.filter((b) => isFinite(b.amount) && b.amount > 0));
    if (!j.next_page_params) break;
    q = '?' + new URLSearchParams(Object.entries(j.next_page_params).map(([k, v]) => [k, String(v)])).toString();
  }
}

/** Latest burns of HESTIA or ULTRAROUND from every source: the last five, the rest behind a toggle, and a link to the full history. */
export default function BurnFeed({ token, all }: { token: 'HESTIA' | 'ULTRAROUND'; all: string }) {
  const [burns, setBurns] = useState<Burn[] | null>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    load(token === 'HESTIA' ? C.hestia : C.circle, (b) => setBurns([...b]))
      .catch(() => {})
      .finally(() => setDone(true));
  }, [token]);
  if (done && (!burns || !burns.length)) return null;
  const row = (b: Burn, i: number) => (
    <li key={b.tx + i}>
      <span className="k">{ago(b.at)} · {b.src}</span>
      <a href={`https://basescan.org/tx/${b.tx}`} target="_blank" rel="noreferrer" className="burn-amt"><strong>{num(b.amount, 2)} {token}</strong> <span aria-hidden>↗</span></a>
    </li>
  );
  const list = burns || [];
  const first = list.slice(0, 5), rest = list.slice(5, 20);
  return (
    <div className="card glass-rim burn-feed">
      <div className="burn-head"><b className="eyebrow">Latest burns</b><span className="muted">Sent to the burn address, gone for good</span></div>
      {!list.length ? <p className="muted" style={{ margin: 0 }}>Loading the latest burns…</p> : <ul className="list">{first.map(row)}</ul>}
      {rest.length > 0 && (
        <details className="more"><summary>Show {rest.length} more</summary><ul className="list">{rest.map((b, i) => row(b, i + 5))}</ul></details>
      )}
      <a className="burn-all" href={all} target="_blank" rel="noreferrer">Every burn on Basescan →</a>
    </div>
  );
}
