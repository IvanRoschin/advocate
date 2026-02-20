// import { Column, Line, Row, Text } from "@once-ui-system/core";

import type { Newsletter, Person, Social } from '@/types';

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
  description: <>Листи про юридичні кейси</>,
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
  },
  {
    name: `${phone1Pretty}`,
    icon: 'phone',
    link: `tel:${phone1}`,
    essential: true,
  },
  {
    name: `${phone2Pretty}`,
    icon: 'phone',
    link: `tel:${phone2}`,
    essential: true,
  },
  {
    name: 'Telegram',
    icon: 'telegram',
    link: `https://t.me/ivanroschin`,
    essential: false,
  },
  // За потреби можна додати Telegram/Viber, але лише якщо іконки точно є у вашому /once-ui/icons.ts
  // { name: 'Telegram', icon: 'telegram', link: 'https://t.me/<username>', essential: true },
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
  title: `${person.role} ${person.name} — простір традиції`,
  description:
    'Головна сторінка Адвокат Іван Рощин – професійна правнича допомога у цивільних, господарських та адміністративних справах.',
};

// const about: About = {
//   path: '/about',
//   label: 'Про мене',
//   title: `Про мене — ${person.name}`,
//   description: `${person.name} — ${person.role}, ${person.location}`,
//   tableOfContent: {
//     display: true,
//     subItems: false,
//   },
//   avatar: { display: true },
//   calendar: {
//     display: false,
//     link: 'https://cal.com',
//   },
//   intro: {
//     display: true,
//     title: 'Хто я',
//     description: (
//       <>
//         <Text as="p">
//           Я — жінка, що пам’ятає. За освітою я — вчителька історії, за
//           покликанням — дослідниця українських традицій, знатниця, ладувальниця,
//           майстриня оберегів, прикрас і сакральної випічки.
//         </Text>

//         <Text as="p">
//           Моє серце належить справі збереження та передачі народних звичаїв,
//           живої пам’яті Роду — тих знань, які не читають у підручниках, але
//           відчувають тілом і душею.
//         </Text>

//         <Text as="p">
//           Я — авторка п’яти колод ресурсних метафоричних карт, що допомагають
//           людині віднайти себе, розкрити внутрішній потенціал і зцілити душу
//           через образи, символи та глибинні сенси.
//         </Text>

//         <Text as="p">
//           Я вивчаю й практикую характерницькі практики та українські ведичні
//           знання — як шлях відновлення зв’язку з прадавніми витоками сили, з
//           природою, стихіями та власною суттю.
//         </Text>
//       </>
//     ),
//   },

//   work: {
//     display: true,
//     title: 'Моя унікальність',
//     experiences: [
//       {
//         company: 'Жива українська традиція',
//         timeframe: 'Практика та передача знань',
//         role: 'Ладування простору людини',
//         achievements: [
//           <Text key="ach-1" as="p">
//             Працюю не з запозиченими методиками, а з живою українською
//             традицією, пам’яттю Роду і прадавніми знаннями нашої землі.
//           </Text>,
//           <Text key="ach-2" as="p">
//             Я не просто проводжу сесії — я ладую простір людини: відновлюю
//             зв’язок з тілом, душею, природою і внутрішнім джерелом сили.
//           </Text>,
//           <Text key="ach-3" as="p">
//             У роботі поєдную слово і дію, знання і творіння руками — через
//             обереги, символи, ритуали та сакральні практики.
//           </Text>,
//           <Text key="ach-4" as="p">
//             Працюю не лише з особистістю, а з Родом, родовою пам’яттю і
//             глибинними сценаріями, що формують життя людини.
//           </Text>,
//           <Text key="ach-5" as="p">
//             Мій шлях — не навчати, а допомагати згадати. Не змінювати, а
//             повертати до істинної суті.
//           </Text>,
//         ],
//         images: [],
//       },
//     ],
//   },

//   studies: {
//     display: true,
//     title: 'Напрями, з якими працюю',
//     institutions: [
//       {
//         name: 'Метафоричні карти',
//         description: <>Ресурсні практики, діагностика, пошук рішень.</>,
//       },
//       {
//         name: 'Слов’янські руни',
//         description: <>Діагностика стану та підказки шляху.</>,
//       },
//       {
//         name: 'Енергетичні практики',
//         description: <>Баланс стихій, робота з наміром.</>,
//       },
//       {
//         name: 'Характерницькі практики',
//         description: <>Відновлення зв’язку з прадавніми витоками сили.</>,
//       },
//     ],
//   },

//   technical: {
//     display: true,
//     title: 'Мої послуги',
//     skills: [
//       {
//         title: 'Індивідуальні практики',
//         description: (
//           <>
//             <Text as="p">
//               Формат один на один — для глибокого налаштування під ваш запит,
//               відновлення ресурсу та повернення внутрішньої опори.
//             </Text>

