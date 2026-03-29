import { legalFooter } from '../blocks/legalFooter';
import { baseEmailLayout } from '../layout/baseEmailLayout';

export interface LeadAdminTemplateProps {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
}

export function leadAdminTemplate(props: LeadAdminTemplateProps) {
  return baseEmailLayout({
    title: `🚨 Новий лід з сайту`,
    content: leadAdminContent(props),
    footer: legalFooter(),
  });
}

export function leadAdminContent({
  name,
  email,
  phone,
  message,
  source,
}: LeadAdminTemplateProps) {
  return `
  <p style="font-size: 15px; line-height: 1.6;">
    Ім'я: <strong>${name}</strong> 
  </p>
<p style="font-size: 15px; line-height: 1.6;">
    Надіслав форму з : ${source}
  </p>
  <p style="font-size: 15px; line-height: 1.6;">
    з повідомленням : ${message}
  </p>
  

  <p style="font-size: 15px; line-height: 1.6;">
    Email: <strong>${email}</strong>
  </p>

  <p style="font-size: 15px; line-height: 1.6;">
    Телефон: <strong>${phone}</strong>
  </p>

  <p style="font-size: 15px; line-height: 1.6;">
    Будь ласка, зв'яжіться з клієнтом якнайшвидше.
  </p>
  `;
}
