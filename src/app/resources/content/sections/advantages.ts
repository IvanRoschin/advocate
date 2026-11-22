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
    src: '/images/bg/advantages_bg_v1.webp',
    alt: 'Юридичні послуги адвоката',
  },
  header: {
    uptitle: 'Факти, а не обіцянки',
    titleTop: 'Досвід, швидка реакція',
    titleAccent: 'та адвокатська таємниця',
  },
  metrics: [
    {
      id: 'experience',
      value: 10,
      suffix: '+',
      text: 'Років адвокатської практики',
    },
    {
      id: 'response',
      value: 1,
      suffix: ' год',
      text: 'Відповідь на звернення в робочий час',
    },
    {
      id: 'practices',
      value: 4,
      text: 'Напрями: борги, договори, сімейні та спадкові спори',
    },
    {
      id: 'confidentiality',
      value: 100,
      suffix: '%',
      text: 'Адвокатська таємниця — обовʼязок адвоката за законом',
    },
  ] satisfies AdvantageMetric[],
  cta: {
    title: 'Потрібна юридична допомога?',
    text: 'Отримайте первинну консультацію та зрозумійте реальні перспективи вашої справи вже сьогодні.',
    buttonPrefix: 'Зателефонувати адвокату',
  },
};
