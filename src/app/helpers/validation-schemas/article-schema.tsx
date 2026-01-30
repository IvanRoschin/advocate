import { Types } from 'mongoose';
import * as yup from 'yup';

/* ---------------------------- */
/* Media validation */
/* ---------------------------- */
const coverImageSchema = yup.object({
  url: yup.string().url('Неверный URL').required('Обязательное поле'),
  publicId: yup.string().required('Обязательное поле'),
  alt: yup.string().required('Обязательное поле'),
  width: yup.number().min(1).required('Обязательное поле'),
  height: yup.number().min(1).required('Обязательное поле'),
  dominantColor: yup.string().optional(),
});

/* ---------------------------- */
/* SEO validation */
/* ---------------------------- */
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

/* ---------------------------- */
/* Article validation */
/* ---------------------------- */
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

  author: yup
    .mixed<Types.ObjectId>()
    .test(
      'is-objectid',
      'Неверный ObjectId',
      val => val instanceof Types.ObjectId
    )
    .required('Обязательное поле'),

  coAuthors: yup
    .array()
    .of(
      yup
        .mixed<Types.ObjectId>()
        .test(
          'is-objectid',
          'Неверный ObjectId',
          val => val instanceof Types.ObjectId
        )
    )
    .optional(),

  coverImage: coverImageSchema.optional(),

  tags: yup.array().of(yup.string()).optional(),
  categories: yup
    .array()
    .of(
      yup
        .mixed<Types.ObjectId>()
        .test(
          'is-objectid',
          'Неверный ObjectId',
          val => val instanceof Types.ObjectId
        )
    )
    .optional(),

  comments: yup
    .array()
    .of(
      yup
        .mixed<Types.ObjectId>()
        .test(
          'is-objectid',
          'Неверный ObjectId',
          val => val instanceof Types.ObjectId
        )
    )
    .optional(),

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
