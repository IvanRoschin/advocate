import { NextResponse } from 'next/server';

import type { ApiResponse } from '@/app/lib/server/ApiError';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { dbConnect } from '@/app/lib/server/mongoose';
import { leadService } from '@/app/lib/services';
import { LeadResponseDTO } from '@/app/types';
export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const lead = await leadService.create(body);

    return NextResponse.json<ApiResponse<LeadResponseDTO>>(
      { ok: true, data: lead },
      { status: 201 }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}
