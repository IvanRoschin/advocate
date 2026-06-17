import { articleService } from '@/app/lib/services';
import ServiceEditorClient from '../../services/_components/ServiceEditorClient';

export const dynamic = 'force-dynamic';

export default async function NewServicePage() {
  const [articlesRaw] = await Promise.all([articleService.getPublicList()]);

  const articles = articlesRaw.items.map(a => ({
    id: String(a.id),
    title: a.title,
  }));
  return <ServiceEditorClient mode="create" articles={articles} />;
}
