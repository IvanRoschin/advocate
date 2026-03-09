import * as Yup from 'yup';

import type { ServiceStatus } from './service.dto';

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

const srcCreateSchema = Yup.array()
  .of(Yup.string().trim().required())
  .min(1, 'Додайте хоча б одне фото')
  .max(5, 'Максимум 5 фото');

const srcPatchSchema = Yup.array()
  .of(Yup.string().trim().required())
  .max(5, 'Максимум 5 фото')
  .nullable()
  .optional()
  .transform((value, originalValue) => {
    if (originalValue === null) return null;
    if (!Array.isArray(originalValue)) return value;

    return originalValue
      .filter((x): x is string => typeof x === 'string')
      .map(x => x.trim())
      .filter(Boolean);
  });

const serviceSectionItemSchema = Yup.object({
  key: Yup.string().trim().required("Обов'язкове поле"),
  display: Yup.boolean().required("Обов'язкове поле"),
});

const serviceLayoutNodeSchema = Yup.object({
  type: Yup.mixed<'section' | 'group'>()
    .oneOf(['section', 'group'], 'Некоректний тип секції')
    .required("Обов'язкове поле"),
  key: Yup.string().trim().required("Обов'язкове поле"),
  display: Yup.boolean().required("Обов'язкове поле"),
  wrapperClassName: Yup.string().trim().optional(),
  items: Yup.array().of(serviceSectionItemSchema).optional(),
});

const serviceSectionsSchema = Yup.object({
  hero: Yup.object({
    title: Yup.string().trim().default(''),
    description: Yup.string().trim().default(''),
    src: Yup.array().of(Yup.string().trim().required()).default([]),
  }).optional(),

  benefits: Yup.object({
    title: Yup.string().trim().default(''),
    items: Yup.array()
      .of(
        Yup.object({
          title: Yup.string().trim().required("Обов'язкове поле"),
          description: Yup.string().trim().required("Обов'язкове поле"),
        })
      )
      .default([]),
  }).optional(),

  process: Yup.object({
    title: Yup.string().trim().default(''),
    steps: Yup.array()
      .of(
        Yup.object({
          title: Yup.string().trim().required("Обов'язкове поле"),
          description: Yup.string().trim().required("Обов'язкове поле"),
        })
      )
      .default([]),
  }).optional(),

  faq: Yup.object({
    title: Yup.string().trim().default(''),
    items: Yup.array()
      .of(
        Yup.object({
          question: Yup.string().trim().required("Обов'язкове поле"),
          answer: Yup.string().trim().required("Обов'язкове поле"),
        })
      )
      .default([]),
  }).optional(),

  reviews: Yup.object({
    title: Yup.string().trim().default(''),
    reviewIds: Yup.array()
      .of(Yup.string().trim().required("Обов'язкове поле"))
      .default([]),
  }).optional(),

  cta: Yup.object({
    title: Yup.string().trim().default(''),
    description: Yup.string().trim().default(''),
    buttonLabel: Yup.string().trim().default(''),
  }).optional(),
});

export const baseServiceSchema = {
  status: Yup.mixed<ServiceStatus>().oneOf(
    ['draft', 'published'],
    'Некоректний статус'
  ),

  title: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(200, 'Максимальна кількість символів 200'),

  summary: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(10, 'Мінімальна кількість символів 10')
    .max(500, 'Максимальна кількість символів 500'),

  src: Yup.array().of(Yup.string().trim()).min(1).max(5),

  layout: Yup.array()
    .of(serviceLayoutNodeSchema)
    .min(1, 'Потрібна хоча б одна секція'),

  sections: serviceSectionsSchema,

  seoTitle: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(10, 'Мінімальна кількість символів 10')
    .max(120, 'Максимальна кількість символів 120'),

  seoDescription: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(20, 'Мінімальна кількість символів 20')
    .max(160, 'Максимальна кількість символів 160'),
};

export const createServiceSchema = Yup.object({
  status: baseServiceSchema.status
    .default('draft')
    .required("Обов'язкове поле"),

  title: baseServiceSchema.title.required("Обов'язкове поле"),
  summary: baseServiceSchema.summary.required("Обов'язкове поле"),

  src: srcCreateSchema.required("Обов'язкове поле"),

  layout: baseServiceSchema.layout.required("Обов'язкове поле"),
  sections: baseServiceSchema.sections.required("Обов'язкове поле"),

  seoTitle: baseServiceSchema.seoTitle.required("Обов'язкове поле"),
  seoDescription: baseServiceSchema.seoDescription.required("Обов'язкове поле"),
}).noUnknown(true);

export type CreateServiceFormValues = Yup.InferType<typeof createServiceSchema>;

export const updateServiceSchema = Yup.object({
  status: baseServiceSchema.status.optional(),

  title: baseServiceSchema.title.optional(),
  summary: baseServiceSchema.summary.optional(),

  src: srcPatchSchema,

  layout: baseServiceSchema.layout.optional(),
  sections: baseServiceSchema.sections.optional(),

  seoTitle: baseServiceSchema.seoTitle.optional(),
  seoDescription: baseServiceSchema.seoDescription.optional(),
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

export type UpdateServiceFormValues = Yup.InferType<typeof updateServiceSchema>;
