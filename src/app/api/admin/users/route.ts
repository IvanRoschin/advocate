import { NextResponse } from 'next/server';

import { userActions } from '@/app/actions/user.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { CreateUserRequestDTO, createUserSchema } from '@/app/types';

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

    const validated = await createUserSchema.validate(body, {
      abortEarly: false,
    });

    const data = validated as CreateUserRequestDTO;

    const user = await userActions.create(data);

    return NextResponse.json({ ok: true, data: user }, { status: 201 });
  } catch (err) {
    return errorToResponse(err);
  }
}
