import { articleService } from '@/app/lib/services';
import { serviceService } from '@/app/lib/services/service.service';
import { mapServiceToResponse } from '@/app/types';
import ServiceEditorClient from '../../_components/ServiceEditorClient';

export const dynamic = 'force-dynamic';

type EditServicePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const { id } = await params;

  const [serviceRaw, articleRaw] = await Promise.all([
    serviceService.getById(id),
    articleService.getAll(),
  ]);

  const service = mapServiceToResponse(serviceRaw);

  const articles = articleRaw.map(a => ({
    id: String(a._id ?? a.id),
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
