import { ReactNode } from 'react';

import { Header } from '@/app/components';
import Footer from '@/app/components/footer/Footer';
import AuthAside from './_components/AuthAside';
import AuthFeedbackProvider from './_components/AuthFeedbackProvider';

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />

      <AuthFeedbackProvider>
        <main className="relative overflow-hidden">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(180,140,80,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(180,140,80,0.12),transparent_24%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02),transparent_20%,rgba(0,0,0,0.03))]" />

          <div className="container py-12 sm:py-16 lg:py-20">
            <div className="grid min-h-[calc(100vh-220px)] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
              <AuthAside />

              <section className="mx-auto flex w-full max-w-lg items-center justify-center">
                {children}
              </section>
            </div>
          </div>
        </main>
      </AuthFeedbackProvider>

      <Footer />
    </div>
  );
}
