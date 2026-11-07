import Link from 'next/link';
import Nav from '@/components/Nav';

export default function NotFound() {
  return (
    <div className="page">
      <Nav />
      <section className="wrap" style={{ padding: '120px 24px', textAlign: 'center' }}>
        <img src="/assets/urm_fortress.svg" alt="" width={200} height={200} style={{ borderRadius: 32 }} />
        <h1 className="h1" style={{ marginTop: 32 }}>This page <span className="acc">isn&apos;t here.</span></h1>
        <p className="lead" style={{ margin: '18px auto 0' }}>The link may be old. Your funds are fine, nothing moved.</p>
        <div className="row" style={{ justifyContent: 'center', marginTop: 32 }}><Link className="btn btn-primary btn-lg" href="/">Back home</Link><Link className="btn btn-outline btn-lg" href="/urm/fountain">Go to Fountain</Link></div>
      </section>
    </div>
  );
}
