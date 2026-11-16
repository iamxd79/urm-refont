'use client';
import { useEffect, useState } from 'react';
import { num, ago } from '@/lib/fmt';
import { C } from '@/lib/tokens';

type Burn = { at: string; amount: number; tx: string };
const BS = 'https://base.blockscout.com/api/v2/addresses/';

/** Latest HESTIA burns: HestiaRaged events from the Hestia Chaos Engine. */
async function hestia(): Promise<Burn[]> {
  const j = await fetch(`${BS}${C.hestiaChaos}/logs`).then((r) => r.json());
  return ((j?.items || []) as any[])
    .filter((l) => /^HestiaRaged/.test(l?.decoded?.method_call || ''))
    .map((l) => ({ at: l.block_timestamp, amount: Number(l.decoded.parameters?.[0]?.value) / 1e18, tx: l.transaction_hash }));
}
/** Latest ULTRAROUND burns: transfers from the Chaos Engine (CCTP) to the zero address. */
async function ultraround(): Promise<Burn[]> {
  const out: Burn[] = [];
  let q = '';
  for (let i = 0; i < 3 && out.length < 10; i++) {
    const j = await fetch(`${BS}${C.circleChaos}/token-transfers${q}`).then((r) => r.json());
    if (!j?.items) break;
    for (const x of j.items as any[])
      if (/^0x0+$/.test(x?.to?.hash || '') && String(x?.token?.address_hash || x?.token?.address || '').toLowerCase() === C.circle.toLowerCase())
        out.push({ at: x.timestamp, amount: Number(x.total?.value) / 1e18, tx: x.transaction_hash });
    if (!j.next_page_params) break;
    q = '?' + new URLSearchParams(Object.entries(j.next_page_params).map(([k, v]) => [k, String(v)])).toString();
  }
  return out;
}

/** Latest burns by a Chaos Engine, read in the browser: the last five, the rest behind a toggle, and a link to the full history. */
export default function BurnFeed({ token, all }: { token: 'HESTIA' | 'ULTRAROUND'; all: string }) {
  const [burns, setBurns] = useState<Burn[] | null>(null);
  useEffect(() => {
    (token === 'HESTIA' ? hestia() : ultraround())
      .then((b) => setBurns(b.filter((x) => isFinite(x.amount) && x.amount > 0)))
      .catch(() => setBurns([]));
  }, [token]);
  if (burns && !burns.length) return null;
  const row = (b: Burn) => (
    <li key={b.tx}>
      <span className="k">{ago(b.at)}</span>
      <a href={`https://basescan.org/tx/${b.tx}`} target="_blank" rel="noreferrer" className="burn-amt"><strong>{num(b.amount, 2)} {token}</strong> <span aria-hidden>↗</span></a>
    </li>
  );
  const first = (burns || []).slice(0, 5), rest = (burns || []).slice(5, 20);
  return (
    <div className="card glass-rim burn-feed">
      <div className="burn-head"><b className="eyebrow">Latest burns</b><span className="muted">Burned forever, by the Chaos Engine</span></div>
      {burns === null ? <p className="muted" style={{ margin: 0 }}>Loading the latest burns…</p> : <ul className="list">{first.map(row)}</ul>}
      {rest.length > 0 && (
        <details className="more"><summary>Show {rest.length} more</summary><ul className="list">{rest.map(row)}</ul></details>
      )}
      <a className="burn-all" href={all} target="_blank" rel="noreferrer">Every burn on Basescan →</a>
    </div>
  );
}
