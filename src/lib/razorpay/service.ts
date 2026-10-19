// src/lib/razorpay/service.ts
// Razorpay Server-Side Service for Order Creation, Signature Verification & Refunds

import crypto from 'crypto';
import Razorpay from 'razorpay';

export interface CreateOrderParams {
  bookingId: string;
  amountPaise: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface VerifySignatureParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface VerifyWebhookParams {
  rawBody: string;
  signature: string;
}

/**
 * Returns a configured Razorpay instance or null if credentials are unconfigured
 */
export function getRazorpayClient(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Creates an authoritative Razorpay order from server-verified booking amounts
 */
export async function createRazorpayOrder(params: CreateOrderParams) {
  const client = getRazorpayClient();

  if (!client) {
    // If provider is not configured, throw a clear business error per spec
    throw new Error(
      'RAZORPAY_NOT_CONFIGURED: Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.'
    );
  }

  const options = {
    amount: params.amountPaise, // In paise (e.g. ₹500.00 = 50000)
    currency: params.currency || 'INR',
    receipt: params.receipt || `bk_${params.bookingId.slice(0, 16)}`,
    notes: {
      booking_id: params.bookingId,
      ...(params.notes || {}),
    },
  };

  const order = await client.orders.create(options);
  return order;
}

/**
 * Authoritatively verifies Razorpay checkout signature:
 * signature = hmac_sha256(order_id + "|" + payment_id, secret)
 */
export function verifyRazorpaySignature(params: VerifySignatureParams): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET is not configured on server.');
  }

  const payload = `${params.orderId}|${params.paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf8'),
    Buffer.from(params.signature, 'utf8')
  );
}

/**
 * Verifies inbound webhook event authenticity against RAZORPAY_WEBHOOK_SECRET
 */
export function verifyWebhookSignature(params: VerifyWebhookParams): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET is not configured on server.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(params.rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf8'),
    Buffer.from(params.signature, 'utf8')
  );
}
