import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

const wc = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

export const config = createConfig({
  chains: [base],
  ssr: true,
  connectors: [
    coinbaseWallet({ appName: 'URM', preference: 'all' }),
    injected({ shimDisconnect: true }),
    ...(wc ? [walletConnect({ projectId: wc, showQrModal: true })] : []),
  ],
  transports: { [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC || undefined) },
});
