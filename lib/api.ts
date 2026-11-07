import 'server-only';
const BASE = 'https://api.ultraroundmoney.com/api/';

/** Fetch one endpoint of the URM API on the server, cached for 60 seconds. Returns null on failure. */
export async function api<T = any>(path: string): Promise<T | null> {
  if (process.env.URM_MOCK) {
    const fs = await import('fs');
    const p = `${process.cwd()}/mock/${path.replace(/\//g, '_')}.json`;
    try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
  }
  try {
    const r = await fetch(BASE + path, { next: { revalidate: 60 } });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}
