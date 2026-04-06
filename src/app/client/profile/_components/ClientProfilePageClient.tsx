'use client';

import { Form, Formik, FormikErrors, FormikTouched } from 'formik';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { apiUrl } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';
import {
  clientProfileSchema,
  mapClientProfileToForm,
  mapFormToUpdateClientProfile,
} from '@/app/types';

import type { ClientProfileDto, ClientProfileFormValues } from '@/app/types';
type Props = {
  initialProfile: ClientProfileDto;
};

type FieldProps = {
  label: string;
  name: keyof ClientProfileFormValues;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: string;
  touched?: boolean;
  type?: string;
  as?: 'input' | 'textarea';
  rows?: number;
  disabled?: boolean;
};

const Field = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  type = 'text',
  as = 'input',
  rows,
  disabled,
}: FieldProps) => (
  <label className="flex flex-col gap-2">
    <span className="text-secondary text-sm font-medium">{label}</span>

    {as === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        rows={rows ?? 4}
        disabled={disabled}
        className="border-border bg-background text-primary focus:border-accent min-h-28 rounded-2xl border px-4 py-3 text-sm transition outline-none disabled:cursor-not-allowed disabled:opacity-70"
      />
    ) : (
      <input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        disabled={disabled}
        className="border-border bg-background text-primary focus:border-accent h-12 rounded-2xl border px-4 text-sm transition outline-none disabled:cursor-not-allowed disabled:opacity-70"
      />
    )}

    {touched && error ? (
      <span className="text-sm text-red-500">{error}</span>
    ) : null}
  </label>
);

const ReadonlyRow = ({ label, value }: { label: string; value: string }) => (
  <div className="border-border bg-background/60 rounded-2xl border p-4">
    <div className="text-secondary text-xs tracking-[0.14em] uppercase">
      {label}
    </div>
    <div className="text-primary mt-2 text-sm leading-6">
      {value || 'Не вказано'}
    </div>
  </div>
);

const getFieldError = <
  TValues extends Record<string, unknown>,
  TName extends keyof TValues,
>(
  name: TName,
  errors: FormikErrors<TValues>,
  touched: FormikTouched<TValues>
) => {
  const error = errors[name];
  const isTouched = touched[name];

  return {
    error: typeof error === 'string' ? error : undefined,
    touched: Boolean(isTouched),
  };
};

