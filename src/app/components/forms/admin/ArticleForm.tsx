'use client';

import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

import AdminFormSection from '@/app/components/forms/shared/AdminFormSection';
import AdminFormShell from '@/app/components/forms/shared/AdminFormShell';
import { fieldMotion } from '@/app/components/forms/shared/formMotion';
import storageKeys from '@/app/config/storageKeys';
import { useFormDraft } from '@/app/hooks/useFormDraft';
import { clearFormDraft } from '@/app/lib/client/form-draft';
import ImageUploadCloudinary from '@/app/lib/client/ImageUploadCloudinary';
import { createArticleSchema, updateArticleSchema } from '@/app/types';
import {
  FormDraftPersist,
  Input,
  Select,
  TagsInputField,
  Textarea,
} from '@/components';

import type {
  ArticleLanguage,
  ArticleStatus,
  CoverImageDto,
  CreateArticleRequestDTO,
  UpdateArticleDTO,
} from '@/app/types';

/* Helpers — без изменений */
const parseTags = (raw: string): string[] =>
  raw
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

const tagsToString = (tags?: string[]) => (tags?.length ? tags.join(', ') : '');

export type UserOption = { id: string; name: string };
export type CategoryOption = { id: string; title: string };
export type ServiceOption = { id: string; title: string };

type ArticleFormValues = CreateArticleRequestDTO & {
  tagsInput: string;
  src: CoverImageDto;
};

const normalize = (values: ArticleFormValues): ArticleFormValues => ({
  ...values,
  title: values.title.trim(),
  subtitle: values.subtitle?.trim() || '',
  summary: values.summary.trim(),
  tags: parseTags(values.tagsInput),
});

const sameArray = (a?: string[], b?: string[]) =>
  JSON.stringify(a ?? []) === JSON.stringify(b ?? []);

const stripEmpty = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== '')
  ) as Partial<T>;

const buildPatch = (
  initial: ArticleFormValues,
  current: ArticleFormValues
): UpdateArticleDTO => {
  const i = normalize(initial);
  const c = normalize(current);
  const patch: UpdateArticleDTO = {};

  if (c.slug !== i.slug) patch.slug = c.slug;
  if (c.status !== i.status) patch.status = c.status;
  if (c.title !== i.title) patch.title = c.title;

  const iSub = i.subtitle || '';
  const cSub = c.subtitle || '';
  if (cSub !== iSub) patch.subtitle = cSub;

  if (c.summary !== i.summary) patch.summary = c.summary;
  if (c.content !== i.content) patch.content = c.content;
  if (c.language !== i.language) patch.language = c.language;
  if (c.authorId !== i.authorId) patch.authorId = c.authorId;
  if (c.categoryId !== i.categoryId) patch.categoryId = c.categoryId;
  if (!sameArray(c.tags, i.tags)) patch.tags = c.tags;
  if (!sameArray(c.src, i.src)) patch.src = c.src;

  return stripEmpty(patch) as UpdateArticleDTO;
};

/* Props — без изменений */
type BaseProps = {
  onClose: () => void;
  submitLabel?: string;
  users?: UserOption[];
  categories?: CategoryOption[];
  services?: ServiceOption[];
  persistToLocalStorage?: boolean;
  clearDraftOnClose?: boolean;
};

type CreateModeProps = BaseProps & {
  mode: 'create';
  onSubmit: (values: CreateArticleRequestDTO) => void | Promise<void>;
};

type EditModeProps = BaseProps & {
  mode: 'edit';
  initialValues: Partial<CreateArticleRequestDTO>;
  onSubmit: (values: UpdateArticleDTO) => void | Promise<void>;
};

type Props = CreateModeProps | EditModeProps;

