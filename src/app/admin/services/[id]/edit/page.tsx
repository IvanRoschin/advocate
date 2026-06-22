import { getArticlesPublicList, getServiceById } from '@/app/actions';
import { mapServiceToResponse } from '@/app/types';

import ServiceEditorClient from '../../_components/ServiceEditorClient';

type EditServicePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const { id } = await params;

  const [serviceRaw, articleRaw] = await Promise.all([
    getServiceById(id),
    getArticlesPublicList({ limit: 50 }),
  ]);

  const service = mapServiceToResponse(serviceRaw);

  const articles = articleRaw.items.map(a => ({
    id: String(a.id),
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
