'use client';
import { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useBalances } from './useBalances';

const ICON: Record<string, string> = { coinbaseWalletSDK: '/assets/coinbase.png', injected: '/assets/metamask.png', metaMask: '/assets/metamask.png', walletConnect: '/assets/walletconnect.png' };
const fmt = (v?: number, d = 2) => (v === undefined ? '…' : v.toLocaleString('en-US', { maximumFractionDigits: d }));

export default function ConnectModal({ onClose }: { onClose: () => void }) {
  const { connectors, connect, isPending, error } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { balances } = useBalances();
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);

  const label = (id: string, name: string) => (id === 'coinbaseWalletSDK' ? 'Coinbase Wallet or passkey' : id === 'injected' ? 'Browser wallet (MetaMask, Rabby…)' : name);

  return (
    <div onClick={onClose} className="scrim" style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, overflowY: 'auto' }}>
      <div className="glass sheet" style={{ ['--r' as any]: '32px', borderRadius: 32, width: 'min(860px,100%)' }} onClick={(e) => e.stopPropagation()}>
      <div role="dialog" aria-modal="true" aria-labelledby="ct" style={{ width: 'min(860px,100%)', background: '#f3f0e7', color: '#0d1b33', borderRadius: 32, display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}>
        <div style={{ flex: '1 1 380px', padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 id="ct" style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>{isConnected ? 'Your wallet' : 'Connect to URM'}</h2>
            <button aria-label="Close" onClick={onClose} style={{ width: 44, height: 44, border: 0, borderRadius: 999, background: '#e6dfd0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d1b33" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          {!isConnected ? (
            <>
              <p style={{ margin: '8px 0 0', color: '#4c6892', fontSize: 15 }}>Pick how you want to sign in.</p>
              <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {connectors.map((c, i) => (
                  <button key={c.uid} disabled={isPending} onClick={() => connect({ connector: c })}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 62, padding: '0 16px', border: `2px solid ${i === 0 ? '#0d1b33' : '#dcd4c6'}`, borderRadius: 18, background: '#fff', font: '700 16px var(--font-inter),sans-serif', color: '#0d1b33', cursor: 'pointer', textAlign: 'left' }}>
                    <img src={ICON[c.id] || c.icon || '/assets/walletconnect.png'} alt="" width={36} height={36} style={{ borderRadius: 10, border: c.id === 'injected' ? '1px solid #dcd4c6' : 0 }} />
                    <span style={{ flex: 1 }}>{label(c.id, c.name)}</span>
                    {i === 0 && <span className="pill" style={{ background: '#d7b067' }}>Best</span>}
                  </button>
                ))}
              </div>
              {error && <p role="alert" style={{ marginTop: 12, color: '#b3202a', fontSize: 14 }}>{error.message.split('\n')[0]}</p>}
            </>
          ) : (
            <>
              <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 44, height: 44, borderRadius: 999, background: '#2e7d50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
                </span>
                <div><b style={{ fontSize: 20 }}>Connected</b><div className="mono" style={{ fontSize: 14, color: '#4c6892' }}>{address?.slice(0, 6)}...{address?.slice(-4)} · Base</div></div>
              </div>
              <ul className="list" style={{ marginTop: 18, background: '#fff' }}>
                {['URM', 'fURM', 'RAGE', 'HESTIA', 'ULTRAROUND', 'USDC'].map((s) => (
                  <li key={s} style={{ borderTopColor: '#ece6da' }}><span style={{ color: '#4c6892' }}>{s}</span><strong>{fmt(balances[s])}</strong></li>
                ))}
                <li style={{ borderTopColor: '#ece6da' }}><span style={{ color: '#4c6892' }}>CDP positions</span><strong>{fmt(balances.CDP, 0)}</strong></li>
              </ul>
              <button onClick={() => disconnect()} className="btn btn-outline btn-block" style={{ marginTop: 14, color: '#0d1b33' }}>Disconnect</button>
            </>
          )}
        </div>
        <div style={{ flex: '1 1 300px', background: '#0d1b33', color: '#f3f0e7', padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <p className="punch" style={{ margin: 0, color: '#d7b067', fontSize: 26 }}>What connecting does, and doesn&apos;t.</p>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>✓ Reads your address and balances so we can show your positions.</p>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>✕ Never moves funds. Never asks for your seed phrase.</p>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>✓ For now, deposit, invest and borrow open the current URM app, where you sign as usual.</p>
          <div style={{ marginTop: 'auto', padding: 16, background: '#172a4a', borderRadius: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
            <img src="/assets/base.png" alt="" width={26} height={26} /><div><b>Network: Base</b><div style={{ fontSize: 13, color: '#b0bfd6' }}>Your wallet will switch if needed.</div></div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
