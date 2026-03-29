'use client';

import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import Btn from '@/app/components/ui/button/Btn';
import { apiUrl } from '@/app/config/routes';
import { useRecaptchaWidget } from '@/app/hooks/useRecaptchaWidget';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { ApiResponse } from '@/app/lib/server/ApiError';
import { useLoadingStore } from '@/app/store/loading.store.ts';
import { adminLeadSubmitSchema, leadFormSchema } from '@/app/types';
import { Input, Switcher, Textarea } from '@/components/index';

import type {
  AdminLeadFormValues,
  LeadAdminFormSubmitValues,
  LeadResponseDTO,
  PublicLeadFormValues,
} from '@/app/types';

interface Props {
  onSubmit?: (values: LeadAdminFormSubmitValues) => Promise<void> | void;
  onClose?: () => void;
  onConvertToClient?: () => Promise<void> | void;
  initialValues?: Partial<AdminLeadFormValues>;
  submitLabel?: string;
  mode: 'public' | 'create' | 'edit';
  publicVariant?: 'home' | 'contacts';
}

const publicDefaultValues: PublicLeadFormValues = {
  name: '',
  email: '',
  phone: '+380',
  source: 'home',
  consent: false,
  website: '',
  message: '',
};

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

const fieldMotion = (delay: number) => ({
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.2 },
});

const cardClassName =
  'border-border bg-card/80 supports-[backdrop-filter]:bg-card/70 rounded-2xl border shadow-sm backdrop-blur';
const sectionTitleClassName =
  'text-foreground text-sm font-semibold tracking-wide';
const helperTextClassName = 'text-muted-foreground text-xs leading-5';
const selectClassName =
  'border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-accent/30 rounded-xl border px-3 py-2.5 transition outline-none focus:ring-2';

