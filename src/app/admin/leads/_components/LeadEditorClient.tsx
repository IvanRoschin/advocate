'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import LeadForm from '@/app/components/forms/LeadForm';
import { apiUrl } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';

import type {
  AdminLeadFormValues,
  CreateLeadDTO,
  LeadAdminFormSubmitValues,
  LeadResponseDTO,
  UpdateLeadDTO,
} from '@/app/types';

type Props =
  | {
      mode: 'create';
    }
  | {
      mode: 'edit';
      leadId: string;
      initialValues: Partial<AdminLeadFormValues>;
    };

export default function LeadEditorClient(props: Props) {
  const router = useRouter();

  const backToList = () => router.push('/admin/leads');

  const handleCreate = async (values: LeadAdminFormSubmitValues) => {
    const payload: CreateLeadDTO = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message,
      source: values.source,
    };

    try {
      await apiFetch<LeadResponseDTO>(apiUrl('/api/admin/leads'), {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      toast.success('Лід створений');
      backToList();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка створення');
    }
  };

  const handleUpdate = async (values: LeadAdminFormSubmitValues) => {
    if (props.mode !== 'edit') return;

    const payload: UpdateLeadDTO = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message,
      source: values.source,
      status: values.status,
      notes: values.notes,
    };

    try {
      await apiFetch<LeadResponseDTO>(
        apiUrl(`/api/admin/leads/${props.leadId}`),
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }
      );

      toast.success('Лід оновлено');
      backToList();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка оновлення');
    }
  };

  const handleConvertToClient = async () => {
    if (props.mode !== 'edit') return;

    try {
      await apiFetch<{
        client: unknown;
        lead: LeadResponseDTO | null;
      }>(apiUrl(`/api/admin/leads/${props.leadId}/convert`), {
        method: 'POST',
      });

      toast.success('Ліда конвертовано в клієнта');
      backToList();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка конвертації');
    }
  };

  return (
    <div className="container py-6">
      {props.mode === 'create' ? (
        <LeadForm
          mode="create"
          onClose={backToList}
          onSubmit={handleCreate}
          source={'home'}
        />
      ) : (
        <LeadForm
          mode="edit"
          initialValues={{
            name: props.initialValues.name ?? '',
            email: props.initialValues.email ?? '',
            phone: props.initialValues.phone ?? '+380',
            message: props.initialValues.message ?? '',
            source: props.initialValues.source ?? 'home',
            status: props.initialValues.status ?? 'new',
            notes: props.initialValues.notes ?? '',
            clientId: props.initialValues.clientId ?? null,
            assignedToUserId: props.initialValues.assignedToUserId ?? null,
          }}
          onConvertToClient={handleConvertToClient}
          onClose={backToList}
          onSubmit={handleUpdate}
          source={'home'}
        />
      )}
    </div>
  );
}
