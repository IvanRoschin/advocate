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
import { ServiceMobileCard } from './_components/ServiceMobileCard';
import { servicesColumns } from './services.columns';

import type { ServiceResponseDTO } from '@/app/types';
type Props = {
  initialServices: ServiceResponseDTO[];
};

export default function ServicesClient({ initialServices }: Props) {
  const router = useRouter();
  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;
  const isLoading = useLoadingStore(state => state.isLoading);

  const [services, setServices] =
    useState<ServiceResponseDTO[]>(initialServices);
  const [serviceToDelete, setServiceToDelete] =
    useState<ServiceResponseDTO | null>(null);

  const deleteModal = useModal('deleteService');

  const handleDelete = useCallback(
    (service: ServiceResponseDTO) => {
      setServiceToDelete(service);
      deleteModal.open();
    },
    [deleteModal]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!serviceToDelete) return;

    start();

    try {
      await apiFetch<void>(
        apiUrl(`/api/admin/services/${serviceToDelete._id}`),
        {
          method: 'DELETE',
        }
      );

      setServices(prev =>
        prev.filter(service => service._id !== serviceToDelete._id)
      );

      toast.success('Послугу видалено');
      deleteModal.close();
      setServiceToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка видалення');
    } finally {
      done();
    }
  }, [serviceToDelete, start, done, deleteModal]);

  const handleEdit = useCallback(
    (service: ServiceResponseDTO) => {
      router.push(`/admin/services/${service._id}/edit`);
    },
    [router]
  );

  const handleCreate = useCallback(() => {
    router.push('/admin/services/new');
  }, [router]);

  const columns = useMemo(
    () =>
      servicesColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleDelete, handleEdit]
  );

  const renderDeleteModal = (
    <Modal
      isOpen={deleteModal.isOpen}
      onClose={deleteModal.close}
      body={
        <DeleteConfirmation
          title={`Послуга: ${serviceToDelete?.title ?? '—'}`}
          onConfirm={handleDeleteConfirm}
          onCancel={deleteModal.close}
        />
      }
    />
  );

  if (services.length === 0) {
    return (
      <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 xl:px-8">
        <EmptyState
          title="Послуги відсутні"
          subtitle="Додайте першу послугу"
          actionLabel="Додати нову послугу"
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
        title="Послуги"
        description="Керуйте сторінками послуг"
        actions={<Btn label="Додати послугу" onClick={handleCreate} />}
      >
        <AdminTableToolbar>
          <input
            type="text"
            placeholder="Пошук..."
            className="border-border bg-background h-10 w-full rounded-xl border px-3 sm:max-w-xs"
          />
        </AdminTableToolbar>

        <AdminTable
          data={services}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="Послуг поки немає"
          mobileRender={service => (
            <ServiceMobileCard
              row={service}
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
