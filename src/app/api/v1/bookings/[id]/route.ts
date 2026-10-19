// src/app/api/v1/bookings/[id]/route.ts
import { NextResponse } from 'next/server';
import { DataService } from '@/services/dataService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await DataService.getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { error: { code: 'BOOKING_NOT_FOUND', message: 'Booking does not exist.' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: booking });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'BOOKING_FETCH_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
