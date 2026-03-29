'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import ClientForm from '@/app/components/forms/ClientForm';
import { apiUrl } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';

import type {
  ClientResponseDTO,
  CreateClientDTO,
  UpdateClientDTO,
} from '@/app/types';

type Props =
  | {
      mode: 'create';
    }
  | {
      mode: 'edit';
      clientId: string;
      initialValues: Partial<ClientResponseDTO>;
    };

export default function ClientEditorClient(props: Props) {
  const router = useRouter();

  const backToList = () => router.push('/admin/clients');

  const handleCreate = async (values: CreateClientDTO) => {
    try {
      await apiFetch<ClientResponseDTO>(apiUrl('/api/admin/clients'), {
        method: 'POST',
        body: JSON.stringify(values),
      });

      toast.success('Клієнта створено');
      backToList();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка створення');
    }
  };

  const handleUpdate = async (values: CreateClientDTO) => {
    if (props.mode !== 'edit') return;

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

    try {
      await apiFetch<ClientResponseDTO>(
        apiUrl(`/api/admin/clients/${props.clientId}`),
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }
      );

      toast.success('Клієнта оновлено');
      backToList();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка оновлення');
    }
  };

  return (
    <div className="container py-6">
      {props.mode === 'create' ? (
        <ClientForm
          mode="create"
          onClose={backToList}
          onSubmit={handleCreate}
        />
      ) : (
        <ClientForm
          mode="edit"
          initialValues={props.initialValues}
          submitLabel="Оновити клієнта"
          onClose={backToList}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
}
