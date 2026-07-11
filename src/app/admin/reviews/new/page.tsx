import { articleActions } from '@/app/actions/article.actions';
import { serviceActions } from '@/app/actions/service.actions';
import { REVIEW_PAGE_OPTIONS } from '@/app/types';

import ReviewEditorClient from '../_components/ReviewEditorClient';

export default async function ReviewCreatePage() {
  const [services, articles] = await Promise.all([
    serviceActions.getAll({ limit: 20 }),
    articleActions.getAll({ limit: 20 }),
  ]);

  const serviceOptions = services.items.map(service => ({
    value: service._id,
    label: service.title,
  }));

  const articleOptions = articles.items.map(article => ({
    value: article._id,
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
