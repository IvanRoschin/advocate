import { articleActions } from '@/app/actions/article.actions';
import { categoryActions } from '@/app/actions/category.actions';
import { userActions } from '@/app/actions/user.actions';

import ArticlesClient from './ArticlesClient';

const ArticlesPage = async () => {
  const [articlesRes, usersRes, categoriesRes] = await Promise.all([
    articleActions.getAll({ page: 1, limit: 5 }),
    userActions.getAll(),
    categoryActions.getAll(),
  ]);

  const users = usersRes.items.map(u => ({
    id: String(u._id ?? u._id),
    name: u.name,
  }));
  const categories = categoriesRes.items.map(c => ({
    id: String(c._id),
    title: c.title,
  }));

  return (
    <ArticlesClient
      initialArticles={articlesRes.items}
      users={users}
      categories={categories}
    />
  );
};

export default ArticlesPage;
