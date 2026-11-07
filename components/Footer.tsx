import Link from 'next/link';
import { legacy } from '@/lib/fmt';

const X: Record<string, string> = { URMdollar: 'URM', therageprotocol: 'RAGE', HestiaOnBase: 'HESTIA', UltraRoundMoney: 'ULTRAROUND' };

export default function Footer({ name = 'URM', x = 'URMdollar' }: { name?: string; x?: string }) {
  const follow = name === 'URM' ? Object.keys(X) : [x, ...(x !== 'URMdollar' ? ['URMdollar'] : [])];
  const col = (title: string, links: [string, string][]) => (
    <div className="fcol">
      <b>{title}</b>
      {links.map(([l, h]) => (h.startsWith('/') && !h.endsWith('.pdf') ? <Link key={l} href={h}>{l}</Link> : <a key={l} href={h}>{l}</a>))}
    </div>
  );
  return (
    <>
      <div className="strip" style={{ marginTop: 112 }}>
        <Link href="/urm"><img src="/assets/urm_fortress.svg" alt="URM" /></Link>
        <Link href="/rage"><img src="/assets/rage_stack.svg" alt="RAGE" /></Link>
        <Link href="/hestia"><img src="/assets/hestia_fire.svg" alt="HESTIA" /></Link>
        <Link href="/circle"><img src="/assets/ultraround_temple.svg" alt="ULTRAROUND" /></Link>
      </div>
      <footer className="foot">
        <div className="wrap fgrid">
          <div style={{ flex: '1 1 240px' }}>
            <b style={{ fontSize: 18 }}>{name}</b>
            <p className="muted" style={{ margin: '10px 0 0', maxWidth: 300 }}>Onchain money that works while you sleep. Part of the URM ecosystem, built on Base.</p>
          </div>
          {col('PRODUCTS', [['URM', '/urm'], ['Fountain', '/urm/fountain'], ['CDP', '/urm/cdp'], ['RAGE', '/rage'], ['HESTIA', '/hestia'], ['ULTRAROUND', '/circle'], ['Earn', '/earn']])}
          {col('SECURITY', [['Risks', '/risks'], ['URM audit', legacy('/urm/audit.pdf')], ['Contracts', '/#trust'], ['Docs', 'https://ultraroundmoney.gitbook.io/ultraroundmoney/']])}
          {col('FOLLOW', follow.map((h) => [`@${h}`, `https://x.com/${h}`] as [string, string]))}
          {col('COMMUNITY', [['Telegram', 'https://t.me/urm_ecosystem'], ['Discord', 'https://discord.gg/J3U8wNmKQa'], ['GitHub', 'https://github.com/ultraroundMoney']])}
          {col('DATA', [['Dune', 'https://dune.com/ultraround_money'], ['DefiLlama', 'https://defillama.com/protocol/urm'], ['Email', 'mailto:info@ultraroundmoney.com']])}
        </div>
        <div className="wrap" style={{ paddingBottom: 32 }}><p className="muted" style={{ margin: 0, fontSize: 13 }}>Nothing here is financial advice. Yields are targets, not promises. Crypto can lose value.</p></div>
      </footer>
    </>
  );
}
