'use client';

import { useField, useFormikContext } from 'formik';
import { useEffect } from 'react';
import slugify from 'slugify';

import { ArticleFormValues } from '../forms/ArticleForm';

type RawSlugifyOptions = Parameters<typeof slugify>[1];
type SlugifyObjectOptions = Exclude<RawSlugifyOptions, string | undefined>;

interface AutoSlugFieldProps {
  sourceField: string;
  targetField: string;
  touchedFlagField: string;
  options?: SlugifyObjectOptions;
}

const AutoSlugField = ({
  sourceField,
  targetField,
  touchedFlagField,
  options,
}: AutoSlugFieldProps) => {
  const { setFieldValue } = useFormikContext<ArticleFormValues>();

  const [{ value: sourceValue }] = useField<string>(sourceField);
  const [{ value: touchedManually }] = useField<boolean>(touchedFlagField);
  const [{ value: slug }] = useField<string>(targetField);

  useEffect(() => {
    if (touchedManually) return; // если пользователь редактировал вручную, ничего не делаем
    if (!sourceValue) return; // если нет значения источника, ничего не делаем

    const nextSlug = slugify(sourceValue, {
      lower: true,
      strict: true,
      trim: true,
      ...(options ?? {}),
    });

    // Обновляем только если slug реально отличается
    if (slug !== nextSlug) {
      setFieldValue(targetField, nextSlug, false);
    }
  }, [sourceValue, touchedManually, options, setFieldValue, targetField, slug]);

  return null;
};

export default AutoSlugField;
