import { articleService } from '@/app/lib/services/article.service';
import { categoryService } from '@/app/lib/services/category.service';
import { userService } from '@/app/lib/services/user.service';
import { ArticleResponseDTO, mapArticleToResponse } from '@/app/types';
import ArticlesClient from './ArticlesClient';

export const dynamic = 'force-dynamic';

const ArticlesPage = async () => {
  const [articlesRaw, usersRaw, categoriesRaw] = await Promise.all([
    articleService.getAll(),
    userService.getAll(),
    categoryService.getAll(),
  ]);
  const articles: ArticleResponseDTO[] = articlesRaw.map(mapArticleToResponse);
  const users = usersRaw.map(u => ({
    id: String(u._id ?? u._id),
    name: u.name,
  }));
  const categories = categoriesRaw.map(c => ({
    id: String(c._id ?? c.id),
    title: c.title,
  }));

  return (
    <ArticlesClient
      initialArticles={articles}
      users={users}
      categories={categories}
    />
  );
};

export default ArticlesPage;
