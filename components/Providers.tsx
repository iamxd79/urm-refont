'use client';
import { createContext, useContext, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';
import ConnectModal from './ConnectModal';

const Ctx = createContext<{ open: () => void }>({ open: () => {} });
export const useConnectModal = () => useContext(Ctx);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  const [show, setShow] = useState(false);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={qc}>
        <Ctx.Provider value={{ open: () => setShow(true) }}>
          {children}
          {show && <ConnectModal onClose={() => setShow(false)} />}
        </Ctx.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
