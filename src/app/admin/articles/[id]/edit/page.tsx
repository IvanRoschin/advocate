import { articleService } from '@/app/lib/services/article.service';
import { categoryService } from '@/app/lib/services/category.service';
import { userService } from '@/app/lib/services/user.service';
import { mapArticleToResponse } from '@/app/types';
import ArticleEditorClient from '../../_components/ArticleEditorClient';

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [articleRaw, usersRaw, categoriesRaw] = await Promise.all([
    articleService.getById(id),
    userService.getAll(),
    categoryService.getAll(),
  ]);

  const article = mapArticleToResponse(articleRaw);

  const users = usersRaw.map(u => ({
    id: String(u._id ?? u._id),
    name: u.name,
  }));
  const categories = categoriesRaw.map(c => ({
    id: String(c._id ?? c.id),
    title: c.title,
  }));

  return (
    <ArticleEditorClient
      mode="edit"
      articleId={id}
      initialValues={{
        slug: article.slug,
        status: article.status,
        title: article.title,
        subtitle: article.subtitle ?? '',
        summary: article.summary,
        content: article.content,
        tags: article.tags ?? [],
        src: article.src ?? [],
        language: article.language,
        authorId: article.authorId,
        categoryId: article.categoryId,
      }}
      users={users}
      categories={categories}
    />
  );
}
