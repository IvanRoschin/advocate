import { articleService } from '@/app/lib/services/article.service';

import { ArticleListPreview } from './components/ArticleListPreview';

// import { ArticleListPreviewSkeleton } from "@/app/blog/_components/ArticleListPreviewSkeleton";

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const items = await articleService.getPublicList();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Блог</h1>
        <p className="text-muted-foreground text-sm">
          Корисні матеріали, пояснення та практика.
        </p>
      </div>

      <ArticleListPreview items={items} baseHref="/blog" />
    </main>
  );
}
