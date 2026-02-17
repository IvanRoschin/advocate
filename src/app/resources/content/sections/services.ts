import type { IconName } from '@/app/resources/icons';

export type ServiceItem = {
  id: string;
  icon: IconName;
  title: string;
  text: string;
};

export const servicesSection = {
  id: 'services',
  items: [
    {
      id: 'registration',
      icon: 'registered',
      title: 'Реєстрація бізнесу',
      text: 'Реєстрація ФОП, ТОВ, зміна керівника, адреси, КВЕД',
    },
    {
      id: 'support',
      icon: 'briefcaseBusiness',
      title: 'Супроводження бізнесу',
      text: 'Розробка бізнес-моделі, підготовка проектів договорів, аналіз запропонованого договору',
    },
    {
      id: 'commercial-disputes',
      icon: 'boringCompany',
      title: 'Господарські спори',
      text: 'Відшкодування шкоди внаслідок невиконання договірних зобов’язань, представництво в суді',
    },
    {
      id: 'civil-disputes',
      icon: 'people',
      title: 'Цивільні спори',
      text: 'Сімейні, спадкові спори, спори, що виникають з договірних та позадоговірних зобов’язань',
    },
  ] satisfies ServiceItem[],
};
