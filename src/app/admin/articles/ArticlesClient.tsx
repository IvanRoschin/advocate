'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { DataTable } from '@/app/components/data-table/DataTable';
import { apiUrl } from '@/app/config/routes';
import { useModal } from '@/app/hooks/useModal';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { useLoadingStore } from '@/app/store/loading.store.ts';
import {
  Breadcrumbs,
  Btn,
  DeleteConfirmation,
  EmptyState,
  Modal,
} from '@/components';

import { articlesColumns } from './articles.columns';

import type {
  CategoryOption,
  UserOption,
} from '@/app/components/forms/ArticleForm';
import type { ArticleResponseDTO } from '@/app/types';

interface Props {
  initialArticles: ArticleResponseDTO[];
  users: UserOption[];
  categories: CategoryOption[];
}

export default function ArticlesClient({
  initialArticles,
  users,
  categories,
}: Props) {
  const router = useRouter();
  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;

  const [articles, setArticles] =
    useState<ArticleResponseDTO[]>(initialArticles);
  const [articleToDelete, setArticleToDelete] =
    useState<ArticleResponseDTO | null>(null);

  const deleteModal = useModal('deleteArticle');

  const authorNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const u of users) m.set(u.id, u.name);
    return m;
  }, [users]);

  const categoryTitleById = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of categories) m.set(c.id, c.title);
    return m;
  }, [categories]);

  // ✅ стабилизируем коллбеки
  const handleDelete = useCallback(
    (article: ArticleResponseDTO) => {
      setArticleToDelete(article);
      deleteModal.open();
    },
    [deleteModal]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!articleToDelete) return;

    start();
    try {
      await apiFetch<void>(
        apiUrl(`/api/admin/articles/${articleToDelete._id}`),
        {
          method: 'DELETE',
        }
      );

      setArticles(prev => prev.filter(a => a._id !== articleToDelete._id));

      toast.success('Статтю видалено');
      deleteModal.close();
      setArticleToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка видалення');
    } finally {
      done();
    }
  }, [articleToDelete, start, done, deleteModal]);

  const handleEdit = useCallback(
    (article: ArticleResponseDTO) => {
      // ✅ это страница, не api
      router.push(`/admin/articles/${article._id}/edit`);
    },
    [router]
  );

  const handleCreate = useCallback(() => {
    router.push('/admin/articles/new');
  }, [router]);

  const columns = useMemo(
    () =>
      articlesColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        authorNameById,
        categoryTitleById,
      }),
    [authorNameById, categoryTitleById, handleDelete, handleEdit]
  );

  if (articles.length === 0) {
    return (
      <div className="container">
        <EmptyState
          title="Статті відсутні"
          subtitle="Додайте першу статтю"
          actionLabel="Додати нову статтю"
          actionOnClick={handleCreate}
        />

        <Modal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          body={
            <DeleteConfirmation
              title={`Стаття: ${articleToDelete?.title ?? '—'}`}
              onConfirm={handleDeleteConfirm}
              onCancel={deleteModal.close}
            />
          }
        />
      </div>
    );
  }

  return (
    <div className="container">
      <Breadcrumbs />

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-accent text-xl font-semibold">Статті</h1>
        <Btn label="Додати статтю" onClick={handleCreate} />
      </div>

      <DataTable data={articles} columns={columns} />

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        body={
          <DeleteConfirmation
            title={`Стаття: ${articleToDelete?.title ?? '—'}`}
            onConfirm={handleDeleteConfirm}
            onCancel={deleteModal.close}
          />
        }
      />
    </div>
  );
}
