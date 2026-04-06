'use client';

import { changePasswordSchema } from '@/app/helpers/validationSchemas';
import { PasswordForm } from '@/components/forms/PasswordForm';

interface Values {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const ChangePasswordForm = ({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail?: string | null;
}) => {
  if (!userId) return null;

  return (
    <PasswordForm<Values>
      title="Змінити пароль"
      submitLabel="Змінити пароль"
      hiddenUsername={userEmail ?? ''}
      initialValues={{
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }}
      validationSchema={changePasswordSchema}
      fields={[
        {
          name: 'oldPassword',
          label: 'Старий пароль',
          autoComplete: 'current-password',
        },
        {
          name: 'newPassword',
          label: 'Новий пароль',
          autoComplete: 'new-password',
        },
        {
          name: 'confirmNewPassword',
          label: 'Повторіть пароль',
          autoComplete: 'new-password',
        },
      ]}
      onSubmit={async values => {
        console.warn('values', values);
      }}
    />
  );
};
