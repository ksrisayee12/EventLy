// src/app/api/v1/refunds/route.ts
import { NextResponse } from 'next/server';
import { DataService } from '@/services/dataService';

export async function GET() {
  try {
    const refunds = await DataService.getAllRefundRequests();
    return NextResponse.json({ data: refunds });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'REFUNDS_FETCH_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.bookingId || !body.reason) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Booking ID and reason are required.' } },
        { status: 400 }
      );
    }

    const refund = await DataService.submitRefundRequest({
      bookingId: body.bookingId,
      requestedBy: body.requestedBy || '00000000-0000-0000-0000-000000000003',
      reason: body.reason,
    });

    return NextResponse.json({ data: refund }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'REFUND_REQUEST_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
