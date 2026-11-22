/**
 * Людський вигляд телефону з tel:-посилання або «сирого» номера.
 * tel:+380951983729 → +380 95 198 37 29. Інші формати повертає як є (без tel:).
 */
export const formatPhone = (value: string): string => {
  const raw = value.replace(/^tel:/, '').trim();
  const digits = raw.replace(/\D/g, '');

  const ua = digits.match(/^380(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (ua) return `+380 ${ua[1]} ${ua[2]} ${ua[3]} ${ua[4]}`;

  return raw;
};
