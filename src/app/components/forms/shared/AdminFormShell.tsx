'use client';

import { ReactNode } from 'react';

import Btn from '@/app/components/ui/button/Btn';

type Props = {
  title: string;
  description?: string;
  onClose?: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  debugHint?: ReactNode;
  children: ReactNode;
};

export default function AdminFormShell({
  title,
  description,
  onClose,
  submitLabel,
  isSubmitting = false,
  submitDisabled = false,
  debugHint,
  children,
}: Props) {
  return (
    <div className="text-primary w-full">
      <div className="mb-4">
        <h2 className="text-primary text-xl font-semibold">{title}</h2>
        {description && (
          <p className="text-secondary mt-1 text-sm">{description}</p>
        )}
      </div>

      <div className="flex max-h-[85vh] w-full flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="space-y-3">{children}</div>

          {debugHint && (
            <div className="border-border text-secondary bg-muted/40 mt-3 rounded-2xl border px-4 py-3 text-sm">
              {debugHint}
            </div>
          )}
        </div>

        <div className="border-border bg-card sticky bottom-0 mt-4 flex flex-wrap items-center justify-end gap-2 border-t pt-4">
          {onClose && (
            <Btn
              type="button"
              label="Скасувати"
              uiVariant="ghost"
              onClick={onClose}
            />
          )}

          <Btn
            uiVariant="accent"
            radius={12}
            type="submit"
            label={isSubmitting ? 'Збереження...' : submitLabel}
            disabled={isSubmitting || submitDisabled}
          />
        </div>
      </div>
    </div>
  );
}
