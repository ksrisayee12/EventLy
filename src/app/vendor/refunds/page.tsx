// src/app/vendor/refunds/page.tsx
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly } from '@/lib/utils';
import { RefundForm } from '@/components/refunds/RefundForm';
import { RotateCcw, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VendorRefundsPage() {
  const vendorId = '22222222-2222-2222-2222-222222222222';
  const bookings = await DataService.getVendorBookings(vendorId);
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const allRefunds = await DataService.getAllRefundRequests();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cancellation & Refund Center
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review cancellation policies, submit refund requests for eligible bookings, and track admin review statuses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Submit Request */}
        <div className="md:col-span-1 space-y-4">
          <RefundForm bookings={confirmedBookings} />

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-2">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
              Standard Refund Policy:
            </span>
            <p>
              Cancellations requested 7+ days prior to event start are eligible for an 80% refund subject to admin review. Less than 48 hours is non-refundable.
            </p>
          </div>
        </div>

        {/* Right Column: Refund Requests History */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Your Refund Requests</h2>

          {allRefunds.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
              No refund requests submitted.
            </div>
          ) : (
            <div className="space-y-3">
              {allRefunds.map((refund) => (
                <div
                  key={refund.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-slate-900">
                      Request #{refund.id.slice(0, 8)}
                    </div>
                    <div className="text-xs text-slate-500">
                      Reason: <span className="text-slate-800">{refund.reason}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Requested on {formatDateOnly(refund.created_at)}
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-slate-100 sm:pl-4">
                    <div className="font-bold text-sm text-slate-900">
                      {formatPaiseToINR(refund.amount_paise)}
                    </div>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        refund.status === 'succeeded' || refund.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : refund.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {refund.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
