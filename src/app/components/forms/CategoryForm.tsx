'use client';

import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';

import Btn from '@/app/components/ui/button/Btn';
import { DEFAULT_CATEGORY_ICON } from '@/app/resources/category-icons';
import { CreateCategoryRequestDTO, createCategorySchema } from '@/app/types';
import { Input } from '@/components/index';

import { IconPicker } from '../common/IconPicker';

interface Props {
  onSubmit: (values: CreateCategoryRequestDTO) => void;
  onClose: () => void;
  initialValues?: CreateCategoryRequestDTO;
  submitLabel?: string;
}

const CategoryForm = ({
  onSubmit,
  onClose,
  initialValues,
  submitLabel = 'Додати категорію',
}: Props) => {
  const isEditMode = Boolean(initialValues);

  return (
    <>
      {isEditMode ? 'Редагувати категорію' : 'Додати нову категорію'}
      <Formik<CreateCategoryRequestDTO>
        enableReinitialize
        initialValues={{
          title: initialValues?.title ?? '',
          icon: initialValues?.icon ?? DEFAULT_CATEGORY_ICON,
        }}
        validationSchema={createCategorySchema}
        onSubmit={onSubmit}
      >
        {({ isValid, isSubmitting, setFieldValue, values }) => (
          <Form className="flex w-full max-w-lg flex-col gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Input name="title" label="Назва категорії" required />{' '}
            </motion.div>
            {/* ICON PICKER */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium">Іконка категорії</label>

              <IconPicker
                value={values.icon}
                onChange={v => setFieldValue('icon', v)}
              />
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

export default CategoryForm;
