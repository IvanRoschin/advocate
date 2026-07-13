'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import SubscriberForm from '@/app/components/forms/SubscriberForm';
import { apiUrl, routes } from '@/app/config/routes';
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
import { SubscriberMobileCard } from './_components/SubscriberMobileCard';
import { subscribersColumns } from './subscribers.columns';

import type {
  CreateSubscriberDTO,
  SubscriberResponseDTO,
  UpdateSubscriberDTO,
} from '@/app/types';
type Props = {
  initialSubscribers: SubscriberResponseDTO[];
};

export default function SubscribersClient({ initialSubscribers }: Props) {
  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;
  const isLoading = useLoadingStore(state => state.isLoading);

  const [search, setSearch] = useState('');
  const [subscribers, setSubscribers] =
    useState<SubscriberResponseDTO[]>(initialSubscribers);

  const [subscriberToDelete, setSubscriberToDelete] =
    useState<SubscriberResponseDTO | null>(null);
  const [subscriberToUpdate, setSubscriberToUpdate] =
    useState<SubscriberResponseDTO | null>(null);

  const createModal = useModal('createSubscriber');
  const deleteModal = useModal('deleteSubscriber');
  const updateModal = useModal('updateSubscriber');

  // ==================== HANDLERS ====================

  const handleEdit = useCallback(
    (subscriber: SubscriberResponseDTO) => {
      setSubscriberToUpdate(subscriber);
      updateModal.open();
    },
    [updateModal]
  );

  const handleDelete = useCallback(
    (subscriber: SubscriberResponseDTO) => {
      setSubscriberToDelete(subscriber);
      deleteModal.open();
    },
    [deleteModal]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!subscriberToDelete) return;

    start();
    try {
      await apiFetch<void>(
        apiUrl(routes.api.admin.subscribe + `/${subscriberToDelete._id}`),
        { method: 'DELETE' }
      );

      setSubscribers(prev =>
        prev.filter(item => item._id !== subscriberToDelete._id)
      );
      toast.success('Підписника видалено');
      deleteModal.close();
      setSubscriberToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка видалення');
    } finally {
      done();
    }
  }, [deleteModal, done, subscriberToDelete, start]);

  const handleToggleActive = useCallback(
    async (subscriber: SubscriberResponseDTO, checked: boolean) => {
      try {
        const endpoint = checked
          ? routes.api.admin.subscribe + `/${subscriber._id}/activate`
          : routes.api.admin.subscribe + `/${subscriber._id}/deactivate`;

        const updated = await apiFetch<SubscriberResponseDTO>(
          apiUrl(endpoint),
          {
            method: 'PATCH',
          }
        );

        setSubscribers(prev =>
          prev.map(item => (item._id === updated._id ? updated : item))
        );

        toast.success(
          checked ? 'Підписника активовано' : 'Підписника деактивовано'
        );
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Помилка зміни статусу'
        );
      }
    },
    []
  );

  const handleUpdateSubscriber = useCallback(
    async (payload: UpdateSubscriberDTO) => {
      if (!subscriberToUpdate) return;

      start();
      try {
        const updated = await apiFetch<SubscriberResponseDTO>(
          apiUrl(routes.api.admin.subscribe + `/${subscriberToUpdate._id}`),
          {
            method: 'PATCH',
            body: JSON.stringify(payload),
          }
        );

        setSubscribers(prev =>
          prev.map(item => (item._id === updated._id ? updated : item))
        );

        toast.success('Підписника оновлено');
        updateModal.close();
        setSubscriberToUpdate(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Помилка оновлення');
      } finally {
        done();
      }
    },
    [done, start, subscriberToUpdate, updateModal]
  );

  const handleCreateSubscriber = useCallback(
    async (payload: CreateSubscriberDTO) => {
      start();
      try {
        const created = await apiFetch<SubscriberResponseDTO>(
          apiUrl(routes.api.admin.subscribe),
          {
            method: 'POST',
            body: JSON.stringify(payload),
          }
        );

        setSubscribers(prev => [created, ...prev]);
        toast.success('Підписника створено');
        createModal.close();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Помилка створення');
      } finally {
        done();
      }
    },
    [createModal, done, start]
  );

  // ==================== COLUMNS & MODALS ====================

  const columns = useMemo(
    () =>
      subscribersColumns({
        onDelete: handleDelete,
        onEdit: handleEdit,
        onToggleActive: handleToggleActive,
      }),
    [handleDelete, handleEdit, handleToggleActive]
  );
  const renderCreateModal = (
    <Modal
      isOpen={createModal.isOpen}
      onClose={createModal.close}
      body={
        <SubscriberForm
          mode="create"
          onSubmit={handleCreateSubscriber}
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
          title={`Підписник: ${subscriberToDelete?.email ?? '—'}`}
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
        setSubscriberToUpdate(null);
      }}
      body={
        subscriberToUpdate && (
          <SubscriberForm
            mode="edit"
            initialValues={subscriberToUpdate}
            onSubmit={handleUpdateSubscriber}
            onClose={() => {
              updateModal.close();
              setSubscriberToUpdate(null);
            }}
          />
        )
      }
    />
  );

  if (subscribers.length === 0) {
    return (
      <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 xl:px-8">
        <EmptyState
          title="Підписники відсутні"
          subtitle="Поки що немає жодного підписника"
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
        title="Підписники"
        description="Управління email-підписками"
        actions={<Btn label="Додати підписника" onClick={createModal.open} />}
      >
        <AdminTableToolbar>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Пошук за email..."
            className="border-border bg-background h-10 w-full rounded-xl border px-3 sm:max-w-xs"
          />
        </AdminTableToolbar>

        <AdminTable
          data={subscribers}
          columns={columns}
          isLoading={isLoading}
          globalFilter={search}
          emptyMessage="Підписників не знайдено"
          mobileRender={subscriber => (
            <SubscriberMobileCard
              row={subscriber}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
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
