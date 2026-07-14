import { legalFooter } from '../blocks/legalFooter';
import { baseEmailLayout } from '../layout/baseEmailLayout';

export interface ReviewAdminTemplateProps {
  authorName: string;
  text: string;
  rating: number;
  targetType: 'service' | 'article';
}

export function reviewAdminTemplate(props: ReviewAdminTemplateProps) {
  return baseEmailLayout({
    title: `🔔 Новий відгук на сайті`,
    content: reviewAdminContent(props),
    footer: legalFooter(),
  });
}

export function reviewAdminContent({
  authorName,
  text,
  rating,
  targetType,
}: ReviewAdminTemplateProps) {
  return `
         <p style="font-size:15px; line-height:1.6;">
        Надійшов новий відгук, який очікує на модерацію.
      </p>

      <p style="font-size:15px; line-height:1.6;">
        <strong>Автор:</strong> ${authorName}<br />
        <strong>Тип:</strong> ${targetType}<br />
        <strong>Оцінка:</strong> ${'★'.repeat(Math.round(rating))}${'☆'.repeat(5 - Math.round(rating))} (${rating})
      </p>

      <p style="font-size:15px; line-height:1.6; background:#f9fafb; border-radius:8px; padding:16px; border-left:3px solid #C89B3C;">
        ${text}
      </p>

      <p style="font-size:14px; line-height:1.6; color:#666;">
        Перейдіть у адмін-панель, щоб підтвердити або відхилити відгук.
      </p>
  `;
}
