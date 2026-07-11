'use server';

import nodemailer from 'nodemailer';

import { renderEmailTemplate } from '@/app/templates/email/emailFactory';
import {
  EmailTemplatePropsMap,
  EmailTemplateType,
} from '@/app/templates/email/types';

import { env } from '../env/serverEnv';
import { errorToResponse } from '../errors/errorToResponse';
import { emailMetaMap } from './emailMeta';

interface SendEmailParams<T extends EmailTemplateType> {
  to: string;
  type: T;
  props: EmailTemplatePropsMap[T];
  from?: { name: string; email: string };
}

export async function sendEmail<T extends EmailTemplateType>({
  to,
  type,
  props,
  from,
}: SendEmailParams<T>) {
  const { email, password } = env.smtp;
  if (!email || !password) {
    throw new Error(
      '❌ SMTP_EMAIL and SMTP_PASSWORD must be set in environment variables'
    );
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail', // или другой сервис
    auth: {
      user: email,
      pass: password,
    },
  });

  const meta = emailMetaMap[type];
  if (!meta) throw new Error(`Email meta not found for template: ${type}`);

  const html = renderEmailTemplate(type, props);

  const fromField =
    from?.email && from?.name
      ? { name: from.name, address: from.email }
      : `"Адвокат Іван Рощин" <${email}>`;

  try {
    const result = await transporter.sendMail({
      from: fromField,
      to,
      subject: meta.subject,
      html,
    });

    return result;
  } catch (err) {
    return errorToResponse(err);
    throw err;
  }
}
