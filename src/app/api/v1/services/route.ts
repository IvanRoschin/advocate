import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { serviceService } from '@/app/lib/services/service.service';

export async function GET() {
  try {
    const items = await serviceService.getPublicList();
    return NextResponse.json({ ok: true, data: items });
  } catch (err) {
    return errorToResponse(err);
  }
}
