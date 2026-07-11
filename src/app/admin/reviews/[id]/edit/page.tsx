import { articleActions } from '@/app/actions/article.actions';
import { reviewActions } from '@/app/actions/review.actions';
import { serviceActions } from '@/app/actions/service.actions';
import { REVIEW_PAGE_OPTIONS, ReviewTargetOptionDto } from '@/app/types';

import ReviewEditorClient from '../../_components/ReviewEditorClient';

type EditReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditReviewPage({ params }: EditReviewPageProps) {
  const { id } = await params;

  const [review, services, articles] = await Promise.all([
    reviewActions.getById(id),
    serviceActions.getAll({ limit: 20 }),
    articleActions.getAll({ limit: 20 }),
  ]);

  const serviceOptions: ReviewTargetOptionDto[] = services.items.map(
    service => ({
      value: service._id,
      label: service.title,
    })
  );

  const articleOptions: ReviewTargetOptionDto[] = articles.items.map(
    article => ({
      value: article._id,
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
