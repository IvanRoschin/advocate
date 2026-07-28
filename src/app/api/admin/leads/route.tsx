import { NextResponse } from 'next/server';

import { leadActions } from '@/app/actions/lead.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { adminLeadSubmitSchema, CreateLeadDTO } from '@/app/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 20);

    const result = await leadActions.getAll({ page, limit });

    return NextResponse.json({
      ok: true,
      data: result.items,
      meta: { page, limit, hasMore: result.hasMore },
    });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validated = await adminLeadSubmitSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const lead = await leadActions.create(validated as CreateLeadDTO);

    return NextResponse.json({ ok: true, data: lead }, { status: 201 });
  } catch (err) {
    return errorToResponse(err);
  }
}
