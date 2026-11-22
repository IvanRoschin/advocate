'use client';

import dynamic from 'next/dynamic';

import Skeleton from '@/app/components/common/Skeleton';
import { useNearViewport } from '@/app/hooks/useNearViewport';

const PublicReviewForm = dynamic(
  () => import('@/app/components/forms/public/PublicReviewForm'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-80 w-full rounded-xl" />,
  }
);

type Props = {
  targetType: 'service' | 'article';
  targetId: string;
};

/** Форма відгуку внизу сторінки: JS (Formik/Yup/Turnstile) — лише при наближенні. */
export default function LazyReviewForm(props: Props) {
  const { ref, near } = useNearViewport();

  return (
    <div ref={ref}>
      {near ? (
        <PublicReviewForm {...props} />
      ) : (
        <Skeleton className="h-80 w-full rounded-xl" />
      )}
    </div>
  );
}
