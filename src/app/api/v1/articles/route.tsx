import { NextResponse } from 'next/server';

import { Article } from '@/models';
import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { dbConnect } from '@/app/lib/server/mongoose';

export async function GET() {
  try {
    await dbConnect();

    const articles = await Article.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ ok: true, data: articles });
  } catch (err) {
    return errorToResponse(err);
  }
}
