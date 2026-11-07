'use client';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import ConnectButton from './ConnectButton';
import { useBalances } from './useBalances';

const f = (v: number, d = 1) => (isFinite(v) ? v.toLocaleString('en-US', { maximumFractionDigits: d }) : '—');
const parse = (s: string) => Number(s.replace(/,/g, '')) || 0;

function Amount({ id, label, value, set, unit, bal }: { id: string; label: string; value: string; set: (s: string) => void; unit: string; bal?: number }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label htmlFor={id} className="label">{label}</label>
        <span className="muted" style={{ fontSize: 'var(--fs-footnote)' }}>Balance: {bal !== undefined ? f(bal, 2) : '—'} {unit}</span>
      </div>
      <div className="field">
        <input id={id} inputMode="decimal" value={value} onChange={(e) => set(e.target.value.replace(/[^0-9.,]/g, ''))} />
        {bal !== undefined && <button type="button" onClick={() => set(String(Math.floor(bal * 100) / 100))} className="max">MAX</button>}
        <span className="unit">{unit}</span>
      </div>
    </>
  );
}

function Tabs<T extends string>({ items, value, set, label }: { items: T[]; value: T; set: (v: T) => void; label: string }) {
  return (
    <div className="seg" role="tablist" aria-label={label}>
      {items.map((i) => <button key={i} role="tab" aria-selected={value === i} onClick={() => set(i)}>{i}</button>)}
    </div>
  );
}

function Cta({ href, label, connectLabel }: { href: string; label: string; connectLabel: string }) {
  const { isConnected } = useAccount();
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return (
    <div style={{ marginTop: 18 }}>
      {m && isConnected
        ? <a className="btn btn-ink btn-lg btn-block" href={href} target="_blank" rel="noreferrer">{label}</a>
        : <ConnectButton block className="btn btn-ink btn-lg" label={connectLabel} />}
    </div>
  );
}

/* ---------- Rage OTC ---------- */
export function OtcPanel({ prices, fmv, bonus, app }: { prices: Record<string, number>; fmv: number; bonus: number; app: string }) {
  const [tok, setTok] = useState<'HESTIA' | 'ULTRAROUND' | 'URM'>('HESTIA');
  const [amt, setAmt] = useState('500');
  const { balances } = useBalances();
  const value = parse(amt) * (prices[tok] || 0);
  const fair = value / fmv;
  const extra = fair * (bonus / 100);
  return (
    <div className="cream glass-rim" style={{ padding: 24 }}>
      <p className="muted" style={{ margin: '0 0 8px 6px', fontSize: 'var(--fs-subhead)', fontWeight: 600 }}>Pay with</p>
      <Tabs items={['HESTIA', 'ULTRAROUND', 'URM'] as const as any} value={tok} set={setTok as any} label="Pay with" />
      <Amount id="otc" label="You pay" value={amt} set={setAmt} unit={tok} bal={balances[tok]} />
      <ul className="list" style={{ marginTop: 16 }}>
        <li><span className="k">Value</span><strong>${f(value, 2)}</strong></li>
        <li><span className="k">Fair price</span><strong>{f(fair, 2)} RAGE</strong></li>
        <li><span className="k">Bonus right now</span><strong>+{f(extra, 2)} RAGE ({f(bonus, 2)}%)</strong></li>
        <li><span className="k">You receive</span><strong>about {f(fair + extra, 2)} RAGE</strong></li>
      </ul>
      <Cta href={app} label="Trade in the current app" connectLabel="Connect wallet to trade" />
    </div>
  );
}