//             <Text as="p" weight="strong">
//               У цьому форматі можливі:
//             </Text>

//             <Column as="ul" gap="8" paddingLeft="16">
//               <Text as="li">
//                 Коучинг / менторство: шлях до себе, розвиток інтуїції, розкриття
//                 жіночої енергії.
//               </Text>
//               <Text as="li">
//                 Сесії з метафоричними картами: діагностика, пошук рішень,
//                 ресурсні практики.
//               </Text>
//               <Text as="li">
//                 Діагностика стану людини за допомогою слов’янських рун.
//               </Text>
//               <Text as="li">
//                 Енергетичні практики: балансування енергії стихій, робота з
//                 наміром.
//               </Text>
//               <Text as="li">Індивідуальні консультації під ваш запит.</Text>
//               <Text as="li">
//                 Практика корекції і енергетичного очищення яйцем.
//               </Text>
//             </Column>
//           </>
//         ),
//         tags: [
//           { name: 'Коучинг', icon: 'sparkles' },
//           { name: 'МАК', icon: 'cards' },
//           { name: 'Руни', icon: 'shield' },
//           { name: 'Енергія', icon: 'sun' },
//         ],
//         images: [],
//       },
//       {
//         title: 'Групові формати',
//         description: (
//           <>
//             <Text as="p">
//               Група — це сила спільного поля. Тут народжується підтримка,
//               ясність і відчуття єднання.
//             </Text>

//             <Text as="p" weight="strong">
//               Формати:
//             </Text>

//             <Column as="ul" gap="8" paddingLeft="16">
//               <Text as="li">
//                 Майстер-клас «Намисто-оберіг» — створення прикраси з символікою
//                 сили та захисту.
//               </Text>
//               <Text as="li">
//                 Майстер-клас «Сакральна обрядова випічка» на житній заквасці.
//               </Text>
//               <Text as="li">
//                 Трансформаційні ігри: особистісний розвиток через гру.
//               </Text>
//               <Text as="li">
//                 Жіночі кола: ритуали, медитації, практика єднання.
//               </Text>
//               <Text as="li">Екскурсії з енергетичними практиками.</Text>
//               <Text as="li">Групові майстер-класи за домовленістю.</Text>
//             </Column>
//           </>
//         ),
//         tags: [
//           { name: 'Майстер-класи', icon: 'wand' },
//           { name: 'Жіночі кола', icon: 'heart' },
//           { name: 'Ігри', icon: 'game' },
//           { name: 'Екскурсії', icon: 'map' },
//         ],
//         images: [],
//       },
//       {
//         title: 'Контакти',
//         description: (
//           <>
//             <Text as="p">📞 {phonePretty} (Телефон, Viber, Telegram)</Text>
//             <Text as="p">✉️ {person.email}</Text>
//           </>
//         ),
//         tags: [
//           { name: 'Запис', icon: 'calendar' },
//           { name: 'Зв’язок', icon: 'phone' },
//         ],
//         images: [],
//       },
//     ],
//   },
// };

// const blog: Blog = {
//   path: '/blog',
//   label: 'Блог',
//   title: 'Думки, спостереження, традиції…',
//   description: `Читайте, чим живе ${person.name} останнім часом`,
// };

// const work: Work = {
//   path: '/work',
//   label: 'Проєкти',
//   title: `Проєкти — ${person.name}`,
//   description: `Практики, формати та події від ${person.name}`,
// };

// const gallery: Gallery = {
//   path: '/gallery',
//   label: 'Галерея',
//   title: `Галерея — ${person.name}`,
//   // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
//   description: `Фото й моменти з мого простору та подій`,
//   images: [
//     // залишив плейсхолдери — заміниш на свої фото
//     {
//       src: '/images/gallery/horizontal-1.jpg',
//       alt: 'image',
//       orientation: 'horizontal',
//     },
//     {
//       src: '/images/gallery/vertical-4.jpg',
//       alt: 'image',
//       orientation: 'vertical',
//     },
//     {
//       src: '/images/gallery/horizontal-3.jpg',
//       alt: 'image',
//       orientation: 'horizontal',
//     },
//     {
//       src: '/images/gallery/vertical-1.jpg',
//       alt: 'image',
//       orientation: 'vertical',
//     },
//     {
//       src: '/images/gallery/vertical-2.jpg',
//       alt: 'image',
//       orientation: 'vertical',
//     },
//     {
//       src: '/images/gallery/horizontal-2.jpg',
//       alt: 'image',
//       orientation: 'horizontal',
//     },
//     {
//       src: '/images/gallery/horizontal-4.jpg',
//       alt: 'image',
//       orientation: 'horizontal',
//     },
//     {
//       src: '/images/gallery/vertical-3.jpg',
//       alt: 'image',
//       orientation: 'vertical',
//     },
//   ],
// };

export { brand, home, logo, newsletter, person, social };
