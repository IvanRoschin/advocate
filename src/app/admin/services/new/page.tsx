import { articleService } from '@/app/lib/services';
import ServiceEditorClient from '../../services/_components/ServiceEditorClient';

export const dynamic = 'force-dynamic';

export default async function NewServicePage() {
  const [articlesRaw] = await Promise.all([articleService.getAll()]);

  const articles = articlesRaw.map(a => ({
    id: String(a._id ?? a._id),
    title: a.title,
  }));
  return <ServiceEditorClient mode="create" articles={articles} />;
}
