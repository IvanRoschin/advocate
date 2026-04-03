'use client';

import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

import Btn from '@/app/components/ui/button/Btn';
import storageKeys from '@/app/config/storageKeys';
import { useFormDraft } from '@/app/hooks/useFormDraft';
import { clearFormDraft } from '@/app/lib/client/form-draft';
import ImageUploadCloudinary from '@/app/lib/client/ImageUploadCloudinary';
import { createSlideSchema, updateSlideSchema } from '@/app/types';
import { Checkbox, Input, Textarea } from '@/components';

import FormDraftPersist from './FormDraftPersist';

import type {
  CreateSlideDTO,
  SlideResponseDTO,
  UpdateSlideDTO,
} from '@/app/types';

type SlideFormValues = {
  title: string;
  desc: string;
  src: string[];
  isActive: boolean;
};

type BaseProps = {
  onClose: () => void;
  submitLabel?: string;
  persistToLocalStorage?: boolean;
  clearDraftOnClose?: boolean;
};

type CreateModeProps = BaseProps & {
  mode: 'create';
  onSubmit: (values: CreateSlideDTO) => void | Promise<void>;
};

type EditModeProps = BaseProps & {
  mode: 'edit';
  initialValues: Partial<SlideResponseDTO>;
  onSubmit: (values: UpdateSlideDTO) => void | Promise<void>;
};

type Props = CreateModeProps | EditModeProps;

const normalize = (values: SlideFormValues): SlideFormValues => ({
  ...values,
  title: values.title.trim(),
  desc: values.desc.trim(),
  src: values.src.filter(Boolean).map(item => item.trim()),
});

const sameArray = (a?: string[], b?: string[]) =>
  JSON.stringify(a ?? []) === JSON.stringify(b ?? []);

const buildPatch = (
  initial: SlideFormValues,
  current: SlideFormValues
): UpdateSlideDTO => {
  const i = normalize(initial);
  const c = normalize(current);

  const patch: UpdateSlideDTO = {};

  if (c.title !== i.title) patch.title = c.title;
  if (c.desc !== i.desc) patch.desc = c.desc;
  if (c.isActive !== i.isActive) patch.isActive = c.isActive;
  if (!sameArray(c.src, i.src)) patch.src = c.src;

  return patch;
};

const SlideForm = (props: Props) => {
  const isEditMode = props.mode === 'edit';
  const initialValues = isEditMode ? props.initialValues : undefined;

  const persist =
    props.persistToLocalStorage ?? (props.mode === 'create' ? true : false);

  const clearOnClose = props.clearDraftOnClose ?? true;

  const { draft, clearDraft } = useFormDraft<SlideFormValues>(
    storageKeys.slide,
    persist && props.mode === 'create'
  );

  const baseValues: SlideFormValues = useMemo(
    () => ({
      title: initialValues?.title ?? '',
      desc: initialValues?.desc ?? '',
      src: initialValues?.src ?? [],
      isActive: initialValues?.isActive ?? false,
    }),
    [initialValues]
  );

  const defaultValues: SlideFormValues = useMemo(() => {
    if (!persist || props.mode !== 'create' || !draft) return baseValues;

    return {
      ...baseValues,
      ...draft,
      src: Array.isArray(draft.src) ? draft.src : baseValues.src,
      isActive:
        typeof draft.isActive === 'boolean'
          ? draft.isActive
          : baseValues.isActive,
    };
  }, [baseValues, draft, persist, props.mode]);

  const schema = useMemo(
    () => (isEditMode ? updateSlideSchema : createSlideSchema),
    [isEditMode]
  );

  const handleClose = () => {
    if (clearOnClose) clearFormDraft(storageKeys.slide);
    props.onClose();
  };

  return (
    <>
      {isEditMode ? 'Редагувати слайд' : 'Додати новий слайд'}

      <Formik<SlideFormValues>
        enableReinitialize={isEditMode || (props.mode === 'create' && persist)}
        initialValues={defaultValues}
        validationSchema={schema}
        onSubmit={async values => {
          const normalized = normalize(values);

          if (props.mode === 'create') {
            const payload: CreateSlideDTO = {
              title: normalized.title,
              desc: normalized.desc,
              src: normalized.src,
              isActive: normalized.isActive,
            };

            await props.onSubmit(payload);
            clearDraft();
            return;
          }

          const patch = buildPatch(baseValues, normalized);
          await props.onSubmit(patch);
          clearDraft();
        }}
      >
        {({ isValid, isSubmitting, setFieldValue, values, errors }) => (
          <Form className="flex w-full max-w-4xl flex-col gap-6">
            <FormDraftPersist<SlideFormValues>
              storageKey={storageKeys.slide}
              enabled={persist && props.mode === 'create'}
              values={values}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.04 }}
            >
              <Input name="title" label="Назва" required />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08 }}
            >
              <Textarea name="desc" label="Опис" rows={2} required />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
            >
              <div className="border-border bg-background/50 rounded-2xl border p-4">
                <Checkbox name="isActive">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Активний слайд</div>
                    <div className="text-muted-foreground text-xs">
                      Якщо увімкнено, слайд може бути показаний у публічному
                      слайдері.
                    </div>
                  </div>
                </Checkbox>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.16 }}
            >
              <ImageUploadCloudinary
                fieldName="src"
                setFieldValue={setFieldValue}
                values={values.src}
                error={typeof errors.src === 'string' ? errors.src : undefined}
                uploadPreset="slides"
                multiple
              />
            </motion.div>

            <div className="flex justify-end gap-2">
              <Btn
                type="button"
                label="Скасувати"
                uiVariant="ghost"
                onClick={handleClose}
              />

              <Btn
                uiVariant="accent"
                radius={12}
                type="submit"
                label={
                  props.submitLabel ??
                  (isEditMode ? 'Оновити слайд' : 'Додати слайд')
                }
                disabled={!isValid || isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SlideForm;
