import { NextResponse } from 'next/server';

import { articlePublicActions } from '@/app/actions/article.actions';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const article = await articlePublicActions.findBySlug(slug);

  if (!article) {
    throw new Error('Article not found');
  }
  return NextResponse.json({
    title: article.title,
    slug: article.slug,
  });
}
