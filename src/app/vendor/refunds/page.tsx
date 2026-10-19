// src/app/vendor/refunds/page.tsx
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly } from '@/lib/utils';
import { RefundForm } from '@/components/refunds/RefundForm';
import { ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VendorRefundsPage() {
  const vendorId = '22222222-2222-2222-2222-222222222222';
  const bookings = await DataService.getVendorBookings(vendorId);
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const allRefunds = await DataService.getAllRefundRequests();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#E5E0D7] pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
          Policy & Disputes
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202A35] tracking-tight mt-0.5">
          Cancellation & Refund Center
        </h1>
        <p className="text-sm text-[#747B80]">
          Review cancellation policies, submit refund requests for eligible bookings, and track admin review outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Submit Request */}
        <div className="md:col-span-1 space-y-4">
          <RefundForm bookings={confirmedBookings} />

          <div className="p-4 bg-[#FFFFFF] border border-[#E5E0D7] rounded-xl text-xs text-[#747B80] space-y-2 shadow-curated">
            <span className="font-bold text-[#202A35] flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-[#B95335]" />
              Standard Refund Policy:
            </span>
            <p className="leading-relaxed">
              Cancellations requested 7+ days prior to exhibition start are eligible for an 80% refund subject to admin review. Less than 48 hours is non-refundable.
            </p>
          </div>
        </div>

        {/* Right Column: Refund Requests History */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-[#202A35]">Your Submitted Refund Requests</h2>

          {allRefunds.length === 0 ? (
            <div className="p-8 text-center bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] text-xs text-[#747B80] shadow-curated">
              No refund requests submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {allRefunds.map((refund) => (
                <div
                  key={refund.id}
                  className="p-5 bg-[#FFFFFF] rounded-xl border border-[#E5E0D7] shadow-curated flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-[#202A35]">
                      Request #{refund.id.slice(0, 8)}
                    </div>
                    <div className="text-xs text-[#747B80]">
                      Reason: <span className="text-[#202A35] font-medium">{refund.reason}</span>
                    </div>
                    <div className="text-xs text-[#747B80]">
                      Requested on {formatDateOnly(refund.created_at)}
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-[#E5E0D7] sm:pl-4">
                    <div className="font-bold text-sm text-[#202A35]">
                      {formatPaiseToINR(refund.amount_paise)}
                    </div>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                        refund.status === 'succeeded' || refund.status === 'approved'
                          ? 'bg-[#EFEAE1] text-[#287653] border border-[#E5E0D7]'
                          : refund.status === 'rejected'
                          ? 'bg-[#EFEAE1] text-[#B33A3A] border border-[#E5E0D7]'
                          : 'bg-[#EFEAE1] text-[#94620B] border border-[#E5E0D7]'
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
