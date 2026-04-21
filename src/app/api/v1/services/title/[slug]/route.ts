import { NextResponse } from 'next/server';

import { serviceService } from '@/app/lib/services';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const service = await serviceService.getPublicBySlug(slug);

  return NextResponse.json({
    title: service.title,
    slug: service.slug,
  });
}
