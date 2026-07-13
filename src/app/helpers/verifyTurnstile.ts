import { serverEnv } from '@/app/lib/server/env/serverEnv';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';

export async function verifyTurnstile(token: string) {
  const secret = serverEnv.cloudflare.turnstileSecretKey;

  if (!secret) return;

  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    }
  );

  const data = await res.json();

  if (!data.success) {
    throw new ValidationError('Captcha failed');
  }
}
