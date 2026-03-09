'use client';

import { useField, useFormikContext } from 'formik';
import { memo } from 'react';

type ArticleFormValues = {
  tagsInput: string;
  tags: string[];
};

const parseTags = (raw: string): string[] =>
  raw
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

interface TagsInputFieldProps {
  name: 'tagsInput';
  label: string;
  className?: string;
  placeholder?: string;
}

const TagsInputField = memo(function TagsInputField({
  name,
  label,
  className = '',
  placeholder,
}: TagsInputFieldProps) {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext<ArticleFormValues>();
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className={`relative w-full ${className}`}>
      <input
        {...field}
        id={name}
        type="text"
        placeholder={placeholder ?? ' '}
        onChange={e => {
          const value = e.target.value;
          setFieldValue('tagsInput', value);
          setFieldValue('tags', parseTags(value));
        }}
        className={`peer input-field w-full rounded-xl px-4 pt-6 pb-2 transition-all ${
          hasError ? 'border-red-500' : ''
        }`}
      />

      <label
        htmlFor={name}
        className={`absolute top-2 left-4 origin-left transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:scale-90 ${
          hasError
            ? 'text-label-error'
            : 'text-label peer-focus:text-label-focus'
        }`}
      >
        {label}
      </label>

      <p className="mt-1 min-h-4 text-xs text-red-500">
        {hasError ? meta.error : ' '}
      </p>
    </div>
  );
});

export default TagsInputField;
