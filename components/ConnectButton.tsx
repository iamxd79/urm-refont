'use client';
import { useAccount } from 'wagmi';
import { useConnectModal } from './Providers';
import { useEffect, useState } from 'react';

export default function ConnectButton({ label = 'Connect wallet', className = 'btn btn-primary', block = false }: { label?: string; className?: string; block?: boolean }) {
  const { open } = useConnectModal();
  const { isConnected, address } = useAccount();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const text = mounted && isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : label;
  return <button type="button" onClick={open} className={className + (block ? ' btn-block' : '')}>{text}</button>;
}
