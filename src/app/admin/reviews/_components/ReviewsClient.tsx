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

import { reviewsColumns } from './reviews.columns';

import type { ReviewResponseDTO } from '@/app/types';

type Props = {
  initialReviews: ReviewResponseDTO[];
};

export default function ReviewsClient({ initialReviews }: Props) {
  const router = useRouter();
  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;

  const [reviews, setReviews] = useState<ReviewResponseDTO[]>(initialReviews);
  const [reviewToDelete, setReviewToDelete] =
    useState<ReviewResponseDTO | null>(null);

  const deleteModal = useModal('deleteReview');

  const handleDelete = useCallback(
    (review: ReviewResponseDTO) => {
      setReviewToDelete(review);
      deleteModal.open();
    },
    [deleteModal]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!reviewToDelete) return;

    start();

    try {
      await apiFetch<void>(apiUrl(`/api/admin/reviews/${reviewToDelete._id}`), {
        method: 'DELETE',
      });

      setReviews(prev => prev.filter(item => item._id !== reviewToDelete._id));

      toast.success('Відгук видалено');
      deleteModal.close();
      setReviewToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка видалення');
    } finally {
      done();
    }
  }, [reviewToDelete, start, done, deleteModal]);

  const handleEdit = useCallback(
    (review: ReviewResponseDTO) => {
      router.push(`/admin/reviews/${review._id}/edit`);
    },
    [router]
  );

  const handleCreate = useCallback(() => {
    router.push('/admin/reviews/new');
  }, [router]);

  const columns = useMemo(
    () =>
      reviewsColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleEdit, handleDelete]
  );

  if (reviews.length === 0) {
    return (
      <div className="container">
        <EmptyState
          title="Відгуки відсутні"
          subtitle="Додайте перший відгук"
          actionLabel="Додати новий відгук"
          actionOnClick={handleCreate}
        />

        <Modal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          body={
            <DeleteConfirmation
              title={`Відгук: ${reviewToDelete?.authorName ?? '—'}`}
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
        <h1 className="text-accent text-xl font-semibold">Відгуки</h1>
        <Btn label="Додати відгук" onClick={handleCreate} />
      </div>

      <DataTable
        data={reviews}
        columns={columns}
        searchColumnId="authorName"
        searchPlaceholder="Пошук за автором…"
      />

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        body={
          <DeleteConfirmation
            title={`Відгук: ${reviewToDelete?.authorName ?? '—'}`}
            onConfirm={handleDeleteConfirm}
            onCancel={deleteModal.close}
          />
        }
      />
    </div>
  );
}
