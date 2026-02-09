'use client';
import { signOut } from 'next-auth/react';
import { MdLogout } from 'react-icons/md';

import { routes } from '@/app/config/routes';

const SingOutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: `${routes.public.auth.signIn}` })}
      className="nav flex items-center justify-center gap-3"
    >
      {' '}
      <MdLogout />
      Вихід
    </button>
  );
};

export default SingOutButton;
