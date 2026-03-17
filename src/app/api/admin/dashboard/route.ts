import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { dbConnect } from '@/app/lib/server/mongoose';
import { adminDashboardService } from '@/lib/services/admin-dashboard.service';

export async function GET() {
  try {
    await dbConnect();

    const data = await adminDashboardService.getDashboard();

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return errorToResponse(error);
  }
}
