'use client';
import { useState, type ReactNode } from 'react';

/** Shows the first `limit` rows of a table, with a button to reveal the rest. */
export default function ShowAll({ total, limit = 10, label, children }: { total: number; limit?: number; label: string; children: ReactNode }) {
  const [all, setAll] = useState(false);
  return (
    <div className={all ? 'showall all' : 'showall'} style={{ ['--limit' as any]: limit }}>
      {children}
      {total > limit && (
        <button type="button" className="btn btn-outline showall-btn" aria-expanded={all} onClick={() => setAll(!all)}>
          {all ? 'Show less' : `Show all ${total} ${label}`}
        </button>
      )}
    </div>
  );
}
