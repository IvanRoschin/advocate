import { reviewService } from '@/app/lib/services/review.service';
import { ReviewResponseDTO } from '@/app/types';

import ReviewsClient from './ReviewsClient';

const ReviewsPage = async () => {
  const reviews: ReviewResponseDTO[] = await reviewService.getAll();

  return <ReviewsClient initialReviews={reviews} />;
};

export default ReviewsPage;
