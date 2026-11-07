import { scan } from '@/lib/tokens';
export type Link = { label: string; href: string; strong?: boolean };
export default function Check({ title = 'Check it yourself.', note, links }: { title?: string; note?: React.ReactNode; links: Link[] }) {
  return (
    <section className="wrap sec">
      <div className="cream glass-rim" style={{ padding: 'var(--s-10)' }}>
        <h2 className="h2" style={{ fontSize: 'clamp(30px,3.6vw,44px)' }}>{title}</h2>
        {note && <p className="muted" style={{ margin: '8px 0 0' }}>{note}</p>}
        <div className="row" style={{ marginTop: 'var(--s-6)', gap: 'var(--s-3)' }}>
          {links.map((l) => <a key={l.href + l.label} href={l.href} className={'chip ' + (l.strong ? 'chip-ink' : 'chip-line')}>{l.label}</a>)}
        </div>
      </div>
    </section>
  );
}
export const addr = (label: string, a: string, token = false): Link => ({ label: `${label} ${a.slice(0, 6)}...${a.slice(-4)}`, href: scan(a, token) });
