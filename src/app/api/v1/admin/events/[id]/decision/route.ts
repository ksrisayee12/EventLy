// src/app/api/v1/admin/events/[id]/decision/route.ts
import { NextResponse } from 'next/server';
import { DataService } from '@/services/dataService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.decision || !['approved', 'rejected'].includes(body.decision)) {
      return NextResponse.json(
        { error: { code: 'INVALID_DECISION', message: 'Decision must be approved or rejected.' } },
        { status: 400 }
      );
    }

    const event = await DataService.decideAdminEvent(id, body.decision, body.reason);
    return NextResponse.json({ data: event });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'EVENT_DECISION_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
