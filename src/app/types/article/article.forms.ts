import * as Yup from 'yup';

import type { ArticleStatus, CoverImageDto } from './article.dto';

/* -------------------------------- Helpers -------------------------------- */

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

const srcCreateSchema = Yup.array()
  .of(Yup.string().trim().required())
  .min(1, 'Додайте хоча б одне фото')
  .max(3, 'Максимум 3 фото');

/**
 * Для PATCH удобно игнорить пустые строки, чтобы optional поля не валились на min/regex.
 * Мы делаем transform на уровне схемы.
 */

const srcPatchSchema = Yup.array()
  .of(Yup.string().trim().required()) // 🔥 ключ: никакого undefined внутри массива
  .max(3, 'Максимум 3 фото')
  .nullable()
  .optional()
  .transform((value, originalValue) => {
    // разрешаем null как "удалить картинки"
    if (originalValue === null) return null;

    if (!Array.isArray(originalValue)) return value;

    // чистим мусор, чтобы не было ['', undefined]
    return originalValue
      .filter((x): x is string => typeof x === 'string')
      .map(x => x.trim())
      .filter(Boolean);
  });

/* -------------------------------- Base rules -------------------------------- */

export const baseArticleSchema = {
  status: Yup.mixed<ArticleStatus>().oneOf(
    ['draft', 'published'],
    'Некоректний статус'
  ),

  title: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(200, 'Максимальна кількість символів 200'),

  subtitle: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .max(200, 'Максимальна кількість символів 200'),

  summary: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(10, 'Мінімальна кількість символів 10')
    .max(500, 'Максимальна кількість символів 500'),

  content: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(20, 'Мінімальна кількість символів 20'),

  language: Yup.mixed<'uk' | 'ru' | 'en'>().oneOf(
    ['uk', 'ru', 'en'],
    'Некоректна мова'
  ),

  authorId: Yup.string().transform(emptyToUndefined).trim(),

  categoryId: Yup.string().transform(emptyToUndefined).trim(),

  serviceId: Yup.string().transform(emptyToUndefined).trim(),

  tags: Yup.array()
    .of(Yup.string().trim().min(1).required())
    .default([])
    .transform((v: unknown) => {
      if (!Array.isArray(v)) return [];
      return v
        .filter((x): x is string => typeof x === 'string')
        .map(x => x.trim())
        .filter(Boolean);
    }),

  src: Yup.array()
    .of(Yup.string().trim())
    .min(1, 'Додайте хоча б одне фото')
    .max(3, 'Максимум 3 фото'),
};

export type ArticleBaseValues = {
  status: ArticleStatus;

  title: string;
  subtitle?: string;

  summary: string;
  content: string;

  tags: string[];

  src: CoverImageDto;

  language: 'uk' | 'ru' | 'en';

  authorId: string;
  categoryId: string;
};

/* -------------------------------- Create -------------------------------- */

export const createArticleSchema = Yup.object({
  status: baseArticleSchema.status
    .default('draft')
    .required("Обов'язкове поле"),

  title: baseArticleSchema.title.required("Обов'язкове поле"),
  subtitle: baseArticleSchema.subtitle.optional(),

  summary: baseArticleSchema.summary.required("Обов'язкове поле"),
  content: baseArticleSchema.content.required("Обов'язкове поле"),

  tags: baseArticleSchema.tags.default([]).required(),

  src: srcCreateSchema.required("Обов'язкове поле"),

  language: baseArticleSchema.language
    .default('uk')
    .required("Обов'язкове поле"),

  authorId: baseArticleSchema.authorId.required("Обов'язкове поле"),
  categoryId: baseArticleSchema.categoryId.required("Обов'язкове поле"),
  serviceId: baseArticleSchema.serviceId.required("Обов'язкове поле"),
}).noUnknown(true);

export type CreateArticleFormValues = Yup.InferType<typeof createArticleSchema>;

/* -------------------------------- Update (PATCH) -------------------------------- */

export const updateArticleSchema = Yup.object({
  status: baseArticleSchema.status.optional(),

  title: baseArticleSchema.title.optional(),
  subtitle: baseArticleSchema.subtitle.optional(),

  summary: baseArticleSchema.summary.optional(),
  content: baseArticleSchema.content.optional(),

  tags: baseArticleSchema.tags.optional(),

  src: srcPatchSchema,

  language: baseArticleSchema.language.optional(),
  authorId: baseArticleSchema.authorId.optional(),
  categoryId: baseArticleSchema.categoryId.optional(),
  serviceId: baseArticleSchema.serviceId.optional(),
})
  .noUnknown(true)
  .test(
    'at-least-one-field',
    'Потрібно змінити хоча б одне поле',
    value =>
      value != null &&
      Object.values(value).some(v =>
        Array.isArray(v) ? v.length > 0 : v !== undefined
      )
  );

export type UpdateArticleFormValues = Yup.InferType<typeof updateArticleSchema>;
