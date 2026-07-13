import { ValidationError } from 'yup';

export async function checkHoneypot(website?: string): Promise<void> {
  if (website?.trim()) {
    throw new ValidationError('Bot detected');
  }
}
