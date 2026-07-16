import { ReactNode } from 'react';

const cardClassName = 'border-border rounded-2xl border bg-card shadow-sm';
const sectionTitleClassName =
  'text-primary text-sm font-semibold tracking-wide';
const helperTextClassName = 'text-secondary text-xs leading-5';

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function AdminFormSection({
  title,
  description,
  children,
  className,
}: Props) {
  return (
    <section className={`${cardClassName} p-4 sm:p-5 ${className ?? ''}`}>
      <div className="mb-4">
        <h3 className={sectionTitleClassName}>{title}</h3>
        {description && (
          <p className={`${helperTextClassName} mt-1`}>{description}</p>
        )}
      </div>

      {children}
    </section>
  );
}
