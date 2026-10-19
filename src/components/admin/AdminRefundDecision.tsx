// src/components/admin/AdminRefundDecision.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Loader2 } from 'lucide-react';

export function AdminRefundDecision({
  refundId,
  currentStatus,
}: {
  refundId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (currentStatus !== 'requested' && currentStatus !== 'under_review') {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
          currentStatus === 'succeeded' || currentStatus === 'approved'
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {currentStatus}
      </span>
    );
  }

  async function handleDecision(decision: 'approved' | 'rejected') {
    setLoading(true);
    try {
      await fetch(`/api/v1/admin/refunds/${refundId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          reason: decision === 'approved' ? 'Eligible per 7-day cancellation policy' : 'Policy ineligible',
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
        Authorize Refund
      </button>

      <button
        onClick={() => handleDecision('rejected')}
        disabled={loading}
        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600 text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50"
      >
        Decline
      </button>
    </div>
  );
}
