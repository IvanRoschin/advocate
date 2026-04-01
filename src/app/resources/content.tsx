import type { Blog, ContactContent, Newsletter, Person, Social } from '@/types';

type PaymentDetail = {
  label: string;
  value: string;
  mono?: boolean;
};

type BlogContent = Blog & {
  eyebrow: string;
  heading: string;
  lead: string;
  aside: {
    categoriesTitle: string;
    emptyCategories: string;
    newsletterTitle: string;
    newsletterDescription: string;
    recentTitle: string;
    emptyRecent: string;
  };
};

type PaymentContent = {
  path: string;
  image: string;
  label: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  lead: string;
  details: PaymentDetail[];
  notesTitle: string;
  notes: string[];
  aside: {
    title: string;
    description: string;
    contactHref: string;
    contactLabel: string;
    phoneHref: string;
    phoneLabel: string;
    footnote: string;
  };
};

const person: Person = {
  firstName: 'Іван',
  lastName: 'Рощин',
  name: 'Іван Рощин',
  role: 'Адвокат',
  avatar: '/images/ivan_roschin.webp',
  email: 'advocate.roschin@gmail.com',
  location: 'Україна, м. Київ',
  timeZone: 'Europe/Kyiv',
  languages: ['Українська'],
};

const newsletter: Newsletter = {
  display: true,
  title: <>Підписатися на розсилку</>,
  description: <>Нові статті, практичні роз’яснення та юридичні нотатки.</>,
};

const phone1 = '0951983729';
const phone2 = '0961983729';

const phone1Pretty = '+380 95 198 37 29';
const phone2Pretty = '+380 96 198 37 29';

const social: Social = [
  {
    name: 'Email',
    icon: 'email',
    link: `mailto:${person.email}`,
    essential: false,
    visible: false,
  },
  {
    name: phone1Pretty,
    icon: 'phone',
    link: `tel:${phone1}`,
    essential: true,
  },
  {
    name: phone2Pretty,
    icon: 'phone',
    link: `tel:${phone2}`,
    essential: true,
  },
  {
    name: 'Telegram',
    icon: 'telegram',
    link: 'https://t.me/ivanroschin',
    essential: false,
  },
  {
    name: 'Viber',
    icon: 'viber',
    link: 'viber://chat?number=%2B380967759569',
    essential: false,
  },
  {
    name: 'Instagram',
    icon: 'instagram',
    link: '',
    essential: false,
  },
  {
    name: 'Facebook',
    icon: 'facebook',
    link: '',
    essential: false,
  },
];

const logo = {
  logoBlack: '/images/logo/logo_black_bg.webp',
  logoWhite: '/images/logo/logo_white_bg.webp',
};

const brand = {
  logoSrc: '/images/brand/logo.svg',
  label: 'Завантаження…',
};

const home = {
  path: '/',
  image: '/images/ivan_roschin.webp',
  label: 'Головна',
  title: `${person.role} ${person.name} — правнича допомога та представництво інтересів`,
  description:
    'Адвокат Іван Рощин — юридична допомога, консультації, підготовка процесуальних документів і представництво у цивільних, господарських та адміністративних справах.',
};

const blog: BlogContent = {
  path: '/blog',
  label: 'Блог',
  title: `Блог — ${person.role} ${person.name}`,
  description: `Статті, роз’яснення законодавства, практичні кейси та юридичні коментарі від ${person.name}.`,
  eyebrow: 'Блог',
  heading: 'Юридичні статті, роз’яснення та практика',
  lead: 'У блозі публікуються матеріали про застосування законодавства, практичні правові ситуації, процесуальні питання та інші теми, які можуть бути корисними для клієнтів і колег.',
  aside: {
    categoriesTitle: 'Категорії',
    emptyCategories: 'Категорії відсутні',
    newsletterTitle: 'Підписка на нові матеріали',
    newsletterDescription:
      'Отримуйте нові статті, практичні роз’яснення та короткі юридичні нотатки.',
    recentTitle: 'Останні публікації',
    emptyRecent: 'Публікації відсутні',
  },
};

