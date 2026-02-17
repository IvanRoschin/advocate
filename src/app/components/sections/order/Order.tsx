'use client';

import { iconLibrary, orderSection } from '@/app/resources';
import { LeadForm, NextImage } from '@/components';

const Order = () => {
  const UptitleIcon = iconLibrary[orderSection.left.uptitleIcon];

  return (
    <section
      id={orderSection.id}
      className="relative flex flex-col items-center justify-center py-28 sm:py-36 lg:py-44"
    >
      <NextImage
        useSkeleton
        src={orderSection.background.src}
        alt={orderSection.background.alt}
        fill
        priority
        className="-z-20 object-cover"
      />

      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/80 via-black/40 to-black/80" />

      <div className="font-eukraine container mx-auto flex flex-col items-center gap-10 px-4 lg:flex-row lg:gap-16">
        {/* LEFT */}
        <div className="bg-app/85 flex flex-1 flex-col gap-4 rounded-2xl p-6 text-center shadow-md backdrop-blur-md lg:text-left">
          <p className="text-accent flex items-center justify-center gap-2 text-xs tracking-widest uppercase lg:justify-start">
            <UptitleIcon className="h-4 w-4" aria-hidden />
            {orderSection.left.uptitle}
          </p>

          <h2 className="font-eukrainehead text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {orderSection.left.title}
          </h2>

          <p className="text-app text-base leading-relaxed sm:text-lg">
            {orderSection.left.descriptionLines[0]}
            <br />
            {orderSection.left.descriptionLines[1]}
          </p>
        </div>

        {/* RIGHT */}
        <div className="bg-app/85 surface-dark flex w-full max-w-md flex-1 flex-col rounded-2xl p-6 shadow-md backdrop-blur-md">
          <LeadForm />
        </div>
      </div>
    </section>
  );
};

export default Order;
