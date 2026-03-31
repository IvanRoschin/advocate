import { ReactNode } from 'react';

import { Header } from '@/app/components';
import Footer from '@/app/components/footer/Footer';

type Props = {
  children: ReactNode;
};

export default function SignIntLayout({ children }: Props) {
  return (
    <div className="blog-wrapper bg-background text-foreground min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
