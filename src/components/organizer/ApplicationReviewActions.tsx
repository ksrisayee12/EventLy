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
        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
          currentStatus === 'approved'
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
        <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-1.5">
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
            placeholder="Reason for rejection (e.g. Duplicate category)..."
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDecision('rejected')}
              disabled={loading}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Rejection'}
            </button>
            <button
              onClick={() => setShowRejectInput(false)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
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
            className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
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
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
