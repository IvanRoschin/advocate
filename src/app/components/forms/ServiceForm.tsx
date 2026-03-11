'use client';

import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';

import Btn from '@/app/components/ui/button/Btn';
import ImageUploadCloudinary from '@/app/lib/client/ImageUploadCloudinary';
import { defaultServiceLayout } from '@/app/resources/content/pages/service.layout';
import {
  CreateServiceRequestDTO,
  ServiceLayoutNodeInput,
  ServiceSectionsDto,
  ServiceStatus,
  UpdateServiceDTO,
} from '@/app/types';
import { Input, Select, Textarea } from '@/components/index';

/* ------------------------------------------------------------------ */
/* Types ------------------------------------------------------------- */

export type ServiceFormValues = {
  slug: string;
  status: ServiceStatus;
  title: string;
  summary: string;
  src: string[];
  layout: ServiceLayoutNodeInput[];
  seoTitle: string;
  seoDescription: string;

  heroTitle: string;
  heroDescription: string;
  heroSrc: string[];

  benefitsTitle: string;
  benefitsItemsText: string;

  processTitle: string;
  processStepsText: string;

  faqTitle: string;
  faqItemsText: string;

  reviewsTitle: string;
  reviewIdsText: string;

  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
};

type BaseProps = {
  onClose: () => void;
  submitLabel?: string;
};

type CreateModeProps = BaseProps & {
  mode: 'create';
  onSubmit: (values: CreateServiceRequestDTO) => void | Promise<void>;
};

type EditModeProps = BaseProps & {
  mode: 'edit';
  initialValues: Partial<CreateServiceRequestDTO>;
  onSubmit: (values: UpdateServiceDTO) => void | Promise<void>;
};

type Props = CreateModeProps | EditModeProps;

/* ------------------------------------------------------------------ */
/* Helpers ----------------------------------------------------------- */

const parseLines = (raw: string): string[] =>
  raw
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean);

const stringifyLines = (items?: string[]) =>
  items?.length ? items.join('\n') : '';

const parseKeyValueLines = (
  raw: string
): Array<{ title: string; description: string }> =>
  raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [title, ...rest] = line.split('|');
      return {
        title: (title ?? '').trim(),
        description: rest.join('|').trim(),
      };
    })
    .filter(item => item.title && item.description);

const stringifyKeyValueLines = (
  items?: Array<{ title: string; description: string }>
) =>
  items?.length
    ? items.map(item => `${item.title} | ${item.description}`).join('\n')
    : '';

const parseFaqLines = (
  raw: string
): Array<{ question: string; answer: string }> =>
  raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [question, ...rest] = line.split('|');
      return {
        question: (question ?? '').trim(),
        answer: rest.join('|').trim(),
      };
    })
    .filter(item => item.question && item.answer);

const stringifyFaqLines = (
  items?: Array<{ question: string; answer: string }>
) =>
  items?.length
    ? items.map(item => `${item.question} | ${item.answer}`).join('\n')
    : '';

const sameArray = (a?: string[], b?: string[]) =>
  JSON.stringify(a ?? []) === JSON.stringify(b ?? []);

const sameValue = <T,>(a: T, b: T) => JSON.stringify(a) === JSON.stringify(b);

const stripUndefined = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;

const buildSections = (values: ServiceFormValues): ServiceSectionsDto => {
  const hero =
    values.heroTitle.trim() ||
    values.heroDescription.trim() ||
    values.heroSrc.length
      ? {
          title: values.heroTitle.trim(),
          description: values.heroDescription.trim(),
          src: values.heroSrc,
        }
      : undefined;

  const benefitsItems = parseKeyValueLines(values.benefitsItemsText);
  const benefits =
    values.benefitsTitle.trim() || benefitsItems.length
      ? {
          title: values.benefitsTitle.trim(),
          items: benefitsItems,
        }
      : undefined;

  const processSteps = parseKeyValueLines(values.processStepsText);
  const process =
    values.processTitle.trim() || processSteps.length
      ? {
          title: values.processTitle.trim(),
          steps: processSteps,
        }
      : undefined;

  const faqItems = parseFaqLines(values.faqItemsText);
  const faq =
    values.faqTitle.trim() || faqItems.length
      ? {
          title: values.faqTitle.trim(),
          items: faqItems,
        }
      : undefined;

  const reviewIds = parseLines(values.reviewIdsText);
  const reviews =
    values.reviewsTitle.trim() || reviewIds.length
      ? {
          title: values.reviewsTitle.trim(),
          reviewIds,
        }
      : undefined;

  const cta =
    values.ctaTitle.trim() ||
    values.ctaDescription.trim() ||
    values.ctaButtonLabel.trim()
      ? {
          title: values.ctaTitle.trim(),
          description: values.ctaDescription.trim(),
          buttonLabel: values.ctaButtonLabel.trim(),
        }
      : undefined;

  return {
    ...(hero ? { hero } : {}),
    ...(benefits ? { benefits } : {}),
    ...(process ? { process } : {}),
    ...(faq ? { faq } : {}),
    ...(reviews ? { reviews } : {}),
    ...(cta ? { cta } : {}),
  };
};

