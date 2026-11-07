export const n = (v: any) => (v === null || v === undefined || v === '' ? NaN : Number(v));
export function num(v: any, d = 0) {
  const x = n(v);
  if (!isFinite(x)) return '—';
  return x.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}
export const usd = (v: any, d = 0) => (isFinite(n(v)) ? '$' + num(v, d) : '—');
export const pct = (v: any, d = 2) => (isFinite(n(v)) ? num(v, d) + '%' : '—');
/** Basis-point style numbers from the API (e.g. "1657" = 16.57%). */
export const bps = (v: any, d = 2) => (isFinite(n(v)) ? pct(n(v) / 100, d) : '—');
export function ago(date: any) {
  const t = typeof date === 'number' ? date * 1000 : Date.parse(date);
  if (!isFinite(t)) return '—';
  const s = Math.max(0, (Date.now() - t) / 1000);
  const units: [number, string][] = [[31536000, 'year'], [2592000, 'month'], [86400, 'day'], [3600, 'hour'], [60, 'minute']];
  for (const [sec, name] of units) if (s >= sec) { const k = Math.floor(s / sec); return `${k} ${name}${k > 1 ? 's' : ''} ago`; }
  return 'just now';
}
export const short = (a?: string) => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '');
export const legacy = (path: string) => (process.env.NEXT_PUBLIC_LEGACY_APP_URL || 'https://ultraroundmoney.com') + path;
