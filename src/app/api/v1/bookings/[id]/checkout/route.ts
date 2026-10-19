// src/app/api/v1/bookings/[id]/checkout/route.ts
import { NextResponse } from 'next/server';
import { DataService } from '@/services/dataService';
import { createRazorpayOrder, getRazorpayClient } from '@/lib/razorpay/service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await DataService.getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { error: { code: 'BOOKING_NOT_FOUND', message: 'Booking does not exist.' } },
        { status: 404 }
      );
    }

    if (booking.status !== 'pending_payment') {
      return NextResponse.json(
        { error: { code: 'INVALID_BOOKING_STATUS', message: `Booking status is ${booking.status}, not payable.` } },
        { status: 409 }
      );
    }

    // Check hold expiry
    if (new Date(booking.hold_expires_at) <= new Date()) {
      return NextResponse.json(
        { error: { code: 'HOLD_EXPIRED', message: 'The 30-minute reservation hold on this stall has expired.' } },
        { status: 410 }
      );
    }

    const razorpay = getRazorpayClient();
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;

    // Real Razorpay gateway order if keys configured
    if (razorpay && keyId && !keyId.includes('YourKeyId')) {
      const order = await createRazorpayOrder({
        bookingId: booking.id,
        amountPaise: booking.total_amount_paise,
        currency: booking.currency,
        notes: {
          event_id: booking.event_id,
          stall_type_id: booking.stall_type_id,
        },
      });

      return NextResponse.json({
        data: {
          booking_id: booking.id,
          razorpay_order_id: order.id,
          amount_paise: booking.total_amount_paise,
          currency: booking.currency,
          razorpay_key_id: keyId,
          hold_expires_at: booking.hold_expires_at,
          is_sandbox_simulation: false,
          vendor_details: {
            name: booking.vendor?.business_name || 'Vendor',
            email: 'vendor@example.com',
            phone: booking.vendor?.contact_phone || '+919999999999',
          },
        },
      });
    }

    // Clear simulation mode if provider credentials have not been configured yet
    const simulatedOrderId = `order_sim_${crypto.randomUUID().slice(0, 14)}`;
    return NextResponse.json({
      data: {
        booking_id: booking.id,
        razorpay_order_id: simulatedOrderId,
        amount_paise: booking.total_amount_paise,
        currency: booking.currency,
        razorpay_key_id: 'rzp_test_simulation',
        hold_expires_at: booking.hold_expires_at,
        is_sandbox_simulation: true,
        simulation_notice: 'Razorpay keys not detected in .env.local. Running in local test checkout simulation.',
        vendor_details: {
          name: booking.vendor?.business_name || 'Vendor',
          email: 'vendor@example.com',
          phone: booking.vendor?.contact_phone || '+919999999999',
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'CHECKOUT_CREATION_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