export default function LeadForm({
  onSubmit,
  onClose,
  onConvertToClient,
  initialValues,
  submitLabel,
  mode,
  publicVariant = 'home',
}: Props) {
  const [isConverting, setIsConverting] = useState(false);

  const isAdminMode = mode === 'create' || mode === 'edit';
  const isEditMode = mode === 'edit';
  const isPublicMode = mode === 'public';

  const shouldUseCaptcha = isPublicMode;
  const shouldShowConsent = isPublicMode;
  const shouldShowHiddenFields = isPublicMode;
  const shouldShowAdminFields = isAdminMode;

  const shouldShowSource = isAdminMode;
  const shouldShowMessage =
    isAdminMode || (isPublicMode && publicVariant === 'contacts');

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isCaptchaConfigured = Boolean(siteKey);

  const start = useLoadingStore.getState().start;
  const done = useLoadingStore.getState().done;

  const { containerRef, captchaToken, isRendered, resetCaptcha } =
    useRecaptchaWidget({
      siteKey,
    });

  const validationSchema = isAdminMode ? adminLeadSubmitSchema : leadFormSchema;

  const resolvedInitialValues: PublicLeadFormValues | AdminLeadFormValues =
    isAdminMode
      ? {
          ...adminDefaultValues,
          ...initialValues,
        }
      : publicDefaultValues;

  const initialConverted = useMemo(
    () =>
      isAdminMode && initialValues ? Boolean(initialValues.clientId) : false,
    [initialValues, isAdminMode]
  );

  const [isConvertedLocal, setIsConvertedLocal] = useState(initialConverted);

  useEffect(() => {
    setIsConvertedLocal(initialConverted);
  }, [initialConverted]);

  const canConvertToClient =
    isEditMode && typeof onConvertToClient === 'function';

  const handleConvertSwitch = async (checked: boolean) => {
    if (!checked || !canConvertToClient || isConvertedLocal || isConverting) {
      return;
    }

    try {
      setIsConverting(true);
      await onConvertToClient?.();
      setIsConvertedLocal(true);
      toast.success('Ліда успішно конвертовано в клієнта');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка конвертації');
    } finally {
      setIsConverting(false);
    }
  };

  const handlePublicSubmit = async (
    values: PublicLeadFormValues,
    resetForm: () => void
  ) => {
    start();

    if (shouldUseCaptcha && !isCaptchaConfigured) {
      toast.error('reCAPTCHA не налаштована');
      done();
      return;
    }

    if (shouldUseCaptcha && !captchaToken) {
      toast.error('Будь ласка, підтвердіть, що ви не робот');
      done();
      return;
    }

    try {
      await apiFetch<ApiResponse<LeadResponseDTO>>(apiUrl('/api/v1/leads'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          message: values.message.trim(),
          recaptchaToken: captchaToken,
        }),
      });

      toast.success('Ваша заявка успішно надіслана!');
      resetForm();
      resetCaptcha();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Помилка створення');
    } finally {
      done();
    }
  };

  return (
    <div className="text-foreground w-full">
      {(isEditMode || isAdminMode) && (
        <div className="mb-4">
          <h2 className="text-foreground text-xl font-semibold">
            {isEditMode ? 'Редагувати лід' : 'Додати нового ліда'}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Заповніть основні дані та, за потреби, виконайте конвертацію в
            клієнта.
          </p>
        </div>
      )}

      <Formik<PublicLeadFormValues | AdminLeadFormValues>
        enableReinitialize
        initialValues={resolvedInitialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          if (isAdminMode) {
            const adminValues = values as AdminLeadFormValues;

            const normalizedValues: LeadAdminFormSubmitValues = {
              name: adminValues.name.trim(),
              email: adminValues.email.trim(),
              phone: adminValues.phone.trim(),
              message: adminValues.message.trim(),
              source: adminValues.source,
              status: adminValues.status,
              notes: adminValues.notes.trim(),
            };

            await onSubmit?.(normalizedValues);
            return;
          }

          const publicValues = values as PublicLeadFormValues;

          await handlePublicSubmit(
            {
              ...publicValues,
              name: publicValues.name.trim(),
              email: publicValues.email.trim(),
              phone: publicValues.phone.trim(),
              message: publicValues.message.trim(),
            },
            resetForm
          );
        }}
      >
        {({ isSubmitting, values, setFieldValue, submitCount, errors }) => {
          const publicCaptchaBlocked =
            isPublicMode && shouldUseCaptcha && !isRendered;

          /**
           * ВАЖНО:
           * Не блокируем admin submit по !isValid.
           * Иначе форма может "залипнуть" disabled из-за скрытого/несовпадающего schema-поля.
           * Валидация всё равно отработает внутри Formik при submit.
           */
          const isSubmitDisabled =
            isSubmitting || isConverting || publicCaptchaBlocked;

          const showDebugHint =
            isAdminMode && submitCount > 0 && Object.keys(errors).length > 0;

          const canConvertToClient =
            isEditMode && typeof onConvertToClient === 'function';

          return (
            <Form className="flex max-h-[85vh] w-full flex-col overflow-hidden">
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="space-y-3">
                  <motion.section
                    {...fieldMotion(0.1)}
                    className={`${cardClassName} p-4 sm:p-5`}
                  >
                    <div className="mb-4">
                      <h3 className={sectionTitleClassName}>Контактні дані</h3>
                      <p className={`${helperTextClassName} mt-1`}>
                        Основна інформація для звʼязку з лідом.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Input name="name" label="Імʼя" required />
                      <Input name="email" label="Email" type="email" required />
                      <Input name="phone" label="Телефон" type="tel" required />
                      {shouldShowSource && (
                        <label className="flex flex-col gap-2">
                          <select
                            name="source"
                            value={values.source}
                            onChange={e =>
                              setFieldValue('source', e.target.value)
                            }
                            className={selectClassName}
                          >
                            <option value="home">Головна</option>
                            <option value="contacts">Контакти</option>
                          </select>
                        </label>
                      )}
                    </div>

                    {shouldShowMessage && (
                      <div className="mt-2">
                        <Textarea
                          name="message"
                          label="Повідомлення"
                          rows={1}
                        />
                      </div>
                    )}
                  </motion.section>

                  {shouldShowAdminFields && (
                    <motion.section
                      {...fieldMotion(0.15)}
                      className={`${cardClassName} p-4 sm:p-5`}
                    >
                      <div className="mb-2">
                        <h3 className={sectionTitleClassName}>
                          Адміністрування
                        </h3>
                        <p className={`${helperTextClassName} mt-1`}>
                          Статус ліда, внутрішні нотатки та конвертація.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <label className="flex flex-col gap-2">
                          <span className="text-foreground text-sm font-medium">
                            Статус
                          </span>
                          <select
                            name="status"
                            value={'status' in values ? values.status : 'new'}
                            onChange={e =>
                              setFieldValue('status', e.target.value)
                            }
                            className={selectClassName}
                          >
                            <option value="new">Новий</option>
                            <option value="processed">Опрацьований</option>
                          </select>
                        </label>

                        {isEditMode ? (
                          <div className="border-border bg-background/70 rounded-2xl border p-4">
                            <div className="mb-3">
                              <div className="text-foreground text-sm font-medium">
                                Конвертація в клієнта
                              </div>
                              <div className="text-muted-foreground mt-1 text-xs leading-5">
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
                                isConvertedLocal
                                  ? 'Лід уже конвертовано. Повторна конвертація недоступна.'
                                  : 'Після увімкнення буде створено клієнта, а лід отримає звʼязок з clientId.'
                              }
                              labels={['Не конвертовано', 'Конвертовано']}
                              checked={isConvertedLocal}
                              disabled={
                                isConvertedLocal ||
                                isConverting ||
                                !canConvertToClient
                              }
                              loading={isConverting}
                              onChange={checked => {
                                void handleConvertSwitch(checked);
                              }}
                              labelPosition="top"
                            />

                            {initialValues?.clientId ? (
                              <div className="text-muted-foreground mt-3 text-xs break-all">
                                Client ID: {initialValues.clientId}
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-4">
                        <Input name="notes" label="Нотатки" />
                      </div>
                    </motion.section>
                  )}

                  {shouldShowConsent && (
                    <motion.section
                      {...fieldMotion(0.2)}
                      className={`${cardClassName} p-3 sm:p-4`}
                    >
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          name="consent"
                          checked={
                            'consent' in values
                              ? Boolean(values.consent)
                              : false
                          }
                          onChange={e =>
                            setFieldValue('consent', e.currentTarget.checked)
                          }
                          className="accent-accent mt-1 h-4 w-4 rounded"
                        />
                        <span className="text-foreground text-sm leading-6">
                          Даю згоду на обробку персональних даних
                        </span>
                      </label>
                    </motion.section>
                  )}

                  {shouldShowHiddenFields && (
                    <input
                      type="text"
                      name="website"
                      autoComplete="off"
                      tabIndex={-1}
                      aria-hidden="true"
                      className="hidden"
                    />
                  )}

                  {shouldUseCaptcha && (
                    <motion.section
                      {...fieldMotion(0.25)}
                      className={`${cardClassName} p-4 sm:p-5`}
                    >
                      <div className="flex items-center justify-center">
                        <div ref={containerRef} />
                      </div>

                      {!isRendered ? (
                        <p className="text-muted-foreground mt-3 text-center text-sm">
                          Завантаження перевірки безпеки...
                        </p>
                      ) : null}
                    </motion.section>
                  )}

                  {showDebugHint && (
                    <div className="border-border bg-muted/40 text-muted-foreground rounded-2xl border px-4 py-3 text-sm">
                      Форма не проходить валідацію. Найімовірніше, в
                      <code className="bg-muted mx-1 rounded px-1 py-0.5 text-[11px]">
                        adminLeadFormSchema
                      </code>
                      є поле, якого немає у видимій формі, або enum статусів не
                      збігається з значеннями select.
                    </div>
                  )}
                </div>
              </div>

              <div className="border-border bg-background/95 supports-backdrop-filter:bg-background/80 sticky bottom-0 mt-4 flex flex-wrap items-center justify-end gap-2 border-t pt-4 backdrop-blur">
                {onClose && (
                  <Btn
                    type="button"
                    label="Скасувати"
                    uiVariant="ghost"
                    onClick={onClose}
                  />
                )}

                <Btn
                  uiVariant="accent"
                  radius={12}
                  type="submit"
                  label={
                    submitLabel ??
                    (isEditMode
                      ? 'Оновити ліда'
                      : isAdminMode
                        ? 'Додати ліда'
                        : 'Надіслати')
                  }
                  disabled={isSubmitDisabled}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
