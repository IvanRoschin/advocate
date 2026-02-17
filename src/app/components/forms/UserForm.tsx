'use client';

import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';

import Btn from '@/app/components/ui/button/Btn';
import { CreateUserRequestDTO, createUserSchema, UserRole } from '@/app/types';
import { Checkbox, Input, Select } from '@/components';

interface Props {
  onSubmit: (values: CreateUserRequestDTO) => void;
  onClose: () => void;
  initialValues?: CreateUserRequestDTO;
  submitLabel?: string;
}

const roleOptions = Object.values(UserRole).map(role => ({
  value: role,
  label: role.toUpperCase(),
}));

const UserForm = ({
  onSubmit,
  onClose,
  initialValues,
  submitLabel = 'Додати користувача',
}: Props) => {
  const isEditMode = Boolean(initialValues);

  return (
    <>
      {isEditMode ? 'Редагувати користувача' : 'Додати нового користувача'}

      <Formik<CreateUserRequestDTO>
        enableReinitialize
        initialValues={{
          name: initialValues?.name ?? '',
          email: initialValues?.email ?? '',
          password: initialValues?.password ?? '',
          phone: initialValues?.phone ?? '+380',
          role: initialValues?.role ?? UserRole.CLIENT,
          isActive: initialValues?.isActive ?? true,
        }}
        validationSchema={createUserSchema}
        onSubmit={onSubmit}
      >
        {({ isValid, isSubmitting }) => (
          <Form className="flex w-full max-w-lg flex-col gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Input name="name" label="Імʼя" required />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <Input name="email" label="Email" type="email" required />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <Input name="phone" label="Phone" type="tel" required />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Select name="role" label="Роль" options={roleOptions} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-2"
            >
              <Checkbox name="isActive" label="Активний користувач" />
            </motion.div>

            <div className="flex justify-end gap-2">
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
                label={submitLabel}
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
