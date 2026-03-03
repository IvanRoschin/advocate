import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import { dbConnect } from '@/app/lib/server/mongoose';
import { UpdateUserDTO, updateUserSchema } from '@/app/types';
import { userService } from '@/lib/services/user.service';

interface Params {
  id: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!id) throw new ValidationError('ID не вказано');

    const user = await userService.getById(id);
    return NextResponse.json({ ok: true, data: user });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const body = await req.json();
    const data: UpdateUserDTO = await updateUserSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const updated = await userService.update(id, data);
    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const deleted = await userService.delete(id);
    return NextResponse.json({ ok: true, data: deleted });
  } catch (err) {
    return errorToResponse(err);
  }
}
