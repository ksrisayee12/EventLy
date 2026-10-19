// src/app/vendor/bookings/page.tsx
import Link from 'next/link';
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly, formatDateTime } from '@/lib/utils';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Download, 
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Confirmed Stall Bookings & Passes
          </h1>
          <p className="text-sm text-slate-600">
            Official digital booking vouchers and receipts for entry and stall setup.
          </p>
        </div>

        <Link
          href="/vendor/refunds"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-indigo-600"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Refund Request Center
        </Link>
      </div>

      {confirmedBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <Store className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No confirmed bookings yet.</h3>
          <p className="text-xs text-slate-500">
            Once your stall application is approved and paid via Razorpay, your confirmed digital pass will appear here.
          </p>
          <Link
            href="/vendor/applications"
            className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm"
          >
            Check Applications
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {confirmedBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-3xl border border-emerald-200/80 shadow-md overflow-hidden flex flex-col justify-between"
            >
              {/* Voucher Top Strip */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-700/60 px-2 py-0.5 rounded-md">
                    Verified Digital Stall Pass
                  </span>
                  <div className="font-mono text-sm font-bold tracking-wider mt-1">
                    PASS #{booking.id.slice(0, 12).toUpperCase()}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Voucher Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{booking.event?.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{booking.event?.venue_name}, {booking.event?.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{formatDateTime(booking.event?.starts_at || '')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl text-xs border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Stall Type</span>
                    <strong className="text-slate-800">{booking.stall_type?.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Quantity</span>
                    <strong className="text-slate-800">{booking.quantity} Stall(s)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Paid</span>
                    <strong className="text-emerald-700 font-extrabold">
                      {formatPaiseToINR(booking.total_amount_paise)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Confirmation</span>
                    <span className="text-emerald-600 font-bold">Paid & Verified</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Show pass at organizer gate
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/vendor/refunds?bookingId=${booking.id}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
                  >
                    Request Refund
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