/* ---------- URM CDP ---------- */
type Col = { symbol: string; price: number; min: number; max: number };
export function CdpPanel({ cols, rate, app }: { cols: Col[]; rate: number; app: string }) {
  const [mode, setMode] = useState<'Borrow' | 'Leverage'>('Borrow');
  const [sym, setSym] = useState(cols[0]?.symbol || 'RAGE');
  const [amt, setAmt] = useState('100');
  const { balances } = useBalances();
  const c = cols.find((x) => x.symbol === sym) || cols[0];
  const value = parse(amt) * (c?.price || 0);
  const key = sym === 'CIRCLE' || sym === 'ULTRAROUND' ? 'ULTRAROUND' : sym;
  return (
    <div className="cream glass-rim" style={{ padding: 24 }}>
      <Tabs items={['Borrow', 'Leverage'] as any} value={mode} set={setMode as any} label="CDP mode" />
      <p className="muted" style={{ margin: '18px 0 8px 6px', fontSize: 'var(--fs-subhead)', fontWeight: 600 }}>Collateral</p>
      <Tabs items={cols.map((x) => x.symbol) as any} value={sym} set={setSym as any} label="Collateral" />
      <Amount id="cdp" label="You lock" value={amt} set={setAmt} unit={sym} bal={balances[key]} />
      <ul className="list" style={{ marginTop: 16 }}>
        <li><span className="k">Collateral value</span><strong>${f(value, 2)}</strong></li>
        <li><span className="k">Collateral ratio</span><strong>{c ? `${c.min}x to ${c.max}x` : '—'}</strong></li>
        <li><span className="k">Interest</span><strong>{f(rate, 2)}% a year</strong></li>
        <li><span className="k">You receive</span><strong>{mode === 'Borrow' ? 'URM + a position NFT' : `more ${sym} + a position NFT`}</strong></li>
      </ul>
      <p style={{ margin: '14px 0 0', fontSize: 'var(--fs-subhead)', lineHeight: 1.5, background: 'var(--soft)', borderRadius: 'var(--r-sm)', padding: '12px 14px' }}>
        <b>Know the cost.</b> Use the CDP for liquidity without selling, not as a yield loop. The exact URM you mint shows in the app before you sign.
      </p>
      <Cta href={app} label={`${mode} in the current app`} connectLabel={`Connect wallet to ${mode.toLowerCase()}`} />
      <p className="muted" style={{ fontSize: 'var(--fs-footnote)', textAlign: 'center', margin: '12px 0 0' }}><a href="/risks" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Read the risks</a> before you borrow.</p>
    </div>
  );
}

/* ---------- Hestia Mine / Ultraround Temple ---------- */
export function MinerPanel({ token, balKey, unit, verbs, perOne, dailyPerOne, sellLimit, app, connectLabel }: { token: string; balKey: string; unit: string; verbs: [string, string, string]; perOne: number; dailyPerOne: number; sellLimit: number; app: string; connectLabel: string }) {
  const [tab, setTab] = useState(verbs[0]);
  const [amt, setAmt] = useState(String(Math.round(perOne / 5)));
  const { balances } = useBalances();
  const share = parse(amt) / perOne;
  return (
    <div className="cream glass-rim" style={{ padding: 24 }}>
      <Tabs items={verbs as any} value={tab} set={setTab as any} label={`${token} action`} />
      {tab === verbs[0] ? (
        <>
          <Amount id="mine" label="You spend" value={amt} set={setAmt} unit={token} bal={balances[balKey]} />
          <ul className="list" style={{ marginTop: 16 }}>
            <li><span className="k">Your share of {unit}</span><strong>about {f(share, 2)}%</strong></li>
            <li><span className="k">Daily rewards today</span><strong>about {f(share * dailyPerOne, 2)} {token}</strong></li>
            <li><span className="k">Sell limit</span><strong>{f(sellLimit, 0)} {token}</strong></li>
          </ul>
        </>
      ) : (
        <ul className="list" style={{ marginTop: 16 }}>
          {tab === verbs[1]
            ? <><li><span className="k">What it does</span><strong>Turns rewards into more {unit}</strong></li><li><span className="k">Why</span><strong>Active players take share</strong></li></>
            : <><li><span className="k">What it does</span><strong>Cashes out rewards</strong></li><li><span className="k">Sell limit right now</span><strong>{f(sellLimit, 0)} {token}</strong></li></>}
        </ul>
      )}
      <Cta href={app} label={`${tab} in the current app`} connectLabel={connectLabel} />
      <p className="muted" style={{ fontSize: 'var(--fs-footnote)', textAlign: 'center', margin: '12px 0 0' }}>Rewards change as more players join. Figures update live. <a href="/risks" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Read the risks</a></p>
    </div>
  );
}

