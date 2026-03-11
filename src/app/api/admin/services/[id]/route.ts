import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { serviceService } from '@/app/lib/services/service.service';
import { UpdateServiceDTO, updateServiceSchema } from '@/app/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const service = await serviceService.getById(id);

    return NextResponse.json({ ok: true, data: service });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();

    const validated = await updateServiceSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const data = Object.fromEntries(
      Object.entries(validated as Record<string, unknown>).filter(
        ([, value]) => value !== undefined
      )
    ) as UpdateServiceDTO;

    const service = await serviceService.update(id, data);

    return NextResponse.json({ ok: true, data: service });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const result = await serviceService.delete(id);

    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    return errorToResponse(err);
  }
}
