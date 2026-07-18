'use client';

import { Form, Formik } from 'formik';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import AdminFormSection from '@/app/components/forms/shared/AdminFormSection';
import AdminFormShell from '@/app/components/forms/shared/AdminFormShell';
import {
  panelClassName,
  selectClassName,
} from '@/app/components/forms/shared/adminFormStyles';
import { adminLeadSubmitSchema } from '@/app/types';
import { Input, Switcher, Textarea } from '@/components';

import type {
  AdminLeadFormValues,
  LeadAdminFormSubmitValues,
} from '@/app/types';

interface Props {
  onSubmit: (values: LeadAdminFormSubmitValues) => Promise<void> | void;
  onClose?: () => void;
  onConvertToClient?: () => Promise<void> | void;
  initialValues?: Partial<AdminLeadFormValues>;
  submitLabel?: string;
  mode: 'create' | 'edit';
}

const adminDefaultValues: AdminLeadFormValues = {
  name: '',
  email: '',
  phone: '+380',
  source: 'home',
  message: '',
  status: 'new',
  notes: '',
  clientId: null,
  assignedToUserId: null,
  convertedToClient: false,
};

export default function AdminLeadForm({
  onSubmit,
  onClose,
  onConvertToClient,
  initialValues,
  submitLabel,
  mode,
}: Props) {
  const [isConverting, setIsConverting] = useState(false);
  const [isConvertedOptimistic, setIsConvertedOptimistic] = useState(false);

  const isEditMode = mode === 'edit';
  const resolvedInitialValues: AdminLeadFormValues = {
    ...adminDefaultValues,
    ...initialValues,
  };

  const initialConverted = useMemo(
    () => (initialValues ? Boolean(initialValues.clientId) : false),
    [initialValues]
  );

  const isConverted = initialConverted || isConvertedOptimistic;
  const canConvertToClient =
    isEditMode && typeof onConvertToClient === 'function';

  const handleConvertSwitch = async (checked: boolean) => {
    if (!checked || !canConvertToClient || isConverted || isConverting) return;

    try {
      setIsConverting(true);
      await onConvertToClient?.();
      setIsConvertedOptimistic(true);
      toast.success('Ліда успішно конвертовано в клієнта');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка конвертації');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Formik<AdminLeadFormValues>
      enableReinitialize
      initialValues={resolvedInitialValues}
      validationSchema={adminLeadSubmitSchema}
      onSubmit={async values => {
        await onSubmit({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          message: values.message.trim(),
          source: values.source,
          status: values.status,
          notes: values.notes.trim(),
        });
      }}
    >
      {({ isSubmitting, values, setFieldValue, submitCount, errors }) => {
        const showDebugHint = submitCount > 0 && Object.keys(errors).length > 0;

        return (
          <Form>
            <AdminFormShell
              title={isEditMode ? 'Редагувати лід' : 'Додати нового ліда'}
              description="Заповніть основні дані та, за потреби, виконайте конвертацію в клієнта."
              onClose={onClose}
              submitLabel={
                submitLabel ?? (isEditMode ? 'Оновити ліда' : 'Додати ліда')
              }
              isSubmitting={isSubmitting || isConverting}
              debugHint={
                showDebugHint && (
                  <>
                    Форма не проходить валідацію. Найімовірніше, в{' '}
                    <code className="bg-muted rounded px-1 py-0.5 text-[11px]">
                      adminLeadSubmitSchema
                    </code>{' '}
                    є поле, якого немає у видимій формі, або enum статусів не
                    збігається зі значеннями select.
                  </>
                )
              }
            >
              <AdminFormSection
                title="Контактні дані"
                description="Основна інформація для звʼязку з лідом."
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input name="name" label="Імʼя" required />
                  <Input name="email" label="Email" type="email" required />
                  <Input name="phone" label="Телефон" type="tel" required />

                  <label className="flex flex-col gap-2">
                    <span className="text-secondary text-sm font-medium">
                      Джерело
                    </span>
                    <select
                      name="source"
                      value={values.source}
                      onChange={e => setFieldValue('source', e.target.value)}
                      className={selectClassName}
                    >
                      <option value="home">Головна</option>
                      <option value="contacts">Контакти</option>
                    </select>
                  </label>
                </div>

                <div className="mt-2">
                  <Textarea name="message" label="Повідомлення" rows={2} />
                </div>
              </AdminFormSection>

              <AdminFormSection
                title="Адміністрування"
                description="Статус ліда, внутрішні нотатки та конвертація."
              >
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                      <option value="new">Новий</option>
                      <option value="processed">Опрацьований</option>
                    </select>
                  </label>

                  {isEditMode && (
                    <div className={panelClassName}>
                      <div className="mb-3">
                        <div className="text-primary text-sm font-medium">
                          Конвертація в клієнта
                        </div>
                        <div className="text-secondary mt-1 text-xs leading-5">
                          Викликає окрему дію через{' '}
                          <code className="bg-muted rounded px-1 py-0.5 text-[11px]">
                            /api/admin/leads/[id]/convert
                          </code>
                        </div>
                      </div>

                      <Switcher
                        id="convert-lead-to-client"
                        label="Створити клієнта з цього ліда"
                        description={
                          isConverted
                            ? 'Лід уже конвертовано. Повторна конвертація недоступна.'
                            : 'Після увімкнення буде створено клієнта, а лід отримає звʼязок з clientId.'
                        }
                        labels={['Не конвертовано', 'Конвертовано']}
                        checked={isConverted}
                        disabled={
                          isConverted || isConverting || !canConvertToClient
                        }
                        loading={isConverting}
                        onChange={checked => void handleConvertSwitch(checked)}
                        labelPosition="top"
                      />

                      {initialValues?.clientId && (
                        <div className="text-secondary mt-3 text-xs break-all">
                          Client ID: {initialValues.clientId}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <Input name="notes" label="Нотатки" />
                </div>
              </AdminFormSection>
            </AdminFormShell>
          </Form>
        );
      }}
    </Formik>
  );
}
