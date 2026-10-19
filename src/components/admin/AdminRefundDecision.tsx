// src/components/admin/AdminRefundDecision.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';

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
        className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
          currentStatus === 'succeeded' || currentStatus === 'approved'
            ? 'bg-[#EFEAE1] text-[#287653] border border-[#E5E0D7]'
            : 'bg-[#EFEAE1] text-[#B33A3A] border border-[#E5E0D7]'
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
        className="px-3 py-1.5 bg-[#287653] hover:bg-[#1E5A3F] text-white font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        Authorize Refund
      </button>

      <button
        onClick={() => handleDecision('rejected')}
        disabled={loading}
        className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E5E0D7] text-[#202A35] hover:bg-[#F7F5F0] hover:text-[#B33A3A] text-xs font-medium rounded-lg cursor-pointer disabled:opacity-50 transition-colors"
      >
        Decline
      </button>
    </div>
  );
}
