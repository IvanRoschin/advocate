import { Social } from '@/types/content.types';

export const getSocials = (): Social => {
  const phone1 = process.env.NEXT_PUBLIC_ADVOCATE_PN_1;
  const phone2 = process.env.NEXT_PUBLIC_ADVOCATE_PN_2;
  const email = process.env.NEXT_PUBLIC_ADVOCATE_EMAIL;
  const facebook = process.env.NEXT_PUBLIC_FACEBOOK_URL;
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  const socials: Social = [
    email && {
      name: 'Email',
      icon: 'email',
      link: `mailto:${email}`,
      essential: true,
    },
    phone1 && {
      name: 'Телефон',
      icon: 'phone',
      link: `tel:${phone1}`,
      essential: true,
    },
    phone2 && {
      name: 'Телефон',
      icon: 'phone',
      link: `tel:${phone2}`,
      essential: true,
    },
    {
      name: 'Telegram',
      icon: 'telegram',
      link: `https://t.me/ivanroschin`,
      essential: true,
    },
    {
      name: 'Viber',
      icon: 'viber',
      link: 'viber://chat?number=%2B380967759569',
      essential: false,
    },
    facebook && {
      name: 'Facebook',
      icon: 'facebook',
      link: facebook,
      essential: false,
    },
    instagram && {
      name: 'Instagram',
      icon: 'instagram',
      link: instagram,
      essential: false,
    },
  ].filter(Boolean) as Social;

  return socials;
};
