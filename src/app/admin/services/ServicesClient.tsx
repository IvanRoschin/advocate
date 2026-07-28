'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { routes } from '@/app/config/routes';
import { useLoadingStore } from '@/app/store/loading.store';
import {
  Breadcrumbs,
  Btn,
  DeleteConfirmation,
  EmptyState,
  Modal,
} from '@/components';

import { useAdminDeleteFlow } from '../_hooks/useAdminDeleteFlow';
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
  const isLoading = useLoadingStore(state => state.isLoading);

  const [search, setSearch] = useState('');

  const [services, setServices] =
    useState<ServiceResponseDTO[]>(initialServices);

  const {
    itemToDelete: serviceToDelete,
    deleteModal,
    handleDelete,
    handleDeleteConfirm,
  } = useAdminDeleteFlow<ServiceResponseDTO>({
    modalKey: 'deleteService',
    apiPath: routes.api.admin.services,
    getId: service => service._id,
    successMessage: 'Послугу видалено',
    onDeleted: deleted =>
      setServices(prev => prev.filter(service => service._id !== deleted._id)),
  });

  const handleEdit = useCallback(
    (service: ServiceResponseDTO) => {
      router.push(routes.api.admin.services + `/${service._id}/edit`);
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
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Пошук..."
            className="border-border bg-background h-10 w-full rounded-xl border px-3 sm:max-w-xs"
          />
        </AdminTableToolbar>

        <AdminTable
          data={services}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="Послуг поки немає"
          globalFilter={search}
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
