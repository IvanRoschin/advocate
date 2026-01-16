import { NextResponse } from 'next/server';

import { validate } from '@/app/helpers/validate';
import leadSchema from '@/app/helpers/validation-schemas/lead-schema';
import { ValidationError } from '@/app/lib/errors/http-errors';
import {
  leadAdminTemplate,
  leadClientTemplate,
} from '@/app/lib/mail-templates/index';
import { sendMail } from '@/app/lib/send-mail';
import { LeadRequestBody } from '@/app/types/lead-request';
import type { ApiResponse } from '@/lib/api-response';
import { errorToResponse } from '@/lib/errors/error-to-response';
import { connectDB } from '@/lib/mongoose';
import { Lead } from '@/models';
const ADMIN_EMAIL = 'advocate.roschin@gmail.com';
const RATE_LIMIT = 30_000; // 30 секунд
const requests: Record<string, number> = {}; // in-memory, для продакшена лучше Redis

async function verifyRecaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET!;
  const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`,
  });
  const data = await res.json();
  if (!data.success || (data.score && data.score < 0.5)) {
    throw new ValidationError('Captcha failed');
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError('Invalid JSON body');
    }

    const payload = body as LeadRequestBody;

    // 🐝 Honeypot
    if (payload.website) throw new ValidationError('Bot detected');

    // ⏱ Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (requests[ip] && Date.now() - requests[ip] < RATE_LIMIT) {
      throw new ValidationError('Too many requests');
    }
    requests[ip] = Date.now();

    // ✅ reCAPTCHA проверка
    if (!payload.recaptchaToken)
      throw new ValidationError('Captcha token missing');
    await verifyRecaptcha(payload.recaptchaToken);

    const data = await validate(leadSchema, body);
    const lead = await Lead.create(data);

    // ✉️ письма
    sendMail({
      to: data.email,
      subject: 'Ми отримали вашу заявку',
      body: leadClientTemplate({ name: data.name }),
    }).catch(console.error);

    sendMail({
      to: ADMIN_EMAIL,
      subject: '🚨 Новий лід з сайту',
      body: leadAdminTemplate({
        name: data.name,
        email: data.email,
        phone: data.phone,
      }),
    }).catch(console.error);

    return NextResponse.json<ApiResponse<typeof lead>>(
      { ok: true, data: lead.toObject() },
      { status: 201 }
    );
  } catch (err) {
    return errorToResponse(err);
  }
}