export default function ClientProfilePageClient({ initialProfile }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ClientProfileDto>(initialProfile);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="border-border bg-card overflow-hidden rounded-[28px] border shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.2fr)_320px] lg:p-8">
          <div>
            <div className="border-accent/15 bg-accent/10 text-accent inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.16em] uppercase">
              Профіль клієнта
            </div>

            <h1 className="text-primary mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">
              Особисті та контактні дані
            </h1>

            <p className="text-secondary mt-3 max-w-2xl text-sm leading-7 sm:text-base">
              Тут ви можете переглянути та оновити свої контактні дані, адресу,
              а також реквізити компанії, якщо працюєте як юридична особа.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(prev => !prev)}
                className="bg-accent inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-medium text-white transition hover:opacity-90"
              >
                {isEditing ? 'Скасувати редагування' : 'Редагувати профіль'}
              </button>

              <Link
                href="/client"
                className="border-border bg-background text-primary hover:bg-muted inline-flex h-11 items-center justify-center rounded-2xl border px-5 text-sm font-medium transition"
              >
                Назад у кабінет
              </Link>
            </div>
          </div>

          <div className="border-border bg-background/70 rounded-[24px] border p-5">
            <div className="text-primary text-sm font-semibold">
              Стан профілю
            </div>

            <div className="mt-4 space-y-3">
              <div className="border-border bg-card rounded-2xl border p-4">
                <div className="text-secondary text-xs tracking-[0.14em] uppercase">
                  Тип клієнта
                </div>
                <div className="text-primary mt-2 text-sm font-medium">
                  {profile.type === 'company'
                    ? 'Юридична особа'
                    : 'Фізична особа'}
                </div>
              </div>

              <div className="border-border bg-card rounded-2xl border p-4">
                <div className="text-secondary text-xs tracking-[0.14em] uppercase">
                  Статус
                </div>
                <div className="text-primary mt-2 text-sm font-medium">
                  {profile.status === 'active' ? 'Активний' : 'Неактивний'}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="text-primary text-sm font-medium">
                  Рекомендація
                </div>
                <div className="text-secondary mt-2 text-sm leading-6">
                  Підтримуйте email, телефон та адресу актуальними — це спрощує
                  комунікацію по справах і документам.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isEditing ? (
        <section className="border-border bg-card rounded-[28px] border p-6 shadow-sm lg:p-8">
          <div className="mb-6">
            <h2 className="text-primary text-xl font-semibold">
              Редагування профілю
            </h2>
            <p className="text-secondary mt-1 text-sm leading-6">
              Збережіть актуальні контактні та реєстраційні дані.
            </p>
          </div>

          <Formik<ClientProfileFormValues>
            initialValues={mapClientProfileToForm(profile)}
            enableReinitialize
            validationSchema={clientProfileSchema}
            onSubmit={async (values, helpers) => {
              try {
                const updated = await apiFetch<ClientProfileDto>(
                  apiUrl('/api/client/profile'),
                  {
                    method: 'PATCH',
                    body: JSON.stringify(mapFormToUpdateClientProfile(values)),
                  }
                );

                setProfile(updated);
                setIsEditing(false);
                toast.success('Профіль оновлено');
              } catch (err) {
                toast.error(
                  err instanceof Error ? err.message : 'Помилка оновлення'
                );
              } finally {
                helpers.setSubmitting(false);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting,
              handleBlur,
            }) => {
              const fullNameMeta = getFieldError('fullName', errors, touched);
              const emailMeta = getFieldError('email', errors, touched);
              const phoneMeta = getFieldError('phone', errors, touched);
              const addressMeta = getFieldError('address', errors, touched);
              const companyNameMeta = getFieldError(
                'companyName',
                errors,
                touched
              );

              return (
                <Form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="ПІБ"
                      name="fullName"
                      value={values.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={fullNameMeta.error}
                      touched={fullNameMeta.touched}
                    />

                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={emailMeta.error}
                      touched={emailMeta.touched}
                    />

                    <Field
                      label="Телефон"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={phoneMeta.error}
                      touched={phoneMeta.touched}
                    />

                    <Field
                      label="Адреса"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={addressMeta.error}
                      touched={addressMeta.touched}
                    />

                    <label className="flex flex-col gap-2">
                      <span className="text-secondary text-sm font-medium">
                        Тип клієнта
                      </span>
                      <select
                        name="type"
                        value={values.type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="border-border bg-background text-primary focus:border-accent h-12 rounded-2xl border px-4 text-sm transition outline-none"
                      >
                        <option value="individual">Фізична особа</option>
                        <option value="company">Юридична особа</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-secondary text-sm font-medium">
                        Статус
                      </span>
                      <input
                        value={
                          values.status === 'active' ? 'Активний' : 'Неактивний'
                        }
                        disabled
                        className="border-border bg-background text-primary h-12 rounded-2xl border px-4 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-70"
                      />
                    </label>

                    {values.type === 'company' ? (
                      <Field
                        label="Назва компанії"
                        name="companyName"
                        value={values.companyName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={companyNameMeta.error}
                        touched={companyNameMeta.touched}
                      />
                    ) : null}
                  </div>

                  <div className="flex flex-wrap justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="border-border bg-background text-primary hover:bg-muted inline-flex h-11 items-center justify-center rounded-2xl border px-5 text-sm font-medium transition"
                    >
                      Скасувати
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-accent inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-70"
                    >
                      Зберегти зміни
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </section>
      ) : (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_380px]">
          <div className="border-border bg-card rounded-[28px] border p-6 shadow-sm">
            <h2 className="text-primary text-xl font-semibold">
              Основна інформація
            </h2>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <ReadonlyRow label="ПІБ" value={profile.fullName} />
              <ReadonlyRow label="Email" value={profile.email} />
              <ReadonlyRow label="Телефон" value={profile.phone} />
              <ReadonlyRow label="Адреса" value={profile.address} />
              <ReadonlyRow
                label="Тип клієнта"
                value={
                  profile.type === 'company'
                    ? 'Юридична особа'
                    : 'Фізична особа'
                }
              />
              <ReadonlyRow
                label="Статус"
                value={profile.status === 'active' ? 'Активний' : 'Неактивний'}
              />
              {profile.type === 'company' ? (
                <ReadonlyRow
                  label="Назва компанії"
                  value={profile.companyName}
                />
              ) : null}
            </div>
          </div>

          <div className="border-border bg-card rounded-[28px] border p-6 shadow-sm">
            <h2 className="text-primary text-xl font-semibold">
              Додаткова інформація
            </h2>

            <div className="mt-6 space-y-3">
              <ReadonlyRow label="ID клієнта" value={profile.id} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
