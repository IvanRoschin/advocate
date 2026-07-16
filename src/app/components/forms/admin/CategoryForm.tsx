'use client';

import { Form, Formik } from 'formik';

import AdminFormShell from '@/app/components/forms/shared/AdminFormShell';
import { DEFAULT_CATEGORY_ICON } from '@/app/resources/category-icons';
import { CreateCategoryRequestDTO, createCategorySchema } from '@/app/types';
import { IconPicker, Input } from '@/components';

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
        <Form>
          <AdminFormShell
            title={
              isEditMode ? 'Редагувати категорію' : 'Додати нову категорію'
            }
            onClose={onClose}
            submitLabel={submitLabel}
            isSubmitting={isSubmitting}
            submitDisabled={!isValid}
          >
            <Input name="title" label="Назва категорії" required />

            <div className="mt-3 space-y-2">
              <label className="text-secondary text-sm font-medium">
                Іконка категорії
              </label>

              <IconPicker
                value={values.icon}
                onChange={v => setFieldValue('icon', v)}
              />
            </div>
          </AdminFormShell>
        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;
