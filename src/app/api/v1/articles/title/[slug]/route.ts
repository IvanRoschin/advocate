import { NextResponse } from 'next/server';

import { articleService } from '@/app/lib/services/article.service';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const article = await articleService.getPublicBySlug(slug);

  return NextResponse.json({
    title: article.title,
    slug: article.slug,
  });
}
