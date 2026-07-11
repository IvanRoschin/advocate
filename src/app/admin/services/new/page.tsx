import { articleActions } from '@/app/actions/article.actions';

import ServiceEditorClient from '../../services/_components/ServiceEditorClient';

export default async function NewServicePage() {
  const [articlesRaw] = await Promise.all([
    articleActions.getAll({ limit: 50 }),
  ]);

  const articles = articlesRaw.items.map(a => ({
    id: String(a._id),
    title: a.title,
  }));
  return <ServiceEditorClient mode="create" articles={articles} />;
}
