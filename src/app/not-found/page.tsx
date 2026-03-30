import Link from 'next/link';

import { person } from '@/app/resources/content';

export default function NotFoundPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="container flex min-h-screen items-center justify-center py-10">
        <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:items-center">
          <section className="min-w-0">
            <p className="text-accent mb-3 text-sm font-semibold tracking-[0.18em] uppercase">
              Помилка навігації
            </p>

            <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              404
            </h1>

            <div className="mt-4 max-w-2xl space-y-4">
              <h2 className="text-foreground text-2xl font-semibold sm:text-3xl">
                Сторінку не знайдено
              </h2>

              <p className="text-muted-foreground text-base leading-7">
                Можливо, сторінку було переміщено, видалено або адреса введена з
                помилкою. Ви можете повернутися на головну сторінку або перейти
                до розділів, де зібрана основна інформація про послуги та
                способи зв’язку.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="bg-accent text-accent-foreground inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-medium transition hover:opacity-90"
              >
                На головну
              </Link>

              <Link
                href="/services"
                className="border-border bg-card text-foreground hover:bg-muted inline-flex min-h-11 items-center justify-center rounded-xl border px-5 text-sm font-medium transition"
              >
                Переглянути послуги
              </Link>

              <Link
                href="/contact"
                className="border-border bg-card text-foreground hover:bg-muted inline-flex min-h-11 items-center justify-center rounded-xl border px-5 text-sm font-medium transition"
              >
                Контакти
              </Link>
            </div>

            <div className="border-border bg-card mt-8 rounded-2xl border p-4 sm:p-5">
              <p className="text-foreground text-sm font-medium">
                Потрібна допомога зараз?
              </p>

              <p className="text-muted-foreground mt-2 text-sm leading-6">
                Якщо ви шукали конкретну юридичну послугу або хотіли зв’язатися
                з адвокатом, скористайтеся сторінкою контактів або поверніться
                на головну для швидкої навігації по сайту.
              </p>
            </div>
          </section>

          <aside className="min-w-0">
            <div className="border-border bg-card relative overflow-hidden rounded-3xl border p-6 shadow-sm sm:p-7">
              <div className="from-accent/12 to-accent/4 absolute inset-0 bg-linear-to-br via-transparent" />

              <div className="relative">
                <div className="border-border bg-background/80 inline-flex h-14 w-14 items-center justify-center rounded-2xl border text-xl font-semibold backdrop-blur">
                  404
                </div>

                <h3 className="text-foreground mt-5 text-xl font-semibold">
                  {person.role} {person.name}
                </h3>

                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  Юридична допомога, консультації, підготовка документів і
                  представництво інтересів.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="border-border bg-background/70 rounded-2xl border p-4">
                    <div className="text-foreground text-sm font-medium">
                      Що можна зробити далі
                    </div>

                    <ul className="text-muted-foreground mt-3 space-y-2 text-sm leading-6">
                      <li>• перейти до переліку юридичних послуг</li>
                      <li>• залишити звернення через контактну форму</li>
                      <li>• зв’язатися телефоном або електронною поштою</li>
                    </ul>
                  </div>

                  <div className="border-border bg-background/70 rounded-2xl border p-4">
                    <div className="text-foreground text-sm font-medium">
                      Корисні посилання
                    </div>

                    <div className="mt-3 flex flex-col gap-2">
                      <Link
                        href="/blog"
                        className="text-accent text-sm font-medium hover:underline"
                      >
                        Перейти до блогу
                      </Link>

                      <Link
                        href="/payment"
                        className="text-accent text-sm font-medium hover:underline"
                      >
                        Перейти до сторінки оплати
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
