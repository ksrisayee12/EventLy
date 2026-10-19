// src/components/events/ApplyStallModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { EventStallType } from '@/types/database';
import { formatPaiseToINR } from '@/lib/utils';
import { Store, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function ApplyStallModal({
  eventId,
  stallTypes,
}: {
  eventId: string;
  stallTypes: EventStallType[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStallId, setSelectedStallId] = useState(stallTypes[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedStall = stallTypes.find((s) => s.id === selectedStallId);
  const totalPaise = selectedStall ? selectedStall.price_paise * quantity : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          stallTypeId: selectedStallId,
          quantity: Number(quantity),
          message,
          vendorId: '22222222-2222-2222-2222-222222222222',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to submit application');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/vendor/applications');
      }, 1600);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          setSuccess(false);
          setError(null);
        }}
        className="w-full py-3.5 bg-[#B95335] hover:bg-[#98432B] text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <Store className="w-4 h-4" />
        Apply for Stall Space
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202A35]/60 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-curated-lg border border-[#E5E0D7] relative space-y-5">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-[#747B80] hover:text-[#202A35] rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#EFEAE1] text-[#287653] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#202A35]">Application Submitted!</h3>
                <p className="text-xs text-[#747B80] leading-relaxed max-w-sm mx-auto">
                  The organizer has received your brand profile. Upon approval, an atomic 30-minute hold will reserve your space for payment.
                </p>
                <div className="text-xs font-semibold text-[#B95335]">
                  Redirecting to your application tracker...
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-[#E5E0D7] pb-3">
                  <span className="text-[11px] font-bold text-[#64786B] uppercase tracking-wider">
                    Application Details
                  </span>
                  <h3 className="text-lg font-bold text-[#202A35] mt-0.5">Apply for Stall Space</h3>
                  <p className="text-xs text-[#747B80]">
                    No upfront payment required. You will only pay once approved by the organizer.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-[#F7F5F0] border border-[#B33A3A] text-[#B33A3A] text-xs rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#202A35] mb-1">
                      Choose Stall Category
                    </label>
                    <select
                      value={selectedStallId}
                      onChange={(e) => setSelectedStallId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-xs font-medium text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
                    >
                      {stallTypes.map((stall) => (
                        <option key={stall.id} value={stall.id}>
                          {stall.name} ({formatPaiseToINR(stall.price_paise)}) - {stall.available_capacity ?? stall.total_capacity} stalls available
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#202A35] mb-1">
                      Number of Stalls
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max={selectedStall?.available_capacity || 5}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-24 px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-xs font-bold text-center text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
                      />
                      <span className="text-xs text-[#747B80]">
                        Payable upon approval: <strong className="text-[#202A35]">{formatPaiseToINR(totalPaise)}</strong>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#202A35] mb-1">
                      Products to Exhibit & Brand Details
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe items you plan to sell (e.g. handmade ceramics, apparel, packaged gourmet coffee)..."
                      className="w-full px-3 py-2 bg-[#F7F5F0] border border-[#E5E0D7] rounded-lg text-xs text-[#202A35] focus:outline-none focus:ring-1 focus:ring-[#B95335]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#B95335] hover:bg-[#98432B] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        'Submit Application for Review'
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
