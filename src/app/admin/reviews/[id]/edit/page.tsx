import {
  getArticlesPublicList,
  getReviewById,
  getServicesPublicList,
} from '@/app/actions';
import { REVIEW_PAGE_OPTIONS, ReviewTargetOptionDto } from '@/app/types';

import ReviewEditorClient from '../../_components/ReviewEditorClient';

type EditReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditReviewPage({ params }: EditReviewPageProps) {
  const { id } = await params;

  const [review, services, articles] = await Promise.all([
    getReviewById(id),
    getServicesPublicList({ limit: 20 }),
    getArticlesPublicList({ limit: 50 }),
  ]);

  const serviceOptions: ReviewTargetOptionDto[] = services.map(service => ({
    value: service.id,
    label: service.title,
  }));

  const articleOptions: ReviewTargetOptionDto[] = articles.items.map(
    article => ({
      value: article.id,
      label: article.title,
    })
  );

  return (
    <ReviewEditorClient
      mode="edit"
      reviewId={id}
      initialValues={{
        authorName: review.authorName,
        text: review.text,
        rating: review.rating,
        status: review.status,
        targetType: review.targetType,
        targetId: review.targetId,
        pageKey: review.pageKey,
      }}
      serviceOptions={serviceOptions}
      articleOptions={articleOptions}
      pageOptions={REVIEW_PAGE_OPTIONS}
    />
  );
}
