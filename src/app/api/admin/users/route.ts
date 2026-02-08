import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { connectDB } from '@/app/lib/server/mongoose';
import { CreateUserRequestDTO, createUserSchema } from '@/app/types';
import { userService } from '@/lib/services/user.service';

export async function GET() {
  try {
    await connectDB();
    const users = await userService.getAll();

    return NextResponse.json({ ok: true, data: users });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const data: CreateUserRequestDTO = await createUserSchema.validate(body, {
      abortEarly: false,
    });

    const user = await userService.create(data);

    return NextResponse.json({ ok: true, data: user });
  } catch (err) {
    return errorToResponse(err);
  }
}
