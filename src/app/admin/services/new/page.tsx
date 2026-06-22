import { getArticlesPublicList } from '@/app/actions/article.actions';

import ServiceEditorClient from '../../services/_components/ServiceEditorClient';

export default async function NewServicePage() {
  const [articlesRaw] = await Promise.all([
    getArticlesPublicList({ limit: 50 }),
  ]);

  const articles = articlesRaw.items.map(a => ({
    id: String(a.id),
    title: a.title,
  }));
  return <ServiceEditorClient mode="create" articles={articles} />;
}
