'use client';

import { FieldArray, Form, Formik } from 'formik';
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

  const benefitsItems = values.benefitsItems
    .map(item => ({
      title: item.title.trim(),
      description: item.description.trim(),
    }))
    .filter(item => item.title && item.description);

  const benefits =
    values.benefitsTitle.trim() || benefitsItems.length
      ? {
          title: values.benefitsTitle.trim(),
          items: benefitsItems,
        }
      : undefined;

  const processSteps = values.processSteps
    .map(item => ({
      title: item.title.trim(),
      description: item.description.trim(),
    }))
    .filter(item => item.title && item.description);

  const process =
    values.processTitle.trim() || processSteps.length
      ? {
          title: values.processTitle.trim(),
          steps: processSteps,
        }
      : undefined;

  const faqItems = values.faqItems
    .map(item => ({
      question: item.question.trim(),
      answer: item.answer.trim(),
    }))
    .filter(item => item.question && item.answer);

  const faq =
    values.faqTitle.trim() || faqItems.length
      ? {
          title: values.faqTitle.trim(),
          items: faqItems,
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
    benefitsItems: initialValues?.sections?.benefits?.items ?? [],

    processTitle: initialValues?.sections?.process?.title ?? '',
    processSteps: initialValues?.sections?.process?.steps ?? [],

    faqTitle: initialValues?.sections?.faq?.title ?? '',
    faqItems: initialValues?.sections?.faq?.items ?? [],

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
                <FieldArray name="benefitsItems">
                  {({ push, remove }) => (
                    <div className="grid gap-4">
                      {values.benefitsItems.map((_, index) => (
                        <div
                          key={`benefit-${index}`}
                          className="border-border rounded-xl border p-4"
                        >
                          <div className="grid gap-4">
                            <Input
                              name={`benefitsItems.${index}.title`}
                              label={`Benefit #${index + 1} title`}
                            />
                            <Textarea
                              name={`benefitsItems.${index}.description`}
                              label={`Benefit #${index + 1} description`}
                              rows={3}
                            />

                            <div className="flex justify-end">
                              <Btn
                                type="button"
                                label="Удалить"
                                uiVariant="ghost"
                                onClick={() => remove(index)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <div>
                        <Btn
                          type="button"
                          label="Добавить benefit"
                          uiVariant="ghost"
                          onClick={() => push({ title: '', description: '' })}
                        />
                      </div>
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>

            <div className="border-border rounded-2xl border p-4">
              <h3 className="text-accent mb-4 text-lg font-semibold">
                Process
              </h3>
              <div className="grid gap-4">
                <Input name="processTitle" label="Process title" />
                <FieldArray name="processSteps">
                  {({ push, remove }) => (
                    <div className="grid gap-4">
                      {values.processSteps.map((_, index) => (
                        <div
                          key={`step-${index}`}
                          className="border-border rounded-xl border p-4"
                        >
                          <div className="grid gap-4">
                            <Input
                              name={`processSteps.${index}.title`}
                              label={`Step #${index + 1} title`}
                            />
                            <Textarea
                              name={`processSteps.${index}.description`}
                              label={`Step #${index + 1} description`}
                              rows={3}
                            />
                            <div className="flex justify-end">
                              <Btn
                                type="button"
                                label="Удалить"
                                uiVariant="ghost"
                                onClick={() => remove(index)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <Btn
                        type="button"
                        label="Добавить step"
                        uiVariant="ghost"
                        onClick={() => push({ title: '', description: '' })}
                      />
                    </div>
                  )}
                </FieldArray>
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
