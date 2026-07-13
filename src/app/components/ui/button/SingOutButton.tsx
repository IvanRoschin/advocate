'use client';

import { signOut } from 'next-auth/react';
import { MdLogout } from 'react-icons/md';

import { routes } from '@/app/config/routes';
import { useUserStore } from '@/app/store/user.store';

const SignOutButton = () => {
  const clearUser = useUserStore(state => state.clearUser);

  const handleSignOut = async () => {
    clearUser();
    await signOut({ callbackUrl: routes.public.home });
  };

  return (
    <button
      onClick={handleSignOut}
      className="nav flex items-center justify-center gap-3"
    >
      <MdLogout />
      Вихід
    </button>
  );
};

export default SignOutButton;
