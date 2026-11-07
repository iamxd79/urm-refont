'use client';
import { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { useBalances } from './useBalances';

/**
 * Fountain, visualised: the Fortress drips yield into the vault.
 * Your fURM count never moves; its URM value ticks up every 100ms at the real on-chain pace
 * (interest per day spread over all fURM shares).
 */
type P = { toAssets: number; interestPerDay: number; totalShares: number; yieldRate: number };
const CHIPS = [100, 1000, 10000];
const f = (v: number, d: number) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export default function YieldCounter({ toAssets, interestPerDay, totalShares, yieldRate }: P) {
  const { isConnected } = useAccount();
  const { balances } = useBalances();
  const mine = isConnected && balances.fURM ? balances.fURM : 0;
  const [amt, setAmt] = useState(1000);
  const [useMine, setUseMine] = useState(false);
  const shares = useMine && mine ? mine : amt;
  const perSharePerSec = totalShares > 0 ? interestPerDay / totalShares / 86400 : 0;
  const big = useRef<HTMLSpanElement>(null);
  const tail = useRef<HTMLSpanElement>(null);
  const today = useRef<HTMLElement>(null);
  const live = Number.isFinite(toAssets) && perSharePerSec > 0;

  useEffect(() => {
    if (!live) return;
    const t0 = Date.now();
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const draw = () => {
      const now = Date.now();
      const v = shares * (toAssets + perSharePerSec * ((now - t0) / 1000));
      const s = f(v, 6);
      if (big.current) big.current.textContent = s.slice(0, -4);
      if (tail.current) tail.current.textContent = s.slice(-4);
      const midnight = new Date(); midnight.setUTCHours(0, 0, 0, 0);
      if (today.current) today.current.textContent = '+' + f(shares * perSharePerSec * ((now - midnight.getTime()) / 1000), 4);
    };
    draw();
    if (still) return;
    const id = setInterval(draw, 100);
    return () => clearInterval(id);
  }, [shares, toAssets, perSharePerSec, live]);

  const yearPace = shares * (interestPerDay / Math.max(totalShares, 1)) * 365;

  return (
    <div className="yc">
      <div className="yc-art" aria-hidden="true">
        <svg viewBox="0 0 320 340" width="100%" height="100%">
          {/* the Fortress */}
          <g transform="translate(110 18)">
            <rect x="0" y="22" width="100" height="62" rx="6" fill="#b0bfd6" />
            <rect x="0" y="10" width="16" height="16" rx="3" fill="#b0bfd6" /><rect x="28" y="10" width="16" height="16" rx="3" fill="#b0bfd6" /><rect x="56" y="10" width="16" height="16" rx="3" fill="#b0bfd6" /><rect x="84" y="10" width="16" height="16" rx="3" fill="#b0bfd6" />
            <path d="M38 84 V58 a12 12 0 0 1 24 0 V84 Z" fill="#0d1b33" />
            <circle cx="50" cy="68" r="7" fill="none" stroke="#d7b067" strokeWidth="3" />
            <rect x="0" y="22" width="100" height="3" fill="#ffffff" opacity=".55" />
          </g>
          {/* pipe */}
          <rect x="155" y="102" width="10" height="44" rx="5" fill="#172a4a" stroke="rgba(255,255,255,.25)" />
          {/* drops: each one is a slice of today's payout */}
          <g className="yc-drops">
            <circle className="yc-drop" cx="160" cy="150" r="6" fill="#d7b067" />
            <circle className="yc-drop d2" cx="160" cy="150" r="5" fill="#d7b067" />
            <circle className="yc-drop d3" cx="160" cy="150" r="4" fill="#d7b067" />
          </g>
          {/* the vault: glass vessel */}
          <rect x="62" y="178" width="196" height="146" rx="32" fill="#0d1b33" />
          <clipPath id="ycv"><rect x="62" y="178" width="196" height="146" rx="32" /></clipPath>
          <g clipPath="url(#ycv)">
            <rect x="40" y="226" width="240" height="120" fill="#172a4a" />
            <path className="yc-wave" d="M0 226 q25 -10 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V346 H0 Z" fill="#23385c" />
            <path className="yc-wave w2" d="M0 232 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V346 H0 Z" fill="#1d3358" />
            {/* fURM coin floating in the vault */}
            <g className="yc-coin">
              <circle cx="160" cy="262" r="38" fill="#0d1b33" stroke="#d7b067" strokeWidth="3" />
              <circle cx="160" cy="262" r="27" fill="none" stroke="#b0bfd6" strokeWidth="5.5" />
              <circle cx="160" cy="262" r="16" fill="none" stroke="#b0bfd6" strokeWidth="5.8" />
              <circle cx="160" cy="262" r="9.5" fill="#f1ebdd" />
            </g>
          </g>
          {/* glass rim + specular edge */}
          <rect x="62" y="178" width="196" height="146" rx="32" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="3" />
          <path d="M96 182 H224" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity=".7" />
        </svg>
      </div>
      <div className="yc-copy">
        <span className="eyebrow">If you hold</span>
        <div className="row" style={{ marginTop: 'var(--s-3)', gap: 'var(--s-2)' }} role="group" aria-label="Amount of fURM">
          {CHIPS.map((c) => (
            <button key={c} type="button" className="ycchip" aria-pressed={!useMine && amt === c} onClick={() => { setUseMine(false); setAmt(c); }}>{c.toLocaleString('en-US')} fURM</button>
          ))}
          {mine > 0 && <button type="button" className="ycchip" aria-pressed={useMine} onClick={() => setUseMine(true)}>Mine · {f(mine, 2)}</button>}
        </div>
        <div className="yc-row">
          <span className="muted">fURM in your wallet</span>
          <b>{f(shares, 2)}</b>
          <span className="muted yc-note">stays the same</span>
        </div>
        <div className="yc-row">
          <span className="muted">Worth right now</span>
          <b className="yc-big" aria-live="off">
            {live ? <><span ref={big}>{f(shares * toAssets, 6).slice(0, -4)}</span><span ref={tail} className="acc">{f(shares * toAssets, 6).slice(-4)}</span></> : '—'}
            <small> URM</small>
          </b>
          <span className="muted yc-note">ticking up, live</span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 'var(--s-3)', marginTop: 'var(--s-4)' }}>
          <div className="tile"><span>Earned today, so far</span><b className="acc" ref={today}>—</b></div>
          <div className="tile"><span>At today&apos;s pace, a year</span><b>{live ? '+' + f(yearPace, 2) : '—'}</b></div>
        </div>
        <p className="muted" style={{ fontSize: 'var(--fs-footnote)', margin: '14px 0 0' }}>
          The Fortress pays {f(interestPerDay, 2)} URM a day across {f(totalShares, 0)} fURM. Target {f(yieldRate, 0)}% a year, not a promise.
        </p>
      </div>
    </div>
  );
}
