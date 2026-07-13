import { NextResponse } from 'next/server';

import { userActions } from '@/app/actions/user.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';

export async function GET() {
  try {
    const users = await userActions.getAll();

    return NextResponse.json({ ok: true, data: users });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await userActions.create(body);

    return NextResponse.json({ ok: true, data: user });
  } catch (err) {
    return errorToResponse(err);
  }
}
