// src/app/vendor/applications/page.tsx
import Link from 'next/link';
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly } from '@/lib/utils';
import { Store, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VendorApplicationsPage() {
  const vendorId = '22222222-2222-2222-2222-222222222222';
  const applications = await DataService.getVendorApplications(vendorId);
  const bookings = await DataService.getVendorBookings(vendorId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#E5E0D7] pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
          Application Management
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202A35] tracking-tight mt-0.5">
          My Stall Applications
        </h1>
        <p className="text-sm text-[#747B80]">
          Track organizer reviews, decision feedback, and proceed to payment for approved stall spaces.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] p-8 space-y-4">
          <Store className="w-12 h-12 text-[#747B80] mx-auto" />
          <h3 className="text-base font-bold text-[#202A35]">No applications submitted yet.</h3>
          <p className="text-xs text-[#747B80]">Browse open exhibitions and apply for stall categories with zero upfront fee.</p>
          <Link
            href="/events"
            className="inline-block px-5 py-2.5 bg-[#B95335] text-white font-semibold text-xs rounded-lg"
          >
            Discover Exhibitions
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {applications.map((app) => {
            const booking = bookings.find((b) => b.application_id === app.id);
            const isHoldActive =
              booking &&
              booking.status === 'pending_payment' &&
              new Date(booking.hold_expires_at) > new Date();

            return (
              <div
                key={app.id}
                className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated p-6 sm:p-7 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D7] pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64786B]">
                      Application #{app.id.slice(0, 8)} • Applied on {formatDateOnly(app.created_at)}
                    </span>
                    <h2 className="text-xl font-bold text-[#202A35] mt-0.5">
                      {app.event?.title}
                    </h2>
                    <div className="text-xs text-[#747B80]">
                      {app.event?.venue_name}, {app.event?.city}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${
                        app.status === 'approved'
                          ? 'bg-[#EFEAE1] text-[#287653] border border-[#E5E0D7]'
                          : app.status === 'pending'
                          ? 'bg-[#EFEAE1] text-[#94620B] border border-[#E5E0D7]'
                          : 'bg-[#EFEAE1] text-[#B33A3A] border border-[#E5E0D7]'
                      }`}
                    >
                      {app.status === 'approved'
                        ? 'Approved by Organizer'
                        : app.status === 'pending'
                        ? 'Under Organizer Review'
                        : 'Application Declined'}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 bg-[#F7F5F0] rounded-xl border border-[#E5E0D7]">
                    <span className="text-[#747B80] block mb-0.5">Stall Category</span>
                    <strong className="text-[#202A35] text-sm">{app.stall_type?.name}</strong>
                  </div>

                  <div className="p-3.5 bg-[#F7F5F0] rounded-xl border border-[#E5E0D7]">
                    <span className="text-[#747B80] block mb-0.5">Requested Quantity</span>
                    <strong className="text-[#202A35] text-sm">{app.quantity} stall(s)</strong>
                  </div>

                  <div className="p-3.5 bg-[#F7F5F0] rounded-xl border border-[#E5E0D7]">
                    <span className="text-[#747B80] block mb-0.5">Approved Total Rate</span>
                    <strong className="text-[#202A35] text-sm">
                      {formatPaiseToINR((app.stall_type?.price_paise || 0) * app.quantity)}
                    </strong>
                  </div>
                </div>

                {/* Organizer Review Feedback */}
                {app.decision_reason && (
                  <div className="p-3 bg-[#EFEAE1] rounded-xl border border-[#E5E0D7] text-xs text-[#202A35]">
                    <strong className="block text-[#202A35] font-semibold mb-0.5">
                      Organizer Notes:
                    </strong>
                    {app.decision_reason}
                  </div>
                )}

                {/* Action CTA for Approved Bookings */}
                {app.status === 'approved' && booking && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#E5E0D7]">
                    <div className="flex items-center gap-2 text-xs text-[#747B80]">
                      <Clock className="w-4 h-4 text-[#B95335]" />
                      {booking.status === 'confirmed' ? (
                        <span className="text-[#287653] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Paid & Confirmed
                        </span>
                      ) : isHoldActive ? (
                        <span>
                          Active Hold Expires at:{' '}
                          <strong className="text-[#B95335]">
                            {new Date(booking.hold_expires_at).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </strong>
                        </span>
                      ) : (
                        <span className="text-[#B33A3A] font-medium">Hold Expired</span>
                      )}
                    </div>

                    {booking.status === 'confirmed' ? (
                      <Link
                        href="/vendor/bookings"
                        className="px-4 py-2 bg-[#287653] hover:bg-[#1E5A3F] text-white font-semibold text-xs rounded-lg transition-colors"
                      >
                        View Confirmed Pass
                      </Link>
                    ) : (
                      <Link
                        href={`/vendor/bookings/${booking.id}/pay`}
                        className="px-5 py-2.5 bg-[#B95335] hover:bg-[#98432B] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        Complete Checkout (30m Hold)
                        <ArrowRight className="w-3.5 h-3.5" />
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
