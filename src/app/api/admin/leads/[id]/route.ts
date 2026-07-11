import { NextResponse } from 'next/server';

import { leadActions } from '@/app/actions/lead.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { adminLeadSubmitSchema, UpdateLeadDTO } from '@/app/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const lead = await leadActions.getById(id);

    return NextResponse.json({ ok: true, data: lead });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();

    const validated = await adminLeadSubmitSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const data = Object.fromEntries(
      Object.entries(validated as Record<string, unknown>).filter(
        ([, value]) => value !== undefined
      )
    ) as UpdateLeadDTO;

    const lead = await leadActions.update(id, data);

    return NextResponse.json({ ok: true, data: lead });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const result = await leadActions.delete(id);

    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    return errorToResponse(err);
  }
}
