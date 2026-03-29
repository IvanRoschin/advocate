import { ValidationError } from '@/app/lib/server/errors/httpErrors';

type RecaptchaVerifyResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
};

class RecaptchaService {
  async verify(token: string): Promise<void> {
    if (!token.trim()) {
      throw new ValidationError('Captcha token missing');
    }

    const secret = process.env.RECAPTCHA_SECRET;

    if (!secret) {
      throw new Error('RECAPTCHA_SECRET is not configured');
    }

    const body = new URLSearchParams({
      secret,
      response: token,
    });

    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    );

    const data = (await response.json()) as RecaptchaVerifyResponse;

    if (!data.success) {
      throw new ValidationError('Captcha failed');
    }
  }
}

export const recaptchaService = new RecaptchaService();
