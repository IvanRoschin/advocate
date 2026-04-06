'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import ClientForm from '@/app/components/forms/ClientForm';
import { apiUrl } from '@/app/config/routes';
import { useModal } from '@/app/hooks/useModal';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { useLoadingStore } from '@/app/store/loading.store.ts';
import {
  Breadcrumbs,
  Btn,
  DeleteConfirmation,
  EmptyState,
  Loader,
  Modal,
} from '@/components';

import { AdminPageContainer } from '../_components/AdminPageContainer';
import { AdminTable } from '../_components/table';
import { AdminTableToolbar } from '../_components/table/AdminTableToolbar';
import { ClientMobileCard } from './_components/ClientMobileCard';
import { clientsColumns } from './clients.columns';

import type { ClientResponseDTO, CreateClientDTO } from '@/app/types';

type Props = {
  initialClients: ClientResponseDTO[];
};

export default function ClientsClient({ initialClients }: Props) {
  const router = useRouter();

  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;
  const isLoading = useLoadingStore(state => state.isLoading);

  const [clients, setClients] = useState<ClientResponseDTO[]>(initialClients);
  const [clientToDelete, setClientToDelete] =
    useState<ClientResponseDTO | null>(null);

  const createModal = useModal('createClient');
  const deleteModal = useModal('deleteClient');

  const handleDelete = (client: ClientResponseDTO) => {
    setClientToDelete(client);
    deleteModal.open();
  };

  const handleEdit = (client: ClientResponseDTO) => {
    router.push(`/admin/clients/${client.id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;

    start();

    try {
      await apiFetch<void>(apiUrl(`/api/admin/clients/${clientToDelete.id}`), {
        method: 'DELETE',
      });

      setClients(prev =>
        prev.filter(client => client.id !== clientToDelete.id)
      );

      toast.success('Клієнта видалено');
      deleteModal.close();
      setClientToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка видалення');
    } finally {
      done();
    }
  };

  const handleCreateClient = async (values: CreateClientDTO) => {
    start();

    try {
      const newClient = await apiFetch<ClientResponseDTO>(
        apiUrl('/api/admin/clients'),
        {
          method: 'POST',
          body: JSON.stringify(values),
        }
      );

      setClients(prev => [newClient, ...prev]);
      toast.success('Клієнта створено');
      createModal.close();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка створення');
    } finally {
      done();
    }
  };

  const renderCreateModal = (
    <Modal
      isOpen={createModal.isOpen}
      onClose={createModal.close}
      body={
        <ClientForm
          mode="create"
          onSubmit={handleCreateClient}
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
          title={`Клієнт: ${clientToDelete?.fullName ?? '—'}`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            deleteModal.close();
            setClientToDelete(null);
          }}
        />
      }
    />
  );

  if (!clients) {
    return <Loader />;
  }

  if (clients.length === 0) {
    return (
      <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 xl:px-8">
        <EmptyState
          title="Клієнти відсутні"
          subtitle="Додайте першого клієнта"
          actionLabel="Додати клієнта"
          actionOnClick={createModal.open}
        />
        {renderCreateModal}
        {renderDeleteModal}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 xl:px-8">
      <Breadcrumbs />

      <AdminPageContainer
        title="Клієнти"
        description="Керуйте базою клієнтів"
        actions={<Btn label="Додати клієнта" onClick={createModal.open} />}
      >
        <AdminTableToolbar>
          <input
            type="text"
            placeholder="Пошук..."
            className="border-border bg-background h-10 w-full rounded-xl border px-3 sm:max-w-xs"
          />
        </AdminTableToolbar>

        <AdminTable
          data={clients}
          columns={clientsColumns({
            onEdit: handleEdit,
            onDelete: handleDelete,
          })}
          isLoading={isLoading}
          emptyMessage="Клієнтів поки немає"
          mobileRender={client => (
            <ClientMobileCard
              row={client}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        />
      </AdminPageContainer>

      {renderCreateModal}
      {renderDeleteModal}
    </div>
  );
}
