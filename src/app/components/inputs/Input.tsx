import { memo, ReactNode } from 'react';

import { useField } from 'formik';

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
    const hasError = meta.touched && meta.error;

    return (
      <div className={`relative w-full ${className}`}>
        {prefixIcon && (
          <span className="absolute top-4 left-3 z-10">{prefixIcon}</span>
        )}
        <input
          {...field}
          id={name}
          type={type}
          disabled={disabled}
          placeholder=" "
          className={`peer bg-app text-app w-full rounded-xl border px-4 pt-6 pb-2 transition-all duration-300 focus:outline-none ${
            prefixIcon ? 'pl-10' : 'pl-4'
          } ${hasError ? 'border-red-500 focus:ring-red-500/30' : 'border-accent/30 focus:border-accent focus:ring-accent/30'} focus:ring-2`}
        />
        <label
          htmlFor={name}
          className={`absolute top-2 left-2 origin-left text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:scale-90 ${
            prefixIcon ? 'left-10' : ''
          } ${hasError ? 'text-red-500' : 'text-app/60 peer-focus:text-accent'}`}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
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
