'use client';

import { Form, Formik, FormikProps } from 'formik';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import Btn from '@/app/components/ui/button/Btn';
import { apiUrl } from '@/app/config/routes';
import { articleSchema } from '@/app/helpers/validationSchemas/article/createArticle.schema';
import ImageUploadCloudinary from '@/app/lib/client/ImageUploadCloudinary';
import {
  AutoSlugField,
  Checkbox,
  Input,
  Select,
  Textarea,
} from '@/components/index';

/* ------------------------------------------------------------------ */
/* Types -------------------------------------------------------------- */
export type ArticleFormValues = {
  slug: string;
  slugTouchedManually: boolean;

  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'unlisted';

  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  readingTime: number;
  language: 'uk' | 'ru' | 'en';

  author: string; // ObjectId выбранного автора
  coAuthors: string[]; // ObjectId выбранных соавторов
  category: string; // ObjectId выбранной категории

  coverImage: string[];
  tags: string[];

  seo?: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
  };

  featured: boolean;
  pinned: boolean;
};

export type UserOption = {
  id: string;
  name: string;
};

export type CategoryOption = {
  id: string;
  name: string;
};

export type ArticleFormProps = {
  initialValues?: ArticleFormValues;
  users?: UserOption[];
  categories?: CategoryOption[];
};

/* ------------------------------------------------------------------ */
/* Inner form --------------------------------------------------------- */
const InnerArticleForm = ({
  values,
  setFieldValue,
  errors,
  isValid,
  isSubmitting,
  users,
  categories,
}: FormikProps<ArticleFormValues> & {
  users?: UserOption[];
  categories?: CategoryOption[];
}) => {
  return (
    <Form className="flex max-w-4xl flex-col gap-6">
      {/* AUTO SLUG */}
      <AutoSlugField
        sourceField="title"
        targetField="slug"
        touchedFlagField="slugTouchedManually"
        options={{ locale: 'uk' }}
      />

      {/* TITLE & SUBTITLE */}
      <Input name="title" label="Заголовок" required />
      <Input name="subtitle" label="Підзаголовок" />
      <Textarea name="excerpt" label="Короткий опис" required />
      <Textarea name="content" label="Контент" rows={10} required />

      <Input
        name="readingTime"
        label="Час читання (хв)"
        required
        type="number"
      />

      {/* META */}
      <div className="grid grid-cols-3 gap-4">
        <Select
          name="status"
          label="Статус"
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'archived', label: 'Archived' },
          ]}
        />
        <Select
          name="visibility"
          label="Видимість"
          options={[
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
            { value: 'unlisted', label: 'Unlisted' },
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

      {/* AUTHOR & CO-AUTHORS */}
      <Select
        name="author"
        label="Автор"
        options={(users ?? []).map(user => ({
          value: user.id,
          label: user.name,
        }))}
        required
      />
      <Select
        name="coAuthors"
        label="Співавтори"
        options={(users ?? []).map(user => ({
          value: user.id,
          label: user.name,
        }))}
      />

      {/* CATEGORY */}
      <Select
        name="category"
        label="Категорія"
        options={(categories ?? []).map(cat => ({
          value: cat.id,
          label: cat.name,
        }))}
        required
      />

      {/* COVER IMAGE */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <ImageUploadCloudinary
          uploadPreset="Articles"
          setFieldValue={setFieldValue}
          values={values.coverImage}
          error={
            typeof errors.coverImage === 'string'
              ? errors.coverImage
              : undefined
          }
        />
      </motion.div>

      {/* TAGS */}
      <Input name="tags" label="Теги (через кому)" />

      {/* SEO */}
      <h3 className="text-lg font-semibold">SEO</h3>
      <Input name="seo.title" label="SEO Title" />
      <Textarea name="seo.description" label="SEO Description" />
      <Input name="seo.canonicalUrl" label="Canonical URL" />
      <Checkbox name="seo.noIndex">No index</Checkbox>

      <div className="flex gap-6">
        <Checkbox name="featured">Featured</Checkbox>
        <Checkbox name="pinned">Pinned</Checkbox>
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end">
        <Btn
          type="submit"
          label="Створити статтю"
          disabled={!isValid || isSubmitting}
        />
      </div>
    </Form>
  );
};

/* ------------------------------------------------------------------ */
/* Form wrapper ------------------------------------------------------- */
const ArticleForm = ({
  initialValues,
  users,
  categories,
}: ArticleFormProps) => {
  return (
    <Formik<ArticleFormValues>
      initialValues={
        initialValues ?? {
          title: '',
          slug: '',
          slugTouchedManually: false,

          status: 'draft',
          visibility: 'public',

          subtitle: '',
          excerpt: '',
          content: '',
          readingTime: 5,
          language: 'uk',

          author: '',
          coAuthors: [],
          category: '',

          tags: [],
          coverImage: [],

          seo: {
            title: '',
            description: '',
            canonicalUrl: '',
            noIndex: false,
          },

          featured: false,
          pinned: false,
        }
      }
      validationSchema={articleSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          const res = await fetch(apiUrl('/api/v1/articles'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });

          const json = await res.json();

          if (!res.ok) {
            toast.error(json?.error?.message || 'Помилка створення статті');
            return;
          }

          toast.success('Стаття успішно створена');
          resetForm();
        } catch (e) {
          toast.error(e instanceof Error ? e.message : 'Невідома помилка');
        }
      }}
    >
      {formik => (
        <InnerArticleForm {...formik} users={users} categories={categories} />
      )}
    </Formik>
  );
};

export default ArticleForm;
