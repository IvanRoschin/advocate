import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { dbConnect } from '@/app/lib/server/mongoose';
import { slideService } from '@/app/lib/services/slide.service';
import { CreateSlideDTO, createSlideSchema } from '@/app/types';

export async function GET() {
  try {
    await dbConnect();

    const slides = await slideService.getAll();

    return NextResponse.json({ ok: true, data: slides });
  } catch (error) {
    errorToResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const validated = await createSlideSchema.validate(body, {
      abortEarly: false,
    });

    const data = validated as CreateSlideDTO;

    const slide = await slideService.create(data);

    return NextResponse.json({ ok: true, data: slide }, { status: 201 });
  } catch (error) {
    return errorToResponse(error);
  }
}
