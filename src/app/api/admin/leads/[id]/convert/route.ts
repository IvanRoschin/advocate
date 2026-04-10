import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { leadService } from '@/app/lib/services/lead.service';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const result = await leadService.convertToClient(id);

    return NextResponse.json({
      ok: true,
      message: 'Ліда успішно конвертовано в клієнта та видалено',
      data: result,
      meta: {
        convertedLeadId: id,
        leadDeleted: true,
      },
    });
  } catch (err) {
    return errorToResponse(err);
  }
}
