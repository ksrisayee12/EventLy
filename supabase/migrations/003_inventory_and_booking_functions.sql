-- 003_inventory_and_booking_functions.sql
-- EventLy: Atomic Concurrency and Inventory Hold Operations

-- 1. Helper to calculate live available capacity
CREATE OR REPLACE FUNCTION public.calculate_available_stall_capacity(p_stall_type_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_total_capacity INTEGER;
    v_allocated INTEGER;
BEGIN
    -- Fetch total capacity
    SELECT total_capacity INTO v_total_capacity
    FROM public.event_stall_types
    WHERE id = p_stall_type_id;

    IF NOT FOUND THEN
        RETURN 0;
    END IF;

    -- Calculate sum of confirmed bookings + active pending holds that haven't expired
    SELECT COALESCE(SUM(quantity), 0) INTO v_allocated
    FROM public.bookings
    WHERE stall_type_id = p_stall_type_id
      AND (
          status = 'confirmed' 
          OR (status = 'pending_payment' AND hold_expires_at > timezone('utc', now()))
      );

    RETURN GREATEST(0, v_total_capacity - v_allocated);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Atomic Application Approval & Booking Hold Creation (with row locking)
CREATE OR REPLACE FUNCTION public.approve_application_and_create_hold(
    p_application_id UUID,
    p_decision_by UUID,
    p_hold_duration_minutes INTEGER DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
    v_app RECORD;
    v_stall RECORD;
    v_allocated INTEGER;
    v_available INTEGER;
    v_expires_at TIMESTAMPTZ;
    v_booking_id UUID;
    v_total_amount BIGINT;
BEGIN
    -- Fetch and validate the application
    SELECT * INTO v_app
    FROM public.applications
    WHERE id = p_application_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'APPLICATION_NOT_FOUND: Application does not exist';
    END IF;

    IF v_app.status != 'pending' THEN
        RAISE EXCEPTION 'INVALID_APPLICATION_STATUS: Only pending applications can be approved (current: %)', v_app.status;
    END IF;

    -- Lock the stall type row to serialize concurrent approvals and prevent race conditions
    SELECT * INTO v_stall
    FROM public.event_stall_types
    WHERE id = v_app.stall_type_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'STALL_TYPE_NOT_FOUND: Stall type does not exist';
    END IF;

    -- Count allocated units (confirmed + active holds)
    SELECT COALESCE(SUM(quantity), 0) INTO v_allocated
    FROM public.bookings
    WHERE stall_type_id = v_stall.id
      AND (
          status = 'confirmed'
          OR (status = 'pending_payment' AND hold_expires_at > timezone('utc', now()))
      );

    v_available := v_stall.total_capacity - v_allocated;

    IF v_available < v_app.quantity THEN
        RAISE EXCEPTION 'CAPACITY_UNAVAILABLE: Only % stalls available, requested %', v_available, v_app.quantity;
    END IF;

    -- Calculate total and hold expiry
    v_total_amount := v_stall.price_paise * v_app.quantity;
    v_expires_at := timezone('utc', now()) + (p_hold_duration_minutes || ' minutes')::interval;

    -- 1. Update application status
    UPDATE public.applications
    SET status = 'approved',
        decision_by = p_decision_by,
        decision_at = timezone('utc', now()),
        updated_at = timezone('utc', now())
    WHERE id = p_application_id;

    -- 2. Create the booking with pending_payment status and time-limited hold
    INSERT INTO public.bookings (
        application_id,
        vendor_id,
        event_id,
        stall_type_id,
        quantity,
        unit_price_paise,
        total_amount_paise,
        currency,
        status,
        hold_expires_at,
        created_at,
        updated_at
    ) VALUES (
        v_app.id,
        v_app.vendor_id,
        v_app.event_id,
        v_app.stall_type_id,
        v_app.quantity,
        v_stall.price_paise,
        v_total_amount,
        v_stall.currency,
        'pending_payment',
        v_expires_at,
        timezone('utc', now()),
        timezone('utc', now())
    ) RETURNING id INTO v_booking_id;

    -- 3. Record status history
    INSERT INTO public.booking_status_history (
        booking_id,
        previous_status,
        new_status,
        actor_id,
        reason
    ) VALUES (
        v_booking_id,
        NULL,
        'pending_payment',
        p_decision_by,
        'Application approved, hold created for ' || p_hold_duration_minutes || ' minutes'
    );

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', v_booking_id,
        'total_amount_paise', v_total_amount,
        'hold_expires_at', v_expires_at,
        'currency', v_stall.currency
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Release Expired Holds
CREATE OR REPLACE FUNCTION public.release_expired_holds()
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER := 0;
    r RECORD;
BEGIN
    FOR r IN 
        SELECT id FROM public.bookings
        WHERE status = 'pending_payment'
          AND hold_expires_at <= timezone('utc', now())
    LOOP
        UPDATE public.bookings
        SET status = 'expired',
            updated_at = timezone('utc', now())
        WHERE id = r.id;

        INSERT INTO public.booking_status_history (
            booking_id,
            previous_status,
            new_status,
            actor_id,
            reason
        ) VALUES (
            r.id,
            'pending_payment',
            'expired',
            NULL,
            'Hold reservation expired before payment verification'
        );

        v_count := v_count + 1;
    END LOOP;

    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Confirm Verified Booking Payment
CREATE OR REPLACE FUNCTION public.confirm_booking_payment(
    p_booking_id UUID,
    p_payment_id UUID,
    p_actor_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_booking RECORD;
BEGIN
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'BOOKING_NOT_FOUND';
    END IF;

    IF v_booking.status = 'confirmed' THEN
        -- Idempotent return if already confirmed
        RETURN jsonb_build_object('success', true, 'status', 'already_confirmed');
    END IF;

    -- Update booking status
    UPDATE public.bookings
    SET status = 'confirmed',
        confirmed_at = timezone('utc', now()),
        updated_at = timezone('utc', now())
    WHERE id = p_booking_id;

    -- Update payment status
    UPDATE public.payments
    SET status = 'succeeded',
        paid_at = timezone('utc', now()),
        updated_at = timezone('utc', now())
    WHERE id = p_payment_id;

    -- Log history
    INSERT INTO public.booking_status_history (
        booking_id,
        previous_status,
        new_status,
        actor_id,
        reason
    ) VALUES (
        p_booking_id,
        v_booking.status,
        'confirmed',
        p_actor_id,
        'Payment verified successfully'
    );

    RETURN jsonb_build_object('success', true, 'status', 'confirmed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
