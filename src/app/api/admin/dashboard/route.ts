import { NextResponse } from 'next/server';

import { adminDashboardActions } from '@/app/actions/admin-dashboard.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

export async function GET() {
  try {
    const data = await adminDashboardActions.getCounters();

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return errorToResponse(error);
  }
}
