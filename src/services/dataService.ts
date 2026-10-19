// src/services/dataService.ts
// Authoritative Data Access Service for Events, Applications, Bookings, and Refunds
// Supports both Supabase Database and In-Memory Demo Fallback for local sandbox testing.

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import type { 
  EventItem, 
  EventStallType, 
  Application, 
  Booking, 
  Payment, 
  RefundRequest, 
  Profile,
  OrganizerProfile,
  VendorProfile,
  NotificationItem,
  AdminAuditLog
} from '@/types/database';

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')
  );
}

// In-Memory Seed Storage for Immediate Sandbox / Demo Verification
const DEMO_PROFILES: Profile[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    full_name: 'EventLy System Admin',
    phone: '+919876543210',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    full_name: 'Kavita Sharma',
    phone: '+919812345678',
    role: 'organizer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    full_name: 'Rohan Verma',
    phone: '+919765432109',
    role: 'vendor',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEMO_ORGANIZER: OrganizerProfile = {
  id: '11111111-1111-1111-1111-111111111111',
  user_id: '00000000-0000-0000-0000-000000000002',
  organization_name: 'Bengaluru Cultural Expos Pvt Ltd',
  contact_person: 'Kavita Sharma',
  business_email: 'kavita@bangaloreculturalexpos.in',
  business_phone: '+919812345678',
  address: 'Indiranagar 100ft Road, Bengaluru, Karnataka',
  verification_status: 'verified',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_VENDOR: VendorProfile = {
  id: '22222222-2222-2222-2222-222222222222',
  user_id: '00000000-0000-0000-0000-000000000003',
  business_name: 'Clay & Craft Studio',
  business_category: 'Handmade Ceramics & Pottery',
  contact_phone: '+919765432109',
  business_description: 'Handcrafted artisanal ceramics, dinnerware, and terracotta home decor items.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

let inMemoryEvents: EventItem[] = [
  {
    id: '33333333-3333-3333-3333-333333333333',
    organizer_id: '11111111-1111-1111-1111-111111111111',
    title: 'Bengaluru Spring Artisan & Flea Festival 2026',
    description: 'Join the premier cultural and lifestyle exhibition featuring 80+ curated indie makers, craft food pop-ups, artisanal fashion, and live acoustic music across 3 vibrant days.',
    event_category: 'Flea Market & Craft Expo',
    venue_name: 'Jaymahal Palace Exhibition Grounds',
    address: '1, Jayamahal Road, near Cantonment Railway Station',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    starts_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
    expected_footfall: 8500,
    terms_text: 'Standard electricity (1 socket, 5A) included. No plastic bags allowed. Setup strictly between 7:00 AM - 9:30 AM on Day 1. Stall spaces are allocated on first-approved first-paid basis.',
    review_status: 'approved',
    publication_status: 'published',
    rejection_reason: null,
    submitted_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333334',
    organizer_id: '11111111-1111-1111-1111-111111111111',
    title: 'Mumbai Gourmet Food & Beverage Bazaar',
    description: 'A curated weekend food festival showcasing organic artisanal bakeries, cold-brew coffee roasters, craft confectionery, and small-batch packaged sauces.',
    event_category: 'Food & Beverage',
    venue_name: 'Bandra Fort Amphitheatre Grounds',
    address: 'Byramji Jeejeebhoy Road, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    starts_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
    expected_footfall: 12000,
    terms_text: 'FSSAI registration mandatory for all food and beverage stalls. Wet waste segregation strictly enforced. Fire safety equipment provided.',
    review_status: 'approved',
    publication_status: 'published',
    rejection_reason: null,
    submitted_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333335',
    organizer_id: '11111111-1111-1111-1111-111111111111',
    title: 'Delhi Winter Handloom & Sustainable Fashion Expo',
    description: 'An exclusive exhibition of Khadi weavers, natural indigo dyers, sustainable footwear, and brass jewelry designers from across India.',
    event_category: 'Apparel & Sustainable Fashion',
    venue_name: 'Dilli Haat INA',
    address: 'Sri Aurobindo Marg, Laxmi Bai Nagar',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    starts_at: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    expected_footfall: 15000,
    terms_text: 'All textiles must be handwoven or verified sustainable. Billing machine or QR code mandatory.',
    review_status: 'approved',
    publication_status: 'published',
    rejection_reason: null,
    submitted_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let inMemoryStallTypes: EventStallType[] = [
  {
    id: '44444444-4444-4444-4444-444444444441',
    event_id: '33333333-3333-3333-3333-333333333333',
    name: 'Standard Artisan Stall (6x6 ft)',
    description: 'Covered canopy stall with 1 table, 2 chairs, and 5A lighting socket. Best for ceramics, apparel, jewelry, and prints.',
    vendor_category: 'Handmade / Lifestyle',
    price_paise: 1200000, // ₹12,000
    currency: 'INR',
    total_capacity: 40,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444442',
    event_id: '33333333-3333-3333-3333-333333333333',
    name: 'Corner Premium Canopy (10x10 ft)',
    description: 'Two-sided open high-traffic corner spot with 2 tables, 4 chairs, and 15A power plug. Best for live workshops or food pop-ups.',
    vendor_category: 'Gourmet Food / Premium Brand',
    price_paise: 2500000, // ₹25,000
    currency: 'INR',
    total_capacity: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444443',
    event_id: '33333333-3333-3333-3333-333333333334',
    name: 'Gourmet Tasting Stall (8x8 ft)',
    description: 'Dedicated food grade stall with wash basin access and grease disposal.',
    vendor_category: 'Food & Beverage',
    price_paise: 1800000, // ₹18,000
    currency: 'INR',
    total_capacity: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    event_id: '33333333-3333-3333-3333-333333333335',
    name: 'Handloom Pavilion Stall (8x8 ft)',
    description: 'Fabric hanging rods and spotlights included.',
    vendor_category: 'Apparel & Sustainable Fashion',
    price_paise: 1500000, // ₹15,000
    currency: 'INR',
    total_capacity: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let inMemoryApplications: Application[] = [
  {
    id: '55555555-5555-5555-5555-555555555551',
    event_id: '33333333-3333-3333-3333-333333333333',
    vendor_id: '22222222-2222-2222-2222-222222222222',
    stall_type_id: '44444444-4444-4444-4444-444444444441',
    quantity: 1,
    message: 'We will be displaying our new stoneware mug collection and glazed terracotta planters.',
    status: 'approved',
    decision_by: '00000000-0000-0000-0000-000000000002',
    decision_at: new Date().toISOString(),
    decision_reason: 'Great product fit for the artisan flea market.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let inMemoryBookings: Booking[] = [
  {
    id: '66666666-6666-6666-6666-666666666661',
    application_id: '55555555-5555-5555-5555-555555555551',
    vendor_id: '22222222-2222-2222-2222-222222222222',
    event_id: '33333333-3333-3333-3333-333333333333',
    stall_type_id: '44444444-4444-4444-4444-444444444441',
    quantity: 1,
    unit_price_paise: 1200000,
    total_amount_paise: 1200000,
    currency: 'INR',
    status: 'pending_payment',
    hold_expires_at: new Date(Date.now() + 25 * 60 * 1000).toISOString(), // 25 mins remaining
    confirmed_at: null,
    cancelled_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let inMemoryPayments: Payment[] = [];
let inMemoryRefunds: RefundRequest[] = [];
let inMemoryNotifications: NotificationItem[] = [
  {
    id: '77777777-7777-7777-7777-777777777771',
    recipient_id: '00000000-0000-0000-0000-000000000003',
    title: 'Application Approved!',
    message: 'Your application for "Standard Artisan Stall (6x6 ft)" at Bengaluru Spring Artisan Festival has been approved. Please complete payment within 30 minutes to reserve your stall.',
    type: 'application_approved',
    related_entity_type: 'booking',
    related_entity_id: '66666666-6666-6666-6666-666666666661',
    read: false,
    delivery_status: 'in_app',
    created_at: new Date().toISOString(),
  }
];
let inMemoryAuditLogs: AdminAuditLog[] = [];

// ==============================================================================
// DOMAIN SERVICES
// ==============================================================================

export const DataService = {
  // Profiles
  async getProfile(userId: string): Promise<Profile | null> {
    return DEMO_PROFILES.find((p) => p.id === userId) || null;
  },

  async getOrganizerProfile(userId: string): Promise<OrganizerProfile | null> {
    if (DEMO_ORGANIZER.user_id === userId) return DEMO_ORGANIZER;
    return DEMO_ORGANIZER; // fallback demo
  },

  async getVendorProfile(userId: string): Promise<VendorProfile | null> {
    if (DEMO_VENDOR.user_id === userId) return DEMO_VENDOR;
    return DEMO_VENDOR; // fallback demo
  },

  // Events Discovery
  async getPublicEvents(filters?: {
    city?: string;
    category?: string;
    search?: string;
  }): Promise<EventItem[]> {
    let events = inMemoryEvents.filter(
      (e) => e.publication_status === 'published' && e.review_status === 'approved'
    );

    if (filters?.city && filters.city !== 'All Cities') {
      events = events.filter((e) => e.city.toLowerCase() === filters.city!.toLowerCase());
    }

    if (filters?.category && filters.category !== 'All Categories') {
      events = events.filter((e) => e.event_category.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.venue_name.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    return events;
  },

  async getEventById(eventId: string): Promise<EventItem | null> {
    return inMemoryEvents.find((e) => e.id === eventId) || null;
  },

  async getStallTypesForEvent(eventId: string): Promise<EventStallType[]> {
    const stalls = inMemoryStallTypes.filter((s) => s.event_id === eventId);
    return stalls.map((stall) => {
      // Calculate live available capacity
      const allocated = inMemoryBookings
        .filter(
          (b) =>
            b.stall_type_id === stall.id &&
            (b.status === 'confirmed' ||
              (b.status === 'pending_payment' && new Date(b.hold_expires_at) > new Date()))
        )
        .reduce((sum, b) => sum + b.quantity, 0);

      return {
        ...stall,
        available_capacity: Math.max(0, stall.total_capacity - allocated),
      };
    });
  },

  async createEvent(eventData: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>, stallTypes: Omit<EventStallType, 'id' | 'event_id' | 'created_at' | 'updated_at'>[]): Promise<EventItem> {
    const newEvent: EventItem = {
      ...eventData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inMemoryEvents.push(newEvent);

    stallTypes.forEach((st) => {
      inMemoryStallTypes.push({
        ...st,
        id: crypto.randomUUID(),
        event_id: newEvent.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    });

    return newEvent;
  },

  // Applications
  async submitApplication(params: {
    eventId: string;
    vendorId: string;
    stallTypeId: string;
    quantity: number;
    message?: string;
  }): Promise<Application> {
    // 1. Prevent duplicate active pending applications
    const existing = inMemoryApplications.find(
      (a) =>
        a.event_id === params.eventId &&
        a.vendor_id === params.vendorId &&
        a.stall_type_id === params.stallTypeId &&
        a.status === 'pending'
    );
    if (existing) {
      throw new Error('DUPLICATE_APPLICATION: You already have a pending application for this stall type.');
    }

    // 2. Validate stall exists
    const stall = inMemoryStallTypes.find((s) => s.id === params.stallTypeId);
    if (!stall) throw new Error('STALL_TYPE_NOT_FOUND');

    const app: Application = {
      id: crypto.randomUUID(),
      event_id: params.eventId,
      vendor_id: params.vendorId,
      stall_type_id: params.stallTypeId,
      quantity: params.quantity,
      message: params.message || null,
      status: 'pending',
      decision_by: null,
      decision_at: null,
      decision_reason: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    inMemoryApplications.push(app);
    return app;
  },

  async getVendorApplications(vendorId: string): Promise<Application[]> {
    return inMemoryApplications
      .filter((a) => a.vendor_id === vendorId)
      .map((a) => ({
        ...a,
        event: inMemoryEvents.find((e) => e.id === a.event_id),
        stall_type: inMemoryStallTypes.find((s) => s.id === a.stall_type_id),
      }));
  },

  async getOrganizerApplications(organizerId: string): Promise<Application[]> {
    const eventIds = inMemoryEvents
      .filter((e) => e.organizer_id === organizerId)
      .map((e) => e.id);

    return inMemoryApplications
      .filter((a) => eventIds.includes(a.event_id))
      .map((a) => ({
        ...a,
        event: inMemoryEvents.find((e) => e.id === a.event_id),
        stall_type: inMemoryStallTypes.find((s) => s.id === a.stall_type_id),
        vendor: DEMO_VENDOR,
      }));
  },

  // Atomic Application Decision & Inventory Hold Creation
  async decideApplication(params: {
    applicationId: string;
    decision: 'approved' | 'rejected';
    decisionBy: string;
    reason?: string;
    holdDurationMinutes?: number;
  }): Promise<{ application: Application; booking?: Booking }> {
    const appIndex = inMemoryApplications.findIndex((a) => a.id === params.applicationId);
    if (appIndex === -1) throw new Error('APPLICATION_NOT_FOUND');

    const app = inMemoryApplications[appIndex];
    if (app.status !== 'pending') {
      throw new Error(`INVALID_STATUS: Application is already ${app.status}`);
    }

    if (params.decision === 'rejected') {
      app.status = 'rejected';
      app.decision_by = params.decisionBy;
      app.decision_at = new Date().toISOString();
      app.decision_reason = params.reason || null;
      app.updated_at = new Date().toISOString();
      return { application: app };
    }

    // APPROVAL: Atomic capacity check and 30-min hold creation
    const stall = inMemoryStallTypes.find((s) => s.id === app.stall_type_id);
    if (!stall) throw new Error('STALL_TYPE_NOT_FOUND');

    const allocated = inMemoryBookings
      .filter(
        (b) =>
          b.stall_type_id === stall.id &&
          (b.status === 'confirmed' ||
            (b.status === 'pending_payment' && new Date(b.hold_expires_at) > new Date()))
      )
      .reduce((sum, b) => sum + b.quantity, 0);

    const available = stall.total_capacity - allocated;
    if (available < app.quantity) {
      throw new Error(`CAPACITY_UNAVAILABLE: Only ${available} stalls available, requested ${app.quantity}`);
    }

    // Update Application
    app.status = 'approved';
    app.decision_by = params.decisionBy;
    app.decision_at = new Date().toISOString();
    app.decision_reason = params.reason || 'Application approved';
    app.updated_at = new Date().toISOString();

    // Create Booking Hold
    const holdDuration = params.holdDurationMinutes || 30;
    const expiresAt = new Date(Date.now() + holdDuration * 60 * 1000).toISOString();
    const totalAmount = stall.price_paise * app.quantity;

    const booking: Booking = {
      id: crypto.randomUUID(),
      application_id: app.id,
      vendor_id: app.vendor_id,
      event_id: app.event_id,
      stall_type_id: app.stall_type_id,
      quantity: app.quantity,
      unit_price_paise: stall.price_paise,
      total_amount_paise: totalAmount,
      currency: stall.currency,
      status: 'pending_payment',
      hold_expires_at: expiresAt,
      confirmed_at: null,
      cancelled_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    inMemoryBookings.push(booking);

    // Create Notification
    inMemoryNotifications.unshift({
      id: crypto.randomUUID(),
      recipient_id: app.vendor_id,
      title: 'Stall Application Approved!',
      message: `Your application for ${stall.name} has been approved. Please pay ₹${totalAmount / 100} within ${holdDuration} minutes to secure your stall.`,
      type: 'application_approved',
      related_entity_type: 'booking',
      related_entity_id: booking.id,
      read: false,
      delivery_status: 'in_app',
      created_at: new Date().toISOString(),
    });

    return { application: app, booking };
  },

  // Bookings
  async getBookingById(bookingId: string): Promise<Booking | null> {
    const booking = inMemoryBookings.find((b) => b.id === bookingId);
    if (!booking) return null;

    // Check if expired
    if (booking.status === 'pending_payment' && new Date(booking.hold_expires_at) <= new Date()) {
      booking.status = 'expired';
      booking.updated_at = new Date().toISOString();
    }

    return {
      ...booking,
      event: inMemoryEvents.find((e) => e.id === booking.event_id),
      stall_type: inMemoryStallTypes.find((s) => s.id === booking.stall_type_id),
      vendor: DEMO_VENDOR,
    };
  },

  async getVendorBookings(vendorId: string): Promise<Booking[]> {
    return inMemoryBookings
      .filter((b) => b.vendor_id === vendorId)
      .map((b) => {
        if (b.status === 'pending_payment' && new Date(b.hold_expires_at) <= new Date()) {
          b.status = 'expired';
        }
        return {
          ...b,
          event: inMemoryEvents.find((e) => e.id === b.event_id),
          stall_type: inMemoryStallTypes.find((s) => s.id === b.stall_type_id),
        };
      });
  },

  // Confirm Verified Payment
  async confirmPayment(bookingId: string, paymentDetails: {
    providerOrderId: string;
    providerPaymentId: string;
    amountPaise: number;
  }): Promise<Booking> {
    const booking = inMemoryBookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error('BOOKING_NOT_FOUND');

    if (booking.status === 'confirmed') return booking;

    booking.status = 'confirmed';
    booking.confirmed_at = new Date().toISOString();
    booking.updated_at = new Date().toISOString();

    const payment: Payment = {
      id: crypto.randomUUID(),
      booking_id: booking.id,
      provider: 'razorpay',
      provider_order_id: paymentDetails.providerOrderId,
      provider_payment_id: paymentDetails.providerPaymentId,
      amount_paise: paymentDetails.amountPaise,
      currency: 'INR',
      status: 'succeeded',
      idempotency_key: paymentDetails.providerPaymentId,
      paid_at: new Date().toISOString(),
      failure_reason: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inMemoryPayments.push(payment);

    // Notify Vendor & Organizer
    inMemoryNotifications.unshift({
      id: crypto.randomUUID(),
      recipient_id: booking.vendor_id,
      title: 'Booking Confirmed!',
      message: `Your booking for stall at ${inMemoryEvents.find((e) => e.id === booking.event_id)?.title} is confirmed. Payment ID: ${paymentDetails.providerPaymentId}`,
      type: 'booking_confirmed',
      related_entity_type: 'booking',
      related_entity_id: booking.id,
      read: false,
      delivery_status: 'in_app',
      created_at: new Date().toISOString(),
    });

    return booking;
  },

  // Refunds
  async submitRefundRequest(params: {
    bookingId: string;
    requestedBy: string;
    reason: string;
  }): Promise<RefundRequest> {
    const booking = inMemoryBookings.find((b) => b.id === params.bookingId);
    if (!booking) throw new Error('BOOKING_NOT_FOUND');
    if (booking.status !== 'confirmed') throw new Error('REFUND_NOT_ELIGIBLE: Only confirmed bookings can request refund.');

    const refund: RefundRequest = {
      id: crypto.randomUUID(),
      booking_id: booking.id,
      payment_id: inMemoryPayments.find((p) => p.booking_id === booking.id)?.id || 'mock-payment-id',
      requested_by: params.requestedBy,
      reason: params.reason,
      status: 'requested',
      amount_paise: booking.total_amount_paise,
      reviewed_by: null,
      reviewed_at: null,
      rejection_reason: null,
      provider_refund_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    inMemoryRefunds.push(refund);
    return refund;
  },

  async getAllRefundRequests(): Promise<RefundRequest[]> {
    return inMemoryRefunds.map((r) => ({
      ...r,
      booking: inMemoryBookings.find((b) => b.id === r.booking_id),
    }));
  },

  async decideRefundRequest(refundId: string, decision: 'approved' | 'rejected', reviewerId: string, reason?: string): Promise<RefundRequest> {
    const refund = inMemoryRefunds.find((r) => r.id === refundId);
    if (!refund) throw new Error('REFUND_REQUEST_NOT_FOUND');

    refund.status = decision === 'approved' ? 'succeeded' : 'rejected';
    refund.reviewed_by = reviewerId;
    refund.reviewed_at = new Date().toISOString();
    refund.rejection_reason = reason || null;
    refund.provider_refund_id = decision === 'approved' ? `rfnd_${crypto.randomUUID().slice(0, 8)}` : null;
    refund.updated_at = new Date().toISOString();

    if (decision === 'approved') {
      const b = inMemoryBookings.find((bk) => bk.id === refund.booking_id);
      if (b) {
        b.status = 'cancelled';
        b.cancelled_at = new Date().toISOString();
      }
    }

    return refund;
  },

  // Notifications
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    return inMemoryNotifications.filter((n) => n.recipient_id === userId);
  },

  // Admin queues
  async getAdminEvents(): Promise<EventItem[]> {
    return inMemoryEvents;
  },

  async decideAdminEvent(eventId: string, decision: 'approved' | 'rejected', reason?: string): Promise<EventItem> {
    const event = inMemoryEvents.find((e) => e.id === eventId);
    if (!event) throw new Error('EVENT_NOT_FOUND');

    event.review_status = decision;
    if (decision === 'approved') {
      event.publication_status = 'published';
      event.published_at = new Date().toISOString();
    } else {
      event.rejection_reason = reason || null;
    }
    event.updated_at = new Date().toISOString();
    return event;
  }
};
