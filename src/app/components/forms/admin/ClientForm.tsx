'use client';

import { Form, Formik } from 'formik';

import AdminFormShell from '@/app/components/forms/shared/AdminFormShell';
import { selectClassName } from '@/app/components/forms/shared/adminFormStyles';
import { clientFormSchema } from '@/app/types';
import { Input } from '@/components';

import type {
  ClientResponseDTO,
  ClientStatus,
  ClientType,
  CreateClientDTO,
} from '@/app/types';

type ClientFormValues = {
  type: ClientType;
  status: ClientStatus;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  taxId: string;
  address: string;
  notes: string;
};

interface Props {
  mode: 'create' | 'edit';
  initialValues?: Partial<ClientResponseDTO>;
  submitLabel?: string;
  onClose?: () => void;
  onSubmit?: (values: CreateClientDTO) => Promise<void> | void;
}

const defaultValues: ClientFormValues = {
  type: 'individual',
  status: 'active',
  fullName: '',
  email: '',
  phone: '+380',
  companyName: '',
  taxId: '',
  address: '',
  notes: '',
};

export default function ClientForm({
  mode,
  initialValues,
  submitLabel,
  onClose,
  onSubmit,
}: Props) {
  const isEditMode = mode === 'edit';

  const resolvedInitialValues: ClientFormValues = {
    ...defaultValues,
    ...initialValues,
  };

  return (
    <Formik<ClientFormValues>
      enableReinitialize
      initialValues={resolvedInitialValues}
      validationSchema={clientFormSchema}
      onSubmit={async values => {
        await onSubmit?.({
          type: values.type,
          status: values.status,
          fullName: values.fullName.trim(),
          email: values.email.trim().toLowerCase(),
          phone: values.phone.trim(),
          companyName: values.companyName.trim(),
          taxId: values.taxId.trim(),
          address: values.address.trim(),
          notes: values.notes.trim(),
        });
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form>
          <AdminFormShell
            title={isEditMode ? 'Редагувати клієнта' : 'Додати клієнта'}
            onClose={onClose}
            submitLabel={
              submitLabel ?? (isEditMode ? 'Оновити клієнта' : 'Додати клієнта')
            }
            isSubmitting={isSubmitting}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-secondary text-sm font-medium">Тип</span>
                <select
                  name="type"
                  value={values.type}
                  onChange={e => setFieldValue('type', e.target.value)}
                  className={selectClassName}
                >
                  <option value="individual">Фізична особа</option>
                  <option value="company">Компанія</option>
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-secondary text-sm font-medium">
                  Статус
                </span>
                <select
                  name="status"
                  value={values.status}
                  onChange={e => setFieldValue('status', e.target.value)}
                  className={selectClassName}
                >
                  <option value="active">Активний</option>
                  <option value="inactive">Неактивний</option>
                </select>
              </label>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input name="fullName" label="Імʼя / Назва" required />
              <Input name="email" label="Email" type="email" required />
              <Input name="phone" label="Телефон" type="tel" required />
              <Input name="companyName" label="Назва компанії" />
              <Input name="taxId" label="ІПН / ЄДРПОУ" />
              <Input name="address" label="Адреса" />
            </div>

            <div className="mt-3">
              <Input name="notes" label="Нотатки" />
            </div>
          </AdminFormShell>
        </Form>
      )}
    </Formik>
  );
}
