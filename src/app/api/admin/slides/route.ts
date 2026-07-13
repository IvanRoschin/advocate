import { NextResponse } from 'next/server';

import { slideActions } from '@/app/actions/slide.actions';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { CreateSlideDTO, createSlideSchema } from '@/app/types';

export async function GET() {
  try {
    const slides = await slideActions.getAll();

    return NextResponse.json({ ok: true, data: slides });
  } catch (error) {
    errorToResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validated = await createSlideSchema.validate(body, {
      abortEarly: false,
    });

    const data = validated as CreateSlideDTO;

    const slide = await slideActions.create(data);

    return NextResponse.json({ ok: true, data: slide }, { status: 201 });
  } catch (error) {
    return errorToResponse(error);
  }
}
