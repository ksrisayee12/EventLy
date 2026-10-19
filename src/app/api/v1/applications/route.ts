// src/app/api/v1/applications/route.ts
import { NextResponse } from 'next/server';
import { DataService } from '@/services/dataService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'vendor';
    const userId = searchParams.get('userId') || '22222222-2222-2222-2222-222222222222';

    if (role === 'organizer') {
      const apps = await DataService.getOrganizerApplications('11111111-1111-1111-1111-111111111111');
      return NextResponse.json({ data: apps });
    } else {
      const apps = await DataService.getVendorApplications(userId);
      return NextResponse.json({ data: apps });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'APPLICATIONS_FETCH_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.eventId || !body.stallTypeId || !body.quantity || body.quantity < 1) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Valid stallTypeId and positive quantity are required.' } },
        { status: 400 }
      );
    }

    const application = await DataService.submitApplication({
      eventId: body.eventId,
      vendorId: body.vendorId || '22222222-2222-2222-2222-222222222222',
      stallTypeId: body.stallTypeId,
      quantity: Number(body.quantity),
      message: body.message,
    });

    return NextResponse.json({ data: application }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('DUPLICATE_APPLICATION')) {
      return NextResponse.json(
        { error: { code: 'DUPLICATE_APPLICATION', message: error.message } },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: { code: 'APPLICATION_SUBMIT_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
