import { articleActions } from '@/app/actions/article.actions';
import { serviceActions } from '@/app/actions/service.actions';

import ServiceEditorClient from '../../_components/ServiceEditorClient';

type EditServicePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const { id } = await params;

  const [service, articleRaw] = await Promise.all([
    serviceActions.getById(id),
    articleActions.getAll({ limit: 50 }),
  ]);

  const articles = articleRaw.items.map(a => ({
    id: String(a._id),
    title: a.title,
  }));

  return (
    <ServiceEditorClient
      mode="edit"
      serviceId={id}
      initialValues={{
        slug: service.slug,
        status: service.status,
        title: service.title,
        summary: service.summary,
        src: service.src ?? [],
        layout: service.layout,
        sections: service.sections,
        seoTitle: service.seoTitle,
        seoDescription: service.seoDescription,
        relatedArticles: service.relatedArticles,
      }}
      articles={articles}
    />
  );
}
