'use client';

import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import FormDraftPersist from '@/app/components/forms/FormDraftPersist';
import Btn from '@/app/components/ui/button/Btn';
import storageKeys from '@/app/config/storageKeys';
import { clearFormDraft, loadFormDraft } from '@/app/lib/client/form-draft';
import ImageUploadCloudinary from '@/app/lib/client/ImageUploadCloudinary';
import { defaultServiceLayout } from '@/app/resources/content/pages/service.layout';
import {
  createServiceFormSchema,
  CreateServiceRequestDTO,
  ServiceFormValues,
  ServiceSectionsDto,
  UpdateServiceDTO,
  updateServiceFormSchema,
} from '@/app/types';
import {
  Input,
  RepeatableFieldsSection,
  Select,
  Textarea,
} from '@/components/index';

/* ------------------------------------------------------------------ */
/* Types ------------------------------------------------------------- */

type DraftShape = Partial<ServiceFormValues>;

type BaseProps = {
  onClose: () => void;
  submitLabel?: string;
  articles?: ArticleOption[];

  persistToLocalStorage?: boolean;
  clearDraftOnClose?: boolean;
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

type ArticleLike = { id?: string; _id?: string };

export type ArticleOption = { id: string; title: string };
/* ------------------------------------------------------------------ */
/* Helpers ----------------------------------------------------------- */

const extractArticleId = (a: string | ArticleLike): string => {
  if (typeof a === 'string') return a;
  if (a.id) return a.id;
  if (a._id) return a._id;
  throw new Error('Invalid relatedArticles item');
};

const sameArray = (a?: string[], b?: string[]) =>
  JSON.stringify(a ?? []) === JSON.stringify(b ?? []);

const sameValue = <T,>(a: T, b: T) => JSON.stringify(a) === JSON.stringify(b);

const stripUndefined = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;

const normalize = (values: ServiceFormValues): ServiceFormValues => ({
  ...values,
  slug: values.slug.trim(),
  title: values.title.trim(),
  summary: values.summary.trim(),
  seoTitle: values.seoTitle.trim(),
  seoDescription: values.seoDescription.trim(),
  heroTitle: values.heroTitle.trim(),
  heroDescription: values.heroDescription.trim(),
  benefitsTitle: values.benefitsTitle.trim(),
  processTitle: values.processTitle.trim(),
  faqTitle: values.faqTitle.trim(),
  ctaTitle: values.ctaTitle.trim(),
  ctaDescription: values.ctaDescription.trim(),
  ctaButtonLabel: values.ctaButtonLabel.trim(),
  benefitsItems: values.benefitsItems.map(item => ({
    title: item.title.trim(),
    description: item.description.trim(),
  })),
  processSteps: values.processSteps.map(item => ({
    title: item.title.trim(),
    description: item.description.trim(),
  })),
  faqItems: values.faqItems.map(item => ({
    question: item.question.trim(),
    answer: item.answer.trim(),
  })),
  relatedArticles: Array.isArray(values.relatedArticles)
    ? values.relatedArticles
    : [],
});

const buildSections = (values: ServiceFormValues): ServiceSectionsDto => {
  const normalized = normalize(values);

  const hero =
    normalized.heroTitle ||
    normalized.heroDescription ||
    normalized.heroSrc.length
      ? {
          title: normalized.heroTitle,
          description: normalized.heroDescription,
          src: normalized.heroSrc,
        }
      : undefined;

  const benefitsItems = normalized.benefitsItems.filter(
    item => item.title && item.description
  );

  const benefits =
    normalized.benefitsTitle || benefitsItems.length
      ? {
          title: normalized.benefitsTitle,
          items: benefitsItems,
        }
      : undefined;

  const processSteps = normalized.processSteps.filter(
    item => item.title && item.description
  );

  const process =
    normalized.processTitle || processSteps.length
      ? {
          title: normalized.processTitle,
          steps: processSteps,
        }
      : undefined;

  const faqItems = normalized.faqItems.filter(
    item => item.question && item.answer
  );

  const faq =
    normalized.faqTitle || faqItems.length
      ? {
          title: normalized.faqTitle,
          items: faqItems,
        }
      : undefined;

  const cta =
    normalized.ctaTitle ||
    normalized.ctaDescription ||
    normalized.ctaButtonLabel
      ? {
          title: normalized.ctaTitle,
          description: normalized.ctaDescription,
          buttonLabel: normalized.ctaButtonLabel,
        }
      : undefined;

  return {
    ...(hero ? { hero } : {}),
    ...(benefits ? { benefits } : {}),
    ...(process ? { process } : {}),
    ...(faq ? { faq } : {}),
    ...(cta ? { cta } : {}),
  };
};

const buildCreatePayload = (
  values: ServiceFormValues
): CreateServiceRequestDTO => {
  const normalized = normalize(values);

  return {
    slug: normalized.slug,
    status: normalized.status,
    title: normalized.title,
    summary: normalized.summary,
    src: normalized.src,
    layout: normalized.layout,
    sections: buildSections(normalized),
    seoTitle: normalized.seoTitle,
    seoDescription: normalized.seoDescription,
    relatedArticles: normalized.relatedArticles,
  };
};

const buildPatch = (
  initial: ServiceFormValues,
  current: ServiceFormValues
): UpdateServiceDTO => {
  const i = normalize(initial);
  const c = normalize(current);

  const initialSections = buildSections(i);
  const currentSections = buildSections(c);

  const patch: UpdateServiceDTO = {
    ...(c.slug !== i.slug ? { slug: c.slug } : {}),
    ...(c.status !== i.status ? { status: c.status } : {}),
    ...(c.title !== i.title ? { title: c.title } : {}),
    ...(c.summary !== i.summary ? { summary: c.summary } : {}),
    ...(!sameArray(c.src, i.src) ? { src: c.src } : {}),
    ...(!sameValue(c.layout, i.layout) ? { layout: c.layout } : {}),
    ...(c.seoTitle !== i.seoTitle ? { seoTitle: c.seoTitle } : {}),
    ...(c.seoDescription !== i.seoDescription
      ? { seoDescription: c.seoDescription }
      : {}),
    ...(!sameArray(c.relatedArticles, i.relatedArticles)
      ? { relatedArticles: c.relatedArticles }
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

  const persist =
    props.persistToLocalStorage ?? (props.mode === 'create' ? true : false);

  const clearOnClose = props.clearDraftOnClose ?? true;

  const [draft] = useState<DraftShape | null>(() => {
    if (!persist || props.mode !== 'create') return null;
    return loadFormDraft<ServiceFormValues>(storageKeys.service);
  });

  const schema = useMemo(
    () => (isEditMode ? updateServiceFormSchema : createServiceFormSchema),
    [isEditMode]
  );

  const baseValues: ServiceFormValues = useMemo(
    () => ({
      slug: initialValues?.slug ?? '',
      status: initialValues?.status ?? 'draft',
      title: initialValues?.title ?? '',
      summary: initialValues?.summary ?? '',
      src: initialValues?.src ?? [],
      layout: Array.isArray(initialValues?.layout)
        ? initialValues.layout
        : defaultServiceLayout,
      seoTitle: initialValues?.seoTitle ?? '',
      seoDescription: initialValues?.seoDescription ?? '',

      relatedArticles: Array.isArray(initialValues?.relatedArticles)
        ? initialValues.relatedArticles.map(extractArticleId)
        : [],

      heroTitle: initialValues?.sections?.hero?.title ?? '',
      heroDescription: initialValues?.sections?.hero?.description ?? '',
      heroSrc: Array.isArray(initialValues?.sections?.hero?.src)
        ? initialValues.sections.hero.src
        : [],

      benefitsTitle: initialValues?.sections?.benefits?.title ?? '',
      benefitsItems: initialValues?.sections?.benefits?.items ?? [],

      processTitle: initialValues?.sections?.process?.title ?? '',
      processSteps: initialValues?.sections?.process?.steps ?? [],

      faqTitle: initialValues?.sections?.faq?.title ?? '',
      faqItems: initialValues?.sections?.faq?.items ?? [],

      ctaTitle: initialValues?.sections?.cta?.title ?? '',
      ctaDescription: initialValues?.sections?.cta?.description ?? '',
      ctaButtonLabel: initialValues?.sections?.cta?.buttonLabel ?? '',
    }),
    [initialValues]
  );

  const defaultValues: ServiceFormValues = useMemo(() => {
    if (!persist || props.mode !== 'create' || !draft) return baseValues;

    return {
      ...baseValues,
      ...draft,
      src: Array.isArray(draft.src) ? draft.src : baseValues.src,
      relatedArticles: Array.isArray(draft?.relatedArticles)
        ? draft.relatedArticles
        : baseValues.relatedArticles,
      layout: Array.isArray(draft.layout) ? draft.layout : baseValues.layout,
      heroSrc: Array.isArray(draft.heroSrc)
        ? draft.heroSrc
        : baseValues.heroSrc,
      benefitsItems: Array.isArray(draft.benefitsItems)
        ? draft.benefitsItems
        : baseValues.benefitsItems,
      processSteps: Array.isArray(draft.processSteps)
        ? draft.processSteps
        : baseValues.processSteps,
      faqItems: Array.isArray(draft.faqItems)
        ? draft.faqItems
        : baseValues.faqItems,
    };
  }, [baseValues, draft, persist, props.mode]);

  const handleClose = () => {
    if (clearOnClose) {
      clearFormDraft(storageKeys.service);
    }
    props.onClose();
  };

  return (
    <>
      {isEditMode ? 'Редагувати послугу' : 'Додати нову послугу'}

      <Formik<ServiceFormValues>
        enableReinitialize={isEditMode || (props.mode === 'create' && persist)}
        initialValues={defaultValues}
        validationSchema={schema}
        onSubmit={async values => {
          if (props.mode === 'create') {
            await props.onSubmit(buildCreatePayload(values));
            clearFormDraft(storageKeys.service);
            return;
          }

          const patch = buildPatch(baseValues, values);
          await props.onSubmit(patch);
          clearFormDraft(storageKeys.service);
        }}
      >
        {({ isValid, isSubmitting, setFieldValue, values, errors }) => (
          <Form className="flex w-full max-w-5xl flex-col gap-6">
            <FormDraftPersist<ServiceFormValues>
              storageKey={storageKeys.service}
              enabled={persist && props.mode === 'create'}
              values={values}
            />

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
                  { value: 'draft', label: 'Чернетка' },
                  { value: 'published', label: 'Опубліковано' },
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
                fieldName="src"
                setFieldValue={setFieldValue}
                values={values.src}
                error={typeof errors.src === 'string' ? errors.src : undefined}
                uploadPreset="service_cover"
                multiple={false}
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
                  fieldName="heroSrc"
                  setFieldValue={setFieldValue}
                  values={values.heroSrc}
                  uploadPreset="service_hero"
                  multiple={false}
                />
              </div>
            </div>

            <RepeatableFieldsSection
              sectionTitle="Benefits"
              sectionFieldName="benefitsTitle"
              sectionLabel="Benefits title"
              itemsFieldName="benefitsItems"
              items={values.benefitsItems}
              mode="title-description"
              addButtonLabel="Додати benefit"
              itemLabelPrefix="Benefit"
            />

            <RepeatableFieldsSection
              sectionTitle="Process"
              sectionFieldName="processTitle"
              sectionLabel="Process title"
              itemsFieldName="processSteps"
              items={values.processSteps}
              mode="title-description"
              addButtonLabel="Додати step"
              itemLabelPrefix="Step"
            />

            <RepeatableFieldsSection
              sectionTitle="FAQ"
              sectionFieldName="faqTitle"
              sectionLabel="FAQ title"
              itemsFieldName="faqItems"
              items={values.faqItems}
              mode="question-answer"
              addButtonLabel="Додати FAQ"
              itemLabelPrefix="FAQ"
            />

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
            {props.articles?.length ? (
              <div className="border-border rounded-2xl border p-4">
                <h3 className="text-accent mb-4 text-lg font-semibold">
                  Пов’язані статті
                </h3>

                <div className="grid gap-2">
                  {props.articles.map(article => {
                    const checked = values.relatedArticles.includes(article.id);

                    return (
                      <label
                        key={article.id}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => {
                            if (e.target.checked) {
                              setFieldValue('relatedArticles', [
                                ...values.relatedArticles,
                                article.id,
                              ]);
                            } else {
                              setFieldValue(
                                'relatedArticles',
                                values.relatedArticles.filter(
                                  id => id !== article.id
                                )
                              );
                            }
                          }}
                        />

                        <span className="text-sm">{article.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="flex justify-end gap-2">
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
