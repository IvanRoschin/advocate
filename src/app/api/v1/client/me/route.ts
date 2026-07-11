// app/api/client/me/route.ts
import { NextResponse } from 'next/server';

import { clientAccessActions } from '@/app/actions/client-access.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

export async function GET() {
  try {
    const data = await clientAccessActions.getMyOverview();

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return errorToResponse(err);
  }
}
