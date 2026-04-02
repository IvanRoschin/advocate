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
import { ReviewMobileCard } from './_components/ReviewMobileCard';
import { reviewsColumns } from './reviews.columns';

import type { ReviewResponseDTO } from '@/app/types';
type Props = {
  initialReviews: ReviewResponseDTO[];
};

export default function ReviewsClient({ initialReviews }: Props) {
  const router = useRouter();
  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;
  const isLoading = useLoadingStore(state => state.isLoading);

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

  const renderDeleteModal = (
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
  );

  if (reviews.length === 0) {
    return (
      <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 xl:px-8">
        <EmptyState
          title="Відгуки відсутні"
          subtitle="Додайте перший відгук"
          actionLabel="Додати новий відгук"
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
        title="Відгуки"
        description="Керуйте відгуками клієнтів"
        actions={<Btn label="Додати відгук" onClick={handleCreate} />}
      >
        <AdminTableToolbar>
          <input
            type="text"
            placeholder="Пошук за автором..."
            className="border-border bg-background h-10 w-full rounded-xl border px-3 sm:max-w-xs"
          />
        </AdminTableToolbar>

        <AdminTable
          data={reviews}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="Відгуків поки немає"
          mobileRender={review => (
            <ReviewMobileCard
              row={review}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        />
      </AdminPageContainer>

      {renderDeleteModal}
    </div>
  );
}
