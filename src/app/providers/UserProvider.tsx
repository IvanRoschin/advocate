'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { useUserStore } from '@/app/store/user.store';

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const setUser = useUserStore(state => state.setUser);
  const clearUser = useUserStore(state => state.clearUser);

  useEffect(() => {
    if (session?.user?.id) {
      setUser({
        id: session.user.id,
        role: session.user.role ?? '',
        phone: session.user.phone ?? '',
        surname: session.user.surname ?? '',
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      });
    } else {
      clearUser();
    }
  }, [session, setUser, clearUser]);

  return <>{children}</>;
}
