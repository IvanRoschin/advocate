import { NextResponse } from 'next/server';

import { servicePublicActions } from '@/app/actions/service.actions';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const service = await servicePublicActions.findPublishedBySlug({ slug });

  return NextResponse.json({
    title: service.title,
    slug: service.slug,
  });
}
