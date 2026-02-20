'use client';

import { SessionProvider } from 'next-auth/react';
import { Suspense } from 'react';
import { Toaster } from 'sonner';

import { PremiumLoader } from '../components/ui/loader/PremiumLoader';
import { TopProgressBar } from '../components/ui/top-progress/TopProgressBar';
import { LoadingProvider } from './LoadingProvider';
import { PageTransition } from './PageTransition';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <LoadingProvider>
        <TopProgressBar />
        <PremiumLoader />

        <Suspense fallback={null}>
          <PageTransition>{children}</PageTransition>
        </Suspense>

        <Toaster position="top-right" richColors />
      </LoadingProvider>
    </SessionProvider>
  );
}