const ArticleForm = (props: Props) => {
  const { onClose, submitLabel, users, categories, services } = props;

  const isEditMode = props.mode === 'edit';
  const initialValues = isEditMode ? props.initialValues : undefined;

  const persist =
    props.persistToLocalStorage ?? (props.mode === 'create' ? true : false);
  const clearOnClose = props.clearDraftOnClose ?? true;

  const { draft, clearDraft } = useFormDraft<ArticleFormValues>(
    storageKeys.article,
    persist && props.mode === 'create'
  );

  const baseValues: ArticleFormValues = useMemo(
    () => ({
      slug: initialValues?.slug ?? '',
      status: initialValues?.status ?? 'draft',
      title: initialValues?.title ?? '',
      subtitle: initialValues?.subtitle ?? '',
      summary: initialValues?.summary ?? '',
      content: initialValues?.content ?? '',
      tags: initialValues?.tags ?? [],
      tagsInput: tagsToString(initialValues?.tags ?? []),
      src: initialValues?.src ?? [],
      language: (initialValues?.language ?? 'uk') as ArticleLanguage,
      authorId: initialValues?.authorId ?? '',
      categoryId: initialValues?.categoryId ?? '',
      serviceId: initialValues?.serviceId ?? '',
    }),
    [initialValues]
  );

  const defaultValues: ArticleFormValues = useMemo(() => {
    if (!persist || props.mode !== 'create' || !draft) return baseValues;

    return {
      ...baseValues,
      ...draft,
      tags: Array.isArray(draft.tags) ? draft.tags : baseValues.tags,
      src: Array.isArray(draft.src)
        ? (draft.src as CoverImageDto)
        : baseValues.src,
      tagsInput:
        typeof draft.tagsInput === 'string'
          ? draft.tagsInput
          : tagsToString(
              Array.isArray(draft.tags) ? draft.tags : baseValues.tags
            ),
    };
  }, [baseValues, draft, persist, props.mode]);

  const schema = useMemo(
    () => (isEditMode ? updateArticleSchema : createArticleSchema),
    [isEditMode]
  );

  const handleClose = () => {
    if (clearOnClose) clearFormDraft(storageKeys.article);
    onClose();
  };

  return (
    <Formik<ArticleFormValues>
      enableReinitialize={isEditMode || (props.mode === 'create' && persist)}
      initialValues={defaultValues}
      validationSchema={schema}
      onSubmit={async values => {
        const normalized = normalize(values);

        if (props.mode === 'create') {
          const payload: CreateArticleRequestDTO = {
            slug: normalized.slug,
            status: normalized.status as ArticleStatus,
            title: normalized.title,
            ...(normalized.subtitle ? { subtitle: normalized.subtitle } : {}),
            summary: normalized.summary,
            content: normalized.content,
            tags: normalized.tags,
            ...(normalized.src.length ? { src: normalized.src } : {}),
            language: normalized.language,
            authorId: normalized.authorId,
            categoryId: normalized.categoryId,
            serviceId: normalized.serviceId,
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
        <Form>
          <FormDraftPersist<ArticleFormValues>
            storageKey={storageKeys.article}
            enabled={persist && props.mode === 'create'}
            values={values}
          />

          <AdminFormShell
            title={isEditMode ? 'Редагувати статтю' : 'Додати нову статтю'}
            onClose={handleClose}
            submitLabel={
              submitLabel ?? (isEditMode ? 'Оновити статтю' : 'Додати статтю')
            }
            isSubmitting={isSubmitting}
            submitDisabled={!isValid}
          >
            <AdminFormSection title="Основний зміст">
              <motion.div {...fieldMotion(0.04)}>
                <Input
                  name="title"
                  label="Заголовок"
                  placeholder="Введіть заголовок статті"
                  required
                />
              </motion.div>

              <motion.div {...fieldMotion(0.06)} className="mt-3">
                <Input
                  name="subtitle"
                  label="Підзаголовок"
                  placeholder="Введіть підзаголовок"
                />
              </motion.div>

              <motion.div {...fieldMotion(0.08)} className="mt-3">
                <Textarea
                  name="summary"
                  label="Короткий опис (summary)"
                  required
                />
              </motion.div>

              <motion.div {...fieldMotion(0.1)} className="mt-3">
                <Textarea name="content" label="Контент" rows={12} required />
              </motion.div>
            </AdminFormSection>

            <AdminFormSection title="Публікація">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  name="status"
                  label="Статус"
                  options={[
                    { value: 'draft', label: 'Чернета' },
                    { value: 'published', label: 'Опубліковано' },
                  ]}
                />

                <Select
                  name="language"
                  label="Мова"
                  options={[
                    { value: 'uk', label: 'Українська' },
                    { value: 'ru', label: 'Русский' },
                    { value: 'en', label: 'English' },
                  ]}
                />
              </div>
            </AdminFormSection>

            <AdminFormSection title="Класифікація">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Select
                  name="authorId"
                  label="Автор"
                  options={(users ?? []).map(u => ({
                    value: u.id,
                    label: u.name,
                  }))}
                  required
                />

                <Select
                  name="categoryId"
                  label="Категорія"
                  options={(categories ?? []).map(c => ({
                    value: c.id,
                    label: c.title,
                  }))}
                  required
                />

                <Select
                  name="serviceId"
                  label="Послуга"
                  options={(services ?? []).map(s => ({
                    value: s.id,
                    label: s.title,
                  }))}
                  required
                />
              </div>
            </AdminFormSection>

            <AdminFormSection title="Медіа та теги">
              <motion.div {...fieldMotion(0.12)}>
                <ImageUploadCloudinary
                  fieldName="src"
                  setFieldValue={setFieldValue}
                  values={values.src}
                  error={
                    typeof errors.src === 'string' ? errors.src : undefined
                  }
                  uploadPreset="article_cover"
                  multiple
                />
              </motion.div>

              <div className="mt-3">
                <TagsInputField
                  name="tagsInput"
                  label="Теги (через кому)"
                  placeholder="Наприклад: право, суд, адвокат"
                />
              </div>
            </AdminFormSection>
          </AdminFormShell>
        </Form>
      )}
    </Formik>
  );
};

export default ArticleForm;
