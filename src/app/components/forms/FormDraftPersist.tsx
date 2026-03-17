'use client';

import { useEffect, useRef } from 'react';

import { saveFormDraft } from '@/app/lib/client/form-draft';

type Props<TValues> = {
  storageKey: string;
  values: TValues;
  enabled?: boolean;
  delayMs?: number;
  serialize?: (values: TValues) => Partial<TValues>;
  shouldSave?: (values: TValues) => boolean;
  onSaveError?: (error: unknown) => void;
};

function FormDraftPersist<TValues>({
  storageKey,
  values,
  enabled = true,
  delayMs = 400,
  serialize,
  shouldSave,
  onSaveError,
}: Props<TValues>) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (shouldSave && !shouldSave(values)) return;

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      try {
        const payload = serialize ? serialize(values) : values;
        saveFormDraft(storageKey, payload);
      } catch (error) {
        onSaveError?.(error);
      }
    }, delayMs);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    delayMs,
    enabled,
    onSaveError,
    serialize,
    shouldSave,
    storageKey,
    values,
  ]);

  return null;
}

export default FormDraftPersist;
