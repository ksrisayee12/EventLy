// src/app/vendor/bookings/[id]/pay/page.tsx
import { notFound, redirect } from 'next/navigation';
import { DataService } from '@/services/dataService';
import { formatPaiseToINR, formatDateOnly } from '@/lib/utils';
import { CheckoutButton } from '@/components/bookings/CheckoutButton';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  AlertCircle 
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#E5E0D7] pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
          Payment Checkout
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202A35] tracking-tight mt-0.5">
          Confirm Your Stall Booking
        </h1>
        <p className="text-sm text-[#747B80]">
          Review approved booking summary and complete payment via Razorpay.
        </p>
      </div>

      {/* Hold Expiry Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between ${
          isHoldExpired
            ? 'bg-[#F7F5F0] border-[#B33A3A] text-[#B33A3A]'
            : 'bg-[#EFEAE1] border-[#E5E0D7] text-[#202A35]'
        }`}
      >
        <div className="flex items-center gap-3">
          <Clock className={`w-5 h-5 ${isHoldExpired ? 'text-[#B33A3A]' : 'text-[#B95335]'}`} />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#64786B]">
              {isHoldExpired ? 'Reservation Hold Expired' : 'Active 30-Minute Hold'}
            </div>
            <div className="text-sm font-semibold text-[#202A35]">
              {isHoldExpired
                ? 'The 30-minute reservation hold has passed. Capacity released.'
                : `Hold expires at: ${new Date(booking.hold_expires_at).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}`}
            </div>
          </div>
        </div>
        {!isHoldExpired && (
          <span className="text-xs font-bold px-2.5 py-1 bg-[#FFFFFF] rounded-md text-[#B95335] border border-[#E5E0D7]">
            Hold Active
          </span>
        )}
      </div>

      {/* Itemized Order Breakdown */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E0D7] shadow-curated p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-bold text-[#202A35] border-b border-[#E5E0D7] pb-3">
          Booking Summary
        </h2>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-[#202A35]">{booking.event?.title}</div>
              <div className="text-xs text-[#747B80] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#B95335]" />
                {booking.event?.venue_name}, {booking.event?.city}
              </div>
            </div>
            <div className="text-xs font-medium text-[#747B80]">
              {formatDateOnly(booking.event?.starts_at || '')}
            </div>
          </div>

          <div className="p-4 bg-[#F7F5F0] rounded-xl border border-[#E5E0D7] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#747B80]">Stall Category:</span>
              <span className="font-bold text-[#202A35]">{booking.stall_type?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#747B80]">Allocated Quantity:</span>
              <span className="font-bold text-[#202A35]">{booking.quantity} stall(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#747B80]">Unit Rate:</span>
              <span className="font-semibold text-[#202A35]">
                {formatPaiseToINR(booking.unit_price_paise)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E5E0D7] flex justify-between items-center text-base">
            <span className="font-bold text-[#202A35]">Total Payable Amount:</span>
            <span className="text-2xl font-black text-[#202A35]">
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
          <div className="text-center py-4 text-xs text-[#B33A3A] font-semibold">
            Hold has expired. Please return to the exhibition page to re-apply.
          </div>
        )}
      </div>
    </div>
  );
}
