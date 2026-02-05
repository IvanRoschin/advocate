'use client';

import { useField } from 'formik';
import { memo } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormikSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const Select = memo(
  ({
    name,
    label,
    options,
    disabled = false,
    required = false,
    className = '',
  }: FormikSelectProps) => {
    const [field, meta] = useField(name);
    const hasError = Boolean(meta.touched && meta.error);

    return (
      <div
        className={`relative w-full ${
          disabled ? 'cursor-not-allowed opacity-60' : ''
        } ${className}`}
      >
        <select
          {...field}
          id={name}
          disabled={disabled}
          className={`peer input-field w-full appearance-none rounded-xl px-4 pt-6 pb-2 transition-all duration-300 focus:outline-none ${
            hasError ? 'border-red-500 border-b-red-500' : ''
          }`}
        >
          <option value="" disabled hidden />
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

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

        {/* caret */}
        <span className="pointer-events-none absolute top-6 right-4 text-xs opacity-70">
          ▼
        </span>

        <p className="mt-1 min-h-4 text-xs text-red-500">
          {meta.touched && meta.error ? meta.error : ' '}
        </p>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
