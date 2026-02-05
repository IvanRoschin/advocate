'use client';

import { useField } from 'formik';
import { memo } from 'react';

interface FormikTextareaProps {
  name: string;
  label: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const Textarea = memo(
  ({
    name,
    label,
    rows = 4,
    disabled = false,
    required = false,
    className = '',
  }: FormikTextareaProps) => {
    const [field, meta] = useField(name);
    const hasError = Boolean(meta.touched && meta.error);

    return (
      <div
        className={`relative w-full ${
          disabled ? 'cursor-not-allowed opacity-60' : ''
        } ${className}`}
      >
        <textarea
          {...field}
          id={name}
          rows={rows}
          placeholder=" "
          disabled={disabled}
          className={`peer input-field w-full resize-none rounded-xl px-4 pt-6 pb-2 transition-all duration-300 focus:outline-none ${
            hasError ? 'border-red-500 border-b-red-500' : ''
          }`}
        />

        <label
          htmlFor={name}
          className={`absolute top-2 left-4 origin-left transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:scale-90 ${
            hasError
              ? 'text-label-error'
              : disabled
                ? 'text-label'
                : 'text-label peer-focus:text-label-focus'
          }`}
        >
          {label}
          {required && <span className="ml-1">*</span>}
        </label>

        <p className="mt-1 min-h-4 text-xs text-red-500">
          {meta.touched && meta.error ? meta.error : ' '}
        </p>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
