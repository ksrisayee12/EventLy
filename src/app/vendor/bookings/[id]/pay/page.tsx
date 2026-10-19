// src/app/vendor/bookings/[id]/pay/page.tsx
import { notFound, redirect } from 'next/navigation';
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly, formatDateTime } from '@/lib/utils';
import { CheckoutButton } from '@/components/bookings/CheckoutButton';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BookingPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await DataService.getBookingById(id);

  if (!booking) {
    notFound();
  }

  if (booking.status === 'confirmed') {
    redirect('/vendor/bookings');
  }

  const isHoldExpired = new Date(booking.hold_expires_at) <= new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Payment Checkout
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Confirm Your Stall Booking
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review approved booking summary and complete payment via Razorpay.
        </p>
      </div>

      {/* Hold Expiry Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between ${
          isHoldExpired
            ? 'bg-red-50 border-red-200 text-red-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <Clock className={`w-5 h-5 ${isHoldExpired ? 'text-red-600' : 'text-amber-600'}`} />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              {isHoldExpired ? 'Reservation Hold Expired' : 'Active Inventory Hold'}
            </div>
            <div className="text-sm font-semibold">
              {isHoldExpired
                ? 'The 30-minute reservation hold has passed. Inventory has been released.'
                : `Hold expires at: ${new Date(booking.hold_expires_at).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}`}
            </div>
          </div>
        </div>
        {!isHoldExpired && (
          <span className="text-xs font-bold px-3 py-1 bg-amber-200/80 rounded-full text-amber-900">
            30m Timer Active
          </span>
        )}
      </div>

      {/* Itemized Order Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          Booking Summary
        </h2>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-slate-900">{booking.event?.title}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {booking.event?.venue_name}, {booking.event?.city}
              </div>
            </div>
            <div className="text-xs font-semibold text-slate-500">
              {formatDateOnly(booking.event?.starts_at || '')}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Stall Category:</span>
              <span className="font-bold text-slate-800">{booking.stall_type?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Number of Stalls:</span>
              <span className="font-bold text-slate-800">{booking.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Unit Rate:</span>
              <span className="font-semibold text-slate-800">
                {formatPaiseToINR(booking.unit_price_paise)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-base">
            <span className="font-bold text-slate-900">Total Payable Amount:</span>
            <span className="text-2xl font-black text-indigo-700">
              {formatPaiseToINR(booking.total_amount_paise)}
            </span>
          </div>
        </div>

        {/* Checkout Component */}
        {!isHoldExpired ? (
          <CheckoutButton
            bookingId={booking.id}
            totalAmountPaise={booking.total_amount_paise}
            holdExpiresAt={booking.hold_expires_at}
          />
        ) : (
          <div className="text-center py-4 text-xs text-red-600 font-semibold">
            Hold has expired. Please return to the event page to submit a new application.
          </div>
        )}
      </div>
    </div>
  );
}
