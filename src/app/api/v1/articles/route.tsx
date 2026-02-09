import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { connectDB } from '@/app/lib/server/mongoose';
import { Article } from '@/models';

export async function GET() {
  try {
    await connectDB();

    const articles = await Article.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ ok: true, data: articles });
  } catch (err) {
    return errorToResponse(err);
  }
}
