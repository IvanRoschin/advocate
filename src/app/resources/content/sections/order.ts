import type { IconName } from '@/app/resources/icons';

export const orderSection = {
  id: 'order',
  background: {
    src: '/images/bg/order_bg_v1.webp',
    alt: 'Фонове зображення для замовлення послуги',
  },
  left: {
    uptitle: 'Заповніть форму',
    uptitleIcon: 'calendar' as IconName,
    title: 'Як замовити послугу',
    descriptionLines: [
      'Замовте зворотній звʼязок',
      'Отримайте відповідь протягом години',
    ],
  },
} as const;
