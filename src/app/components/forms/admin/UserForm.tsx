'use client';

import { Form, Formik } from 'formik';

import AdminFormShell from '@/app/components/forms/shared/AdminFormShell';
import { selectClassName } from '@/app/components/forms/shared/adminFormStyles';
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
  const isEditMode = mode === 'edit';

  return (
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
        <Form>
          <AdminFormShell
            title={isEditMode ? 'Редагувати користувача' : 'Додати користувача'}
            onClose={onClose}
            submitLabel={
              submitLabel ??
              (isEditMode ? 'Оновити користувача' : 'Додати користувача')
            }
            isSubmitting={isSubmitting}
            submitDisabled={!isValid}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-secondary text-sm font-medium">Роль</span>
                <select
                  name="role"
                  value={values.role}
                  onChange={e => setFieldValue('role', e.target.value)}
                  className={selectClassName}
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-end">
                <div className="flex min-h-11.5 items-center">
                  <Checkbox name="isActive" label="Активний користувач" />
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input name="name" label="Імʼя" required />
              <Input name="email" label="Email" type="email" required />
              <Input name="phone" label="Телефон" type="tel" required />
              <Input
                name="password"
                label="Пароль"
                type="text"
                placeholder={
                  isEditMode
                    ? 'Залиште порожнім, щоб не змінювати'
                    : 'Буде згенеровано, якщо не вказати'
                }
              />
            </div>
          </AdminFormShell>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
