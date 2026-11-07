import ProductLogo from './ProductLogo';
import Link from 'next/link';
import { legacy } from '@/lib/fmt';

const X: Record<string, string> = { URMdollar: 'URM', therageprotocol: 'RAGE', HestiaOnBase: 'HESTIA', UltraRoundMoney: 'ULTRAROUND' };

export default function Footer({ name = 'URM ecosystem', x = 'URMdollar' }: { name?: string; x?: string }) {
  const follow = name === 'URM ecosystem' ? Object.keys(X) : [x, ...(x !== 'URMdollar' ? ['URMdollar'] : [])];
  const col = (title: string, links: ([string, string] | [string, string, string])[]) => (
    <div className="fcol">
      <b>{title}</b>
      {links.map(([l, h, logo]) => (h.startsWith('/') && !h.endsWith('.pdf') ? <Link key={l} href={h} className="flogo">{logo && <ProductLogo id={logo} size={18} />}{l}</Link> : <a key={l} href={h}>{l}</a>))}
    </div>
  );
  return (
    <>
      <footer className="foot" style={{ marginTop: 112 }}>
        <div className="wrap fgrid">
          <div style={{ flex: '1 1 240px' }}>
            <b className="flogo" style={{ fontSize: 'var(--fs-body)' }}><ProductLogo id={({ RAGE: 'rage', HESTIA: 'hestia', ULTRAROUND: 'circle', URM: 'urm' } as Record<string, string>)[name] ?? 'eco'} size={36} />{name}</b>
            <p className="muted" style={{ margin: '10px 0 0', maxWidth: 300 }}>{name === 'URM ecosystem' ? 'A community-driven ecosystem that builds stores of value on Base.' : 'Part of the URM ecosystem, built on Base.'}</p>
          </div>
          {col('PRODUCTS', [['URM', '/urm', 'urm'], ['Fountain', '/urm/fountain'], ['CDP', '/urm/cdp'], ['RAGE', '/rage', 'rage'], ['HESTIA', '/hestia', 'hestia'], ['ULTRAROUND', '/circle', 'circle'], ['Earn', '/earn']])}
          {col('SECURITY', [['Risks', '/risks'], ['URM audit', legacy('/urm/audit.pdf')], ['Contracts', '/#trust'], ['Docs', 'https://ultraroundmoney.gitbook.io/ultraroundmoney/']])}
          {col('FOLLOW', follow.map((h) => [`@${h}`, `https://x.com/${h}`] as [string, string]))}
          {col('COMMUNITY', [['Telegram', 'https://t.me/urm_ecosystem'], ['Discord', 'https://discord.gg/J3U8wNmKQa'], ['GitHub', 'https://github.com/ultraroundMoney']])}
          {col('DATA', [['Dune', 'https://dune.com/ultraround_money'], ['DefiLlama', 'https://defillama.com/protocol/urm'], ['Email', 'mailto:info@ultraroundmoney.com']])}
        </div>
        <div className="wrap" style={{ paddingBottom: 'var(--s-8)' }}><p className="muted" style={{ margin: 0, fontSize: 'var(--fs-footnote)' }}>Nothing here is financial advice. Yields are targets, not promises. Crypto can lose value.</p></div>
      </footer>
    </>
  );
}
