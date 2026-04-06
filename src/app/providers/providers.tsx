'use client';

import { SessionProvider } from 'next-auth/react';
import { Suspense } from 'react';
import { Toaster } from 'sonner';

import { RouteLoadingReset } from '../components/common/RouteLoadingReset';
import { PremiumLoader } from '../components/ui/loader/PremiumLoader';
import { TopProgressBar } from '../components/ui/top-progress/TopProgressBar';
import { LoadingProvider } from './LoadingProvider';
import { PageTransition } from './PageTransition';
import { ThemeStoreProvider } from './ThemeStoreProvider';
import UserProvider from './UserProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeStoreProvider>
        <LoadingProvider>
          <TopProgressBar />
          <PremiumLoader />

          <Suspense fallback={null}>
            <RouteLoadingReset />
            <UserProvider>
              <PageTransition>{children}</PageTransition>
            </UserProvider>
          </Suspense>

          <Toaster position="top-right" richColors />
        </LoadingProvider>
      </ThemeStoreProvider>
    </SessionProvider>
  );
}
