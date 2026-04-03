'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

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

import { AdminPageContainer } from '../_components/AdminPageContainer';
import { AdminTable } from '../_components/table';
import { AdminTableToolbar } from '../_components/table/AdminTableToolbar';
import { ArticleMobileCard } from './_components/ArticleMobileCard';
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
    const map = new Map<string, string>();
    for (const user of users) map.set(user.id, user.name);
    return map;
  }, [users]);

  const categoryTitleById = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of categories) map.set(category.id, category.title);
    return map;
  }, [categories]);

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

      setArticles(prev =>
        prev.filter(article => article._id !== articleToDelete._id)
      );

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

  const renderDeleteModal = (
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
  );

  if (articles.length === 0) {
    return (
      <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 xl:px-8">
        <EmptyState
          title="Статті відсутні"
          subtitle="Додайте першу статтю"
          actionLabel="Додати нову статтю"
          actionOnClick={handleCreate}
        />
        {renderDeleteModal}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 xl:px-8">
      <Breadcrumbs />

      <AdminPageContainer
        title="Статті"
        description="Керуйте опублікованими та чернетками статей"
        actions={<Btn label="Додати статтю" onClick={handleCreate} />}
      >
        <AdminTableToolbar>
          <input
            type="text"
            placeholder="Пошук..."
            className="border-border bg-background h-10 w-full rounded-xl border px-3 sm:max-w-xs"
          />
        </AdminTableToolbar>

        <AdminTable
          data={articles}
          columns={columns}
          isLoading={false}
          emptyMessage="Статей поки немає"
          mobileRender={article => (
            <ArticleMobileCard
              row={article}
              onEdit={handleEdit}
              onDelete={handleDelete}
              authorName={authorNameById.get(article.authorId) ?? '—'}
              categoryTitle={categoryTitleById.get(article.categoryId) ?? '—'}
            />
          )}
        />
      </AdminPageContainer>

      {renderDeleteModal}
    </div>
  );
}
