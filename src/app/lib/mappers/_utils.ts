export const toIdString = (v: unknown): string => {
  if (typeof v === 'string') return v;
  if (typeof v === 'object' && v !== null && 'toString' in v) {
    return (v as { toString(): string }).toString();
  }
  return String(v);
};

export const toIsoString = (v: unknown): string | undefined => {
  if (v == null || v === '') return undefined;

  if (v instanceof Date)
    return Number.isNaN(v.getTime()) ? undefined : v.toISOString();

  if (typeof v === 'string' || typeof v === 'number') {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  }

  if (typeof v === 'object') {
    const obj = v as { valueOf?: () => unknown; toString?: () => string };
    const prim = obj.valueOf?.();
    if (typeof prim === 'string' || typeof prim === 'number') {
      const d = new Date(prim);
      return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
    }
    if (typeof obj.toString === 'function') {
      const s = obj.toString();
      const d = new Date(s);
      return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
    }
  }

  return undefined;
};

export const stringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

export const firstImage = (v: unknown): string | undefined => {
  if (!Array.isArray(v)) return undefined;
  const s = v.find(x => typeof x === 'string' && x.trim());
  return typeof s === 'string' ? s.trim() : undefined;
};

export const sameArray = (
  a?: readonly string[] | null,
  b?: readonly string[] | null
) => {
  const aa = a ?? [];
  const bb = b ?? [];
  if (aa.length !== bb.length) return false;
  for (let i = 0; i < aa.length; i++) if (aa[i] !== bb[i]) return false;
  return true;
};
