import { iconLibrary } from '@/app/resources/icons';
import { ReviewResponseDTO } from '@/app/types';

type Props = {
  review: ReviewResponseDTO;
};

const ReviewCard = ({ review }: Props) => {
  const QuoteLeft = iconLibrary.quoteLeft;
  const QuoteRight = iconLibrary.quoteRight;

  return (
    <article className="group relative flex h-full flex-col justify-between rounded-3xl bg-(--reviews-card-bg) p-6 shadow-(--reviews-card-shadow) transition-all duration-300 hover:-translate-y-2 hover:bg-(--reviews-card-bg-hover) hover:shadow-(--reviews-card-shadow-hover)">
      <header className="mb-4">
        <p className="relative text-base font-semibold text-(--reviews-card-name) transition-colors duration-300 md:text-lg">
          {review.authorName}
          <span className="absolute bottom-0 left-0 h-0.5 w-10 rounded-full bg-(--reviews-card-accent) transition-all duration-500 group-hover:w-20" />
        </p>
      </header>

      <div className="mt-auto flex flex-col gap-2">
        <span className="flex justify-start">
          <QuoteLeft
            className="h-5 w-5 text-(--reviews-card-accent)"
            aria-hidden
          />
        </span>

        <p className="text-sm leading-relaxed text-(--reviews-card-text) md:text-base">
          {review.text}
        </p>

        <span className="flex justify-end">
          <QuoteRight
            className="h-5 w-5 text-(--reviews-card-accent)"
            aria-hidden
          />
        </span>
      </div>
    </article>
  );
};

export default ReviewCard;
