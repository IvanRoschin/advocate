import { NextResponse } from 'next/server';

import { leadActions } from '@/app/actions/lead.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { LeadResponseDTO } from '@/app/types';

import type { ApiResponse } from '@/app/lib/server/ApiError';
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const lead = await leadActions.create(body);

    return NextResponse.json<ApiResponse<LeadResponseDTO>>(
      { ok: true, data: lead },
      { status: 201 }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}
