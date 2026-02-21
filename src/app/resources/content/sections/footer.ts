import type { PublicStringRouteKey } from '@/app/config/routes';

export type FooterQuickLink = {
  id: string;
  title: string;
  route: PublicStringRouteKey;
};

export const footerSection = {
  brand: {
    text: 'Я вірю у Ваш успіх і готовий підтримати Вашу позицію правовими аргументами.',
  },
  columns: {
    practices: {
      title: 'Мої практики',
      items: [
        { id: 'family', title: 'Сімейне право' },
        { id: 'criminal', title: 'Кримінальне право' },
        { id: 'civil', title: 'Цивільні спори' },
      ],
    },
    quickLinks: {
      title: 'Швидкі посилання',
      items: [
        { id: 'about', title: 'Про мене', route: 'about' as const },
        { id: 'practices', title: 'Послуги', route: 'practices' as const },
        { id: 'contact', title: 'Контакти', route: 'contact' as const },
      ] satisfies FooterQuickLink[],
    },
    contacts: {
      title: 'Мої контакти',
      locationLabel: '📍 Київ, Україна',
    },
  },
  bottom: {
    rights: 'Всі права захищені',
  },
} as const;
