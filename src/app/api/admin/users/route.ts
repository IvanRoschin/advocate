import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { userService } from '@/lib/services/user.service';

export async function GET() {
  try {
    const users = await userService.getAll();

    return NextResponse.json({ ok: true, data: users });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await userService.createWithNotifications(body);

    return NextResponse.json({ ok: true, data: user });
  } catch (err) {
    return errorToResponse(err);
  }
}
