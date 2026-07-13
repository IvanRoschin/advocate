const UA_COUNTRY_CODE = '+380';

/**
 * Приводить український номер до формату +380XXXXXXXXX.
 * Приймає: 0961983729, 380961983729, +380961983729, з пробілами/дужками/дефісами.
 * Якщо формат не розпізнано — повертає обрізаний ввід як є.
 */
export function normalizePhoneUA(rawPhone: string): string {
  const digitsOnly = rawPhone.replace(/\D/g, '');

  if (digitsOnly.startsWith('380') && digitsOnly.length === 12) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
    return `${UA_COUNTRY_CODE}${digitsOnly.slice(1)}`;
  }

  return rawPhone.trim();
}
