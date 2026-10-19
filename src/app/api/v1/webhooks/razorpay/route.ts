// src/app/api/v1/webhooks/razorpay/route.ts
import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay/service';
import { DataService } from '@/services/dataService';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: { code: 'SIGNATURE_MISSING', message: 'Missing x-razorpay-signature header' } },
        { status: 400 }
      );
    }

    // Verify webhook signature if secret configured
    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature({ rawBody, signature });
      if (!isValid) {
        return NextResponse.json(
          { error: { code: 'INVALID_SIGNATURE', message: 'Webhook signature verification failed.' } },
          { status: 400 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.event;

    // Idempotent handling for order.paid or payment.captured
    if (eventType === 'order.paid' || eventType === 'payment.captured') {
      const entity = payload.payload?.payment?.entity || payload.payload?.order?.entity;
      const bookingId = entity?.notes?.booking_id;

      if (bookingId) {
        await DataService.confirmPayment(bookingId, {
          providerOrderId: entity.order_id || entity.id,
          providerPaymentId: entity.id,
          amountPaise: entity.amount,
        });
      }
    }

    return NextResponse.json({ received: true, event: eventType });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'WEBHOOK_PROCESSING_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
