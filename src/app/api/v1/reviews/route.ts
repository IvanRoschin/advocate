import { NextRequest, NextResponse } from 'next/server';

import { reviewService } from '@/app/lib/services/review.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const created = await reviewService.create(body);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create review';

    return NextResponse.json({ message }, { status: 400 });
  }
}
