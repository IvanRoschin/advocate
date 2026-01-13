'use client';

import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

type Review = {
  name: string;
  order: string;
  text: string;
};

interface Props {
  review: Review;
}

const ReviewCard = ({ review }: Props) => {
  return (
    <div className="group bg-app hover:bg-app/95 relative flex flex-col justify-between rounded-3xl p-6 shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
      {/* Верхняя часть: автор и заказ */}
      <div className="mb-4">
        <p className="text-accent group-hover:text-accent/80 relative text-base font-semibold transition-colors duration-300 md:text-lg">
          {review.name}
          {/* underline под именем */}
          <span className="bg-accent absolute bottom-0 left-0 h-0.5 w-10 rounded-full transition-all duration-500 group-hover:w-20"></span>
        </p>
        <p className="text-app mt-1 text-xs md:text-sm">{review.order}</p>
      </div>

      {/* Нижняя часть: текст отзыва */}
      <div className="mt-auto flex flex-col gap-2">
        <span className="flex items-center justify-start">
          <FaQuoteLeft className="text-accent h-5 w-5" />
        </span>
        <p className="text-app text-sm leading-relaxed md:text-base">
          {review.text}
        </p>
        <span className="flex items-center justify-end">
          <FaQuoteRight className="text-accent h-5 w-5" />
        </span>
      </div>
    </div>
  );
};

export default ReviewCard;
