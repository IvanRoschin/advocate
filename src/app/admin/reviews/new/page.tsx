import { articleService } from '@/app/lib/services/article.service';
import { serviceService } from '@/app/lib/services/service.service';
import { REVIEW_PAGE_OPTIONS } from '@/app/types';
import ReviewEditorClient from '../_components/ReviewEditorClient';

export default async function ReviewCreatePage() {
  const [services, articles] = await Promise.all([
    serviceService.getPublicList({ limit: 100 }),
    articleService.getPublicList({ limit: 100 }),
  ]);

  const serviceOptions = services.map(service => ({
    value: service.id,
    label: service.title,
  }));

  const articleOptions = articles.map(article => ({
    value: article.id,
    label: article.title,
  }));

  return (
    <ReviewEditorClient
      mode="create"
      serviceOptions={serviceOptions}
      articleOptions={articleOptions}
      pageOptions={REVIEW_PAGE_OPTIONS}
    />
  );
}
