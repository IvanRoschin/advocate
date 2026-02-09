'use client';

import { Field, useField } from 'formik';
import { memo, ReactNode } from 'react';

interface InputProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  prefixIcon?: ReactNode;
  className?: string;
  type?: string;
  autoComplete?: string;
}

const Input = memo(function Input({
  name,
  label,
  required = false,
  disabled = false,
  prefixIcon,
  className = '',
  type,
  autoComplete,
}: InputProps) {
  const [, meta] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className={`relative w-full ${className}`}>
      {prefixIcon && (
        <span className="absolute top-3 left-3 z-10">{prefixIcon}</span>
      )}

      <Field
        id={name}
        type={type}
        name={name}
        autoComplete={autoComplete}
        disabled={disabled}
        placeholder=" "
        className={`peer input-field w-full rounded-xl px-4 pt-6 pb-2 transition-all ${prefixIcon ? 'pl-10' : 'pl-4'} ${hasError ? 'border-red-500' : ''} ${disabled ? 'cursor-not-allowed opacity-60' : ''} `}
      />

      <label
        htmlFor={name}
        className={`absolute top-2 left-4 origin-left transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:scale-90 ${hasError ? 'text-label-error' : 'text-label peer-focus:text-label-focus'} `}
      >
        {label}
        {required && <span className="ml-1">*</span>}
      </label>

      <p className="mt-1 min-h-4 text-xs text-red-500">
        {hasError ? meta.error : ' '}
      </p>
    </div>
  );
});

export default Input;
