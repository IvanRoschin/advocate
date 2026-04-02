import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { dbConnect } from '@/app/lib/server/mongoose';
import { slideService } from '@/app/lib/services/slide.service';
import { UpdateSlideDTO, updateSlideSchema } from '@/app/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    await dbConnect();
    const { id } = await params;

    const slide = await slideService.getById(id);

    if (!slide) {
      return NextResponse.json({ message: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: slide });
  } catch (error) {
    return errorToResponse(error);
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const validated = await updateSlideSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const data = Object.fromEntries(
      Object.entries(validated as Record<string, unknown>).filter(
        ([, value]) => value !== undefined
      )
    ) as UpdateSlideDTO;

    const slide = await slideService.update(id, data);

    if (!slide) {
      return NextResponse.json({ message: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: slide });
  } catch (error) {
    return errorToResponse(error);
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    await dbConnect();
    const { id } = await params;

    const result = await slideService.delete(id);

    if (!result) {
      return NextResponse.json({ message: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    return errorToResponse(error);
  }
}
