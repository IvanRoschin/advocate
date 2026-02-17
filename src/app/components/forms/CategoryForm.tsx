'use client';

import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';

import Btn from '@/app/components/ui/button/Btn';
import ImageUploadCloudinary from '@/app/lib/client/ImageUploadCloudinary';
import { CreateCategoryRequestDTO, createCategorySchema } from '@/app/types';
import { Input } from '@/components/index';

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
          src: initialValues?.src ?? [],
        }}
        validationSchema={createCategorySchema}
        onSubmit={onSubmit}
      >
        {({ isValid, isSubmitting, setFieldValue, values, errors }) => (
          <Form className="flex w-full max-w-lg flex-col gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Input name="title" label="Назва категорії" required />{' '}
              {/* <AutoSlugField
                sourceField="title"
                targetField="slug"
                touchedFlagField="slugTouchedManually"
                options={{ locale: 'uk' }}
              /> */}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ImageUploadCloudinary
                setFieldValue={setFieldValue}
                values={values.src}
                error={typeof errors.src === 'string' ? errors.src : undefined}
                uploadPreset="Categories"
                multiple
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
