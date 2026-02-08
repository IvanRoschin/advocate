import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { connectDB } from '@/app/lib/server/mongoose';
import { Lead } from '@/models';

export async function GET() {
  try {
    await connectDB();

    const leads = await Lead.find().lean();

    return NextResponse.json({ ok: true, data: leads });
  } catch (err) {
    return errorToResponse(err);
  }
}
