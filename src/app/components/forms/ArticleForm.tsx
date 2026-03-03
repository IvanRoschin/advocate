'use client';

import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

import Btn from '@/app/components/ui/button/Btn';
import storageKeys from '@/app/config/storageKeys';
import ImageUploadCloudinary from '@/app/lib/client/ImageUploadCloudinary';
import { createArticleSchema, updateArticleSchema } from '@/app/types';
import { Input, Select, Textarea } from '@/components/index';

import type {
  ArticleLanguage,
  ArticleStatus,
  CoverImageDto, // string[]
  CreateArticleRequestDTO,
  UpdateArticleDTO,
} from '@/app/types';
/* ------------------------------------------------------------------ */
/* Helpers ------------------------------------------------------------ */

const LS_KEY = 'article' as const;

const safeJsonParse = <T,>(raw: string): T | null => {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const parseTags = (raw: string): string[] =>
  raw
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

const tagsToString = (tags?: string[]) => (tags?.length ? tags.join(', ') : '');

export type UserOption = { id: string; name: string };
export type CategoryOption = { id: string; title: string };

export type ArticleFormValues = CreateArticleRequestDTO & {
  tagsInput: string;
  src: CoverImageDto; // всегда массив
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

/**
 * PATCH: только изменённые поля
 */
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

/* ------------------------------------------------------------------ */
/* Props (discriminated union) --------------------------------------- */

type BaseProps = {
  onClose: () => void;
  submitLabel?: string;
  users?: UserOption[];
  categories?: CategoryOption[];
  /** по умолчанию: true в create, false в edit */
  persistToLocalStorage?: boolean;
  /** по умолчанию: очищаем черновик при закрытии */
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

/* ------------------------------------------------------------------ */
/* Draft helpers ------------------------------------------------------ */

type DraftShape = Partial<ArticleFormValues>;

const loadDraft = (): DraftShape | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(LS_KEY);
  if (!raw) return null;
  return safeJsonParse<DraftShape>(raw);
};

const saveDraft = (draft: DraftShape) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKeys.article, JSON.stringify(draft));
  } catch {
    // ignore quota / privacy errors
  }
};

const clearDraft = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(storageKeys.article);
  } catch {
    // ignore
  }
};

function AutoSaveToLocalStorage({
  enabled,
  values,
}: {
  enabled: boolean;
  values: ArticleFormValues;
}) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      try {
        saveDraft(values);
      } catch {
        // ignore quota errors
      }
    }, 400);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, values]);

  return null;
}

const ArticleForm = (props: Props) => {
  const { onClose, submitLabel, users, categories } = props;

  const isEditMode = props.mode === 'edit';
  const initialValues = isEditMode ? props.initialValues : undefined;

  // ✅ по умолчанию сохраняем только create
  const persist =
    props.persistToLocalStorage ?? (props.mode === 'create' ? true : false);

  const clearOnClose = props.clearDraftOnClose ?? true;

  // 1) Подтягиваем draft один раз (только в create и если включено)
  const [draft, setDraft] = useState<DraftShape | null>(null);
  useEffect(() => {
    if (!persist) return;
    if (props.mode !== 'create') return;
    setDraft(loadDraft());
  }, [persist, props.mode]);

  // 2) Формируем базовые значения (из initialValues)
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
    }),
    [
      initialValues?.slug,
      initialValues?.status,
      initialValues?.title,
      initialValues?.subtitle,
      initialValues?.summary,
      initialValues?.content,
      initialValues?.tags,
      initialValues?.src,
      initialValues?.language,
      initialValues?.authorId,
      initialValues?.categoryId,
    ]
  );

  // 3) Итоговые initialValues для Formik: base + draft (draft приоритетнее)
  const defaultValues: ArticleFormValues = useMemo(() => {
    if (!persist || props.mode !== 'create' || !draft) return baseValues;

    // Мержим только безопасные поля формы
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
    if (clearOnClose) clearDraft();
    onClose();
  };

  return (
    <>
      {isEditMode ? 'Редагувати статтю' : 'Додати нову статтю'}

      <Formik<ArticleFormValues>
        enableReinitialize={isEditMode || (props.mode === 'create' && persist)}
        initialValues={defaultValues}
        validationSchema={schema}
        onSubmit={async values => {
          const normalized = normalize(values);

          try {
            if (props.mode === 'create') {
              const payload: CreateArticleRequestDTO = {
                slug: normalized.slug,
                status: normalized.status as ArticleStatus,
                title: normalized.title,
                ...(normalized.subtitle
                  ? { subtitle: normalized.subtitle }
                  : {}),
                summary: normalized.summary,
                content: normalized.content,
                tags: normalized.tags,
                ...(normalized.src.length ? { src: normalized.src } : {}),
                language: normalized.language,
                authorId: normalized.authorId,
                categoryId: normalized.categoryId,
              };

              await props.onSubmit(payload);
              clearDraft();
              return;
            }

            const patch = buildPatch(baseValues, normalized);
            await props.onSubmit(patch);
            clearDraft();
          } finally {
          }
        }}
      >
        {({
          isValid,
          isSubmitting,
          setFieldValue,
          values,
          errors,
          handleChange,
          handleBlur,
        }) => {
          return (
            <Form className="flex w-full max-w-4xl flex-col gap-6">
              <AutoSaveToLocalStorage
                enabled={persist && props.mode === 'create'}
                values={values}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.04 }}
              >
                <Input
                  name="title"
                  label="Заголовок"
                  required
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.08 }}
              >
                <Input
                  name="subtitle"
                  label="Підзаголовок"
                  value={values.subtitle}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Textarea
                  name="summary"
                  label="Короткий опис (summary)"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12 }}
              >
                <Textarea name="content" label="Контент" rows={12} required />
              </motion.div>

              <div className="grid grid-cols-3 gap-4">
                <Select
                  name="status"
                  label="Статус"
                  options={[
                    { value: 'draft', label: 'Draft' },
                    { value: 'published', label: 'Published' },
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

                <div />
              </div>

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

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <ImageUploadCloudinary
                  setFieldValue={setFieldValue}
                  values={values.src}
                  error={
                    typeof errors.src === 'string' ? errors.src : undefined
                  }
                  uploadPreset="Articles"
                  multiple
                />
              </motion.div>

              <Input
                name="tagsInput"
                label="Теги (через кому)"
                value={values.tagsInput}
                onChange={e => {
                  const v = e.target.value;
                  setFieldValue('tagsInput', v);
                  setFieldValue('tags', parseTags(v));
                }}
              />

              <div className="flex justify-end gap-2">
                <Btn
                  type="button"
                  label="Скасувати"
                  uiVariant="ghost"
                  onClick={handleClose} // ✅ очищаем draft при закрытии
                />

                <Btn
                  uiVariant="accent"
                  radius={12}
                  type="submit"
                  label={
                    submitLabel ??
                    (isEditMode ? 'Оновити статтю' : 'Додати статтю')
                  }
                  disabled={isValid && isSubmitting}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default ArticleForm;
