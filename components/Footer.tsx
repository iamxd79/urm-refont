import Link from 'next/link';

export default function Footer({ name = 'URM', x = 'URMdollar' }: { name?: string; x?: string }) {
  return (
    <>
      <div className="strip" style={{ marginTop: 112 }}>
        <Link href="/urm"><img src="/assets/urm_fortress.svg" alt="URM" /></Link>
        <Link href="/rage"><img src="/assets/rage_stack.svg" alt="RAGE" /></Link>
        <Link href="/hestia"><img src="/assets/hestia_fire.svg" alt="HESTIA" /></Link>
        <Link href="/circle"><img src="/assets/ultraround_temple.svg" alt="ULTRAROUND" /></Link>
      </div>
      <footer className="foot">
        <div className="wrap" style={{ padding: '48px 24px', display: 'flex', flexWrap: 'wrap', gap: '24px 48px', fontSize: 15 }}>
          <div style={{ flex: '1 1 240px' }}>
            <b style={{ fontSize: 18 }}>{name}</b>
            <p className="muted" style={{ margin: '10px 0 0', maxWidth: 300 }}>Part of the URM ecosystem. Built on Base.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <b className="muted" style={{ fontSize: 13, letterSpacing: 1.5 }}>FOLLOW</b>
            <a href={`https://x.com/${x}`} style={{ color: 'var(--text)' }}>@{x}</a>
            {x !== 'URMdollar' && <a href="https://x.com/URMdollar" style={{ color: 'var(--text)' }}>@URMdollar</a>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <b className="muted" style={{ fontSize: 13, letterSpacing: 1.5 }}>COMMUNITY</b>
            <a href="https://t.me/urm_ecosystem" style={{ color: 'var(--text)' }}>Telegram</a>
            <a href="https://discord.gg/J3U8wNmKQa" style={{ color: 'var(--text)' }}>Discord</a>
            <a href="https://github.com/ultraroundMoney" style={{ color: 'var(--text)' }}>GitHub</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <b className="muted" style={{ fontSize: 13, letterSpacing: 1.5 }}>DATA</b>
            <a href="https://dune.com/ultraround_money" style={{ color: 'var(--text)' }}>Dune</a>
            <a href="https://ultraroundmoney.gitbook.io/ultraroundmoney/" style={{ color: 'var(--text)' }}>Docs</a>
            <a href="mailto:info@ultraroundmoney.com" style={{ color: 'var(--text)' }}>Email</a>
          </div>
        </div>
      </footer>
    </>
  );
}
