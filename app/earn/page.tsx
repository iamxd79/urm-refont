import { seo } from '@/lib/seo';
import ProductLogo from '@/components/ProductLogo';
import PageBg from '@/components/PageBg';
import Link from 'next/link';
import Footer from '@/components/Footer';
import AutoRefresh from '@/components/AutoRefresh';
import ConnectButton from '@/components/ConnectButton';
import { SwapPanel } from '@/components/Panels';
import PhoneDemo from '@/components/PhoneDemo';
import { Hero } from '@/components/ui';
import { api } from '@/lib/api';
import { usd, bps, n, legacy } from '@/lib/fmt';

export const revalidate = 60;
export const metadata = seo({ title: 'Earn', description: 'From your card to onchain yield. No seed phrase, no gas. Buy USDC, swap, invest or deposit in one place.', handle: '@URMdollar' });


export default async function Earn() {
  const [h, r, f] = await Promise.all([api('home/overview'), api('rage/buying-protocol'), api('urm/fortress')]);
  const prices = { URM: n(h?.urm), RAGE: n(h?.rage), HESTIA: n(h?.hestia), ULTRAROUND: n(h?.circle) };
  const step = (i: number, title: string) => <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}><span className="n" style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 999, background: 'var(--accent)', color: 'var(--onAccent)', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 'var(--fs-body)' }}>{i}</span><h2 className="h3">{title}</h2></div>;
  return (
    <div className="page has-bg">
      <PageBg img="/hero/earn.jpg" color="#030518" pos="50% 70%" mpos="50% 40%" />
      <AutoRefresh />
      <Hero img="/hero/earn.jpg" bg="#030518" pos="50% 70%" mpos="50% 55%">
        <div className="split"><div className="main">
        <h1 className="h1">From your card<br />to <span className="acc">onchain yield.</span></h1>
        <p className="punch">No keys. No gas. Just tap and go.</p>
        <p className="lead">No seed phrase, no hardware wallet, no address to copy. Buy USDC with a card, then swap, invest or deposit in one place.</p>
        </div></div>
      </Hero>
      <section className="wrap sec">
        <h2 className="h2">Four taps.</h2>
        <p className="punch">Here&apos;s how it feels on your phone.</p>
        <PhoneDemo apy={bps(f?.fountainState?.config?.yieldRate, 0)} steps={[{ t: 'Passkey wallet', d: 'Face ID or a fingerprint. No seed phrase to write down.' }, { t: 'Buy USDC', d: 'With a card or Apple Pay. 0.2% gateway fee, shown before you confirm.' }, { t: 'Swap to URM', d: 'One tap on Base. Gas is covered for you.' }, { t: 'Deposit', d: 'Into Fountain. Withdraw anytime.' }]} />
      </section>
      <section className="wrap sec grid2">
        <div className="vstack swapcol">
          <div style={{ marginBottom: 'var(--s-4)' }}>{step(1, 'Fund your wallet')}</div>
          <div className="card glass-rim vstack fundcard">
            <ol className="fundsteps">
              <li><b>Create a passkey wallet</b><span>In seconds, with Face ID or a fingerprint. No seed phrase.</span></li>
              <li><b>Buy USDC on Base</b><span>With a bank card or Apple Pay. 0.2% gateway fee, shown before you confirm.</span></li>
              <li><b>Deposit</b><span>Gas is covered for you.</span></li>
            </ol>
            <div className="row" style={{ marginTop: 'auto', paddingTop: 'var(--s-6)' }}>
              <ConnectButton label="Create a passkey wallet" />
              <a className="btn btn-outline" href={legacy('/earn')} target="_blank" rel="noreferrer">Buy USDC with a card</a>
              <a className="btn btn-outline" href={legacy('/earn')} target="_blank" rel="noreferrer">Pay with Coinbase</a>
            </div>
          </div>
        </div>
        <div className="vstack swapcol">
          <div style={{ marginBottom: 'var(--s-4)' }}>{step(2, 'Swap')}</div>
          <SwapPanel prices={prices} fee={0.2} app={legacy('/earn')} />
        </div>
      </section>
      <section className="wrap sec">
        <div className="cream glass-rim" style={{ padding: 'var(--s-8)', display: 'flex', flexWrap: 'wrap', gap: 'var(--s-6)', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}><span style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 999, background: 'var(--ink)', color: 'var(--accent)', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 'var(--fs-body)' }}>3</span><h2 className="h3">Invest: RAGE Options</h2></div>
            <p style={{ lineHeight: 1.5, margin: '14px 0 0' }}>Buy with USDC anytime. Your gateway to locked products, with a {r?.config?.investorBonus ?? 3}% bonus on the underlying tokens.</p>
          </div>
          <a className="btn btn-ink btn-lg" href={legacy('/rage')} target="_blank" rel="noreferrer">Invest with USDC</a>
        </div>
      </section>
      <section className="wrap sec">
        <h2 className="h2">Then put it to work.</h2>
        <div className="grid" style={{ marginTop: 'var(--s-8)', gridTemplateColumns: 'repeat(auto-fit,minmax(min(200px,100%),1fr))' }}>
          {[['EARN', 'Fountain URM', `${bps(f?.fountainState?.config?.yieldRate, 0)} target APY on URM. Withdraw anytime.`, '/urm/fountain', undefined], ['MINE', 'Hestia Mine', 'Stake HESTIA, hire a crew, earn daily.', '/hestia/mine', 'hestia'], ['MINE', 'Ultraround Temple', 'Stake ULTRAROUND, summon templars.', '/ultraround/temple', 'circle'], ['LIVE', 'URM CDP', 'Borrow URM against RAGE, HESTIA or ULTRAROUND.', '/urm/cdp', undefined]].map(([k, t, d, href, th]) => (
            <Link key={t} href={href!} data-theme={th} className="card glass-rim" style={{ background: 'var(--panel)', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span className="acc" style={{ fontSize: 'var(--fs-footnote)', fontWeight: 700, letterSpacing: 1.5 }}>{k}</span><ProductLogo id={th || 'urm'} size={36} /></span><b style={{ fontSize: 'var(--fs-title3)' }}>{t}</b><span className="muted">{d}</span>
            </Link>
          ))}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)', boxShadow: 'inset 0 0 0 2px var(--line)', background: 'transparent' }}>
            <span className="muted" style={{ fontSize: 'var(--fs-footnote)', fontWeight: 700, letterSpacing: 1.5 }}>COMING NEXT</span><b style={{ fontSize: 'var(--fs-title3)' }}>Chainubi</b><span className="muted">Sponsor distributions, same gateway, same wallet.</span><a className="tap" href="https://chainubi.com">chainubi.com</a>
          </div>
        </div>
      </section>
      <section className="wrap sec" style={{ textAlign: 'center' }}>
        <p className="muted" style={{ fontSize: 'var(--fs-footnote)', fontWeight: 700, letterSpacing: 1.5, margin: 0 }}>INVESTED THROUGH THE PROTOCOL, ALL TIME</p>
        <p style={{ fontSize: 'clamp(48px,7vw,88px)', fontWeight: 800, margin: '8px 0 24px', letterSpacing: '-.03em' }}>{usd(r?.state?.totalInvest)}</p>
        <ConnectButton label="Start now" className="btn btn-primary btn-lg" />
      </section>
      <Footer />
    </div>
  );
}
