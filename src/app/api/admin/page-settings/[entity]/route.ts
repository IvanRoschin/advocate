import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { pageSettingsService } from '@/app/lib/services/page-settings.service';
import type { UpdatePageSettingsDTO } from '@/app/types';
import { updatePageSettingsSchema } from '@/app/types';
type RouteContext = {
  params: Promise<{ entity: 'article' | 'service' }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { entity } = await params;
    const data = await pageSettingsService.getByEntity(entity);

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    const { entity } = await params;
    const body = await req.json();

    const validated = await updatePageSettingsSchema.validate(
      { ...body, entity },
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );

    const data = validated as UpdatePageSettingsDTO;

    const saved = await pageSettingsService.update(data);

    return NextResponse.json({ ok: true, data: saved });
  } catch (err) {
    return errorToResponse(err);
  }
}
