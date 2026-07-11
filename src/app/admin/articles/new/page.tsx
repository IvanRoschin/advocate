import { categoryActions } from '@/app/actions/category.actions';
import { serviceActions } from '@/app/actions/service.actions';
import { userPublicActions } from '@/app/actions/user.actions';

import ArticleEditorClient from '../_components/ArticleEditorClient';

export default async function NewArticlePage() {
  const [usersRaw, categoriesRaw, servivesRaw] = await Promise.all([
    userPublicActions.adminsAndManagers(),
    categoryActions.getAll(),
    serviceActions.getAll({ limit: 20 }),
  ]);

  const users = usersRaw.map(u => ({
    id: String(u._id ?? u._id),
    name: u.name,
  }));
  const categories = categoriesRaw.items.map(c => ({
    id: String(c._id),
    title: c.title,
  }));
  const services = servivesRaw.items.map(s => ({
    id: String(s._id),
    title: s.title,
  }));

  return (
    <ArticleEditorClient
      mode="create"
      users={users}
      categories={categories}
      services={services}
    />
  );
}
