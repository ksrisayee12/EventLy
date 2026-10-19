-- seed.sql
-- EventLy: Seed Data for Local Development & Testing Only
-- [DEV ONLY - NOT FOR PRODUCTION]

-- Insert Demo Admin Profile (Assumes auth user UUID or mock testing)
DO $$
DECLARE
    v_admin_id UUID := '00000000-0000-0000-0000-000000000001';
    v_organizer_user_id UUID := '00000000-0000-0000-0000-000000000002';
    v_vendor_user_id UUID := '00000000-0000-0000-0000-000000000003';
    v_organizer_id UUID := '11111111-1111-1111-1111-111111111111';
    v_vendor_id UUID := '22222222-2222-2222-2222-222222222222';
    v_event_id UUID := '33333333-3333-3333-3333-333333333333';
    v_stall_standard UUID := '44444444-4444-4444-4444-444444444441';
    v_stall_premium UUID := '44444444-4444-4444-4444-444444444442';
BEGIN
    -- 1. Profiles (Demo)
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES 
        (v_admin_id, 'EventLy Admin (Demo)', '+919876543210', 'admin'),
        (v_organizer_user_id, 'Kavita Sharma (Organizer)', '+919812345678', 'organizer'),
        (v_vendor_user_id, 'Rohan Verma (Artisan Vendor)', '+919765432109', 'vendor')
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

    -- 2. Organizer Profile
    INSERT INTO public.organizer_profiles (id, user_id, organization_name, contact_person, business_email, business_phone, address, verification_status)
    VALUES (
        v_organizer_id,
        v_organizer_user_id,
        'Bengaluru Cultural Expos Pvt Ltd',
        'Kavita Sharma',
        'kavita@bangaloreculturalexpos.in',
        '+919812345678',
        'Indiranagar 100ft Road, Bengaluru, Karnataka',
        'verified'
    ) ON CONFLICT (user_id) DO UPDATE SET organization_name = EXCLUDED.organization_name;

    -- 3. Vendor Profile
    INSERT INTO public.vendor_profiles (id, user_id, business_name, business_category, contact_phone, business_description)
    VALUES (
        v_vendor_id,
        v_vendor_user_id,
        'Clay & Craft Studio',
        'Handmade Ceramics & Pottery',
        '+919765432109',
        'Handcrafted artisanal ceramics, dinnerware, and terracotta home decor items.'
    ) ON CONFLICT (user_id) DO UPDATE SET business_name = EXCLUDED.business_name;

    -- 4. Demo Published Event
    INSERT INTO public.events (
        id, organizer_id, title, description, event_category, 
        venue_name, address, city, state, country, 
        starts_at, ends_at, expected_footfall, terms_text,
        review_status, publication_status, published_at
    ) VALUES (
        v_event_id,
        v_organizer_id,
        'Bengaluru Spring Artisan & Flea Festival 2026',
        'Join the premier cultural and lifestyle exhibition featuring 80+ curated indie makers, craft food pop-ups, artisanal fashion, and live acoustic music.',
        'Flea Market & Craft Expo',
        'Jaymahal Palace Exhibition Grounds',
        '1, Jayamahal Road, near Cantonment Railway Station',
        'Bengaluru',
        'Karnataka',
        'India',
        timezone('utc', now() + interval '14 days'),
        timezone('utc', now() + interval '16 days'),
        8500,
        'Standard electricity (1 socket, 5A) included. No plastic bags allowed. Setup strictly between 7:00 AM - 9:30 AM on Day 1.',
        'approved',
        'published',
        timezone('utc', now())
    ) ON CONFLICT (id) DO NOTHING;

    -- 5. Stall Types
    INSERT INTO public.event_stall_types (id, event_id, name, description, vendor_category, price_paise, currency, total_capacity)
    VALUES 
        (v_stall_standard, v_event_id, 'Standard Stall (6x6 ft)', 'Ideal for apparel, accessories, craft items, and small packaged food.', 'Handmade / Lifestyle', 1200000, 'INR', 40),
        (v_stall_premium, v_event_id, 'Corner Canopy Stall (10x10 ft)', 'High-visibility corner placement with 2 side open display and 15A power plug.', 'Gourmet Food / Premium Brand', 2500000, 'INR', 15)
    ON CONFLICT (id) DO NOTHING;

END $$;
