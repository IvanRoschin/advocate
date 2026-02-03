import * as yup from 'yup';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const coverImageSchema = yup
  .array()
  .of(yup.string())
  .min(1, 'Додайте хоча б одне фото')
  .max(3, 'Максимум 3 фото')
  .required(`Обов'язкове поле`);

const seoSchema = yup.object({
  title: yup.string().optional(),
  description: yup.string().optional(),
  canonicalUrl: yup.string().url('Неверный URL').optional(),
  noIndex: yup.boolean().default(false),
  openGraph: yup
    .object({
      title: yup.string().optional(),
      description: yup.string().optional(),
      image: yup.string().url('Неверный URL').optional(),
    })
    .optional(),
});

export const articleValidationSchema = yup.object({
  slug: yup.string().required('Обязательное поле'),
  status: yup
    .mixed<'draft' | 'published' | 'archived'>()
    .oneOf(['draft', 'published', 'archived'])
    .required(),
  visibility: yup
    .mixed<'public' | 'private' | 'unlisted'>()
    .oneOf(['public', 'private', 'unlisted'])
    .required(),

  title: yup.string().required('Обязательное поле'),
  subtitle: yup.string().optional(),
  excerpt: yup.string().max(500).required('Обязательное поле'),
  content: yup.string().required('Обязательное поле'),
  readingTime: yup.number().min(1).required('Обязательное поле'),
  language: yup
    .mixed<'uk' | 'ru' | 'en'>()
    .oneOf(['uk', 'ru', 'en'])
    .required(),

  author: yup.string().matches(objectIdRegex, 'Неверный ObjectId').required(),
  coAuthors: yup
    .array()
    .of(yup.string().matches(objectIdRegex, 'Неверный ObjectId'))
    .optional(),
  categories: yup
    .array()
    .of(yup.string().matches(objectIdRegex, 'Неверный ObjectId'))
    .optional(),
  comments: yup
    .array()
    .of(yup.string().matches(objectIdRegex, 'Неверный ObjectId'))
    .optional(),

  coverImage: coverImageSchema.optional(),
  tags: yup.array().of(yup.string()).optional(),

  commentsCount: yup.number().min(0).optional(),
  likesCount: yup.number().min(0).optional(),
  viewsCount: yup.number().min(0).optional(),

  seo: seoSchema.optional(),

  publishedAt: yup.date().optional(),

  featured: yup.boolean().optional(),
  pinned: yup.boolean().optional(),

  source: yup.string().optional(),
  revision: yup.number().min(1).optional(),
});
