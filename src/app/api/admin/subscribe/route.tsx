import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { connectDB } from '@/app/lib/server/mongoose';
import { Subscriber } from '@/models';

export async function GET() {
  try {
    await connectDB();

    const subscribers = await Subscriber.find().lean();

    return NextResponse.json({ ok: true, data: subscribers });
  } catch (err) {
    return errorToResponse(err);
  }
}
