'use client';

import { Form, Formik } from 'formik';

import { CreateUserRequestDTO, createUserSchema, UserRole } from '@/app/types';

interface Props {
  onSubmit: (values: CreateUserRequestDTO) => void;
  onClose: () => void;
}

export default function CreateUserForm({ onSubmit, onClose }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            phone: '',
            role: UserRole.CLIENT,
            isActive: true,
          }}
          validationSchema={createUserSchema}
          onSubmit={onSubmit}
        >
          {({ isValid, isSubmitting }) => (
            <Form className="space-y-4">
              <h2 className="text-lg font-semibold">Новий користувач</h2>

              <input name="name" placeholder="Імʼя" />
              <input name="email" placeholder="Email" />
              <input name="password" type="password" placeholder="Пароль" />
              <input name="phone" placeholder="+380..." />

              <select name="role">
                <option value={UserRole.CLIENT}>Client</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose}>
                  Скасувати
                </button>
                <button type="submit" disabled={!isValid || isSubmitting}>
                  Створити
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
