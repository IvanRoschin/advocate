import * as Yup from 'yup';

import type { ServiceLayoutNodeInput, ServiceStatus } from './service.dto';

const emptyToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const textOptional = () => Yup.string().trim().default('');

const imageArraySchema = Yup.array()
  .of(Yup.string().trim().required("Обов'язкове поле"))
  .default([]);

const imageArrayCreateSchema = Yup.array()
  .of(Yup.string().trim().required("Обов'язкове поле"))
  .min(1, 'Додайте хоча б одне фото')
  .max(5, 'Максимум 5 фото');

const imageArrayPatchSchema = Yup.array()
  .of(Yup.string().trim().required("Обов'язкове поле"))
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

const serviceLayoutItemSchema = Yup.object({
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
  items: Yup.array().of(serviceLayoutItemSchema).optional(),
});

const benefitsItemSchema = Yup.object({
  title: textOptional(),
  description: textOptional(),
});

const processStepSchema = Yup.object({
  title: textOptional(),
  description: textOptional(),
});

const faqItemSchema = Yup.object({
  question: textOptional(),
  answer: textOptional(),
});

/* ------------------------------------------------------------------ */
/* Form types -------------------------------------------------------- */

export type ServiceFormValues = {
  slug: string;
  status: ServiceStatus;
  title: string;
  summary: string;
  src: string[];
  layout: ServiceLayoutNodeInput[];
  seoTitle: string;
  seoDescription: string;

  relatedArticles: string[];

  heroTitle: string;
  heroDescription: string;
  heroSrc: string[];

  benefitsTitle: string;
  benefitsItems: Array<{
    title: string;
    description: string;
  }>;

  processTitle: string;
  processSteps: Array<{
    title: string;
    description: string;
  }>;

  faqTitle: string;
  faqItems: Array<{
    question: string;
    answer: string;
  }>;

  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
};

/* ------------------------------------------------------------------ */
/* Form schemas ------------------------------------------------------ */

export const createServiceFormSchema = Yup.object({
  slug: Yup.string().trim().default(''),

  status: Yup.mixed<ServiceStatus>()
    .oneOf(['draft', 'published'], 'Некоректний статус')
    .default('draft')
    .required("Обов'язкове поле"),

  title: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(200, 'Максимальна кількість символів 200')
    .required("Обов'язкове поле"),

  summary: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(10, 'Мінімальна кількість символів 10')
    .max(500, 'Максимальна кількість символів 500')
    .required("Обов'язкове поле"),

  src: imageArrayCreateSchema.required("Обов'язкове поле"),

  layout: Yup.array()
    .of(serviceLayoutNodeSchema)
    .min(1, 'Потрібна хоча б одна секція')
    .required("Обов'язкове поле"),

  seoTitle: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(10, 'Мінімальна кількість символів 10')
    .max(120, 'Максимальна кількість символів 120')
    .required("Обов'язкове поле"),

  seoDescription: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(20, 'Мінімальна кількість символів 20')
    .max(160, 'Максимальна кількість символів 160')
    .required("Обов'язкове поле"),

  heroTitle: textOptional(),
  heroDescription: textOptional(),
  heroSrc: imageArraySchema,

  benefitsTitle: textOptional(),
  benefitsItems: Yup.array().of(benefitsItemSchema).default([]),

  processTitle: textOptional(),
  processSteps: Yup.array().of(processStepSchema).default([]),

  faqTitle: textOptional(),
  faqItems: Yup.array().of(faqItemSchema).default([]),

  ctaTitle: textOptional(),
  ctaDescription: textOptional(),
  ctaButtonLabel: textOptional(),
}).noUnknown(true);

export const updateServiceFormSchema = Yup.object({
  slug: Yup.string().trim().default(''),

  status: Yup.mixed<ServiceStatus>()
    .oneOf(['draft', 'published'], 'Некоректний статус')
    .default('draft')
    .required("Обов'язкове поле"),

  title: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(200, 'Максимальна кількість символів 200')
    .required("Обов'язкове поле"),

  summary: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(10, 'Мінімальна кількість символів 10')
    .max(500, 'Максимальна кількість символів 500')
    .required("Обов'язкове поле"),

  src: Yup.array()
    .of(Yup.string().trim().required("Обов'язкове поле"))
    .max(5, 'Максимум 5 фото')
    .default([]),

  layout: Yup.array()
    .of(serviceLayoutNodeSchema)
    .min(1, 'Потрібна хоча б одна секція')
    .required("Обов'язкове поле"),

  seoTitle: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(10, 'Мінімальна кількість символів 10')
    .max(120, 'Максимальна кількість символів 120')
    .required("Обов'язкове поле"),

  seoDescription: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(20, 'Мінімальна кількість символів 20')
    .max(160, 'Максимальна кількість символів 160')
    .required("Обов'язкове поле"),

  heroTitle: textOptional(),
  heroDescription: textOptional(),
  heroSrc: imageArraySchema,

  benefitsTitle: textOptional(),
  benefitsItems: Yup.array().of(benefitsItemSchema).default([]),

  processTitle: textOptional(),
  processSteps: Yup.array().of(processStepSchema).default([]),

  faqTitle: textOptional(),
  faqItems: Yup.array().of(faqItemSchema).default([]),

  ctaTitle: textOptional(),
  ctaDescription: textOptional(),
  ctaButtonLabel: textOptional(),
}).noUnknown(true);

/* ------------------------------------------------------------------ */
/* API / DTO schemas ------------------------------------------------- */

