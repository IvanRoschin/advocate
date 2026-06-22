import { getAllReviews } from '@/app/actions';
import { ReviewResponseDTO } from '@/app/types';

import ReviewsClient from './ReviewsClient';

const ReviewsPage = async () => {
  const reviews: ReviewResponseDTO[] = await getAllReviews();

  return <ReviewsClient initialReviews={reviews} />;
};

export default ReviewsPage;
