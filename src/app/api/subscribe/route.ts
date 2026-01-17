import { NextResponse } from 'next/server';

import { validate } from '@/app/helpers/validate';
import { subscriberSchema } from '@/app/helpers/validation-schemas/index';
import { ValidationError } from '@/app/lib/errors/http-errors';
import { sendMail } from '@/app/lib/send-mail';
import { sendTelegramMessage } from '@/app/lib/send-telegram';
import { Subscriber } from '@/app/models/index';
import type { ApiResponse } from '@/lib/api-response';
import { errorToResponse } from '@/lib/errors/error-to-response';
import { connectDB } from '@/lib/mongoose';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'advocate.roschin@gmail.com';

async function verifyRecaptcha(token: string) {
  if (!process.env.RECAPTCHA_SECRET) return; // пропускаем если нет ключа
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
  });
  const data = await res.json();
  if (!data.success) throw new ValidationError('Captcha failed');
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = (await req.json()) as {
      email: string;
      recaptchaToken?: string;
      consent?: boolean;
      website?: string; // honeypot
    };

    // 🐝 Honeypot
    if (body.website) throw new ValidationError('Bot detected');

    // ✅ reCAPTCHA
    if (body.recaptchaToken) await verifyRecaptcha(body.recaptchaToken);

    // ✅ Валидация email и consent
    const data = await validate(subscriberSchema, body);

    // проверяем, есть ли уже подписчик
    let subscriber = await Subscriber.findOne({ email: data.email });
    if (subscriber) {
      if (!subscriber.subscribed) {
        subscriber.subscribed = true;
        await subscriber.save();
      }
    } else {
      subscriber = await Subscriber.create(data);
    }

    // ✉️ Отправка уведомления админу
    sendMail({
      to: ADMIN_EMAIL,
      subject: '🚨 Новый подписчик на рассылку',
      body: `Новый подписчик: ${data.email}`,
    }).catch(console.error);

    // ✉️ Telegram уведомление
    sendTelegramMessage(`🚨 Новый подписчик: ${data.email}`).catch(
      console.error
    );

    return NextResponse.json<ApiResponse<typeof subscriber>>(
      { ok: true, data: subscriber.toObject() },
      { status: 201 }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}
