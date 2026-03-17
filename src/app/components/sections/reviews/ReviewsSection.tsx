import type { ReactNode } from 'react';

import type { ReviewResponseDTO } from '@/app/types';

type Props = {
  title?: string;
  reviews?: ReviewResponseDTO[];
  reviewForm?: ReactNode;
};

const ReviewsSection = ({
  title = 'Відгуки',
  reviews = [],
  reviewForm,
}: Props) => {
  const hasReviews = reviews.length > 0;
  const hasReviewForm = Boolean(reviewForm);

  if (!hasReviews && !hasReviewForm) return null;

  return (
    <section className="container py-10">
      <div className="mb-6 max-w-2xl">
        <h2 className="title-app text-accent text-2xl font-semibold lg:text-3xl">
          {title}
        </h2>
      </div>

      <div className="grid gap-6">
        {hasReviews ? (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map(review => (
              <article
                key={review._id}
                className="border-border bg-card rounded-2xl border p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-accent text-lg font-semibold">
                    {review.authorName}
                  </h3>

                  {typeof review.rating === 'number' ? (
                    <div className="text-accent text-sm font-medium">
                      {review.rating}/5
                    </div>
                  ) : null}
                </div>

                <p className="text-app mt-3 text-sm leading-6">{review.text}</p>
              </article>
            ))}
          </div>
        ) : null}

        {hasReviewForm ? (
          <div className="border-border bg-card rounded-2xl border p-5">
            <div className="mb-4">
              <h3 className="text-accent text-lg font-semibold">
                Залишити відгук
              </h3>
            </div>

            {reviewForm}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ReviewsSection;
