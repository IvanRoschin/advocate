import { getArticlesPublicList, getServicesPublicList } from '@/app/actions';
import { REVIEW_PAGE_OPTIONS } from '@/app/types';

import ReviewEditorClient from '../_components/ReviewEditorClient';

export default async function ReviewCreatePage() {
  const [services, articles] = await Promise.all([
    getServicesPublicList({ limit: 20 }),
    getArticlesPublicList({ limit: 50 }),
  ]);

  const serviceOptions = services.map(service => ({
    value: service.id,
    label: service.title,
  }));

  const articleOptions = articles.items.map(article => ({
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
