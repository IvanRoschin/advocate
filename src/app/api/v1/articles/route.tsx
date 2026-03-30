import { NextResponse } from 'next/server';

import { errorToResponse } from '@/app/lib/server/errors/errorToResponse';
import { dbConnect } from '@/app/lib/server/mongoose';
import { articleService } from '@/app/lib/services';

export async function GET() {
  try {
    await dbConnect();

    const articles = await articleService.getPublicList();

    return NextResponse.json({ ok: true, data: articles });
  } catch (err) {
    return errorToResponse(err);
  }
}
