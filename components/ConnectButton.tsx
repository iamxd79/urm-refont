'use client';
import { useAccount } from 'wagmi';
import { useConnectModal } from './Providers';
import { useEffect, useState } from 'react';

/** Wallet button. `compact` shows a wallet icon (or the short address once connected). */
export default function ConnectButton({ label = 'Connect wallet', className = 'btn btn-primary', block = false, compact = false }: { label?: string; className?: string; block?: boolean; compact?: boolean }) {
  const { open } = useConnectModal();
  const { isConnected, address } = useAccount();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const on = mounted && isConnected && address;
  const short = on ? `${address!.slice(0, 6)}...${address!.slice(-4)}` : '';
  if (compact) {
    return (
      <button type="button" onClick={open} className={'walletbtn' + (on ? ' on' : '')} aria-label={on ? `Wallet ${short}` : label}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M16 12.5h2M3 9h15a3 3 0 0 0-3-3H6" /></svg>
        {on && <span className="mono">{short}</span>}
      </button>
    );
  }
  return <button type="button" onClick={open} className={className + (block ? ' btn-block' : '')}>{on ? short : label}</button>;
}
