import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { clientDashboardActions } from '@/app/actions/client-dashboard.actions';
import { authOptions } from '@/app/config/authOptions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { UnauthorizedError } from '@/app/lib/server/errors/httpErrors';

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

    // Was previously trusting the client-supplied clientId with no auth
    // check at all — anyone could read any client's dashboard/case data.
    // Only the session's own active client may be requested.
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.activeClientId !== clientId) {
      throw new UnauthorizedError();
    }

    const data = await clientDashboardActions.getByClientId({ clientId });

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return errorToResponse(err);
  }
}
