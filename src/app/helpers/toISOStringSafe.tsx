export const toISOStringSafe = (date?: Date | string | null): string => {
  if (!date) return new Date(0).toISOString();
  if (typeof date === 'string') return date;
  return date.toISOString();
};
