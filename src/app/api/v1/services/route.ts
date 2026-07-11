import { NextResponse } from 'next/server';

import { servicePublicActions } from '@/app/actions/service.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

export async function GET() {
  try {
    const items = await servicePublicActions.list({ limit: 20 });
    return NextResponse.json({ ok: true, data: items });
  } catch (err) {
    return errorToResponse(err);
  }
}
