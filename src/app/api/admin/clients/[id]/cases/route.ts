import { Types } from 'mongoose';
import { NextResponse } from 'next/server';

import {
  caseActions,
  casePublicActions,
} from '@/app/actions/case-admin.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { ValidationError } from '@/app/lib/server/errors';
import { CreateCaseDTO, createCaseSchema } from '@/app/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Некоректний ID клієнта');
    }

    const data = await casePublicActions.getCasesByClientId(id);

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function POST(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Некоректний ID клієнта');
    }

    const body = await req.json();

    const validated = await createCaseSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const data = await caseActions.create({
      ...(validated as CreateCaseDTO),
      clientId: id,
    });

    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (err) {
    return errorToResponse(err);
  }
}
