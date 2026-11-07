'use client';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import ConnectButton from './ConnectButton';
import { useBalances } from './useBalances';

type P = { depositShares: number; redeemAssets: number; toAssets: number; yieldRate: number; depositFee: number; withdrawFee: number; windowRemaining: number; app: string };
const f = (v: number, d = 1) => (isFinite(v) ? v.toLocaleString('en-US', { maximumFractionDigits: d }) : '—');

export default function FountainPanel(p: P) {
  const [wd, setWd] = useState(false);
  const [amt, setAmt] = useState('1000');
  const { isConnected } = useAccount();
  const { balances } = useBalances();
  const a = Number(amt.replace(/,/g, '')) || 0;
  const bal = wd ? balances.fURM : balances.URM;
  return (
    <div className="cream glass" style={{ padding: 24 }}>
      <div className="seg" role="tablist" aria-label="Fountain action">
        <button role="tab" aria-selected={!wd} onClick={() => setWd(false)}>Deposit</button>
        <button role="tab" aria-selected={wd} onClick={() => setWd(true)}>Withdraw</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label htmlFor="famt" className="label">{wd ? 'You withdraw' : 'You deposit'}</label>
        <span className="muted" style={{ fontSize: 13 }}>Balance: {isConnected && bal !== undefined ? f(bal, 2) : '—'} {wd ? 'fURM' : 'URM'}</span>
      </div>
      <div className="field">
        <input id="famt" inputMode="decimal" value={amt} onChange={(e) => setAmt(e.target.value.replace(/[^0-9.,]/g, ''))} />
        {isConnected && bal !== undefined && <button type="button" onClick={() => setAmt(String(Math.floor(bal * 100) / 100))} style={{ minHeight: 36, padding: '0 12px', border: 0, borderRadius: 999, background: 'var(--soft)', font: '700 13px var(--font-inter)', cursor: 'pointer' }}>MAX</button>}
        <span className="unit">{wd ? 'fURM' : 'URM'}</span>
      </div>
      <ul className="list" style={{ marginTop: 16 }}>
        {!wd ? (
          <>
            <li><span className="k">You receive</span><strong>about {f(a * p.depositShares)} fURM</strong></li>
            <li><span className="k">In 12 months, at target</span><strong>about {f(a * (1 + p.yieldRate / 100), 0)} URM</strong></li>
            <li><span className="k">Deposit fee</span><strong>{f(p.depositFee, 2)}%</strong></li>
          </>
        ) : (
          <>
            <li><span className="k">You receive</span><strong>about {f(a * p.redeemAssets)} URM</strong></li>
            <li><span className="k">Withdraw to</span><strong>URM or USDC</strong></li>
            <li><span className="k">Withdraw fee</span><strong>{f(p.withdrawFee, 2)}%</strong></li>
            <li><span className="k">Withdrawable right now</span><strong>{f(p.windowRemaining, 0)} URM</strong></li>
          </>
        )}
      </ul>
      {isConnected && balances.fURM !== undefined && (
        <ul className="list" style={{ marginTop: 12 }}>
          <li><span className="k">Your fURM</span><strong>{f(balances.fURM, 2)}</strong></li>
          <li><span className="k">Worth today</span><strong>{f((balances.fURM || 0) * p.toAssets, 2)} URM</strong></li>
        </ul>
      )}
      <p style={{ margin: '14px 0 0', fontSize: 14, lineHeight: 1.5, background: 'var(--soft)', borderRadius: 16, padding: '12px 14px' }}>
        <b>What you sign:</b> {wd ? 'one withdraw. URM or USDC comes back to your wallet.' : 'one approval for URM, then one deposit. fURM comes back to your wallet.'} Nothing else.
      </p>
      <div style={{ marginTop: 14 }}>
        {isConnected
          ? <a className="btn btn-ink btn-lg btn-block" href={p.app} target="_blank" rel="noreferrer">{wd ? 'Withdraw' : 'Deposit'} in the current app</a>
          : <ConnectButton block className="btn btn-ink btn-lg" label={wd ? 'Connect wallet to withdraw' : 'Connect wallet to deposit'} />}
      </div>
      <p className="muted" style={{ fontSize: 13, textAlign: 'center', margin: '12px 0 0' }}>Target rate, not a promise. <a href="/risks" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Read the risks</a></p>
    </div>
  );
}
