import { articleService } from '@/app/lib/services/article.service';
import { categoryService } from '@/app/lib/services/category.service';
import { userService } from '@/app/lib/services/user.service';
import ArticlesClient from './ArticlesClient';

export const dynamic = 'force-dynamic';

const ArticlesPage = async () => {
  const [articlesRaw, usersRaw, categoriesRaw] = await Promise.all([
    articleService.getAllPaginated({ page: 1, limit: 5 }),
    userService.getAll(),
    categoryService.getAll(),
  ]);

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
      initialArticles={articlesRaw.items}
      users={users}
      categories={categories}
    />
  );
};

export default ArticlesPage;
