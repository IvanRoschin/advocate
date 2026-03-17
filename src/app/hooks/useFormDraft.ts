'use client';

import { useState } from 'react';

import { clearFormDraft, loadFormDraft } from '../lib/client/form-draft';

export const useFormDraft = <T>(storageKey: string, enabled: boolean) => {
  const [draft] = useState<Partial<T> | null>(() => {
    if (!enabled) return null;
    return loadFormDraft<T>(storageKey);
  });

  const clearDraft = () => {
    clearFormDraft(storageKey);
  };

  return {
    draft,
    clearDraft,
  };
};
