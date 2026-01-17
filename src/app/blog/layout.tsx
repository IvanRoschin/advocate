'use client';

import { Header, Socials } from '../components';
import { SubscribeForm } from '../components/forms';

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="blog-wrapper">
      <Socials />
      <Header />
      <div className="flex w-3/4 justify-around">
        {children}
        <aside className="">
          <p>Category</p>
          <p className="nav font-eukrainehead mb-4 text-lg font-semibold">
            Інформаційна розсилка
          </p>
          <SubscribeForm />
          <p>Недавні записи</p>
        </aside>
      </div>
    </div>
  );
}
