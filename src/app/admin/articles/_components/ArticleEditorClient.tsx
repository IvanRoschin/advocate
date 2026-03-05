'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ArticleForm } from '@/app/components/forms';
import { apiUrl } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';

import type {
  CategoryOption,
  UserOption,
} from '@/app/components/forms/ArticleForm';
import type { CreateArticleRequestDTO } from '@/app/types';

type Props =
  | {
      mode: 'create';
      users: UserOption[];
      categories: CategoryOption[];
    }
  | {
      mode: 'edit';
      articleId: string;
      initialValues: Partial<CreateArticleRequestDTO>;
      users: UserOption[];
      categories: CategoryOption[];
    };

export default function ArticleEditorClient(props: Props) {
  const router = useRouter();
  const backToList = () => router.push('/admin/articles');

  return (
    <div className="container py-6">
      {props.mode === 'create' ? (
        <ArticleForm
          mode="create"
          users={props.users}
          categories={props.categories}
          onClose={backToList}
          onSubmit={async payload => {
            try {
              await apiFetch(apiUrl('/api/admin/articles'), {
                method: 'POST',
                body: JSON.stringify(payload),
              });
              toast.success('Статтю створено');
              backToList();
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : 'Помилка створення'
              );
            }
          }}
        />
      ) : (
        <ArticleForm
          mode="edit"
          initialValues={props.initialValues}
          users={props.users}
          categories={props.categories}
          submitLabel="Оновити статтю"
          onClose={backToList}
          onSubmit={async patch => {
            try {
              await apiFetch(apiUrl(`/api/admin/articles/${props.articleId}`), {
                method: 'PATCH',
                body: JSON.stringify(patch),
              });
              toast.success('Статтю оновлено');
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
