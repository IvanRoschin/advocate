'use client';

import { Form, Formik } from 'formik';
import { useMemo } from 'react';

import Btn from '@/app/components/ui/button/Btn';
import {
  createReviewFormSchema,
  CreateReviewRequestDTO,
  ReviewFormValues,
  UpdateReviewDTO,
  updateReviewFormSchema,
} from '@/app/types';
import { Input, Select, Textarea } from '@/components';

type BaseProps = {
  onClose: () => void;
  submitLabel?: string;
};

type CreateModeProps = BaseProps & {
  mode: 'create';
  onSubmit: (values: CreateReviewRequestDTO) => void | Promise<void>;
};

type EditModeProps = BaseProps & {
  mode: 'edit';
  initialValues: Partial<CreateReviewRequestDTO>;
  onSubmit: (values: UpdateReviewDTO) => void | Promise<void>;
};

type Props = CreateModeProps | EditModeProps;

const buildCreatePayload = (
  values: ReviewFormValues
): CreateReviewRequestDTO => ({
  authorName: values.authorName.trim(),
  text: values.text.trim(),
  rating: values.rating === '' ? undefined : Number(values.rating),
  status: values.status,
  targetType: values.targetType,
  targetId:
    values.targetType === 'page'
      ? undefined
      : values.targetId.trim() || undefined,
  pageKey:
    values.targetType === 'page'
      ? values.pageKey.trim() || undefined
      : undefined,
});

const buildUpdatePayload = (values: ReviewFormValues): UpdateReviewDTO => ({
  authorName: values.authorName.trim(),
  text: values.text.trim(),
  rating: values.rating === '' ? undefined : Number(values.rating),
  status: values.status,
  targetType: values.targetType,
  targetId:
    values.targetType === 'page'
      ? undefined
      : values.targetId.trim() || undefined,
  pageKey:
    values.targetType === 'page'
      ? values.pageKey.trim() || undefined
      : undefined,
});

const ReviewForm = (props: Props) => {
  const isEditMode = props.mode === 'edit';

  const schema = useMemo(
    () => (isEditMode ? updateReviewFormSchema : createReviewFormSchema),
    [isEditMode]
  );

  const initialValues: ReviewFormValues = {
    authorName:
      props.mode === 'edit' ? (props.initialValues.authorName ?? '') : '',
    text: props.mode === 'edit' ? (props.initialValues.text ?? '') : '',
    rating: props.mode === 'edit' ? (props.initialValues.rating ?? '') : '',
    status:
      props.mode === 'edit'
        ? (props.initialValues.status ?? 'pending')
        : 'pending',
    targetType:
      props.mode === 'edit'
        ? (props.initialValues.targetType ?? 'service')
        : 'service',
    targetId: props.mode === 'edit' ? (props.initialValues.targetId ?? '') : '',
    pageKey: props.mode === 'edit' ? (props.initialValues.pageKey ?? '') : '',
  };

  return (
    <Formik<ReviewFormValues>
      enableReinitialize
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async values => {
        if (props.mode === 'create') {
          await props.onSubmit(buildCreatePayload(values));
          return;
        }

        await props.onSubmit(buildUpdatePayload(values));
      }}
    >
      {({ isValid, isSubmitting, values }) => (
        <Form className="flex w-full max-w-3xl flex-col gap-6">
          <Input name="authorName" label="Автор" required />

          <Textarea name="text" label="Текст відгуку" rows={6} required />

          <div className="grid gap-4 md:grid-cols-3">
            <Input name="rating" label="Рейтинг (1-5)" type="number" />

            <Select
              name="status"
              label="Статус"
              options={[
                { value: 'pending', label: 'Очікує' },
                { value: 'approved', label: 'Погоджено' },
                { value: 'rejected', label: 'Відхилено' },
              ]}
            />

            <Select
              name="targetType"
              label="Тип привʼязки"
              options={[
                { value: 'service', label: 'Послуга' },
                { value: 'article', label: 'Стаття' },
                { value: 'page', label: 'Сторінка' },
              ]}
            />
          </div>

          {values.targetType === 'page' ? (
            <Input name="pageKey" label="Page key" required />
          ) : (
            <Input name="targetId" label="Target ID" required />
          )}

          <div className="flex justify-end gap-2">
            <Btn
              type="button"
              label="Скасувати"
              uiVariant="ghost"
              onClick={props.onClose}
            />

            <Btn
              uiVariant="accent"
              radius={12}
              type="submit"
              label={
                props.submitLabel ??
                (isEditMode ? 'Оновити відгук' : 'Додати відгук')
              }
              disabled={!isValid || isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ReviewForm;
