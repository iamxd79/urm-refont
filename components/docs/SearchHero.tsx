'use client';
import { useEffect, useState } from 'react';
import { openSearch } from './CommandK';
export default function SearchHero() {
  const [k, setK] = useState('Ctrl K');
  useEffect(() => { const p = (navigator as any).userAgentData?.platform || navigator.platform || ''; if (/mac|iphone|ipad/i.test(p)) setK('⌘K'); }, []);
  return (
    <button type="button" className="dhub-search glass-regular glass-rim" onClick={openSearch}>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.4" fill="none" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
      <span>Search anything: Fountain, burns, claim fee…</span><kbd>{k}</kbd>
    </button>
  );
}
