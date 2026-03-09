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

  const serviceRaw = await serviceService.getById(id);
  const service = mapServiceToResponse(serviceRaw);

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
      }}
    />
  );
}
