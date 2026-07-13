import { NextResponse } from 'next/server';

import { leadPublicActions } from '@/app/actions/lead.actions';
import type { ApiResponse } from '@/app/lib/server/ApiError';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { LeadResponseDTO } from '@/app/types';
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const lead = await leadPublicActions.create(body);

    return NextResponse.json<ApiResponse<LeadResponseDTO>>(
      { ok: true, data: lead },
      { status: 201 }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}
