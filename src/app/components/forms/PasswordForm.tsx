'use client';

import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { useModal } from '@/app/hooks/useModal';
import { Btn, Input, Modal, ModalNotification } from '@/components';

import type { Schema } from 'yup';
export type PasswordField = {
  name: string;
  label: string;
  autoComplete?: string;
};

interface PasswordFormProps<T extends FormikValues> {
  title: string;
  submitLabel: string;
  initialValues: T;
  validationSchema: Schema;
  fields: PasswordField[];
  onSubmit: (
    values: T,
    helpers: FormikHelpers<T>
  ) => Promise<{ message: string } | void>;
  hiddenUsername?: string;
}

export function PasswordForm<T extends FormikValues>({
  title,
  submitLabel,
  initialValues,
  validationSchema,
  fields,
  onSubmit,
  hiddenUsername,
}: PasswordFormProps<T>) {
  const modal = useModal('notificationModal');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: T, helpers: FormikHelpers<T>) => {
    setIsLoading(true);
    setMessage('');

    try {
      const res = await onSubmit(values, helpers);
      if (res?.message) setMessage(res.message);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Невідома помилка';
      setMessage(message || 'Сталася помилка');
    } finally {
      setIsLoading(false);
      helpers.resetForm();
      modal.open();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl md:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h2 className="subtitle mb-6">{title}</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="flex flex-col gap-5">
              {hiddenUsername && (
                <input
                  type="email"
                  name="username"
                  defaultValue={hiddenUsername}
                  autoComplete="username"
                  className="hidden"
                />
              )}

              {fields.map(field => (
                <Input
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type="password"
                  autoComplete={field.autoComplete}
                  required
                />
              ))}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Btn
                  type="submit"
                  label={isLoading ? 'Завантаження...' : submitLabel}
                  disabled={isLoading}
                  className="min-w-37.5 px-5 py-2"
                />
              </motion.div>
            </Form>
          </Formik>
        </motion.div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        body={
          <ModalNotification
            title="Повідомлення"
            message={message}
            onConfirm={modal.close}
          />
        }
      />
    </div>
  );
}
