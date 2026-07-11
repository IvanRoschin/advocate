import { reviewActions } from '@/app/actions/review.actions';
import { ReviewResponseDTO } from '@/app/types';

import ReviewsClient from './ReviewsClient';

const ReviewsPage = async () => {
  const result = await reviewActions.getAll();

  const reviews = result.items as ReviewResponseDTO[];

  return <ReviewsClient initialReviews={reviews} />;
};

export default ReviewsPage;
