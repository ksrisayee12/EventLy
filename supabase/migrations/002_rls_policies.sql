-- 002_rls_policies.sql
-- EventLy: Row Level Security (RLS) & Access Control

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_stall_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function: Is current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles
CREATE POLICY "Public profiles are readable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- 2. Organizer Profiles
CREATE POLICY "Organizers can read and manage their own profile"
    ON public.organizer_profiles FOR ALL
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Public can view verified organizer basic info"
    ON public.organizer_profiles FOR SELECT
    TO anon, authenticated
    USING (verification_status = 'verified');

-- 3. Vendor Profiles
CREATE POLICY "Vendors can read and manage their own profile"
    ON public.vendor_profiles FOR ALL
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

-- 4. Organizer Verifications
CREATE POLICY "Only admins can manage organizer verifications"
    ON public.organizer_verifications FOR ALL
    TO authenticated
    USING (public.is_admin());

-- 5. Events
CREATE POLICY "Public can view published approved events"
    ON public.events FOR SELECT
    TO anon, authenticated
    USING (publication_status = 'published' AND review_status = 'approved');

CREATE POLICY "Organizers can manage their own events"
    ON public.events FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.organizer_profiles op 
            WHERE op.id = events.organizer_id AND op.user_id = auth.uid()
        ) OR public.is_admin()
    );

-- 6. Event Stall Types
CREATE POLICY "Public can view stall types for published events"
    ON public.event_stall_types FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_stall_types.event_id 
              AND e.publication_status = 'published' 
              AND e.review_status = 'approved'
        )
    );

CREATE POLICY "Organizers can view and edit stall types of their events"
    ON public.event_stall_types FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.organizer_profiles op ON op.id = e.organizer_id
            WHERE e.id = event_stall_types.event_id AND op.user_id = auth.uid()
        ) OR public.is_admin()
    );

-- 7. Event Media
CREATE POLICY "Public can view media for published events"
    ON public.event_media FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_media.event_id 
              AND e.publication_status = 'published'
        )
    );

CREATE POLICY "Organizers can manage media for their events"
    ON public.event_media FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.organizer_profiles op ON op.id = e.organizer_id
            WHERE e.id = event_media.event_id AND op.user_id = auth.uid()
        ) OR public.is_admin()
    );

-- 8. Applications
CREATE POLICY "Vendors can view and create their own applications"
    ON public.applications FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.vendor_profiles vp
            WHERE vp.id = applications.vendor_id AND vp.user_id = auth.uid()
        ) OR public.is_admin()
    );

CREATE POLICY "Organizers can view applications for their events"
    ON public.applications FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.organizer_profiles op ON op.id = e.organizer_id
            WHERE e.id = applications.event_id AND op.user_id = auth.uid()
        )
    );

-- 9. Bookings
CREATE POLICY "Vendors can view their own bookings"
    ON public.bookings FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.vendor_profiles vp
            WHERE vp.id = bookings.vendor_id AND vp.user_id = auth.uid()
        ) OR public.is_admin()
    );

CREATE POLICY "Organizers can view bookings for their events"
    ON public.bookings FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.organizer_profiles op ON op.id = e.organizer_id
            WHERE e.id = bookings.event_id AND op.user_id = auth.uid()
        ) OR public.is_admin()
    );

-- 10. Payments
CREATE POLICY "Vendors can view payments for their bookings"
    ON public.payments FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            JOIN public.vendor_profiles vp ON vp.id = b.vendor_id
            WHERE b.id = payments.booking_id AND vp.user_id = auth.uid()
        ) OR public.is_admin()
    );

-- 11. Payment Webhook Events (Only admin and server service role)
CREATE POLICY "Admin only for payment webhook events"
    ON public.payment_webhook_events FOR ALL
    TO authenticated
    USING (public.is_admin());

-- 12. Refund Requests
CREATE POLICY "Vendors can view and create their own refund requests"
    ON public.refund_requests FOR ALL
    TO authenticated
    USING (requested_by = auth.uid() OR public.is_admin());

-- 13. Notifications
CREATE POLICY "Users can view and manage their own notifications"
    ON public.notifications FOR ALL
    TO authenticated
    USING (recipient_id = auth.uid());

-- 14. Admin Audit Logs
CREATE POLICY "Only admins can view audit logs"
    ON public.admin_audit_logs FOR SELECT
    TO authenticated
    USING (public.is_admin());
