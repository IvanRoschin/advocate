'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import ReviewForm from '@/app/components/forms/ReviewForm';
import { apiUrl } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';

import type { CreateReviewRequestDTO } from '@/app/types';

type Props =
  | {
      mode: 'create';
    }
  | {
      mode: 'edit';
      reviewId: string;
      initialValues: Partial<CreateReviewRequestDTO>;
    };

export default function ReviewEditorClient(props: Props) {
  const router = useRouter();

  const backToList = () => router.push('/admin/reviews');

  return (
    <div className="container py-6">
      {props.mode === 'create' ? (
        <ReviewForm
          mode="create"
          onClose={backToList}
          onSubmit={async payload => {
            try {
              await apiFetch(apiUrl('/api/v1/reviews'), {
                method: 'POST',
                body: JSON.stringify(payload),
              });

              toast.success('Відгук створено');
              backToList();
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : 'Помилка створення'
              );
            }
          }}
        />
      ) : (
        <ReviewForm
          mode="edit"
          initialValues={props.initialValues}
          submitLabel="Оновити відгук"
          onClose={backToList}
          onSubmit={async patch => {
            try {
              await apiFetch(apiUrl(`/api/admin/reviews/${props.reviewId}`), {
                method: 'PATCH',
                body: JSON.stringify(patch),
              });

              toast.success('Відгук оновлено');
              backToList();
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : 'Помилка оновлення'
              );
            }
          }}
        />
      )}
    </div>
  );
}
