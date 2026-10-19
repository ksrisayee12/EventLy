// src/app/vendor/applications/page.tsx
import Link from 'next/link';
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly } from '@/lib/utils';
import { Store, Clock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VendorApplicationsPage() {
  const vendorId = '22222222-2222-2222-2222-222222222222';
  const applications = await DataService.getVendorApplications(vendorId);
  const bookings = await DataService.getVendorBookings(vendorId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Stall Applications
        </h1>
        <p className="text-sm text-slate-600">
          Track organizer reviews, decision feedback, and proceed to payment for approved stalls.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <Store className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No applications submitted yet.</h3>
          <p className="text-xs text-slate-500">Explore open events and apply for stall categories with 1-click.</p>
          <Link
            href="/events"
            className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm"
          >
            Discover Events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const booking = bookings.find((b) => b.application_id === app.id);
            const isHoldActive =
              booking &&
              booking.status === 'pending_payment' &&
              new Date(booking.hold_expires_at) > new Date();

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                      Application #{app.id.slice(0, 8)} • Applied on {formatDateOnly(app.created_at)}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                      {app.event?.title}
                    </h2>
                    <div className="text-xs text-slate-500">
                      {app.event?.venue_name}, {app.event?.city}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
                        app.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {app.status === 'approved'
                        ? 'Approved by Organizer'
                        : app.status === 'pending'
                        ? 'Pending Review'
                        : 'Application Rejected'}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 block mb-0.5">Stall Category</span>
                    <strong className="text-slate-800 text-sm">{app.stall_type?.name}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 block mb-0.5">Requested Stalls</span>
                    <strong className="text-slate-800 text-sm">{app.quantity} stall(s)</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 block mb-0.5">Approved Amount</span>
                    <strong className="text-indigo-700 text-sm">
                      {formatPaiseToINR((app.stall_type?.price_paise || 0) * app.quantity)}
                    </strong>
                  </div>
                </div>

                {/* Organizer Review Reason / Feedback */}
                {app.decision_reason && (
                  <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900">
                    <strong className="block mb-0.5 text-indigo-950 font-bold">
                      Organizer Feedback:
                    </strong>
                    {app.decision_reason}
                  </div>
                )}

                {/* Action CTA for Approved Bookings */}
                {app.status === 'approved' && booking && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Clock className="w-4 h-4 text-amber-500" />
                      {booking.status === 'confirmed' ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Paid & Confirmed
                        </span>
                      ) : isHoldActive ? (
                        <span>
                          Active Hold Expires in:{' '}
                          <strong className="text-amber-700">
                            {new Date(booking.hold_expires_at).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </strong>
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">Hold Expired</span>
                      )}
                    </div>

                    {booking.status === 'confirmed' ? (
                      <Link
                        href="/vendor/bookings"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                      >
                        View Confirmed Pass
                      </Link>
                    ) : (
                      <Link
                        href={`/vendor/bookings/${booking.id}/pay`}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                      >
                        Pay & Confirm Stall
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
