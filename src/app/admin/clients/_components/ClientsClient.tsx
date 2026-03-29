'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { DataTable } from '@/app/components/data-table/DataTable';
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

import { clientsColumns } from './clients.columns';

import type {
  ClientResponseDTO,
  CreateClientDTO,
  UpdateClientDTO,
} from '@/app/types';

type Props = {
  initialClients: ClientResponseDTO[];
};

export default function ClientsClient({ initialClients }: Props) {
  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;

  const [clients, setClients] = useState<ClientResponseDTO[]>(initialClients);
  const [clientToDelete, setClientToDelete] =
    useState<ClientResponseDTO | null>(null);
  const [clientToUpdate, setClientToUpdate] =
    useState<ClientResponseDTO | null>(null);

  const createModal = useModal('createClient');
  const deleteModal = useModal('deleteClient');
  const updateModal = useModal('updateClient');

  const handleDelete = (client: ClientResponseDTO) => {
    setClientToDelete(client);
    deleteModal.open();
  };

  const handleEdit = (client: ClientResponseDTO) => {
    setClientToUpdate(client);
    updateModal.open();
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

  const handleUpdateClient = async (values: CreateClientDTO) => {
    if (!clientToUpdate) return;

    const payload: UpdateClientDTO = {
      type: values.type,
      status: values.status,
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      companyName: values.companyName,
      taxId: values.taxId,
      address: values.address,
      notes: values.notes,
    };

    start();
    try {
      const updatedClient = await apiFetch<ClientResponseDTO>(
        apiUrl(`/api/admin/clients/${clientToUpdate.id}`),
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }
      );

      setClients(prev =>
        prev.map(client =>
          client.id === updatedClient.id ? updatedClient : client
        )
      );

      toast.success('Клієнта оновлено');
      updateModal.close();
      setClientToUpdate(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка оновлення');
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

  if (!clients) return <Loader />;

  if (clients.length === 0) {
    return (
      <div className="container">
        <EmptyState
          title="Клієнти відсутні"
          subtitle="Додайте першого клієнта"
          actionLabel="Додати клієнта"
          actionOnClick={createModal.open}
        />
        {renderCreateModal}
      </div>
    );
  }

  return (
    <div className="container">
      <Breadcrumbs />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-accent text-xl font-semibold">Клієнти</h1>
        <Btn label="Додати клієнта" onClick={createModal.open} />
      </div>

      <DataTable
        data={clients}
        columns={clientsColumns({
          onEdit: handleEdit,
          onDelete: handleDelete,
        })}
      />

      {renderCreateModal}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        body={
          <DeleteConfirmation
            title={`Клієнт: ${clientToDelete?.fullName}`}
            onConfirm={handleDeleteConfirm}
            onCancel={deleteModal.close}
          />
        }
      />

      <Modal
        isOpen={updateModal.isOpen}
        onClose={() => {
          updateModal.close();
          setClientToUpdate(null);
        }}
        body={
          clientToUpdate && (
            <ClientForm
              mode="edit"
              initialValues={clientToUpdate}
              submitLabel="Оновити клієнта"
              onSubmit={handleUpdateClient}
              onClose={() => {
                updateModal.close();
                setClientToUpdate(null);
              }}
            />
          )
        }
      />
    </div>
  );
}
