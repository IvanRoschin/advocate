import { memo } from 'react';

import { useField } from 'formik';

interface CheckboxProps {
  name: string;
  children: React.ReactNode;
}

const Checkbox = memo(({ name, children }: CheckboxProps) => {
  const [field, meta] = useField({ name, type: 'checkbox' });

  return (
    <div className="space-y-1">
      <label className="text-app flex cursor-pointer items-start gap-3 text-sm">
        <input
          type="checkbox"
          {...field}
          style={{ accentColor: '#C89B3C' }}
          className="mt-1 h-4 w-4 border-white/30 accent-white"
        />
        <span className="leading-snug">{children}</span>
      </label>
      <p className="mt-1 min-h-4 text-xs text-red-500">
        {meta.touched && meta.error ? meta.error : ' '}
      </p>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
