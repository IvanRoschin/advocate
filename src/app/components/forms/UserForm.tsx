'use client';

import { Form, Formik } from 'formik';

import Btn from '@/app/components/ui/button/Btn';
import { CreateUserRequestDTO, createUserSchema, UserRole } from '@/app/types';
import { Checkbox, Input } from '@/components';

interface Props {
  onSubmit: (values: CreateUserRequestDTO) => void | Promise<void>;
  onClose?: () => void;
  initialValues?: CreateUserRequestDTO;
  submitLabel?: string;
  mode: 'create' | 'edit';
}

const roleOptions = [
  { value: UserRole.ADMIN, label: 'Адміністратор' },
  { value: UserRole.MANAGER, label: 'Менеджер' },
  { value: UserRole.CLIENT, label: 'Клієнт' },
];

const UserForm = ({
  mode,
  onSubmit,
  onClose,
  initialValues,
  submitLabel,
}: Props) => {
  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          {mode === 'edit' ? 'Редагувати користувача' : 'Додати користувача'}
        </h2>
      </div>

      <Formik<CreateUserRequestDTO>
        enableReinitialize
        initialValues={{
          name: initialValues?.name ?? '',
          email: initialValues?.email ?? '',
          password: initialValues?.password ?? '',
          phone: initialValues?.phone ?? '+380',
          role: initialValues?.role ?? UserRole.ADMIN,
          isActive: initialValues?.isActive ?? true,
        }}
        validationSchema={createUserSchema}
        onSubmit={async values => {
          await onSubmit({
            ...values,
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            password: values.password?.trim() ?? '',
            phone: values.phone?.trim(),
            role: values.role,
            isActive: values.isActive,
          });
        }}
      >
        {({ isSubmitting, values, setFieldValue, isValid }) => (
          <Form className="flex w-full flex-col">
            <div className="space-y-3">
              <div className="mb-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Роль</span>
                  <select
                    name="role"
                    value={values.role}
                    onChange={e => setFieldValue('role', e.target.value)}
                    className="select-field rounded-xl px-3 py-2.5"
                  >
                    {roleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-end">
                  <div className="flex min-h-11.5 items-center">
                    <Checkbox name="isActive" label="Активний користувач" />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input name="name" label="Імʼя" required />
                <Input name="email" label="Email" type="email" required />
                <Input name="phone" label="Телефон" type="tel" required />
                <Input
                  name="password"
                  label="Пароль"
                  type="text"
                  placeholder={
                    mode === 'edit'
                      ? 'Залиште порожнім, щоб не змінювати'
                      : 'Буде згенеровано, якщо не вказати'
                  }
                />
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
                  (mode === 'edit'
                    ? 'Оновити користувача'
                    : 'Додати користувача')
                }
                disabled={!isValid || isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UserForm;
