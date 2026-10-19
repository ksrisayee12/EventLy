// src/app/api/v1/admin/refunds/[id]/decision/route.ts
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

    const result = await DataService.decideRefundRequest(
      id,
      body.decision,
      body.reviewerId || '00000000-0000-0000-0000-000000000001',
      body.reason
    );

    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'REFUND_DECISION_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
