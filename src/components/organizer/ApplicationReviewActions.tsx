// src/components/organizer/ApplicationReviewActions.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Loader2, AlertCircle } from 'lucide-react';

export function ApplicationReviewActions({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [reason, setReason] = useState('');

  if (currentStatus !== 'pending') {
    return (
      <span
        className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
          currentStatus === 'approved'
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
    setError(null);

    try {
      const res = await fetch(`/api/v1/applications/${applicationId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          reason: reason || (decision === 'approved' ? 'Application approved' : 'Category full'),
          decisionBy: '00000000-0000-0000-0000-000000000002',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to update decision');
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="p-2 bg-[#F7F5F0] border border-[#B33A3A] text-[#B33A3A] text-xs rounded-lg flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {showRejectInput ? (
        <div className="space-y-2">
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for declining (e.g. Category full)..."
            className="w-full px-3 py-1.5 text-xs bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B33A3A]"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDecision('rejected')}
              disabled={loading}
              className="px-3 py-1 bg-[#B33A3A] hover:bg-[#8F2E2E] text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Decline'}
            </button>
            <button
              onClick={() => setShowRejectInput(false)}
              className="px-3 py-1 bg-[#EFEAE1] text-[#202A35] text-xs font-medium rounded-lg cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDecision('approved')}
            disabled={loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#287653] hover:bg-[#1E5A3F] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                Approve & Create Hold
              </>
            )}
          </button>

          <button
            onClick={() => setShowRejectInput(true)}
            disabled={loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FFFFFF] border border-[#E5E0D7] text-[#202A35] hover:bg-[#F7F5F0] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-[#B33A3A]" />
            Decline
          </button>
        </div>
      )}
    </div>
  );
}
