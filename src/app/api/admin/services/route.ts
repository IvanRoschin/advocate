import { NextResponse } from 'next/server';

import { serviceActions } from '@/app/actions/service.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { CreateServiceRequestDTO, createServiceSchema } from '@/app/types';

export async function GET() {
  try {
    const services = await serviceActions.getAll();
    return NextResponse.json({ ok: true, data: services });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validated = await createServiceSchema.validate(body, {
      abortEarly: false,
    });

    const data = validated as CreateServiceRequestDTO;

    const service = await serviceActions.create(data);

    return NextResponse.json({ ok: true, data: service }, { status: 201 });
  } catch (err) {
    return errorToResponse(err);
  }
}
