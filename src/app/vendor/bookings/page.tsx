// src/app/vendor/bookings/page.tsx
import Link from 'next/link';
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateTime } from '@/lib/utils';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  RotateCcw, 
  Store, 
  ShieldCheck 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VendorBookingsPage() {
  const vendorId = '22222222-2222-2222-2222-222222222222';
  const bookings = await DataService.getVendorBookings(vendorId);
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D7] pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
            Confirmed Reservations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202A35] tracking-tight mt-0.5">
            Confirmed Stall Bookings & Passes
          </h1>
          <p className="text-sm text-[#747B80]">
            Official digital exhibition credentials and receipts for on-site stall setup.
          </p>
        </div>

        <Link
          href="/vendor/refunds"
          className="inline-flex items-center text-xs font-semibold text-[#747B80] hover:text-[#B95335] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Refund Request Center
        </Link>
      </div>

      {confirmedBookings.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] p-8 space-y-4">
          <Store className="w-12 h-12 text-[#747B80] mx-auto" />
          <h3 className="text-base font-bold text-[#202A35]">No confirmed bookings yet.</h3>
          <p className="text-xs text-[#747B80]">
            Once your stall application is approved and paid via Razorpay, your confirmed digital pass will appear here.
          </p>
          <Link
            href="/vendor/applications"
            className="inline-block px-5 py-2.5 bg-[#B95335] text-white font-semibold text-xs rounded-lg"
          >
            Check Applications
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {confirmedBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated overflow-hidden flex flex-col justify-between"
            >
              {/* Pass Header Strip */}
              <div className="bg-[#202A35] text-white p-5 flex items-center justify-between border-b border-[#2E3A47]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-[#2E3A47] px-2 py-0.5 rounded text-[#EFEAE1]">
                    Verified Digital Stall Pass
                  </span>
                  <div className="font-mono text-sm font-bold tracking-wider mt-1 text-[#FFFFFF]">
                    PASS #{booking.id.slice(0, 12).toUpperCase()}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#287653] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Pass Content Body */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#202A35]">{booking.event?.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#747B80] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B95335] shrink-0" />
                    <span>{booking.event?.venue_name}, {booking.event?.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#747B80] mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-[#64786B] shrink-0" />
                    <span>{formatDateTime(booking.event?.starts_at || '')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F7F5F0] rounded-xl text-xs border border-[#E5E0D7]">
                  <div>
                    <span className="text-[#747B80] block text-[10px] uppercase font-bold">Stall Type</span>
                    <strong className="text-[#202A35]">{booking.stall_type?.name}</strong>
                  </div>
                  <div>
                    <span className="text-[#747B80] block text-[10px] uppercase font-bold">Quantity</span>
                    <strong className="text-[#202A35]">{booking.quantity} Stall(s)</strong>
                  </div>
                  <div>
                    <span className="text-[#747B80] block text-[10px] uppercase font-bold">Total Paid</span>
                    <strong className="text-[#202A35] font-extrabold">
                      {formatPaiseToINR(booking.total_amount_paise)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#747B80] block text-[10px] uppercase font-bold">Status</span>
                    <span className="text-[#287653] font-bold">Paid & Verified</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-[#F7F5F0] border-t border-[#E5E0D7] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#747B80] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#287653]" />
                  Present this pass at venue security
                </span>

                <Link
                  href={`/vendor/refunds?bookingId=${booking.id}`}
                  className="px-3 py-1.5 rounded-lg border border-[#E5E0D7] bg-[#FFFFFF] text-[#202A35] hover:bg-[#EFEAE1] font-semibold text-xs transition-colors"
                >
                  Request Refund
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
