// src/types/api.ts
// Standard API Contracts and Request/Response DTOs

export interface ApiErrorShape {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiErrorShape;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    has_more?: boolean;
  };
}

// Auth & Profile DTOs
export interface UpdateMeRequest {
  full_name?: string;
  phone?: string;
}

export interface UpsertOrganizerProfileRequest {
  organization_name: string;
  contact_person: string;
  business_email: string;
  business_phone: string;
  address?: string;
}

export interface UpsertVendorProfileRequest {
  business_name: string;
  business_category: string;
  contact_phone: string;
  business_description?: string;
}

// Event DTOs
export interface CreateEventStallTypeInput {
  name: string;
  description?: string;
  vendor_category: string;
  price_paise: number;
  total_capacity: number;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  event_category: string;
  venue_name: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  starts_at: string;
  ends_at: string;
  expected_footfall?: number;
  terms_text?: string;
  stall_types: CreateEventStallTypeInput[];
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  publication_status?: 'published' | 'unpublished' | 'closed' | 'cancelled';
}

export interface AdminEventDecisionRequest {
  decision: 'approved' | 'rejected' | 'changes_requested';
  reason?: string;
}

// Application DTOs
export interface SubmitApplicationRequest {
  stall_type_id: string;
  quantity: number;
  message?: string;
}

export interface ApplicationDecisionRequest {
  decision: 'approved' | 'rejected';
  reason?: string;
}

// Booking & Payment DTOs
export interface CreateCheckoutSessionResponse {
  booking_id: string;
  razorpay_order_id: string;
  amount_paise: number;
  currency: string;
  razorpay_key_id: string;
  hold_expires_at: string;
  vendor_details: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface VerifyPaymentRequest {
  booking_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Refund DTOs
export interface SubmitRefundRequest {
  booking_id: string;
  reason: string;
  explanation?: string;
}

export interface AdminRefundDecisionRequest {
  decision: 'approved' | 'rejected';
  reason?: string;
}
