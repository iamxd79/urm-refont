'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from './motion/useInView';

/**
 * Earn, visualised: a phone walks through the four taps — passkey, buy USDC, swap to URM, deposit —
 * with the matching step lit beside it. Pauses off-screen and on hover; tap a step to jump.
 */
type Step = { t: string; d: string };
const MS = 3200;

export default function PhoneDemo({ steps, apy }: { steps: Step[]; apy: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, '0px');
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setVis(e.isIntersecting));
    io.observe(el); return () => io.disconnect();
  }, []);
  const run = seen && !reduced && !hold && vis;

  return (
    <div ref={ref} className="pd" data-in={seen ? '1' : undefined} onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      <div className="pd-phone" aria-hidden="true">
        <div className="pd-notch" />
        <div className="pd-screen">
          <div className="pd-strip" style={{ transform: `translateX(${-i * 25}%)` }}>
            {/* 1 passkey */}
            <section className={'pd-s' + (i === 0 ? ' on' : '')}>
              <p className="pd-h">Create wallet</p>
              <div className="pd-face"><svg viewBox="0 0 80 80" width="96"><path d="M8 24 V14 a6 6 0 0 1 6 -6 H24 M56 8 H66 a6 6 0 0 1 6 6 V24 M72 56 V66 a6 6 0 0 1 -6 6 H56 M24 72 H14 a6 6 0 0 1 -6 -6 V56" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" /><circle cx="29" cy="32" r="3.5" fill="currentColor" /><circle cx="51" cy="32" r="3.5" fill="currentColor" /><path d="M40 32 V46 h-4 M28 54 q12 10 24 0" stroke="currentColor" strokeWidth="4.5" fill="none" strokeLinecap="round" /></svg><i className="pd-scan" /></div>
              <p className="pd-ok"><span className="pd-tick">✓</span> Wallet ready</p>
              <p className="pd-m">No seed phrase</p>
              <span className="pd-btn">Continue with Face ID</span>
            </section>
            {/* 2 buy */}
            <section className={'pd-s' + (i === 1 ? ' on' : '')}>
              <p className="pd-h">Buy USDC</p>
              <p className="pd-amt">$100</p>
              <div className="pd-row"><span className="pd-dot" style={{ background: '#2775ca' }}>$</span><span>USDC on Base</span><b>99.80</b></div>
              <div className="pd-row muted"><span>Gateway fee</span><b>0.2%</b></div>
              <span className="pd-btn">Pay with card</span>
            </section>
            {/* 3 swap */}
            <section className={'pd-s' + (i === 2 ? ' on' : '')}>
              <p className="pd-h">Swap</p>
              <div className="pd-row"><span className="pd-dot" style={{ background: '#2775ca' }}>$</span><span>USDC</span><b>99.80</b></div>
              <div className="pd-swap">⇅</div>
              <div className="pd-row"><span className="pd-dot ring" /><span>URM</span><b>99.6</b></div>
              <p className="pd-m">Gas covered</p>
              <span className="pd-btn">Swap</span>
            </section>
            {/* 4 deposit */}
            <section className={'pd-s' + (i === 3 ? ' on' : '')}>
              <p className="pd-h">Fountain</p>
              <div className="pd-coin"><span className="pd-dot ring big" /></div>
              <p className="pd-ok"><span className="pd-tick">✓</span> Deposited</p>
              <div className="pd-row"><span>Target APY</span><b className="acc">{apy}</b></div>
              <p className="pd-m">Withdraw anytime</p>
            </section>
          </div>
        </div>
        <div className="pd-dots">{[0, 1, 2, 3].map((k) => <i key={k} data-on={k === i ? '1' : undefined} />)}</div>
      </div>
      <ol className="pd-steps">
        {steps.map((s, k) => (
          <li key={s.t} data-on={k === i ? '1' : undefined}>
            <button type="button" onClick={() => setI(k)} aria-current={k === i ? 'step' : undefined}>
              <span className="n">{k + 1}</span>
              <span className="pd-txt"><b>{s.t}</b><span>{s.d}</span></span>
              <i className="pd-bar">{k === i && <i key={i} style={{ animationDuration: `${MS}ms`, animationPlayState: run ? 'running' : 'paused' }} onAnimationEnd={() => setI((x) => (x + 1) % steps.length)} />}</i>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
