'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import {
  InfiniteScroll,
  InfiniteScrollHandle,
  PageResult,
} from '@/app/components/common/InfiniteScroll';
import { apiUrl, routes } from '@/app/config/routes';
import { useModal } from '@/app/hooks/useModal';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { useLoadingStore } from '@/app/store/loading.store';
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

  const [search, setSearch] = useState('');

  const [reviews, setReviews] = useState<ReviewResponseDTO[]>(initialReviews);
  const [reviewToDelete, setReviewToDelete] =
    useState<ReviewResponseDTO | null>(null);

  const listRef = useRef<InfiniteScrollHandle<ReviewResponseDTO>>(null);

  const deleteModal = useModal('deleteReview');

  const getReviewsPage = useCallback(
    async (page: number): Promise<PageResult<ReviewResponseDTO>> => {
      const response = await fetch(
        apiUrl(routes.api.admin.reviews + `?page=${page}&limit=20`)
      );
      const json = (await response.json()) as {
        ok: boolean;
        data: ReviewResponseDTO[];
        meta: { page: number; limit: number; hasMore: boolean };
      };

      return { data: json.data, hasMore: json.meta.hasMore };
    },
    []
  );

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
      await apiFetch<void>(
        apiUrl(routes.api.admin.reviews + `/${reviewToDelete._id}`),
        {
          method: 'DELETE',
        }
      );

      setReviews(prev => prev.filter(item => item._id !== reviewToDelete._id));
      listRef.current?.setItems(prev =>
        prev.filter(item => item._id !== reviewToDelete._id)
      );

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
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Пошук..."
            className="border-border bg-background h-10 w-full rounded-xl border px-3 sm:max-w-xs"
          />
        </AdminTableToolbar>

        <InfiniteScroll<ReviewResponseDTO>
          ref={listRef}
          initialData={initialReviews}
          loadMore={getReviewsPage}
          emptyState={
            <EmptyState
              title="Відгуки відсутні"
              subtitle="Додайте перший відгук"
              actionLabel="Додати новий відгук"
              actionOnClick={handleCreate}
            />
          }
          endMessage={<p className="subtitle">Усі відгуки завантажено</p>}
          renderContent={items => (
            <AdminTable
              data={items}
              columns={columns}
              isLoading={isLoading}
              globalFilter={search}
              emptyMessage="Відгуків поки немає"
              mobileRender={review => (
                <ReviewMobileCard
                  row={review}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            />
          )}
        />
      </AdminPageContainer>

      {renderDeleteModal}
    </div>
  );
}
