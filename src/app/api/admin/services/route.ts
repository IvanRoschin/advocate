import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { dbConnect } from '@/app/lib/server/mongoose';
import { serviceService } from '@/app/lib/services/service.service';
import { CreateServiceRequestDTO, createServiceSchema } from '@/app/types';

export async function GET() {
  try {
    await dbConnect();

    const services = await serviceService.getAll();
    return NextResponse.json({ ok: true, data: services });
  } catch (err) {
    return errorToResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const validated = await createServiceSchema.validate(body, {
      abortEarly: false,
    });

    const data = validated as CreateServiceRequestDTO;

    const service = await serviceService.create(data);

    return NextResponse.json({ ok: true, data: service }, { status: 201 });
  } catch (err) {
    return errorToResponse(err);
  }
}
