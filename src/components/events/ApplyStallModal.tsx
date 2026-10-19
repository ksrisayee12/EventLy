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
          vendorId: '22222222-2222-2222-2222-222222222222', // Demo artisan vendor Rohan Verma
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to submit application');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/vendor/applications');
      }, 1800);
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
        className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Store className="w-4 h-4" />
        Apply for a Stall Space
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-6">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Application Submitted!</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  The organizer has received your application. Once approved, a 30-minute hold will reserve your stall for payment.
                </p>
                <div className="text-xs font-semibold text-indigo-600">
                  Redirecting to your application tracker...
                </div>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    Application Form
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">Apply for Stall Space</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    No upfront payment required. You will only pay once the organizer reviews and approves your brand.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Select Stall Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Choose Stall Category
                    </label>
                    <select
                      value={selectedStallId}
                      onChange={(e) => setSelectedStallId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                    >
                      {stallTypes.map((stall) => (
                        <option key={stall.id} value={stall.id}>
                          {stall.name} ({formatPaiseToINR(stall.price_paise)}) - {stall.available_capacity ?? stall.total_capacity} slots left
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Number of Stalls
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max={selectedStall?.available_capacity || 5}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-28 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-center focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-xs text-slate-500">
                        Total amount upon approval: <strong className="text-indigo-700">{formatPaiseToINR(totalPaise)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Brand & Products Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Products to Exhibit & Brand Details
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe what items you plan to sell (e.g. Handmade ceramics, artisan clothing, packaged spices)..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
