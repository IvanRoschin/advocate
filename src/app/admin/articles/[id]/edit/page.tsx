import { articleActions } from '@/app/actions/article.actions';
import { categoryActions } from '@/app/actions/category.actions';
import { servicePublicActions } from '@/app/actions/service.actions';
import { userActions } from '@/app/actions/user.actions';
import { mapArticleToResponse } from '@/app/types';

import ArticleEditorClient from '../../_components/ArticleEditorClient';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [articleRaw, usersRaw, categoriesRaw, serviceRaw] = await Promise.all([
    articleActions.getById(id),
    userActions.getAll(),
    categoryActions.getAll(),
    servicePublicActions.list({ limit: 20 }),
  ]);

  const article = mapArticleToResponse(articleRaw);

  const users = usersRaw.items.map(u => ({
    id: String(u._id ?? u._id),
    name: u.name,
  }));
  const categories = categoriesRaw.items.map(c => ({
    id: String(c._id),
    title: c.title,
  }));
  const services = serviceRaw.items.map(s => ({
    id: String(s.id),
    title: s.title,
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
        serviceId: article.serviceId,
      }}
      users={users}
      categories={categories}
      services={services}
    />
  );
}
