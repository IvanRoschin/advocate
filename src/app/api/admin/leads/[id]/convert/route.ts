import { NextResponse } from 'next/server';

import { leadActions, leadAdminActions } from '@/app/actions/lead.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const result = await leadAdminActions.convertToClient(id);

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
