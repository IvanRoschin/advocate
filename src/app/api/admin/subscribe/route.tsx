import { NextResponse } from 'next/server';

import { Subscriber } from '@/models';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { dbConnect } from '@/app/lib/server/mongoose';

export async function GET() {
  try {
    await dbConnect();

    const subscribers = await Subscriber.find().lean();

    return NextResponse.json({ ok: true, data: subscribers });
  } catch (err) {
    return errorToResponse(err);
  }
}
