// src/components/admin/AdminEventDecision.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';

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
          reason: decision === 'approved' ? 'Verified organizer credentials & terms' : 'Incomplete documentation',
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
        Approve & Publish
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
