// src/components/refunds/RefundForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Booking } from '@/types/database';
import { RotateCcw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatPaiseToINR } from '@/lib/utils';

export function RefundForm({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [selectedBookingId, setSelectedBookingId] = useState(bookings[0]?.id || '');
  const [reason, setReason] = useState('Medical emergency / Unforeseen circumstance');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBookingId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBookingId,
          reason,
          requestedBy: '00000000-0000-0000-0000-000000000003',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to submit refund request');

      setSuccess(true);
      setTimeout(() => router.refresh(), 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 text-center">
        No eligible confirmed bookings found to request a refund for.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
      <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
        <RotateCcw className="w-4 h-4 text-indigo-600" />
        Submit Cancellation / Refund Request
      </h3>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Refund request submitted to platform admin for policy review.</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Select Confirmed Booking
        </label>
        <select
          value={selectedBookingId}
          onChange={(e) => setSelectedBookingId(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
        >
          {bookings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.event?.title} - {b.stall_type?.name} ({formatPaiseToINR(b.total_amount_paise)})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Reason for Cancellation
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Medical emergency / Unforeseen circumstance">
            Medical emergency / Unforeseen circumstance
          </option>
          <option value="Inventory shortage or supply issue">
            Inventory shortage or supply issue
          </option>
          <option value="Event date conflict with another exhibition">
            Event date conflict with another exhibition
          </option>
          <option value="Duplicate booking submitted by mistake">
            Duplicate booking submitted by mistake
          </option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Refund Request for Review'}
      </button>
    </form>
  );
}
