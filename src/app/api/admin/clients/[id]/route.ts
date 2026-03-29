import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { clientService } from '@/app/lib/services/client.service';
import { UpdateClientDTO, updateClientSchema } from '@/app/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const client = await clientService.getById(id);

    return NextResponse.json({ ok: true, data: client });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();

    const validated = await updateClientSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const data = Object.fromEntries(
      Object.entries(validated as Record<string, unknown>).filter(
        ([, value]) => value !== undefined
      )
    ) as UpdateClientDTO;

    const client = await clientService.update(id, data);

    return NextResponse.json({ ok: true, data: client });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const client = await clientService.delete(id);

    return NextResponse.json({ ok: true, data: client });
  } catch (err) {
    return errorToResponse(err);
  }
}
