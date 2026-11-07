'use client';
import { useState } from 'react';
import { Chart, type Row, type S } from './UrmCharts';

/**
 * RAGE history from the Buying Protocol's daily snapshots (/rage/buying-protocol → charts).
 * Row: [FMV, treasury, active supply, backing per share, market price, HESTIA per RAGE, ULTRAROUND per RAGE,
 *       total invest, mintable RAGE, (counter), protocol debt, unix time]
 */
const M: { k: string; t: string; d: string; s: S[]; unit?: string; pre?: string; dec?: number; fit?: boolean }[] = [
  { k: 'Price vs FMV', t: 'Market price vs fair market value', d: 'Fair market value is the treasury divided by the active supply. When the price trades above it, the premium flows into the backing.', s: [{ label: 'Market price', color: '#ff3d3d', i: 4 }, { label: 'Fair value', color: '#e8ba67', i: 0 }], pre: '$', dec: 2, fit: true },
  { k: 'Treasury', t: 'Treasury value', d: 'The dollar value of every active asset (pHestia and pCircle) the Buying Protocol holds.', s: [{ label: 'Treasury', color: '#ff3d3d', i: 1 }], pre: '$' },
  { k: 'Backing', t: 'Backing per share', d: 'Underlying tokens behind each RAGE. It grows with premiums, yield and claim fees.', s: [{ label: 'Backing per RAGE', color: '#e8ba67', i: 3 }], dec: 4, fit: true, unit: '' },
  { k: 'HESTIA / RAGE', t: 'HESTIA per RAGE', d: 'How much HESTIA backs each RAGE.', s: [{ label: 'HESTIA per RAGE', color: '#ff7a2e', i: 5 }], dec: 2, fit: true, unit: '' },
  { k: 'ULTRAROUND / RAGE', t: 'ULTRAROUND per RAGE', d: 'How much ULTRAROUND backs each RAGE.', s: [{ label: 'ULTRAROUND per RAGE', color: '#5d93f0', i: 6 }], dec: 2, fit: true, unit: '' },
  { k: 'Active supply', t: 'Active supply', d: 'RAGE that has a claim on the backing assets.', s: [{ label: 'Active RAGE', color: '#e6cfe2', i: 2 }], unit: '' },
  { k: 'Total invest', t: 'Total invested', d: 'USDC sent through Invest to mint RageOption NFTs, all time.', s: [{ label: 'Invested', color: '#5fd39a', i: 7 }], pre: '$' },
  { k: 'Mintable', t: 'Mintable RAGE', d: 'RAGE that option holders can mint right now.', s: [{ label: 'Mintable', color: '#e8ba67', i: 8 }], unit: '' },
  { k: 'Debt', t: 'Protocol debt', d: 'Long-term USDC refunds owed to options, minus the value of their underlying assets.', s: [{ label: 'Debt', color: '#e6cfe2', i: 10 }], pre: '$' },
];

export default function RageCharts({ rows }: { rows: Row[] }) {
  const [i, setI] = useState(0);
  if (!Array.isArray(rows) || rows.length < 2) return <p className="muted">Charts are loading from the Buying Protocol. Check back in a minute.</p>;
  const sorted = [...rows].sort((a, b) => Number(a[11]) - Number(b[11]));
  const m = M[i];
  return (
    <div className="rc card glass-rim">
      <div className="rc-tabs" role="tablist" aria-label="Pick a chart">
        {M.map((x, k) => <button key={x.k} type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)}>{x.k}</button>)}
      </div>
      <div className="rc-head"><b>{m.t}</b><span>{m.d}</span></div>
      <Chart key={m.k} bare rows={sorted} ti={11} series={m.s} title={m.t} note={m.d} unit={m.unit ?? ''} pre={m.pre ?? ''} dec={m.dec ?? 0} fit={m.fit} />
    </div>
  );
}
