// src/types/database.ts
// Database Schema and Entity Types for EventLy Platform

export type UserRole = 'vendor' | 'organizer' | 'admin';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type EventReviewStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'approved' 
  | 'rejected' 
  | 'changes_requested';

export type EventPublicationStatus = 
  | 'unpublished' 
  | 'published' 
  | 'closed' 
  | 'cancelled';

export type MediaType = 'poster' | 'brochure' | 'gallery' | 'layout';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export type BookingStatus = 
  | 'pending_payment' 
  | 'confirmed' 
  | 'completed' 
  | 'expired' 
  | 'cancelled';

export type PaymentStatus = 
  | 'created' 
  | 'pending' 
  | 'succeeded' 
  | 'failed' 
  | 'cancelled' 
  | 'expired';

export type RefundStatus = 
  | 'requested' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'processing' 
  | 'succeeded' 
  | 'failed';

export type NotificationDeliveryStatus = 'in_app' | 'sent' | 'failed';

export interface Profile {
  id: string; // references auth.users(id)
  full_name: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface OrganizerProfile {
  id: string;
  user_id: string;
  organization_name: string;
  contact_person: string;
  business_email: string;
  business_phone: string;
  address: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_category: string;
  contact_phone: string;
  business_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrganizerVerification {
  id: string;
  organizer_id: string;
  reviewed_by: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  verification_method: string;
  notes: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface EventItem {
  id: string;
  organizer_id: string;
  title: string;
  description: string;
  event_category: string;
  venue_name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  starts_at: string;
  ends_at: string;
  expected_footfall: number | null;
  terms_text: string | null;
  review_status: EventReviewStatus;
  publication_status: EventPublicationStatus;
  rejection_reason: string | null;
  submitted_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventStallType {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  vendor_category: string;
  price_paise: number; // Stored in integer paise (e.g. 150000 = ₹1,500.00)
  currency: string;
  total_capacity: number;
  created_at: string;
  updated_at: string;
  available_capacity?: number; // Calculated dynamically
}

export interface EventMedia {
  id: string;
  event_id: string;
  storage_path: string;
  media_type: MediaType;
  display_order: number;
  uploaded_by: string | null;
  created_at: string;
}

export interface Application {
  id: string;
  event_id: string;
  vendor_id: string;
  stall_type_id: string;
  quantity: number;
  message: string | null;
  status: ApplicationStatus;
  decision_by: string | null;
  decision_at: string | null;
  decision_reason: string | null;
  created_at: string;
  updated_at: string;
  
  // Relations when joined
  event?: EventItem;
  stall_type?: EventStallType;
  vendor?: VendorProfile;
}

export interface Booking {
  id: string;
  application_id: string;
  vendor_id: string;
  event_id: string;
  stall_type_id: string;
  quantity: number;
  unit_price_paise: number;
  total_amount_paise: number;
  currency: string;
  status: BookingStatus;
  hold_expires_at: string;
  confirmed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;

  // Relations when joined
  event?: EventItem;
  stall_type?: EventStallType;
  vendor?: VendorProfile;
  application?: Application;
}

export interface Payment {
  id: string;
  booking_id: string;
  provider: 'razorpay';
  provider_order_id: string;
  provider_payment_id: string | null;
  amount_paise: number;
  currency: string;
  status: PaymentStatus;
  idempotency_key: string | null;
  paid_at: string | null;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentWebhookEvent {
  id: string;
  provider_event_id: string;
  event_type: string;
  processing_status: 'received' | 'processed' | 'failed' | 'ignored';
  payload: Record<string, unknown>;
  received_at: string;
  processed_at: string | null;
  failure_reason: string | null;
}

export interface RefundRequest {
  id: string;
  booking_id: string;
  payment_id: string;
  requested_by: string;
  reason: string;
  status: RefundStatus;
  amount_paise: number;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  provider_refund_id: string | null;
  created_at: string;
  updated_at: string;

  booking?: Booking;
}

export interface BookingStatusHistory {
  id: string;
  booking_id: string;
  previous_status: string | null;
  new_status: string;
  actor_id: string | null;
  reason: string | null;
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  recipient_id: string;
  title: string;
  message: string;
  type: string;
  related_entity_type: string | null;
  related_entity_id: string | null;
  read: boolean;
  delivery_status: NotificationDeliveryStatus;
  created_at: string;
}
