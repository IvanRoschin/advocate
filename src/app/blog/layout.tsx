'use client';

import type React from 'react';

import { Header, Socials } from '../components';
import { SubscribeForm } from '../components/forms';

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="blog-wrapper min-h-screen">
      <Socials />
      <Header />

      {/* container */}
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* main content: up to 80% */}
          <main className="w-full lg:max-w-[80%] lg:flex-[0_0_80%]">
            {children}
          </main>

          {/* aside: up to 20% */}
          <aside className="w-full lg:max-w-[20%] lg:flex-[0_0_20%]">
            <div className="space-y-6 lg:sticky lg:top-6">
              {/* Categories */}
              <section className="bg-background rounded-xl border p-4">
                <p className="text-muted-foreground mb-3 text-sm font-semibold">
                  Категорії
                </p>
                <nav className="space-y-2">
                  <a className="block text-sm hover:underline" href="#">
                    Сімейне право
                  </a>
                  <a className="block text-sm hover:underline" href="#">
                    Трудові спори
                  </a>
                  <a className="block text-sm hover:underline" href="#">
                    Нерухомість
                  </a>
                </nav>
              </section>

              {/* Subscribe */}
              <section className="bg-background rounded-xl border p-4">
                <p className="mb-2 text-lg font-semibold">
                  Інформаційна розсилка
                </p>
                <p className="text-muted-foreground mb-4 text-sm">
                  Отримуйте нові статті та практичні нотатки.
                </p>
                <SubscribeForm />
              </section>

              {/* Recent posts */}
              <section className="bg-background rounded-xl border p-4">
                <p className="text-muted-foreground mb-3 text-sm font-semibold">
                  Недавні записи
                </p>
                <ul className="space-y-3">
                  <li>
                    <a className="block text-sm hover:underline" href="#">
                      Як правильно підготувати позовну заяву
                    </a>
                    <p className="text-muted-foreground text-xs">2 дні тому</p>
                  </li>
                  <li>
                    <a className="block text-sm hover:underline" href="#">
                      Договір оренди: типові ризики
                    </a>
                    <p className="text-muted-foreground text-xs">
                      1 тиждень тому
                    </p>
                  </li>
                </ul>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
