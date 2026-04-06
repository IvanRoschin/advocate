'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { LeadForm } from '@/app/components/forms';
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
import { LeadMobileCard } from './_components/LeadMobileCard';
import { leadColumns } from './lead.columns';

import type {
  CreateLeadDTO,
  LeadAdminFormSubmitValues,
  LeadResponseDTO,
  UpdateLeadDTO,
} from '@/app/types';
interface Props {
  initialLeads: LeadResponseDTO[];
}

export default function LeadsClient({ initialLeads }: Props) {
  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;

  const [leads, setLeads] = useState<LeadResponseDTO[]>(initialLeads);
  const [leadToDelete, setLeadToDelete] = useState<LeadResponseDTO | null>(
    null
  );
  const [leadToUpdate, setLeadToUpdate] = useState<LeadResponseDTO | null>(
    null
  );

  const createModal = useModal('createLead');
  const deleteModal = useModal('deleteLead');
  const updateModal = useModal('updateLead');

  const handleDelete = (lead: LeadResponseDTO) => {
    setLeadToDelete(lead);
    deleteModal.open();
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;

    start();
    try {
      await apiFetch<void>(apiUrl(`/api/admin/leads/${leadToDelete.id}`), {
        method: 'DELETE',
      });

      setLeads(prev => prev.filter(lead => lead.id !== leadToDelete.id));
      toast.success('Лід видалений');
      deleteModal.close();
      setLeadToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка видалення');
    } finally {
      done();
    }
  };

  const handleEdit = (lead: LeadResponseDTO) => {
    setLeadToUpdate(lead);
    updateModal.open();
  };

  const handleCreateLead = async (values: LeadAdminFormSubmitValues) => {
    const payload: CreateLeadDTO = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message,
      source: values.source,
    };

    start();
    try {
      const newLead = await apiFetch<LeadResponseDTO>(
        apiUrl('/api/admin/leads'),
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      setLeads(prev => [newLead, ...prev]);
      toast.success('Лід створений');
      createModal.close();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка створення');
    } finally {
      done();
    }
  };

  const handleUpdateLead = async (values: LeadAdminFormSubmitValues) => {
    if (!leadToUpdate) return;

    const payload: UpdateLeadDTO = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message,
      source: values.source,
      status: values.status,
      notes: values.notes,
    };

    start();
    try {
      const updatedLead = await apiFetch<LeadResponseDTO>(
        apiUrl(`/api/admin/leads/${leadToUpdate.id}`),
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }
      );

      setLeads(prev =>
        prev.map(lead => (lead.id === updatedLead.id ? updatedLead : lead))
      );

      toast.success('Лід оновлений');
      updateModal.close();
      setLeadToUpdate(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка оновлення');
    } finally {
      done();
    }
  };

  const handleConvertLeadToClient = async () => {
    if (!leadToUpdate) return;

    start();
    try {
      const result = await apiFetch<{
        client: unknown | null;
        lead: LeadResponseDTO | null;
      }>(apiUrl(`/api/admin/leads/${leadToUpdate.id}/convert`), {
        method: 'POST',
      });

      if (!result.lead) {
        throw new Error('Не вдалося отримати оновлений лід після конвертації');
      }

      setLeads(prev =>
        prev.map(lead => (lead.id === result.lead!.id ? result.lead! : lead))
      );

      setLeadToUpdate(result.lead);

      toast.success('Ліда конвертовано в клієнта');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка конвертації');
      throw err;
    } finally {
      done();
    }
  };

  const renderCreateModal = (
    <Modal
      isOpen={createModal.isOpen}
      onClose={createModal.close}
      body={
        <LeadForm
          mode="create"
          onSubmit={handleCreateLead}
          onClose={createModal.close}
          source={'home'}
        />
      }
    />
  );

  if (!leads) return <Loader />;

  if (leads.length === 0) {
    return (
      <div className="container">
        <EmptyState
          title="Ліди відсутні"
          subtitle="Додайте перший лід"
          actionLabel="Додати лід"
          actionOnClick={createModal.open}
        />
        {renderCreateModal}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 xl:px-8">
      <Breadcrumbs />

      <AdminPageContainer
        title="Ліди"
        description="Керуйте заявками користувачів"
        actions={<Btn label="Додати лід" onClick={createModal.open} />}
      >
        <AdminTableToolbar>
          <input
            type="text"
            placeholder="Пошук..."
            className="border-border bg-background h-10 w-full rounded-xl border px-3 sm:max-w-xs"
          />
        </AdminTableToolbar>

        <AdminTable
          data={leads}
          columns={leadColumns({
            onEdit: handleEdit,
            onDelete: handleDelete,
          })}
          isLoading={false}
          emptyMessage="Заявок поки немає"
          mobileRender={lead => (
            <LeadMobileCard
              row={lead}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        />
      </AdminPageContainer>

      {renderCreateModal}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        body={
          <DeleteConfirmation
            title={`Лід: ${leadToDelete?.name}`}
            onConfirm={handleDeleteConfirm}
            onCancel={deleteModal.close}
          />
        }
      />

      <Modal
        isOpen={updateModal.isOpen}
        onClose={() => {
          updateModal.close();
          setLeadToUpdate(null);
        }}
        body={
          leadToUpdate && (
            <>
              <LeadForm
                mode="edit"
                initialValues={{
                  name: leadToUpdate.name,
                  email: leadToUpdate.email,
                  phone: leadToUpdate.phone,
                  message: leadToUpdate.message,
                  source: leadToUpdate.source,
                  status: leadToUpdate.status,
                  notes: leadToUpdate.notes,
                  clientId: leadToUpdate.clientId,
                  assignedToUserId: leadToUpdate.assignedToUserId,
                }}
                submitLabel="Оновити лід"
                onSubmit={handleUpdateLead}
                onConvertToClient={handleConvertLeadToClient}
                onClose={() => {
                  updateModal.close();
                  setLeadToUpdate(null);
                }}
                source={'home'}
              />
            </>
          )
        }
      />
    </div>
  );
}
