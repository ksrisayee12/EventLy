// src/app/api/v1/events/route.ts
import { NextResponse } from 'next/server';
import { DataService } from '@/services/dataService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || undefined;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const events = await DataService.getPublicEvents({ city, category, search });
    return NextResponse.json({ data: events });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'EVENTS_FETCH_FAILED', message: error.message || 'Failed to fetch events' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation
    if (!body.title || !body.venue_name || !body.city || !body.starts_at || !body.ends_at) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Missing required event fields.' } },
        { status: 400 }
      );
    }

    if (new Date(body.ends_at) <= new Date(body.starts_at)) {
      return NextResponse.json(
        { error: { code: 'INVALID_DATES', message: 'Event end time must be after start time.' } },
        { status: 422 }
      );
    }

    const event = await DataService.createEvent(
      {
        organizer_id: body.organizer_id || '11111111-1111-1111-1111-111111111111',
        title: body.title,
        description: body.description || '',
        event_category: body.event_category || 'Exhibition',
        venue_name: body.venue_name,
        address: body.address || '',
        city: body.city,
        state: body.state || 'State',
        country: 'India',
        starts_at: body.starts_at,
        ends_at: body.ends_at,
        expected_footfall: body.expected_footfall || 1000,
        terms_text: body.terms_text || '',
        review_status: 'pending_review',
        publication_status: 'unpublished',
        rejection_reason: null,
        submitted_at: new Date().toISOString(),
        published_at: null,
      },
      body.stall_types || []
    );

    return NextResponse.json({ data: event }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'EVENT_CREATION_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
