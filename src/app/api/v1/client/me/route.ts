// app/api/client/me/route.ts
import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { clientCabinetService } from '@/app/lib/services/client-access.service';

export async function GET() {
  try {
    const data = await clientCabinetService.getMyOverview();

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return errorToResponse(err);
  }
}
