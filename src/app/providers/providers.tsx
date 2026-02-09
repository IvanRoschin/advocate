'use client';

import { SessionProvider } from 'next-auth/react';
import { Suspense } from 'react';
import { Toaster } from 'sonner';

import { Loader } from '@/components';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <Suspense fallback={<Loader />}>
        {children}
        <Toaster position="top-right" richColors />
      </Suspense>
    </SessionProvider>
  );
}
