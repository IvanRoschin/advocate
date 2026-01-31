'use client';

import { useField } from 'formik';
import { memo, ReactNode } from 'react';

interface FormikInputProps {
  name: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  prefixIcon?: ReactNode;
  className?: string;
}

const Input = memo(
  ({
    name,
    label,
    type = 'text',
    disabled = false,
    required = false,
    prefixIcon,
    className = '',
  }: FormikInputProps) => {
    const [field, meta] = useField(name);
    const hasError = Boolean(meta.touched && meta.error);

    return (
      <div
        className={`relative w-full ${
          disabled ? 'cursor-not-allowed opacity-60' : ''
        } ${className}`}
      >
        {prefixIcon && (
          <span
            className={`absolute top-4 left-3 z-10 transition-opacity ${
              disabled ? 'opacity-50' : ''
            }`}
          >
            {prefixIcon}
          </span>
        )}

        <input
          {...field}
          id={name}
          type={type}
          placeholder=" "
          disabled={disabled}
          className={`peer input-field w-full rounded-xl px-4 pt-6 pb-2 transition-all duration-300 focus:outline-none ${prefixIcon ? 'pl-10' : 'pl-4'} ${hasError ? 'border-red-500 border-b-red-500' : ''} `}
        />

        <label
          htmlFor={name}
          className={`absolute top-2 origin-left transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:scale-90 ${prefixIcon ? 'left-10' : 'left-4'} ${
            hasError
              ? 'text-label-error'
              : disabled
                ? 'text-label'
                : 'text-label peer-focus:text-label-focus'
          } `}
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

Input.displayName = 'Input';

export default Input;