const buildCreatePayload = (
  values: ServiceFormValues
): CreateServiceRequestDTO => ({
  slug: values.slug.trim(),
  status: values.status,
  title: values.title.trim(),
  summary: values.summary.trim(),
  src: values.src,
  layout: values.layout,
  sections: buildSections(values),
  seoTitle: values.seoTitle.trim(),
  seoDescription: values.seoDescription.trim(),
});

const buildPatch = (
  initial: ServiceFormValues,
  current: ServiceFormValues
): UpdateServiceDTO => {
  const initialSections = buildSections(initial);
  const currentSections = buildSections(current);

  const patch: UpdateServiceDTO = {
    ...(current.slug.trim() !== initial.slug.trim()
      ? { slug: current.slug.trim() }
      : {}),
    ...(current.status !== initial.status ? { status: current.status } : {}),
    ...(current.title.trim() !== initial.title.trim()
      ? { title: current.title.trim() }
      : {}),
    ...(current.summary.trim() !== initial.summary.trim()
      ? { summary: current.summary.trim() }
      : {}),
    ...(!sameArray(current.src, initial.src) ? { src: current.src } : {}),
    ...(!sameValue(current.layout, initial.layout)
      ? { layout: current.layout }
      : {}),
    ...(current.seoTitle.trim() !== initial.seoTitle.trim()
      ? { seoTitle: current.seoTitle.trim() }
      : {}),
    ...(current.seoDescription.trim() !== initial.seoDescription.trim()
      ? { seoDescription: current.seoDescription.trim() }
      : {}),
    ...(!sameValue(currentSections, initialSections)
      ? { sections: currentSections }
      : {}),
  };

  return stripUndefined(patch) as UpdateServiceDTO;
};

/* ------------------------------------------------------------------ */
/* Component --------------------------------------------------------- */

