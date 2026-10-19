// src/app/api/v1/applications/[id]/decision/route.ts
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

    const result = await DataService.decideApplication({
      applicationId: id,
      decision: body.decision,
      decisionBy: body.decisionBy || '00000000-0000-0000-0000-000000000002',
      reason: body.reason,
      holdDurationMinutes: 30,
    });

    return NextResponse.json({ data: result });
  } catch (error: any) {
    if (error.message?.includes('CAPACITY_UNAVAILABLE')) {
      return NextResponse.json(
        { error: { code: 'CAPACITY_UNAVAILABLE', message: error.message } },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: { code: 'DECISION_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
