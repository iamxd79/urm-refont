'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from './motion/useInView';
import ProductLogo from './ProductLogo';

/**
 * Earn, visualised: an iPhone (titanium frame, Dynamic Island, iOS status bar) walks through the four taps —
 * passkey, buy USDC, swap to $URM, deposit — with the matching step lit beside it.
 * Pauses off-screen and on hover; tap a step to jump. Solid colours only, no gradients.
 */
type Step = { t: string; d: string };
const MS = 3600;

const Usdc = ({ s = 28 }: { s?: number }) => <img src="/assets/usdc.svg" width={s} height={s} alt="" className="ip-tok" />;
const Urm = ({ s = 28 }: { s?: number }) => <ProductLogo id="urm" size={s} />;

function StatusBar() {
  return (
    <div className="ip-status">
      <span className="ip-time">9:41</span>
      <span className="ip-icons">
        <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" aria-hidden><path d="M7.5 2.2c2.1 0 4 .8 5.4 2.1l1.1-1.1A9.2 9.2 0 0 0 7.5.6 9.2 9.2 0 0 0 1 3.2l1.1 1.1a7.7 7.7 0 0 1 5.4-2.1Zm0 3.1c1.2 0 2.4.5 3.2 1.3l1.1-1.1a6.1 6.1 0 0 0-8.6 0l1.1 1.1c.8-.8 2-1.3 3.2-1.3Zm0 3.1c.4 0 .8.2 1.1.5L7.5 10 6.4 8.9c.3-.3.7-.5 1.1-.5Z" /></svg>
        <span className="ip-batt"><i /></span>
      </span>
    </div>
  );
}

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
      <div className="ip" aria-hidden="true">
        <i className="ip-btn ip-action" /><i className="ip-btn ip-volup" /><i className="ip-btn ip-voldn" /><i className="ip-btn ip-power" /><i className="ip-btn ip-cam" />
        <div className="ip-glass">
          <div className="ip-screen">
            <StatusBar />
            <div className="ip-island"><span className="ip-lens" /></div>
            <div className="pd-strip" style={{ transform: `translateX(${-i * 25}%)` }}>
              {/* 1 passkey */}
              <section className={'pd-s' + (i === 0 ? ' on' : '')}>
                <div className="ip-nav"><Urm s={26} /><b>URM</b></div>
                <h4 className="ip-title">Create your wallet</h4>
                <p className="ip-sub">Secured by Face ID. No seed phrase to write down.</p>
                <div className="ip-hud">
                  <svg className="ip-faceid" viewBox="0 0 80 80" width="64" aria-hidden><path d="M8 24 V14 a6 6 0 0 1 6 -6 H24 M56 8 H66 a6 6 0 0 1 6 6 V24 M72 56 V66 a6 6 0 0 1 -6 6 H56 M24 72 H14 a6 6 0 0 1 -6 -6 V56" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" /><circle cx="29" cy="32" r="3.5" fill="currentColor" /><circle cx="51" cy="32" r="3.5" fill="currentColor" /><path d="M40 32 V46 h-4 M28 54 q12 10 24 0" stroke="currentColor" strokeWidth="4.5" fill="none" strokeLinecap="round" /></svg>
                  <svg className="ip-done" viewBox="0 0 80 80" width="64" aria-hidden><circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="5" /><path d="M24 41 l11 11 l22 -24" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span>Face ID</span>
                </div>
                <span className="ip-cta">Continue with Face ID</span>
              </section>
              {/* 2 buy */}
              <section className={'pd-s' + (i === 1 ? ' on' : '')}>
                <div className="ip-nav"><span className="ip-back">‹</span><b>Buy USDC</b></div>
                <p className="ip-amt">$100</p>
                <p className="ip-get"><Usdc s={18} /> You get <b>99.80 USDC</b></p>
                <div className="ip-card">
                  <div className="ip-li"><span>Pay with</span><b><span className="ip-cardchip" />Card •••• 4242</b></div>
                  <div className="ip-li"><span>Network</span><b>Base</b></div>
                  <div className="ip-li"><span>Gateway fee</span><b>0.2%</b></div>
                </div>
                <span className="ip-cta">Buy USDC</span>
              </section>
              {/* 3 swap */}
              <section className={'pd-s' + (i === 2 ? ' on' : '')}>
                <div className="ip-nav"><span className="ip-back">‹</span><b>Swap</b></div>
                <div className="ip-swapbox">
                  <div className="ip-tokrow"><div><span className="ip-lbl">You pay</span><b className="ip-big">99.80</b></div><span className="ip-pill"><Usdc s={22} />USDC</span></div>
                  <span className="ip-flip">↓</span>
                  <div className="ip-tokrow"><div><span className="ip-lbl">You receive</span><b className="ip-big">99.60</b></div><span className="ip-pill"><Urm s={22} />$URM</span></div>
                </div>
                <div className="ip-card">
                  <div className="ip-li"><span>Rate</span><b>1 USDC = 0.998 $URM</b></div>
                  <div className="ip-li"><span>Network fee</span><b className="ip-ok">Covered</b></div>
                </div>
                <span className="ip-cta">Swap</span>
              </section>
              {/* 4 deposit */}
              <section className={'pd-s' + (i === 3 ? ' on' : '')}>
                <div className="ip-toast"><span className="ip-tick">✓</span><div><b>Deposited</b><span>99.60 $URM in Fountain</span></div></div>
                <div className="ip-nav"><Urm s={26} /><b>Fountain</b></div>
                <div className="ip-bal"><span className="ip-lbl">Your balance</span><b>99.60 <small>$URM</small></b><span className="ip-apy">{apy} target APY</span></div>
                <div className="ip-card">
                  <div className="ip-li"><span>Earning</span><b>every block</b></div>
                  <div className="ip-li"><span>Withdraw</span><b>anytime</b></div>
                </div>
                <span className="ip-cta ip-cta-ghost">Withdraw</span>
              </section>
            </div>
            <span className="ip-home" />
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
