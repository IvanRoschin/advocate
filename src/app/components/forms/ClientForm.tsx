'use client';

import { Form, Formik } from 'formik';

import Btn from '@/app/components/ui/button/Btn';
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
  const resolvedInitialValues: ClientFormValues = {
    ...defaultValues,
    ...initialValues,
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          {mode === 'edit' ? 'Редагувати клієнта' : 'Додати клієнта'}
        </h2>
      </div>
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
          <Form className="flex w-full flex-col">
            <div className="space-y-3">
              <div className="mb-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Тип</span>
                  <select
                    name="type"
                    value={values.type}
                    onChange={e => setFieldValue('type', e.target.value)}
                    className="select-field rounded-xl px-3 py-2.5"
                  >
                    <option value="individual">Фізична особа</option>
                    <option value="company">Компанія</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Статус</span>
                  <select
                    name="status"
                    value={values.status}
                    onChange={e => setFieldValue('status', e.target.value)}
                    className="select-field rounded-xl px-3 py-2.5"
                  >
                    <option value="active">Активний</option>
                    <option value="inactive">Неактивний</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input name="fullName" label="Імʼя / Назва" required />
                <Input name="email" label="Email" type="email" required />
                <Input name="phone" label="Телефон" type="tel" required />
                <Input name="companyName" label="Назва компанії" />
                <Input name="taxId" label="ІПН / ЄДРПОУ" />
                <Input name="address" label="Адреса" />
              </div>

              <div className="mt-2">
                <Input name="notes" label="Нотатки" />
              </div>
            </div>

            <div className="border-border bg-card/95 mt-4 flex justify-end gap-2 border-t pt-3 dark:bg-transparent">
              {onClose && (
                <Btn
                  type="button"
                  label="Скасувати"
                  uiVariant="ghost"
                  onClick={onClose}
                />
              )}

              <Btn
                type="submit"
                uiVariant="accent"
                radius={12}
                label={
                  submitLabel ??
                  (mode === 'edit' ? 'Оновити клієнта' : 'Додати клієнта')
                }
                disabled={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
