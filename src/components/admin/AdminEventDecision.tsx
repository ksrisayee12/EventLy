// src/components/admin/AdminEventDecision.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Loader2 } from 'lucide-react';

export function AdminEventDecision({
  eventId,
  currentStatus,
}: {
  eventId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDecision(decision: 'approved' | 'rejected') {
    setLoading(true);
    try {
      await fetch(`/api/v1/admin/events/${eventId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          reason: decision === 'approved' ? 'Verified organizer & terms' : 'Incomplete documentation',
        }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleDecision('approved')}
        disabled={loading}
        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1 cursor-pointer disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        Approve & Publish
      </button>

      <button
        onClick={() => handleDecision('rejected')}
        disabled={loading}
        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600 text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
