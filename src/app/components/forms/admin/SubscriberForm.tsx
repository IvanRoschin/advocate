'use client';

import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

import Btn from '@/app/components/ui/button/Btn';
import storageKeys from '@/app/config/storageKeys';
import { useFormDraft } from '@/app/hooks/useFormDraft';
import { clearFormDraft } from '@/app/lib/client/form-draft';
import { createSubscriberSchema } from '@/app/types';
import { Checkbox, Input } from '@/components';

import FormDraftPersist from '../shared/FormDraftPersist'; // если используете

import type {
  CreateSubscriberDTO,
  SubscriberResponseDTO,
  UpdateSubscriberDTO,
} from '@/app/types';

type SubscriberFormValues = {
  email: string;
  subscribed: boolean;
};

type BaseProps = {
  onClose: () => void;
  submitLabel?: string;
  persistToLocalStorage?: boolean;
  clearDraftOnClose?: boolean;
};

type CreateModeProps = BaseProps & {
  mode: 'create';
  onSubmit: (values: CreateSubscriberDTO) => void | Promise<void>;
};

type EditModeProps = BaseProps & {
  mode: 'edit';
  initialValues: Partial<SubscriberResponseDTO>;
  onSubmit: (values: UpdateSubscriberDTO) => void | Promise<void>;
};

type Props = CreateModeProps | EditModeProps;

const normalize = (values: SubscriberFormValues): SubscriberFormValues => ({
  email: values.email.trim().toLowerCase(),
  subscribed: values.subscribed,
});

const SubscriberForm = (props: Props) => {
  const isEditMode = props.mode === 'edit';
  const initialValues = isEditMode ? props.initialValues : undefined;

  const persist =
    props.persistToLocalStorage ?? (props.mode === 'create' ? true : false);
  const clearOnClose = props.clearDraftOnClose ?? true;

  const { draft, clearDraft } = useFormDraft<SubscriberFormValues>(
    storageKeys.subscriber,
    persist && props.mode === 'create'
  );

  const baseValues: SubscriberFormValues = useMemo(
    () => ({
      email: initialValues?.email ?? '',
      subscribed: initialValues?.subscribed ?? true,
    }),
    [initialValues]
  );

  const defaultValues: SubscriberFormValues = useMemo(() => {
    if (!persist || props.mode !== 'create' || !draft) return baseValues;

    return {
      ...baseValues,
      ...draft,
      subscribed:
        typeof draft.subscribed === 'boolean'
          ? draft.subscribed
          : baseValues.subscribed,
    };
  }, [baseValues, draft, persist, props.mode]);

  const handleClose = () => {
    if (clearOnClose) clearFormDraft(storageKeys.subscriber);
    props.onClose();
  };

  return (
    <>
      <div className="text-accent mb-6 text-xl font-semibold">
        {isEditMode ? 'Редагувати підписника' : 'Додати нового підписника'}
      </div>

      <Formik<SubscriberFormValues>
        enableReinitialize={isEditMode || (props.mode === 'create' && persist)}
        initialValues={defaultValues}
        validationSchema={createSubscriberSchema} // можно сделать updateSchema при необходимости
        onSubmit={async values => {
          const normalized = normalize(values);

          if (props.mode === 'create') {
            const payload: CreateSubscriberDTO = {
              email: normalized.email,
              subscribed: normalized.subscribed,
            };

            await props.onSubmit(payload);
            clearDraft();
            return;
          }

          // Для edit — можно сделать patch, если нужно
          await props.onSubmit(normalized as UpdateSubscriberDTO);
          clearDraft();
        }}
      >
        {({ isValid, isSubmitting, values }) => (
          <Form className="flex w-full max-w-md flex-col gap-6">
            {/* Сохранение черновика */}
            <FormDraftPersist<SubscriberFormValues>
              storageKey={storageKeys.subscriber}
              enabled={persist && props.mode === 'create'}
              values={values}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.04 }}
            >
              <Input
                name="email"
                label="Email адреса"
                type="email"
                placeholder="example@email.com"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08 }}
            >
              <div className="border-border bg-background/50 rounded-2xl border p-4">
                <Checkbox name="subscribed">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Активна підписка</div>
                    <div className="text-muted-foreground text-xs">
                      Підписник буде отримувати розсилки
                    </div>
                  </div>
                </Checkbox>
              </div>
            </motion.div>

            <div className="flex justify-end gap-3 pt-4">
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
                  (isEditMode ? 'Оновити підписника' : 'Додати підписника')
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

export default SubscriberForm;
