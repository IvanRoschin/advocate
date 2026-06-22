import { getServicesPublicList } from '@/app/actions';
import { categoryService } from '@/app/lib/services/category.service';
import { userService } from '@/app/lib/services/user.service';

import ArticleEditorClient from '../_components/ArticleEditorClient';

export default async function NewArticlePage() {
  const [usersRaw, categoriesRaw, servivesRaw] = await Promise.all([
    userService.getAdminsAndManagers(),
    categoryService.getAll(),
    getServicesPublicList({ limit: 20 }),
  ]);

  const users = usersRaw.map(u => ({
    id: String(u._id ?? u._id),
    name: u.name,
  }));
  const categories = categoriesRaw.map(c => ({
    id: String(c._id ?? c.id),
    title: c.title,
  }));
  const services = servivesRaw.map(s => ({
    id: String(s.id),
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
