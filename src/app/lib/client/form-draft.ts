export const safeJsonParse = <T>(raw: string): T | null => {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const loadFormDraft = <T>(storageKey: string): Partial<T> | null => {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return null;

  return safeJsonParse<Partial<T>>(raw);
};

export const saveFormDraft = <T>(
  storageKey: string,
  draft: Partial<T>
): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  } catch {
    // ignore
  }
};

export const clearFormDraft = (storageKey: string): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // ignore
  }
};
