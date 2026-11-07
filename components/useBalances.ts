'use client';
import { erc20Abi } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';
import { TOKENS, CDP_NFT } from '@/lib/tokens';

const erc721 = [{ type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }], outputs: [{ type: 'uint256' }] }] as const;
const SYMS = Object.keys(TOKENS) as (keyof typeof TOKENS)[];

/** Live balances of the connected wallet, read straight from Base. */
export function useBalances() {
  const { address } = useAccount();
  const calls: any[] = [];
  for (const s of SYMS) {
    calls.push({ address: TOKENS[s], abi: erc20Abi, functionName: 'balanceOf', args: [address] });
    calls.push({ address: TOKENS[s], abi: erc20Abi, functionName: 'decimals' });
  }
  calls.push({ address: CDP_NFT, abi: erc721, functionName: 'balanceOf', args: [address] });
  const { data, isLoading } = useReadContracts({ contracts: calls, query: { enabled: !!address, refetchInterval: 30000 } });
  const out: Record<string, number | undefined> = {};
  SYMS.forEach((s, i) => {
    const bal = data?.[i * 2]?.result as bigint | undefined;
    const dec = Number(data?.[i * 2 + 1]?.result ?? 18);
    out[s] = bal === undefined ? undefined : Number(bal) / 10 ** dec;
  });
  const nft = data?.[SYMS.length * 2]?.result as bigint | undefined;
  out.CDP = nft === undefined ? undefined : Number(nft);
  return { balances: out, isLoading, address };
}
