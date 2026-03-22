'use client';

import { Form, Formik } from 'formik';
import { useMemo } from 'react';

import Btn from '@/app/components/ui/button/Btn';
import {
  createReviewFormSchema,
  CreateReviewRequestDTO,
  ReviewFormValues,
  ReviewTargetOptionDto,
  UpdateReviewDTO,
  updateReviewFormSchema,
} from '@/app/types';
import { Input, Select, Textarea } from '@/components';

type BaseProps = {
  onClose: () => void;
  submitLabel?: string;
  serviceOptions: ReviewTargetOptionDto[];
  articleOptions: ReviewTargetOptionDto[];
  pageOptions: ReviewTargetOptionDto[];
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

const withPlaceholder = (
  label: string,
  options?: ReviewTargetOptionDto[]
): ReviewTargetOptionDto[] => [{ value: '', label }, ...(options ?? [])];

const buildCreatePayload = (
  values: ReviewFormValues
): CreateReviewRequestDTO => {
  const base = {
    authorName: values.authorName.trim(),
    text: values.text.trim(),
    rating: values.rating === '' ? undefined : Number(values.rating),
    status: values.status,
  };

  if (values.targetType === 'page') {
    return {
      ...base,
      targetType: 'page',
      pageKey: values.pageKey.trim(),
    };
  }

  return {
    ...base,
    targetType: values.targetType,
    targetId: values.targetId.trim(),
  };
};

const buildUpdatePayload = (values: ReviewFormValues): UpdateReviewDTO => {
  const base = {
    authorName: values.authorName.trim(),
    text: values.text.trim(),
    rating: values.rating === '' ? undefined : Number(values.rating),
    status: values.status,
  };

  if (values.targetType === 'page') {
    return {
      ...base,
      targetType: 'page',
      pageKey: values.pageKey.trim(),
      targetId: undefined,
    };
  }

  return {
    ...base,
    targetType: values.targetType,
    targetId: values.targetId.trim(),
    pageKey: undefined,
  };
};

const ReviewForm = (props: Props) => {
  const isEditMode = props.mode === 'edit';

  const schema = useMemo(
    () => (isEditMode ? updateReviewFormSchema : createReviewFormSchema),
    [isEditMode]
  );

  const serviceOptions = props.serviceOptions ?? [];
  const articleOptions = props.articleOptions ?? [];
  const pageOptions = props.pageOptions ?? [];

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
      {({ isValid, isSubmitting, values }) => {
        const targetOptions =
          values.targetType === 'service'
            ? withPlaceholder('Оберіть послугу', serviceOptions)
            : values.targetType === 'article'
              ? withPlaceholder('Оберіть статтю', articleOptions)
              : withPlaceholder('Оберіть сторінку', pageOptions);

        return (
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
              <Select
                name="pageKey"
                label="Сторінка"
                required
                options={targetOptions}
              />
            ) : (
              <Select
                name="targetId"
                label={values.targetType === 'service' ? 'Послуга' : 'Стаття'}
                required
                options={targetOptions}
              />
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
        );
      }}
    </Formik>
  );
};

export default ReviewForm;
