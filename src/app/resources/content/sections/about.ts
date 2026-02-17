export type AboutSection = {
  id: string;
  schemaType: string;

  header: {
    uptitle: string;
    title: string;
  };

  image: {
    src: string;
    alt: string;
    sizes: string;
  };

  lead: {
    titleParts: {
      a: string;
      accent1: string;
      b: string;
      accent2: string;
    };
  };

  paragraphs: string[];

  bullets: string[];

  signature: {
    label: string;
    name: string;
  };
};

export const aboutSection: AboutSection = {
  id: 'about',
  schemaType: 'https://schema.org/LegalService',

  header: {
    uptitle: 'інформація про адвоката',
    title: 'Основні принципи моєї роботи',
  },

  image: {
    src: '/images/ivan_roschin.webp',
    alt: 'Адвокат Рощин Іван Геннадійович',
    sizes: '(max-width: 640px) 280px, 360px',
  },

  lead: {
    titleParts: {
      a: 'Надійний ',
      accent1: 'захист',
      b: ' Вашої позиції',
      accent2: 'правовими аргументами',
    },
  },

  paragraphs: [
    'Адвокат із досвідом юридичної практики понад 10 років. Надаю правову допомогу бізнесу та фізичним особам.',
    'Спеціалізуюсь у сфері цивільного та господарського права. Представляю інтереси клієнтів у спорах щодо:',
    'Працюю виключно в межах закону та будую співпрацю на принципах відповідальності, чесності та взаємоповаги.',
  ],

  bullets: [
    'відшкодування шкоди;',
    'договірних і позадоговірних зобовʼязань;',
    'сімейних, спадкових та житлових спорів;',
    'кредитних правовідносин.',
  ],

  signature: {
    label: 'Ваш адвокат',
    name: 'Ivan Roschin',
  },
};