const payment: PaymentContent = {
  path: '/payment',
  image: '/images/ivan_roschin.webp',
  label: 'Оплата',
  title: `Оплата послуг — ${person.role} ${person.name}`,
  description:
    'Реквізити для оплати юридичних консультацій та правничої допомоги. Перед оплатою узгодьте суму, формат послуги та призначення платежу.',
  eyebrow: 'Оплата послуг',
  heading: 'Реквізити для оплати юридичної допомоги',
  lead: 'На цій сторінці розміщено реквізити для оплати консультацій, підготовки документів та інших юридичних послуг. Перед здійсненням платежу рекомендовано попередньо узгодити суму, формат послуги та призначення платежу.',
  details: [
    {
      label: 'Отримувач',
      value: 'Іван Рощин',
    },
    {
      label: 'IBAN',
      value: 'UA55 305 2990 0000 2600 1010 1213 24',
      mono: true,
    },

    {
      label: 'РНОКПП',
      value: '3146909540',
      mono: true,
    },
    {
      label: 'Банк',
      value: 'АТ КБ "ПриватБанк"',
    },
    {
      label: 'Призначення платежу',
      value: 'Оплата юридичних послуг',
    },
  ],
  notesTitle: 'Важливо перед оплатою',
  notes: [
    'Перед переказом коштів перевірте коректність реквізитів і суму платежу.',
    'У призначенні платежу бажано зазначати назву послуги або інше погоджене формулювання.',
    'Якщо вам потрібні рахунок, підтвердження або інші супровідні документи, це варто узгодити до моменту оплати.',
    'Після оплати збережіть квитанцію або скриншот до підтвердження зарахування коштів.',
  ],
  aside: {
    title: 'Потрібне уточнення щодо оплати?',
    description:
      'Якщо у вас виникли питання щодо реквізитів, суми платежу, формату послуги або підтвердження оплати, зв’яжіться перед здійсненням переказу.',
    contactHref: '/contact',
    contactLabel: 'Зв’язатися для уточнення',
    phoneHref: `tel:${phone1}`,
    phoneLabel: 'Зателефонувати',
    footnote:
      'Рекомендується зберегти підтвердження платежу до моменту остаточного підтвердження зарахування коштів.',
  },
};

const contact: ContactContent = {
  path: '/contact',
  label: 'Контакти',
  title: `Контакти — ${person.role} ${person.name}`,
  description:
    'Контактна інформація, консультації, запис на прийом та способи зв’язку для отримання юридичної допомоги.',
  eyebrow: 'Контакти',
  heading: 'Контакти та юридична консультація',
  lead: 'Зв’яжіться зручним для вас способом для консультації, правового супроводу або запису на прийом.',

  phone: phone1,
  phonePretty: phone1Pretty,
  phoneSecondary: phone2,
  phoneSecondaryPretty: phone2Pretty,

  email: person.email,
  address: 'м. Київ, вул. Антоновича, 47',
  city: 'Київ',
  region: 'Київська область',
  postalCode: '03150',
  country: 'UA',

  latitude: 50.4501,
  longitude: 30.5234,

  workHours: [
    { day: 'Понеділок — П’ятниця', hours: '09:00 — 18:00' },
    { day: 'Субота', hours: 'За попереднім записом' },
    { day: 'Неділя', hours: 'Вихідний' },
  ],

  mapEmbedUrl:
    'https://www.google.com/maps/d/embed?mid=1jxiKyVm9tBik41i5K1Ecu3XxK3i3yBw&ehbc=2E312F',

  seo: {
    title: 'Контакти',
    description:
      'Контактна інформація, консультації, запис на прийом та способи зв’язку для отримання юридичної допомоги.',
    canonical: '/contact',
    openGraph: {
      title: 'Контакти',
      description:
        'Зв’яжіться для отримання юридичної консультації та правової допомоги.',
      url: '/contact',
      type: 'website',
    },
  },

  structuredData: {
    organizationName: 'Advocate Ivan Roschin',
    siteUrl: 'https://roschin.com.ua',
  },
};

export {
  blog,
  brand,
  contact,
  home,
  logo,
  newsletter,
  payment,
  person,
  social,
};
export type { BlogContent, PaymentContent, PaymentDetail };
