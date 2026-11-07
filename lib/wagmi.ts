import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect, mock } from 'wagmi/connectors';

/** NEXT_PUBLIC_WALLET_MOCK=1 adds a read-only demo wallet so the team can review every connected state. Never set it in production. */
export const DEMO = process.env.NEXT_PUBLIC_WALLET_MOCK === '1';
const DEMO_ADDR = '0x9E5d0dCF8A08b19064B4171bDF8CD66A6E8CA7Bb' as const;

const wc = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

export const config = createConfig({
  chains: [base],
  ssr: true,
  connectors: [
    coinbaseWallet({ appName: 'URM', preference: 'all' }),
    injected({ shimDisconnect: true }),
    ...(wc ? [walletConnect({ projectId: wc, showQrModal: true })] : []),
    ...(DEMO ? [mock({ accounts: [DEMO_ADDR], features: { reconnect: true } })] : []),
  ],
  transports: { [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC || undefined) },
});
