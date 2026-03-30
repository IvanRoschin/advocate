import { reviewsSection } from '@/app/resources';
import { ReviewResponseDTO } from '@/app/types';
import ReviewCard from './ReviewCard';

type ReviewsProps = {
  reviews: ReviewResponseDTO[];
};

export default function Reviews({ reviews }: ReviewsProps) {
  const { id, header } = reviewsSection;

  const limitedReviews = reviews.slice(0, 4);

  return (
    <section id={id} className="bg-reviews-section py-20">
      <div className="container mx-auto px-4">
        <header className="mb-10 flex flex-col items-center text-center sm:mb-14">
          <span className="bg-accent mb-4 h-8 w-px" />

          <h2 className="text-reviews-title font-eukrainehead mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
            {header.title}
          </h2>

          <p className="text-reviews-subtitle text-xs tracking-widest uppercase">
            {header.subtitle}
          </p>

          <span className="bg-accent mt-4 h-8 w-px" />
        </header>

        {limitedReviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {limitedReviews.map(review => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border p-6 text-center">
            Відгуки наразі відсутні.
          </div>
        )}
      </div>
    </section>
  );
}
