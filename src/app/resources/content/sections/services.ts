import type { IconName } from '@/app/resources/icons';

export type ServiceItem = {
  id: string;
  icon: IconName;
  title: string;
  text: string;
  /** slug сторінки послуги; ціна береться з SERVICE_PRICES за цим slug */
  slug?: string;
};

// Порядок — від найзатребуваніших напрямів практики.
export const servicesSection = {
  id: 'services',
  moreLabel: 'Детальніше',
  items: [
    {
      id: 'debt-collection',
      icon: 'payments',
      title: 'Стягнення боргів',
      text: 'Розписки, позики, договори: претензія, суд і примусове виконання',
      slug: 'styahnennya-borhu',
    },
    {
      id: 'contracts',
      icon: 'disputes',
      title: 'Договори та господарські спори',
      text: 'Аналіз і підготовка договорів, представництво бізнесу в суді',
      slug: 'perevirka-ta-analiz-dohovoriv',
    },
    {
      id: 'family',
      icon: 'family',
      title: 'Сімейні спори',
      text: 'Розлучення, поділ майна, аліменти, місце проживання дитини',
      slug: 'podil-mayna-podruzhzhya',
    },
    {
      id: 'inheritance',
      icon: 'inheritance',
      title: 'Спадщина',
      text: 'Оформлення спадщини, поновлення строку, спори між спадкоємцями',
      slug: 'oformlennya-spadshchyny',
    },
  ] satisfies ServiceItem[],
};
