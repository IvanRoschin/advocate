'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { apiUrl, routes } from '@/app/config/routes';
import { useModal } from '@/app/hooks/useModal';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { useLoadingStore } from '@/app/store/loading.store';
import {
  Breadcrumbs,
  Btn,
  DeleteConfirmation,
  EmptyState,
  Loader,
  Modal,
  SlideForm,
} from '@/components';

import { useAdminDeleteFlow } from '../_hooks/useAdminDeleteFlow';
import { AdminPageContainer } from '../_components/AdminPageContainer';
import { AdminTable } from '../_components/table';
import { AdminTableToolbar } from '../_components/table/AdminTableToolbar';
import { SlideMobileCard } from './_components/SlideMobileCard';
import { slidesColumns } from './slides.columns';

import type {
  CreateSlideDTO,
  SlideResponseDTO,
  UpdateSlideDTO,
} from '@/app/types';

type Props = {
  initialSlides: SlideResponseDTO[];
};

export default function SlidesClient({ initialSlides }: Props) {
  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;
  const isLoading = useLoadingStore(state => state.isLoading);

  const [search, setSearch] = useState('');

  const [slides, setSlides] = useState<SlideResponseDTO[]>(initialSlides);
  const [slideToUpdate, setSlideToUpdate] = useState<SlideResponseDTO | null>(
    null
  );
  const [togglingIds, setTogglingIds] = useState<string[]>([]);

  const createModal = useModal('createSlide');
  const updateModal = useModal('updateSlide');

  const {
    itemToDelete: slideToDelete,
    deleteModal,
    handleDelete,
    handleDeleteConfirm,
  } = useAdminDeleteFlow<SlideResponseDTO>({
    modalKey: 'deleteSlide',
    apiPath: routes.api.admin.slides,
    getId: slide => slide._id,
    successMessage: 'Слайд видалено',
    onDeleted: deleted =>
      setSlides(prev => prev.filter(item => item._id !== deleted._id)),
  });

  const isSlideToggling = useCallback(
    (slideId: string) => togglingIds.includes(slideId),
    [togglingIds]
  );

  const handleEdit = useCallback(
    (slide: SlideResponseDTO) => {
      setSlideToUpdate(slide);
      updateModal.open();
    },
    [updateModal]
  );

  const handleToggleActive = useCallback(
    async (slide: SlideResponseDTO, checked: boolean) => {
      if (isSlideToggling(slide._id)) return;

      setTogglingIds(prev =>
        prev.includes(slide._id) ? prev : [...prev, slide._id]
      );

      try {
        const endpoint = checked
          ? routes.api.admin.slides + `/${slide._id}/activate`
          : routes.api.admin.slides + `/${slide._id}/deactivate`;

        const updated = await apiFetch<SlideResponseDTO>(apiUrl(endpoint), {
          method: 'PATCH',
        });

        if (!updated) {
          throw new Error('Не вдалося змінити статус слайду');
        }

        setSlides(prev =>
          prev.map(item => (item._id === updated._id ? updated : item))
        );

        toast.success(checked ? 'Слайд активовано' : 'Слайд деактивовано');
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Помилка зміни статусу слайду'
        );
      } finally {
        setTogglingIds(prev => prev.filter(id => id !== slide._id));
      }
    },
    [isSlideToggling]
  );

  const handleCreateSlide = useCallback(
    async (payload: CreateSlideDTO) => {
      start();
      try {
        const created = await apiFetch<SlideResponseDTO>(
          apiUrl(routes.api.admin.slides),
          {
            method: 'POST',
            body: JSON.stringify(payload),
          }
        );

        setSlides(prev => [created, ...prev]);
        toast.success('Слайд створено');
        createModal.close();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Помилка створення');
      } finally {
        done();
      }
    },
    [createModal, done, start]
  );

  const handleUpdateSlide = useCallback(
    async (payload: UpdateSlideDTO) => {
      if (!slideToUpdate) return;

      start();
      try {
        const updated = await apiFetch<SlideResponseDTO>(
          apiUrl(routes.api.admin.slides + `/${slideToUpdate._id}`),
          {
            method: 'PATCH',
            body: JSON.stringify(payload),
          }
        );

        setSlides(prev =>
          prev.map(item => (item._id === updated._id ? updated : item))
        );

        toast.success('Слайд оновлено');
        updateModal.close();
        setSlideToUpdate(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Помилка оновлення');
      } finally {
        done();
      }
    },
    [done, slideToUpdate, start, updateModal]
  );

  const columns = useMemo(
    () =>
      slidesColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleActive: handleToggleActive,
        isSlideToggling,
      }),
    [handleDelete, handleEdit, handleToggleActive, isSlideToggling]
  );

  const renderCreateModal = (
    <Modal
      isOpen={createModal.isOpen}
      onClose={createModal.close}
      body={
        <SlideForm
          mode="create"
          onSubmit={handleCreateSlide}
          onClose={createModal.close}
        />
      }
    />
  );

  const renderDeleteModal = (
    <Modal
      isOpen={deleteModal.isOpen}
      onClose={deleteModal.close}
      body={
        <DeleteConfirmation
          title={`Слайд: ${slideToDelete?.title ?? '—'}`}
          onConfirm={handleDeleteConfirm}
          onCancel={deleteModal.close}
        />
      }
    />
  );

  const renderUpdateModal = (
    <Modal
      isOpen={updateModal.isOpen}
      onClose={() => {
        updateModal.close();
        setSlideToUpdate(null);
      }}
      body={
        slideToUpdate && (
          <SlideForm
            mode="edit"
            initialValues={{
              title: slideToUpdate.title,
              desc: slideToUpdate.desc,
              src: slideToUpdate.src,
              isActive: slideToUpdate.isActive,
            }}
            submitLabel="Оновити слайд"
            onSubmit={handleUpdateSlide}
            onClose={() => {
              updateModal.close();
              setSlideToUpdate(null);
            }}
          />
        )
      }
    />
  );

  if (!slides) return <Loader />;

  if (slides.length === 0) {
    return (
      <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 xl:px-8">
        <EmptyState
          title="Слайди відсутні"
          subtitle="Додайте перший слайд"
          actionLabel="Додати слайд"
          actionOnClick={createModal.open}
        />
        {renderCreateModal}
        {renderDeleteModal}
        {renderUpdateModal}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 xl:px-8">
      <Breadcrumbs />

      <AdminPageContainer
        title="Слайди"
        description="Керуйте головним слайдером"
        actions={<Btn label="Додати слайд" onClick={createModal.open} />}
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

        <AdminTable
          data={slides}
          columns={columns}
          isLoading={isLoading}
          globalFilter={search}
          emptyMessage="Слайдів поки немає"
          mobileRender={slide => (
            <SlideMobileCard
              row={slide}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              isToggling={isSlideToggling(slide._id)}
            />
          )}
        />
      </AdminPageContainer>

      {renderCreateModal}
      {renderDeleteModal}
      {renderUpdateModal}
    </div>
  );
}
