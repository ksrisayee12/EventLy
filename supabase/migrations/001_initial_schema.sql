-- 001_initial_schema.sql
-- EventLy: Event Stall Aggregator & Booking Platform
-- Milestone 1: Production-grade Relational PostgreSQL Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (base user identity tied to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('vendor', 'organizer', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 2. Organizer Profiles
CREATE TABLE IF NOT EXISTS public.organizer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    business_email TEXT NOT NULL,
    business_phone TEXT NOT NULL,
    address TEXT,
    verification_status TEXT NOT NULL DEFAULT 'unverified' 
        CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. Vendor Profiles
CREATE TABLE IF NOT EXISTS public.vendor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_category TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    business_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4. Organizer Verifications (Admin verification records)
CREATE TABLE IF NOT EXISTS public.organizer_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID NOT NULL REFERENCES public.organizer_profiles(id) ON DELETE CASCADE,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'changes_requested')),
    verification_method TEXT NOT NULL,
    notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 5. Events
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID NOT NULL REFERENCES public.organizer_profiles(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_category TEXT NOT NULL,
    venue_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    expected_footfall INTEGER CHECK (expected_footfall >= 0),
    terms_text TEXT,
    review_status TEXT NOT NULL DEFAULT 'draft' 
        CHECK (review_status IN ('draft', 'pending_review', 'approved', 'rejected', 'changes_requested')),
    publication_status TEXT NOT NULL DEFAULT 'unpublished' 
        CHECK (publication_status IN ('unpublished', 'published', 'closed', 'cancelled')),
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT event_dates_check CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS idx_events_discovery 
    ON public.events(city, event_category, publication_status, starts_at);
CREATE INDEX IF NOT EXISTS idx_events_organizer 
    ON public.events(organizer_id);

-- 6. Event Stall Types
CREATE TABLE IF NOT EXISTS public.event_stall_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    vendor_category TEXT NOT NULL,
    price_paise BIGINT NOT NULL CHECK (price_paise >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    total_capacity INTEGER NOT NULL CHECK (total_capacity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_stall_types_event ON public.event_stall_types(event_id);

-- 7. Event Media (Posters, brochures, layout)
CREATE TABLE IF NOT EXISTS public.event_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('poster', 'brochure', 'gallery', 'layout')),
    display_order INTEGER NOT NULL DEFAULT 0,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_event_media_event ON public.event_media(event_id);

-- 8. Applications (Vendors applying for stall slots)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE RESTRICT,
    stall_type_id UUID NOT NULL REFERENCES public.event_stall_types(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
    decision_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    decision_at TIMESTAMPTZ,
    decision_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Unique index to prevent duplicate pending applications for same stall type
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_application 
    ON public.applications(event_id, vendor_id, stall_type_id) 
    WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_applications_vendor ON public.applications(vendor_id);
CREATE INDEX IF NOT EXISTS idx_applications_event ON public.applications(event_id);

-- 9. Bookings (Capacity holds and confirmed bookings)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL UNIQUE REFERENCES public.applications(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE RESTRICT,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE RESTRICT,
    stall_type_id UUID NOT NULL REFERENCES public.event_stall_types(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_paise BIGINT NOT NULL CHECK (unit_price_paise >= 0),
    total_amount_paise BIGINT NOT NULL CHECK (total_amount_paise >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'pending_payment' 
        CHECK (status IN ('pending_payment', 'confirmed', 'completed', 'expired', 'cancelled')),
    hold_expires_at TIMESTAMPTZ NOT NULL,
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_bookings_vendor ON public.bookings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event ON public.bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_stall_active ON public.bookings(stall_type_id, status);

-- 10. Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
    provider TEXT NOT NULL DEFAULT 'razorpay',
    provider_order_id TEXT NOT NULL,
    provider_payment_id TEXT,
    amount_paise BIGINT NOT NULL CHECK (amount_paise >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created' 
        CHECK (status IN ('created', 'pending', 'succeeded', 'failed', 'cancelled', 'expired')),
    idempotency_key TEXT UNIQUE,
    paid_at TIMESTAMPTZ,
    failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(provider_order_id);

-- 11. Payment Webhook Events (Idempotency and audit of callbacks)
CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    processing_status TEXT NOT NULL DEFAULT 'received' 
        CHECK (processing_status IN ('received', 'processed', 'failed', 'ignored')),
    payload JSONB NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    processed_at TIMESTAMPTZ,
    failure_reason TEXT
);

-- 12. Refund Requests
CREATE TABLE IF NOT EXISTS public.refund_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE RESTRICT,
    requested_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'requested' 
        CHECK (status IN ('requested', 'under_review', 'approved', 'rejected', 'processing', 'succeeded', 'failed')),
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    provider_refund_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_refunds_booking ON public.refund_requests(booking_id);

-- 13. Booking Status History (Audit trail of state transitions)
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_history_booking ON public.booking_status_history(booking_id);

-- 14. Admin Audit Logs
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON public.admin_audit_logs(entity_type, entity_id);

-- 15. In-App Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    related_entity_type TEXT,
    related_entity_id UUID,
    read BOOLEAN NOT NULL DEFAULT false,
    delivery_status TEXT NOT NULL DEFAULT 'in_app' 
        CHECK (delivery_status IN ('in_app', 'sent', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, read);
