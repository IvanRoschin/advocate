import { articleService } from '@/app/lib/services/article.service';
import { reviewService } from '@/app/lib/services/review.service';
import { serviceService } from '@/app/lib/services/service.service';
import { REVIEW_PAGE_OPTIONS, ReviewTargetOptionDto } from '@/app/types';

import ReviewEditorClient from '../../_components/ReviewEditorClient';

export const dynamic = 'force-dynamic';

type EditReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditReviewPage({ params }: EditReviewPageProps) {
  const { id } = await params;

  const [review, services, articles] = await Promise.all([
    reviewService.getById(id),
    serviceService.getPublicList({ limit: 100 }),
    articleService.getPublicList({ limit: 100 }),
  ]);

  const serviceOptions: ReviewTargetOptionDto[] = services.map(service => ({
    value: service.id,
    label: service.title,
  }));

  const articleOptions: ReviewTargetOptionDto[] = articles.map(article => ({
    value: article.id,
    label: article.title,
  }));

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
