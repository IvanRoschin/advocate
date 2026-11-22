export const heroSection = {
  id: 'hero',
  schemaType: 'https://schema.org/LegalService',
  portrait: {
    src: '/images/ivan_roschin.webp',
    alt: 'Адвокат Іван Рощин',
  },
  header: {
    uptitle: 'Адвокат Іван Рощин • Київ та онлайн по всій Україні',
    title: 'Стягнення боргів і господарські спори',
    titleAccent: 'повертаю гроші через суд і виконавче провадження',
  },
  subtitle:
    'Борги за розписками, позиками та договорами, спори між бізнесом, договірна робота, сімейні та спадкові справи. Понад 10 років практики.',
  facts: [
    '10+ років адвокатської практики',
    'Бізнес і приватні клієнти',
    'Відповідь протягом години в робочий час',
  ],
  cta: {
    primary: {
      label: 'Розповісти про ситуацію',
      route: 'order',
    },
    secondary: {
      label: 'Зателефонувати',
      // href берём из social (не храним тут)
      uiVariant: 'outline',
    },
    messengersLabel: 'Або напишіть у месенджер:',
  },
  consultationSlug: 'yurydychna-konsultatsiya-advokata',
  note: 'Адвокатська таємниця гарантована законом',
} as const;
