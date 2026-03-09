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

import { servicesColumns } from './services.columns';

import type { ServiceResponseDTO } from '@/app/types';
type Props = {
  initialServices: ServiceResponseDTO[];
};

export default function ServicesClient({ initialServices }: Props) {
  const router = useRouter();
  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;

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

      setServices(prev => prev.filter(s => s._id !== serviceToDelete._id));

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

  if (services.length === 0) {
    return (
      <div className="container">
        <EmptyState
          title="Послуги відсутні"
          subtitle="Додайте першу послугу"
          actionLabel="Додати нову послугу"
          actionOnClick={handleCreate}
        />

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
      </div>
    );
  }

  return (
    <div className="container">
      <Breadcrumbs />

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-accent text-xl font-semibold">Послуги</h1>
        <Btn label="Додати послугу" onClick={handleCreate} />
      </div>

      <DataTable data={services} columns={columns} />

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
    </div>
  );
}
