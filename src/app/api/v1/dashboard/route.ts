import { NextRequest, NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { clientDashboardService } from '@/app/lib/services/client-dashboard.service';

export async function GET(req: NextRequest) {
  try {
    const clientId = req.nextUrl.searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Відсутній clientId',
          },
        },
        { status: 400 }
      );
    }

    const data = await clientDashboardService.getByClientId(clientId);

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return errorToResponse(err);
  }
}