const serviceHeroSchema = Yup.object({
  title: Yup.string().trim().default(''),
  description: Yup.string().trim().default(''),
  src: Yup.array().of(Yup.string().trim().required()).default([]),
});

const serviceBenefitsSchema = Yup.object({
  title: Yup.string().trim().default(''),
  items: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().trim().required("Обов'язкове поле"),
        description: Yup.string().trim().required("Обов'язкове поле"),
      })
    )
    .default([]),
});

const serviceProcessSchema = Yup.object({
  title: Yup.string().trim().default(''),
  steps: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().trim().required("Обов'язкове поле"),
        description: Yup.string().trim().required("Обов'язкове поле"),
      })
    )
    .default([]),
});

const serviceFaqSchema = Yup.object({
  title: Yup.string().trim().default(''),
  items: Yup.array()
    .of(
      Yup.object({
        question: Yup.string().trim().required("Обов'язкове поле"),
        answer: Yup.string().trim().required("Обов'язкове поле"),
      })
    )
    .default([]),
});

const serviceCtaSchema = Yup.object({
  title: Yup.string().trim().default(''),
  description: Yup.string().trim().default(''),
  buttonLabel: Yup.string().trim().default(''),
});

const serviceSectionsSchema = Yup.object({
  hero: serviceHeroSchema.optional(),
  benefits: serviceBenefitsSchema.optional(),
  process: serviceProcessSchema.optional(),
  faq: serviceFaqSchema.optional(),
  cta: serviceCtaSchema.optional(),
});

const serviceSectionsPatchSchema = Yup.object({
  hero: Yup.object({
    title: Yup.string().trim().optional(),
    description: Yup.string().trim().optional(),
    src: Yup.array().of(Yup.string().trim().required()).optional(),
  })
    .optional()
    .default(undefined),

  benefits: Yup.object({
    title: Yup.string().trim().optional(),
    items: Yup.array()
      .of(
        Yup.object({
          title: Yup.string().trim().required("Обов'язкове поле"),
          description: Yup.string().trim().required("Обов'язкове поле"),
        })
      )
      .optional(),
  })
    .optional()
    .default(undefined),

  process: Yup.object({
    title: Yup.string().trim().optional(),
    steps: Yup.array()
      .of(
        Yup.object({
          title: Yup.string().trim().required("Обов'язкове поле"),
          description: Yup.string().trim().required("Обов'язкове поле"),
        })
      )
      .optional(),
  })
    .optional()
    .default(undefined),

  faq: Yup.object({
    title: Yup.string().trim().optional(),
    items: Yup.array()
      .of(
        Yup.object({
          question: Yup.string().trim().required("Обов'язкове поле"),
          answer: Yup.string().trim().required("Обов'язкове поле"),
        })
      )
      .optional(),
  })
    .optional()
    .default(undefined),

  cta: Yup.object({
    title: Yup.string().trim().optional(),
    description: Yup.string().trim().optional(),
    buttonLabel: Yup.string().trim().optional(),
  })
    .optional()
    .default(undefined),
})
  .optional()
  .default(undefined);

export const createServiceSchema = Yup.object({
  status: Yup.mixed<ServiceStatus>()
    .oneOf(['draft', 'published'], 'Некоректний статус')
    .default('draft')
    .required("Обов'язкове поле"),

  title: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(200, 'Максимальна кількість символів 200')
    .required("Обов'язкове поле"),

  summary: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(10, 'Мінімальна кількість символів 10')
    .max(500, 'Максимальна кількість символів 500')
    .required("Обов'язкове поле"),

  src: imageArrayCreateSchema.required("Обов'язкове поле"),

  slug: Yup.string().trim().optional(),

  layout: Yup.array()
    .of(serviceLayoutNodeSchema)
    .min(1, 'Потрібна хоча б одна секція')
    .required("Обов'язкове поле"),

  sections: serviceSectionsSchema.required("Обов'язкове поле"),

  seoTitle: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(10, 'Мінімальна кількість символів 10')
    .max(120, 'Максимальна кількість символів 120')
    .required("Обов'язкове поле"),

  seoDescription: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(20, 'Мінімальна кількість символів 20')
    .max(160, 'Максимальна кількість символів 160')
    .required("Обов'язкове поле"),

  relatedArticles: Yup.array().of(Yup.string().trim().required()).default([]),
}).noUnknown(true);

export const updateServiceSchema = Yup.object({
  status: Yup.mixed<ServiceStatus>()
    .oneOf(['draft', 'published'], 'Некоректний статус')
    .optional(),

  title: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(2, 'Мінімальна кількість символів 2')
    .max(200, 'Максимальна кількість символів 200')
    .optional(),

  summary: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(10, 'Мінімальна кількість символів 10')
    .max(500, 'Максимальна кількість символів 500')
    .optional(),

  src: imageArrayPatchSchema,

  slug: Yup.string().trim().optional(),

  layout: Yup.array().of(serviceLayoutNodeSchema).optional().default(undefined),

  sections: serviceSectionsPatchSchema,

  seoTitle: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(10, 'Мінімальна кількість символів 10')
    .max(120, 'Максимальна кількість символів 120')
    .optional(),

  seoDescription: Yup.string()
    .transform(emptyToUndefined)
    .trim()
    .min(20, 'Мінімальна кількість символів 20')
    .max(160, 'Максимальна кількість символів 160')
    .optional(),

  relatedArticles: Yup.array().of(Yup.string().trim().required()).optional(),
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
