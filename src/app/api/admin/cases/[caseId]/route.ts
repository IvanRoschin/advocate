import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { caseAdminService } from '@/app/lib/services/case-admin.service';
import { UpdateCaseDTO, updateCaseSchema } from '@/app/types';

type RouteContext = {
  params: Promise<{ caseId: string }>;
};

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { caseId } = await params;
    const body = await req.json();

    const validated = await updateCaseSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const data = Object.fromEntries(
      Object.entries(validated as Record<string, unknown>).filter(
        ([, value]) => value !== undefined
      )
    ) as UpdateCaseDTO;

    const updated = await caseAdminService.update(caseId, data);

    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const { caseId } = await params;
    const data = await caseAdminService.delete(caseId);

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return errorToResponse(err);
  }
}
