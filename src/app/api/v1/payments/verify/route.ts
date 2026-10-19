// src/app/api/v1/payments/verify/route.ts
import { NextResponse } from 'next/server';
import { DataService } from '@/services/dataService';
import { verifyRazorpaySignature } from '@/lib/razorpay/service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { booking_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, is_simulation } = body;

    if (!booking_id || !razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Missing required payment verification fields.' } },
        { status: 400 }
      );
    }

    const booking = await DataService.getBookingById(booking_id);
    if (!booking) {
      return NextResponse.json(
        { error: { code: 'BOOKING_NOT_FOUND', message: 'Booking does not exist.' } },
        { status: 404 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Signature verification for live/test Razorpay credentials
    if (keySecret && !is_simulation) {
      if (!razorpay_signature) {
        return NextResponse.json(
          { error: { code: 'SIGNATURE_MISSING', message: 'Razorpay signature is required.' } },
          { status: 400 }
        );
      }

      const isValid = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });

      if (!isValid) {
        return NextResponse.json(
          { error: { code: 'INVALID_SIGNATURE', message: 'Payment verification failed: Signature mismatch.' } },
          { status: 400 }
        );
      }
    }

    // Confirm booking payment authoritatively
    const updatedBooking = await DataService.confirmPayment(booking_id, {
      providerOrderId: razorpay_order_id,
      providerPaymentId: razorpay_payment_id,
      amountPaise: booking.total_amount_paise,
    });

    return NextResponse.json({
      data: {
        success: true,
        booking: updatedBooking,
        message: 'Payment verified and booking confirmed successfully.',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'VERIFICATION_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
