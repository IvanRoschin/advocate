import Link from 'next/link';

import { Breadcrumbs } from '@/app/components';

import {
  eyebrowClassName,
  panelClassName,
  twoColLayoutClassName,
} from './contact.styles';

type Props = {
  phone: string;
  email: string;
  city: string;
};

const ContactHero = ({ phone, email, city }: Props) => {
  return (
    <section className="container py-10 lg:py-16">
      <div className={`${twoColLayoutClassName} lg:items-start`}>
        <div className="min-w-0">
          <Breadcrumbs />

          <p className={`${eyebrowClassName} mt-6`}>
            Адвокатська допомога · Консультації · Представництво
          </p>

          <h1 className="title-app text-accent mt-3 max-w-4xl text-4xl font-semibold tracking-tight lg:text-6xl">
            Контакти та юридична консультація
          </h1>

          <p className="text-app mt-6 max-w-2xl text-base leading-7 lg:text-lg">
            Якщо вам потрібна правова допомога, консультація або супровід
            справи, зв’яжіться зручним для вас способом. Допоможемо оцінити
            ситуацію, визначити ризики та обрати оптимальний формат захисту
            ваших інтересів.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`tel:${phone.replaceAll(' ', '')}`}
              className="bg-accent inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Зателефонувати
            </Link>

            <Link
              href="#contact-form"
              className="border-border text-accent hover:bg-muted inline-flex min-h-12 items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition-colors"
            >
              Залишити запит
            </Link>
          </div>

          <p className="sign text-accent mt-10 text-3xl lg:text-4xl">
            Іван Рощин
          </p>
        </div>

        {/* "Картка справи" — тонка золота смуга замінює важку тінь */}
        <aside className={`${panelClassName} overflow-hidden`}>
          <div
            style={{ backgroundColor: 'var(--accentcolor)' }}
            className="h-1 w-full"
          />

          <div className="px-6 py-6 lg:px-8 lg:py-7">
            <p className={eyebrowClassName}>Швидкий контакт</p>
            <h2 className="text-accent mt-2 text-2xl font-semibold">{city}</h2>

            <div className="divide-border mt-6 divide-y">
              <div className="py-4 first:pt-0">
                <p className="text-muted-foreground text-[11px] tracking-[0.18em] uppercase">
                  Телефон
                </p>
                <Link
                  href={`tel:${phone.replaceAll(' ', '')}`}
                  className="text-accent mt-2 block text-lg font-semibold underline-offset-4 hover:underline"
                >
                  {phone}
                </Link>
              </div>

              <div className="py-4">
                <p className="text-muted-foreground text-[11px] tracking-[0.18em] uppercase">
                  Email
                </p>
                <Link
                  href={`mailto:${email}`}
                  className="text-accent mt-2 block text-lg font-semibold underline-offset-4 hover:underline"
                >
                  {email}
                </Link>
              </div>
            </div>

            <p className="text-app mt-2 text-sm leading-6">
              Первинна комунікація можлива телефоном або письмовим зверненням.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default ContactHero;
