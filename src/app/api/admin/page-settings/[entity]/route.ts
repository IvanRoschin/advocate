import { NextRequest, NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { pageSettingsService } from '@/app/lib/services/page-settings.service';
import type { UpdatePageSettingsDTO } from '@/app/types';
import { normalizePageLayout, updatePageSettingsSchema } from '@/app/types';
type PageSettingsEntity = UpdatePageSettingsDTO['entity'];

const isPageSettingsEntity = (value: string): value is PageSettingsEntity =>
  value === 'article' || value === 'service';

const assertPageSettingsEntity = (value: string): PageSettingsEntity => {
  if (!isPageSettingsEntity(value)) {
    throw new ValidationError('Некоректний entity параметр');
  }

  return value;
};

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;
    const safeEntity = assertPageSettingsEntity(entity);

    const data = await pageSettingsService.getByEntity(safeEntity);

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;
    const safeEntity = assertPageSettingsEntity(entity);
    const body = await req.json();

    const validated = await updatePageSettingsSchema.validate(
      { ...body, entity: safeEntity },
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );

    const data: UpdatePageSettingsDTO = {
      entity: safeEntity,
      layout: normalizePageLayout(validated.layout),
    };

    const saved = await pageSettingsService.update(data);

    return NextResponse.json({ ok: true, data: saved });
  } catch (err) {
    return errorToResponse(err);
  }
}