const ServiceForm = (props: Props) => {
  const isEditMode = props.mode === 'edit';
  const initialValues = isEditMode ? props.initialValues : undefined;

  const baseValues: ServiceFormValues = {
    slug: initialValues?.slug ?? '',
    status: initialValues?.status ?? 'draft',
    title: initialValues?.title ?? '',
    summary: initialValues?.summary ?? '',
    src: Array.isArray(initialValues?.src) ? initialValues.src : [],
    layout: Array.isArray(initialValues?.layout)
      ? initialValues.layout
      : defaultServiceLayout,
    seoTitle: initialValues?.seoTitle ?? '',
    seoDescription: initialValues?.seoDescription ?? '',

    heroTitle: initialValues?.sections?.hero?.title ?? '',
    heroDescription: initialValues?.sections?.hero?.description ?? '',
    heroSrc: Array.isArray(initialValues?.sections?.hero?.src)
      ? initialValues.sections.hero.src
      : [],

    benefitsTitle: initialValues?.sections?.benefits?.title ?? '',
    benefitsItemsText: stringifyKeyValueLines(
      initialValues?.sections?.benefits?.items
    ),

    processTitle: initialValues?.sections?.process?.title ?? '',
    processStepsText: stringifyKeyValueLines(
      initialValues?.sections?.process?.steps
    ),

    faqTitle: initialValues?.sections?.faq?.title ?? '',
    faqItemsText: stringifyFaqLines(initialValues?.sections?.faq?.items),

    reviewsTitle: initialValues?.sections?.reviews?.title ?? '',
    reviewIdsText: stringifyLines(initialValues?.sections?.reviews?.reviewIds),

    ctaTitle: initialValues?.sections?.cta?.title ?? '',
    ctaDescription: initialValues?.sections?.cta?.description ?? '',
    ctaButtonLabel: initialValues?.sections?.cta?.buttonLabel ?? '',
  };

  // const schema = useMemo(
  //   () => (isEditMode ? updateServiceSchema : createServiceSchema),
  //   [isEditMode]
  // );

  return (
    <>
      {isEditMode ? 'Редагувати послугу' : 'Додати нову послугу'}

      <Formik<ServiceFormValues>
        enableReinitialize
        initialValues={baseValues}
        // validationSchema={schema}
        onSubmit={async values => {
          if (props.mode === 'create') {
            await props.onSubmit(buildCreatePayload(values));
            return;
          }

          const patch = buildPatch(baseValues, values);
          await props.onSubmit(patch);
        }}
      >
        {({ isValid, isSubmitting, setFieldValue, values, errors }) => (
          <Form className="flex w-full max-w-5xl flex-col gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.04 }}
            >
              <Input name="title" label="Назва послуги" required />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.06 }}
            >
              <Textarea
                name="summary"
                label="Короткий опис"
                rows={4}
                required
              />
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2">
              <Select
                name="status"
                label="Статус"
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'published', label: 'Published' },
                ]}
              />

              <Input name="slug" label="Slug" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input name="seoTitle" label="SEO title" required />

              <Input name="seoDescription" label="SEO description" required />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08 }}
            >
              <ImageUploadCloudinary
                setFieldValue={setFieldValue}
                values={values.src}
                error={typeof errors.src === 'string' ? errors.src : undefined}
                uploadPreset="Services"
                multiple
              />
            </motion.div>

            <div className="border-border rounded-2xl border p-4">
              <h3 className="text-accent mb-4 text-lg font-semibold">Hero</h3>

              <div className="grid gap-4">
                <Input name="heroTitle" label="Hero title" />

                <Textarea
                  name="heroDescription"
                  label="Hero description"
                  rows={4}
                />

                <ImageUploadCloudinary
                  setFieldValue={setFieldValue}
                  values={values.heroSrc}
                  uploadPreset="Services"
                  multiple
                />
              </div>
            </div>

            <div className="border-border rounded-2xl border p-4">
              <h3 className="text-accent mb-4 text-lg font-semibold">
                Benefits
              </h3>

              <div className="grid gap-4">
                <Input name="benefitsTitle" label="Benefits title" />

                <Textarea
                  name="benefitsItemsText"
                  label="Benefits items"
                  rows={6}
                />
              </div>
            </div>

            <div className="border-border rounded-2xl border p-4">
              <h3 className="text-accent mb-4 text-lg font-semibold">
                Process
              </h3>

              <div className="grid gap-4">
                <Input name="processTitle" label="Process title" />

                <Textarea
                  name="processStepsText"
                  label="Process steps"
                  rows={6}
                />
              </div>
            </div>

            <div className="border-border rounded-2xl border p-4">
              <h3 className="text-accent mb-4 text-lg font-semibold">FAQ</h3>

              <div className="grid gap-4">
                <Input name="faqTitle" label="FAQ title" />

                <Textarea name="faqItemsText" label="FAQ items" rows={6} />
              </div>
            </div>

            <div className="border-border rounded-2xl border p-4">
              <h3 className="text-accent mb-4 text-lg font-semibold">
                Reviews
              </h3>

              <div className="grid gap-4">
                <Input name="reviewsTitle" label="Reviews title" />

                <Textarea name="reviewIdsText" label="Review IDs" rows={4} />
              </div>
            </div>

            <div className="border-border rounded-2xl border p-4">
              <h3 className="text-accent mb-4 text-lg font-semibold">CTA</h3>

              <div className="grid gap-4">
                <Input name="ctaTitle" label="CTA title" />

                <Textarea
                  name="ctaDescription"
                  label="CTA description"
                  rows={4}
                />

                <Input name="ctaButtonLabel" label="CTA button label" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Btn
                type="button"
                label="Скасувати"
                uiVariant="ghost"
                onClick={props.onClose}
              />

              <Btn
                uiVariant="accent"
                radius={12}
                type="submit"
                label={
                  props.submitLabel ??
                  (isEditMode ? 'Оновити послугу' : 'Додати послугу')
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

export default ServiceForm;
