export type AdvantageMetric = {
  id: string;
  value: number;
  suffix?: string;
  text: string;
};

export const advantagesSection = {
  id: 'advantages',
  schemaType: 'https://schema.org/LegalService',
  background: {
    src: '/advantages_bg_v1.webp',
    alt: 'Юридичні послуги адвоката',
  },
  header: {
    uptitle: 'Чому обирають мене',
    titleTop: 'Результат, відповідальність',
    titleAccent: 'та повна конфіденційність',
  },
  metrics: [
    {
      id: 'confidentiality',
      value: 100,
      suffix: '%',
      text: 'Гарантія адвокатської конфіденційності',
    },
    {
      id: 'experience',
      value: 10,
      suffix: '+',
      text: 'Років практичного юридичного досвіду',
    },
    {
      id: 'support',
      value: 24,
      suffix: '/7',
      text: 'Постійний звʼязок з клієнтом',
    },
    {
      id: 'practices',
      value: 5,
      suffix: '+',
      text: 'Ключових юридичних практик',
    },
  ] satisfies AdvantageMetric[],
  cta: {
    title: 'Потрібна юридична допомога?',
    text: 'Отримайте первинну консультацію та зрозумійте реальні перспективи вашої справи вже сьогодні.',
    buttonPrefix: 'Зателефонувати адвокату',
  },
};
