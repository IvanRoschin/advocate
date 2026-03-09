import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { serviceService } from '@/app/lib/services/service.service';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const item = await serviceService.getPublicBySlug(slug);

    return NextResponse.json({ ok: true, data: item });
  } catch (err) {
    return errorToResponse(err);
  }
}
