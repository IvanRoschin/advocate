import { Social } from '@/types/content.types';

import { serverEnv } from '../lib/server/env/serverEnv';

export const getSocials = (): Social => {
  const phone1 = serverEnv.advocatePhone1;
  const phone2 = serverEnv.advocatePhone2;
  const email = serverEnv.advocateEmail;
  const facebook = serverEnv.facebookUrl;
  const instagram = serverEnv.instagramUrl;

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