/* ---------- Earn swap ---------- */
export function SwapPanel({ prices, fee, app }: { prices: Record<string, number>; fee: number; app: string }) {
  const [to, setTo] = useState<'URM' | 'RAGE' | 'HESTIA' | 'ULTRAROUND'>('URM');
  const [amt, setAmt] = useState('100');
  const { balances } = useBalances();
  const out = (parse(amt) * (1 - fee / 100)) / (prices[to] || NaN);
  return (
    <div className="cream glass-rim" style={{ padding: 24 }}>
      <Amount id="swap" label="You pay" value={amt} set={setAmt} unit="USDC" bal={balances.USDC} />
      <p className="muted" style={{ margin: '18px 0 8px 6px', fontSize: 'var(--fs-subhead)', fontWeight: 600 }}>You receive</p>
      <Tabs items={['URM', 'RAGE', 'HESTIA', 'ULTRAROUND'] as any} value={to} set={setTo as any} label="Receive token" />
      <ul className="list" style={{ marginTop: 16 }}>
        <li><span className="k">Estimated output</span><strong>about {f(out, 2)} {to}</strong></li>
        <li><span className="k">Route</span><strong>USDC → Gateway → {to}</strong></li>
        <li><span className="k">Gateway fee</span><strong>{fee}%</strong></li>
        <li><span className="k">Network</span><strong>Base</strong></li>
      </ul>
      <Cta href={app} label="Swap in the current app" connectLabel="Connect wallet to swap" />
    </div>
  );
}

/* ---------- Referral link ---------- */
export function RefLink({ rows }: { rows: { addr: string; invested: string; unpaid: string; paid: string }[] }) {
  const { address, isConnected } = useAccount();
  const [m, setM] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => setM(true), []);
  const on = m && isConnected && address;
  const link = on ? `ultraroundmoney.com/rage?ref=${address}` : 'ultraroundmoney.com/rage?ref=0x…';
  const me = on ? rows.find((r) => r.addr.toLowerCase() === address!.toLowerCase()) : undefined;
  return (
    <div className="cream glass-rim" style={{ padding: 28 }}>
      <h2 className="h3">Your referral link</h2>
      <p className="muted" style={{ margin: '6px 0 0' }}>{on ? 'Share it anywhere. Investments through it count for you.' : 'Connect to get your link, then share it anywhere.'}</p>
      <div className="field" style={{ marginTop: 16 }}>
        <span className="mono" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--fs-subhead)' }}>{link}</span>
        <button type="button" className="max" disabled={!on} onClick={() => { navigator.clipboard?.writeText('https://' + link); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <div className="grid" style={{ marginTop: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10 }}>
        <div className="tile"><span>Invested through you</span><b>{me ? '$' + me.invested : '—'}</b></div>
        <div className="tile"><span>Unpaid commission</span><b>{me ? '$' + me.unpaid : '—'}</b></div>
        <div className="tile"><span>Paid so far</span><b>{me ? '$' + me.paid : '—'}</b></div>
      </div>
      {!on && <div style={{ marginTop: 18 }}><ConnectButton block className="btn btn-ink btn-lg" label="Connect and become a referrer" /></div>}
    </div>
  );
}

/* ---------- Your position strip (any page) ---------- */
export function YourPosition({ items }: { items: { label: string; key: string; unit?: string; mult?: number }[] }) {
  const { balances, isLoading } = useBalances();
  const { isConnected } = useAccount();
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  const on = m && isConnected;
  return (
    <div className="card glass-rim">
      <b className="eyebrow">YOUR POSITION</b>
      {!on && <p className="muted" style={{ margin: '8px 0 0' }}>Connect your wallet to see your balances here. Read only, nothing moves.</p>}
      <div className="grid" style={{ marginTop: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10 }}>
        {items.map((i) => {
          const v = balances[i.key];
          return <div key={i.label} className="tile" style={{ background: 'var(--bg)' }}><span>{i.label}</span><b>{on && v !== undefined ? f(v * (i.mult ?? 1), 2) : on && isLoading ? '…' : '—'}{i.unit ? <small style={{ fontSize: 'var(--fs-subhead)', marginLeft: 6 }}>{i.unit}</small> : null}</b></div>;
        })}
      </div>
      {!on && <div style={{ marginTop: 14 }}><ConnectButton /></div>}
    </div>
  );
}
