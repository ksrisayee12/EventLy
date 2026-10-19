// src/app/admin/page.tsx
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly } from '@/lib/utils';
import { AdminEventDecision } from '@/components/admin/AdminEventDecision';
import { AdminRefundDecision } from '@/components/admin/AdminRefundDecision';
import { 
  ShieldCheck, 
  RotateCcw, 
  Calendar 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const events = await DataService.getAdminEvents();
  const refunds = await DataService.getAllRefundRequests();

  const pendingEvents = events.filter((e) => e.review_status === 'pending_review');
  const pendingRefunds = refunds.filter((r) => r.status === 'requested');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Header */}
      <div className="bg-[#FFFFFF] text-[#202A35] rounded-2xl p-7 sm:p-8 border border-[#E5E0D7] shadow-curated flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
              Platform Administration
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFEAE1] text-[#202A35] border border-[#E5E0D7]">
              Compliance & Verification
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202A35] mt-1">
            Admin Verification & Dispute Center
          </h1>
          <p className="text-xs sm:text-sm text-[#747B80] mt-1">
            Review submitted organizer listings, verify business credentials, and process authorized refunds.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E5E0D7] shadow-curated space-y-2">
          <div className="flex items-center justify-between text-[#747B80]">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Event Reviews</span>
            <Calendar className="w-4 h-4 text-[#94620B]" />
          </div>
          <div className="text-3xl font-extrabold text-[#202A35]">{pendingEvents.length}</div>
          <div className="text-xs text-[#747B80]">Awaiting approval or decline</div>
        </div>

        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E5E0D7] shadow-curated space-y-2">
          <div className="flex items-center justify-between text-[#747B80]">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Refund Requests</span>
            <RotateCcw className="w-4 h-4 text-[#94620B]" />
          </div>
          <div className="text-3xl font-extrabold text-[#202A35]">{pendingRefunds.length}</div>
          <div className="text-xs text-[#747B80]">Requires policy review</div>
        </div>

        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E5E0D7] shadow-curated space-y-2">
          <div className="flex items-center justify-between text-[#747B80]">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Organizers</span>
            <ShieldCheck className="w-4 h-4 text-[#287653]" />
          </div>
          <div className="text-3xl font-extrabold text-[#202A35]">1</div>
          <div className="text-xs text-[#287653] font-semibold">Active vetted organizers</div>
        </div>
      </div>

      {/* Queue 1: Event Submissions */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated p-6 sm:p-8 space-y-5">
        <div className="border-b border-[#E5E0D7] pb-3">
          <h2 className="text-base font-bold text-[#202A35]">Exhibition Verification & Publication Queue</h2>
          <p className="text-xs text-[#747B80]">
            Only approved and published events become discoverable to vendors in the marketplace.
          </p>
        </div>

        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-5 rounded-xl border border-[#E5E0D7] bg-[#F7F5F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#202A35]">{event.title}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      event.review_status === 'approved'
                        ? 'bg-[#EFEAE1] text-[#287653] border border-[#E5E0D7]'
                        : 'bg-[#EFEAE1] text-[#94620B] border border-[#E5E0D7]'
                    }`}
                  >
                    {event.review_status}
                  </span>
                </div>
                <div className="text-xs text-[#747B80]">
                  {event.venue_name}, {event.city} • Est. Footfall: {event.expected_footfall?.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <AdminEventDecision eventId={event.id} currentStatus={event.review_status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Queue 2: Refund Requests */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated p-6 sm:p-8 space-y-5">
        <div className="border-b border-[#E5E0D7] pb-3">
          <h2 className="text-base font-bold text-[#202A35]">Vendor Refund Requests Queue</h2>
          <p className="text-xs text-[#747B80]">
            Approved refunds initiate gateway refunds back to the vendor&apos;s source account.
          </p>
        </div>

        {refunds.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#747B80]">
            No refund requests pending review.
          </div>
        ) : (
          <div className="space-y-3">
            {refunds.map((refund) => (
              <div
                key={refund.id}
                className="p-5 rounded-xl border border-[#E5E0D7] bg-[#F7F5F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="font-bold text-sm text-[#202A35]">
                    Booking #{refund.booking_id.slice(0, 8)} • Amount: {formatPaiseToINR(refund.amount_paise)}
                  </div>
                  <div className="text-xs text-[#747B80]">
                    Reason: <strong className="text-[#202A35]">{refund.reason}</strong>
                  </div>
                  <div className="text-xs text-[#747B80]">
                    Requested on {formatDateOnly(refund.created_at)}
                  </div>
                </div>

                <div>
                  <AdminRefundDecision refundId={refund.id} currentStatus={refund.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
