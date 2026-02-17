'use client';

import { iconLibrary } from '@/app/resources/icons';

import type { ReviewItem } from '@/app/resources/content/sections/reviews';

interface Props {
  review: ReviewItem;
}

const ReviewCard = ({ review }: Props) => {
  const QuoteLeft = iconLibrary.quoteLeft;
  const QuoteRight = iconLibrary.quoteRight;

  return (
    <div className="group bg-app hover:bg-app/95 relative flex flex-col justify-between rounded-3xl p-6 shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="mb-4">
        <p className="text-accent group-hover:text-accent/80 relative text-base font-semibold transition-colors duration-300 md:text-lg">
          {review.name}
          <span className="bg-accent absolute bottom-0 left-0 h-0.5 w-10 rounded-full transition-all duration-500 group-hover:w-20" />
        </p>
        <p className="text-app mt-1 text-xs md:text-sm">{review.order}</p>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <span className="flex justify-start">
          <QuoteLeft className="text-accent h-5 w-5" />
        </span>

        <p className="text-app text-sm leading-relaxed md:text-base">
          {review.text}
        </p>

        <span className="flex justify-end">
          <QuoteRight className="text-accent h-5 w-5" />
        </span>
      </div>
    </div>
  );
};

export default ReviewCard;
