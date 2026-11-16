import 'server-only';
import { C } from './tokens';

const BS = 'https://base.blockscout.com';
const HOUR = 3600;

async function get(url: string, ms = 9000): Promise<any | null> {
  try {
    const r = await fetch(url, { next: { revalidate: HOUR }, signal: AbortSignal.timeout(ms) });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

/* ---------- Mine and Temple settings ---------- */
export type MineConfig = { burnTax: number; referral: number; buyBonus: number; sellPenalty: number; sellLimit: number; live: boolean };

// keccak256("ConfigChanged(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)")
const CONFIG_TOPIC = '0x2069ffb0ebc50f7bf3a40533ce7e74d117aea54e518b48a800186107578e076b';
// last values set onchain (Mine block 50,406,619 / Temple block 50,406,631), used if the explorer is down
const FALLBACK: MineConfig = { burnTax: 5, referral: 5, buyBonus: 5, sellPenalty: 2, sellLimit: 5, live: false };

/** Current fee and bonus settings of the Hestia Mine or Ultraround Temple, read from their last ConfigChanged event. */
export async function mineConfig(which: 'mine' | 'temple'): Promise<MineConfig> {
  const a = which === 'mine' ? C.mine : C.temple;
  const j = await get(`${BS}/api?module=logs&action=getLogs&address=${a}&fromBlock=0&toBlock=latest&topic0=${CONFIG_TOPIC}`);
  const last = Array.isArray(j?.result) ? j.result[j.result.length - 1] : null;
  if (!last?.data) return FALLBACK;
  const w = (last.data as string).slice(2).match(/.{64}/g)?.map((h) => Number(BigInt('0x' + h))) || [];
  if (w.length < 5) return FALLBACK;
  return { burnTax: w[0], referral: w[1], buyBonus: w[2], sellPenalty: w[3], sellLimit: w[4], live: true };
}

/* ---------- Recent burns by the Chaos Engines ---------- */
export type Burn = { at: string; amount: number; tx: string };

/** Latest HESTIA burns: HestiaRaged events from the Hestia Chaos Engine. */
async function hestiaBurns(): Promise<Burn[]> {
  const j = await get(`${BS}/api/v2/addresses/${C.hestiaChaos}/logs`);
  return ((j?.items || []) as any[])
    .filter((l) => /^HestiaRaged/.test(l?.decoded?.method_call || ''))
    .map((l) => ({ at: l.block_timestamp, amount: Number(l.decoded.parameters?.[0]?.value) / 1e18, tx: l.transaction_hash }))
    .filter((b) => isFinite(b.amount) && b.amount > 0);
}

/** Latest ULTRAROUND burns: transfers from the Chaos Engine (CCTP) to the zero address. */
async function ultraroundBurns(): Promise<Burn[]> {
  const out: Burn[] = [];
  let q = '';
  for (let i = 0; i < 3 && out.length < 10; i++) {
    const j = await get(`${BS}/api/v2/addresses/${C.circleChaos}/token-transfers${q}`, 12000);
    if (!j?.items) break;
    for (const x of j.items as any[]) {
      if (/^0x0+$/.test(x?.to?.hash || '') && String(x?.token?.address_hash || x?.token?.address || '').toLowerCase() === C.circle.toLowerCase())
        out.push({ at: x.timestamp, amount: Number(x.total?.value) / 1e18, tx: x.transaction_hash });
    }
    if (!j.next_page_params) break;
    q = '?' + new URLSearchParams(Object.entries(j.next_page_params).map(([k, v]) => [k, String(v)])).toString();
  }
  return out;
}

export async function recentBurns(token: 'HESTIA' | 'ULTRAROUND'): Promise<Burn[]> {
  return (token === 'HESTIA' ? hestiaBurns() : ultraroundBurns()).catch(() => []);
}
