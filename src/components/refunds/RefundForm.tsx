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
      <div className="p-4 bg-[#FFFFFF] border border-[#E5E0D7] rounded-xl text-xs text-[#747B80] text-center">
        No eligible confirmed bookings found to request a refund for.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] p-6 space-y-4 shadow-curated">
      <h3 className="font-bold text-sm text-[#202A35] flex items-center gap-2 border-b border-[#E5E0D7] pb-3">
        <RotateCcw className="w-4 h-4 text-[#B95335]" />
        Submit Cancellation / Refund Request
      </h3>

      {success && (
        <div className="p-3 bg-[#EFEAE1] border border-[#287653] text-[#287653] text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#287653] shrink-0" />
          <span>Refund request submitted to platform admin for policy review.</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-[#F7F5F0] border border-[#B33A3A] text-[#B33A3A] text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[#202A35] mb-1">
          Select Confirmed Booking
        </label>
        <select
          value={selectedBookingId}
          onChange={(e) => setSelectedBookingId(e.target.value)}
          className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-xs text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
        >
          {bookings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.event?.title} - {b.stall_type?.name} ({formatPaiseToINR(b.total_amount_paise)})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#202A35] mb-1">
          Reason for Cancellation
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-xs text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
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
        className="w-full py-2.5 bg-[#202A35] hover:bg-[#141A22] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Refund Request for Review'}
      </button>
    </form>
  );
}
