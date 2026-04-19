'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ServiceForm } from '@/app/components/forms';
import { ArticleOption } from '@/app/components/forms/ServiceForm';
import { apiUrl } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';

import type { CreateServiceRequestDTO } from '@/app/types';
type Props =
  | {
      mode: 'create';
      articles: ArticleOption[];
    }
  | {
      mode: 'edit';
      serviceId: string;
      initialValues: Partial<CreateServiceRequestDTO>;
      articles: ArticleOption[];
    };

export default function ServiceEditorClient(props: Props) {
  const router = useRouter();

  const backToList = () => router.push('/admin/services');

  return (
    <div className="container py-6">
      {props.mode === 'create' ? (
        <ServiceForm
          mode="create"
          articles={props.articles}
          onClose={backToList}
          onSubmit={async payload => {
            try {
              await apiFetch(apiUrl('/api/admin/services'), {
                method: 'POST',
                body: JSON.stringify(payload),
              });

              toast.success('Послугу створено');
              backToList();
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : 'Помилка створення'
              );
            }
          }}
        />
      ) : (
        <ServiceForm
          mode="edit"
          initialValues={props.initialValues}
          articles={props.articles}
          submitLabel="Оновити послугу"
          onClose={backToList}
          onSubmit={async patch => {
            try {
              await apiFetch(apiUrl(`/api/admin/services/${props.serviceId}`), {
                method: 'PATCH',
                body: JSON.stringify(patch),
              });

              toast.success('Послугу оновлено');
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
