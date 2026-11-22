'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { iconLibrary, orderSection } from '@/app/resources';
import { NextImage, Skeleton } from '@/components';

// Defers Formik/Yup/Turnstile (~pulled into the app's largest shared JS
// chunk) until this below-the-fold section is actually needed, instead of
// paying that parse/execute cost before the hero above it can even paint.
const LeadForm = dynamic(
  () => import('@/app/components/forms/public/PublicLeadForm'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full min-h-100 w-full rounded-xl" />,
  }
);

// ssr:false сам по собі не відкладає завантаження: чанк форми (~450 КБ:
// Formik, Yup, Turnstile, motion) тягнувся одразу після гідратації і
// блокував головний потік на мобільному. Монтуємо форму, лише коли секція
// наближається до вʼюпорту (або користувач перейшов на #order).
const useNearViewport = (rootMargin = '800px') => {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || near) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [near, rootMargin]);

  return { ref, near };
};

const Order = () => {
  const UptitleIcon = iconLibrary[orderSection.left.uptitleIcon];
  const { ref: formRef, near } = useNearViewport();

  return (
    <section
      id={orderSection.id}
      className="section relative flex flex-col items-center justify-center"
    >
      <NextImage
        useSkeleton
        src={orderSection.background.src}
        alt={orderSection.background.alt}
        fill
        className="-z-20 object-cover"
      />

      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/80 via-black/40 to-black/80" />

      <div className="font-eukraine container mx-auto flex flex-col items-center gap-10 px-4 lg:flex-row lg:gap-16">
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

        <div
          ref={formRef}
          className="bg-app/85 surface-dark flex w-full max-w-md flex-1 flex-col rounded-2xl p-6 shadow-md backdrop-blur-md"
        >
          {near ? (
            <LeadForm publicVariant="home" source="home" />
          ) : (
            <Skeleton className="h-full min-h-100 w-full rounded-xl" />
          )}
        </div>
      </div>
    </section>
  );
};

export default Order;
