import { reviewService } from '@/app/lib/services/review.service';
import ReviewEditorClient from '../../_components/ReviewEditorClient';

export const dynamic = 'force-dynamic';

type EditReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditReviewPage({ params }: EditReviewPageProps) {
  const { id } = await params;
  const review = await reviewService.getById(id);

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
    />
  );
}
