// src/app/api/v1/events/[id]/route.ts
import { NextResponse } from 'next/server';
import { DataService } from '@/services/dataService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await DataService.getEventById(id);

    if (!event) {
      return NextResponse.json(
        { error: { code: 'EVENT_NOT_FOUND', message: 'Event does not exist.' } },
        { status: 404 }
      );
    }

    const stallTypes = await DataService.getStallTypesForEvent(id);

    return NextResponse.json({
      data: {
        ...event,
        stall_types: stallTypes,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'EVENT_DETAILS_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
