export const heroSection = {
  id: 'hero',
  schemaType: 'https://schema.org/LegalService',
  background: {
    src: '/images/bg/hero_bg.webp',
    alt: 'Hero background',
  },
  header: {
    uptitle: 'Адвокатська допомога • Захист інтересів • Результат',
    title: 'Адвокат у складних правових ситуаціях',
  },
  subtitle:
    'Захищаю ваші права, мінімізую ризики та доводжу справи до результату. Конфіденційно. Професійно. Законно.',
  cta: {
    primary: {
      label: 'Отримати консультацію',
      route: 'order',
    },
    secondary: {
      label: 'Зателефонувати зараз',
      // href берём из social (не храним тут)
      uiVariant: 'outline',
    },
  },
  note: 'Первинна консультація • Адвокатська таємниця гарантована',
} as const;
