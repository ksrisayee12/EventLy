// src/app/admin/page.tsx
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly } from '@/lib/utils';
import { AdminEventDecision } from '@/components/admin/AdminEventDecision';
import { AdminRefundDecision } from '@/components/admin/AdminRefundDecision';
import { 
  ShieldCheck, 
  RotateCcw, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  AlertCircle 
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
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Platform Administration & Compliance
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              Admin Ops
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Admin Verification & Dispute Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Review submitted organizer listings, verify business credentials, and process authorized refunds.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Event Reviews</span>
            <Calendar className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{pendingEvents.length}</div>
          <div className="text-xs text-slate-500">Awaiting approval or rejection</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Refund Requests</span>
            <RotateCcw className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{pendingRefunds.length}</div>
          <div className="text-xs text-amber-600 font-semibold">Requires policy review</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Organizers</span>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">1</div>
          <div className="text-xs text-emerald-600 font-semibold">Active vetted organizers</div>
        </div>
      </div>

      {/* Queue 1: Event Submissions */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Event Verification & Publication Queue</h2>
            <p className="text-xs text-slate-500">
              Only approved and published events become discoverable to vendors.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{event.title}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      event.review_status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {event.review_status}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
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
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Vendor Refund Requests Queue</h2>
            <p className="text-xs text-slate-500">
              Cumulative approved refunds must not exceed captured booking payments.
            </p>
          </div>
        </div>

        {refunds.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No refund requests pending review.
          </div>
        ) : (
          <div className="space-y-4">
            {refunds.map((refund) => (
              <div
                key={refund.id}
                className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="font-bold text-sm text-slate-900">
                    Booking #{refund.booking_id.slice(0, 8)} • Amount: {formatPaiseToINR(refund.amount_paise)}
                  </div>
                  <div className="text-xs text-slate-600">
                    Reason: <strong>{refund.reason}</strong>
                  </div>
                  <div className="text-xs text-slate-400">
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
