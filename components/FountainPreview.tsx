'use client';
import Link from 'next/link';
import { useState } from 'react';

/** Home: a compact Fountain calculator. Pick an amount, see where it lands at the target rate. */
const AMTS = [100, 1000, 10000];
const f = (v: number, d = 0) => (isFinite(v) ? v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) : '—');

export default function FountainPreview({ apy, shareRate, depositFee, withdrawFee }: { apy: number; shareRate: number; depositFee: string; withdrawFee: string }) {
  const [amt, setAmt] = useState(1000);
  const at = (m: number) => amt * (1 + (apy / 100) * (m / 12));
  const end = at(12);
  const steps = [0, 3, 6, 9, 12];
  return (
    <div className="fpv card glass-rim">
      <div className="fpv-head">
        <b className="eyebrow">Fountain calculator</b>
        <span className="pill fpv-apy">{f(apy, 0)}% target APY</span>
      </div>
      <div className="seg fpv-seg" role="group" aria-label="Amount to deposit">
        {AMTS.map((a) => <button key={a} type="button" aria-pressed={a === amt} onClick={() => setAmt(a)}>{f(a)}</button>)}
      </div>
      <p className="fpv-label">In 12 months, {f(amt)} $URM becomes</p>
      <p className="fpv-big"><span>{f(end)}</span> <small>$URM</small> <em>+{f(end - amt)}</em></p>
      <div className="fpv-bars" aria-hidden="true">
        {steps.map((m) => (
          <div key={m} className="fpv-col">
            <i style={{ ['--h' as any]: 0.35 + 0.65 * ((at(m) - amt) / Math.max(1, end - amt)) }} />
            <span>{m === 0 ? 'Now' : `${m}m`}</span>
          </div>
        ))}
      </div>
      <ul className="fpv-rows">
        <li><span>You receive</span><b>about {f(amt * shareRate, 1)} fURM</b></li>
        <li><span>Deposit / withdraw fee</span><b>{depositFee} / {withdrawFee}</b></li>
        <li><span>Withdraw</span><b>anytime, to $URM or USDC</b></li>
      </ul>
      <Link href="/urm/fountain" className="btn btn-primary btn-lg btn-block">Deposit in Fountain</Link>
      <p className="fpv-foot">Target rate, not a promise. <Link href="/risks">Read the risks</Link></p>
    </div>
  );
}
