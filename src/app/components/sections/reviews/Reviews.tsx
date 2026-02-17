'use client';

import { reviewsSection } from '@/app/resources';

import ReviewCard from './ReviewCard';

const Reviews = () => {
  const { id, header, items } = reviewsSection;

  return (
    <section id={id} className="fg-app py-20">
      <div className="container mx-auto px-4">
        <header className="mb-10 flex flex-col items-center text-center sm:mb-14">
          <span className="bg-accent mb-4 h-8 w-px" />

          <h2 className="font-eukrainehead mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            {header.title}
          </h2>

          <p className="text-xs tracking-widest text-white uppercase">
            {header.subtitle}
          </p>

          <span className="bg-accent mt-4 h-8 w-px" />
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
