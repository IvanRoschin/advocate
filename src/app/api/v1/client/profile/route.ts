import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { clientCabinetService } from '@/app/lib/services/client-access.service';
import { UpdateClientProfileDto, updateClientProfileSchema } from '@/app/types';

export async function GET() {
  try {
    const data = await clientCabinetService.getMyProfile();

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const validated = await updateClientProfileSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const data = await clientCabinetService.updateMyProfile(
      validated as UpdateClientProfileDto
    );

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return errorToResponse(err);
  }
}
