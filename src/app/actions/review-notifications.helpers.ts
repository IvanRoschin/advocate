import { createEntityNotifier } from '@/app/lib/server/notifications/createEntityNotifier';
import { EmailTemplateType } from '@/app/templates/email/types';
import 'server-only';

type ReviewNotifyData = {
  authorName: string;
  text: string;
  rating: number;
  targetType: 'service' | 'article';
};

export const notifyReviewCreated = createEntityNotifier<ReviewNotifyData>({
  adminEmail: data => ({
    type: EmailTemplateType.REVIEW_ADMIN,
    props: {
      authorName: data.authorName,
      text: data.text,
      rating: data.rating,
      targetType: data.targetType === 'service' ? 'Послуга' : 'Стаття',
    },
  }),

  telegramMessage: data =>
    [
      '⭐ <b>Новий відгук на модерацію</b>',
      `Автор: ${data.authorName}`,
      `Рейтинг: ${data.rating}`,
      `Тип: ${data.targetType === 'service' ? 'Послуга' : 'Стаття'}`,
      `Текст: ${data.text}`,
    ].join('\n'),
});
