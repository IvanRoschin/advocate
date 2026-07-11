import type { ReactNode } from 'react';

import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi2';

import { Breadcrumbs, LeadForm } from '@/app/components';
import Footer from '@/app/components/footer/Footer';
import { ContactPageSectionKey } from '@/app/resources/content/pages/contact.layout';
import { Header } from '@/components';

export type ContactPageProps = {
  phone: string;
  email: string;
  address: string;
  city: string;
  region?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  workHours?: Array<{ day: string; hours: string }>;
  mapEmbedUrl?: string;
};

export type ContactPageSectionComponent = (
  props: ContactPageProps
) => ReactNode;

const sectionContainerClassName = 'container';
const twoColLayoutClassName =
  'grid gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)]';

const eyebrowClassName =
  'text-accent text-[11px] font-semibold uppercase tracking-[0.22em]';

const sectionTitleClassName =
  'title-app text-accent mt-3 text-2xl font-semibold tracking-tight lg:text-3xl';

/** Тонка панель без тіні — hairline-межа замість важкої картки */
const panelClassName = 'border-border bg-card rounded-2xl border';

const ContactHeaderSection: ContactPageSectionComponent = () => <Header />;

const ContactHeroSection: ContactPageSectionComponent = ({
  phone,
  email,
  city,
}) => {
  return (
    <section className={`${sectionContainerClassName} py-10 lg:py-16`}>
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

const ContactInfoSection: ContactPageSectionComponent = ({
  phone,
  email,
  address,
  city,
}) => {
  const items = [
    {
      label: 'Телефон',
      value: phone,
      href: `tel:${phone.replaceAll(' ', '')}`,
    },
    { label: 'Email', value: email, href: `mailto:${email}` },
    { label: 'Адреса', value: `${address}, ${city}`, href: undefined },
  ];

  return (
    <section className={`${sectionContainerClassName} pb-10`}>
      <div className="grid divide-y border-t border-b md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map(item => (
          <div
            key={item.label}
            className="px-1 py-6 md:px-6 md:first:pl-0 md:last:pr-0"
          >
            <p className={eyebrowClassName}>{item.label}</p>
            {item.href ? (
              <Link
                href={item.href}
                className="text-accent mt-3 block text-lg font-medium underline-offset-4 hover:underline"
              >
                {item.value}
              </Link>
            ) : (
              <p className="text-app mt-3 text-lg font-medium">{item.value}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const ContactScheduleSection: ContactPageSectionComponent = ({
  workHours = [
    { day: 'Понеділок — П’ятниця', hours: '09:00 — 18:00' },
    { day: 'Субота', hours: 'За попереднім записом' },
    { day: 'Неділя', hours: 'Вихідний' },
  ],
}) => {
  const prepTips = [
    'Коротко опишіть обставини справи та ключове питання.',
    'Підготуйте документи, які можуть мати значення для аналізу.',
    'Вкажіть бажаний формат зв’язку: дзвінок, email або особиста зустріч.',
  ];

  return (
    <section className={`${sectionContainerClassName} pb-10`}>
      <div className={twoColLayoutClassName}>
        <div>
          <p className={eyebrowClassName}>Графік роботи</p>
          <h2 className={sectionTitleClassName}>Консультації та запис</h2>

          <p className="text-app mt-4 max-w-xl text-base leading-7">
            Для зручності клієнтів консультації та зустрічі можуть проводитися
            за попереднім записом. У термінових питаннях рекомендуємо телефонний
            зв’язок.
          </p>

          <div className="divide-border mt-6 divide-y border-t">
            {workHours.map(item => (
              <div
                key={item.day}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-accent font-medium">{item.day}</span>
                <span className="text-muted-foreground">{item.hours}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:border-accent lg:border-l lg:pl-8">
          <p className={eyebrowClassName}>Підготовка</p>
          <h3 className={sectionTitleClassName}>
            Як підготуватись до консультації
          </h3>

          <div className="mt-6 space-y-5">
            {prepTips.map((tip, index) => (
              <div key={index} className="flex gap-3">
                <span
                  className="text-lg leading-none font-semibold"
                  style={{ color: 'var(--accentcolor)' }}
                >
                  §
                </span>
                <p className="text-app text-sm leading-6">{tip}</p>
              </div>
            ))}
          </div>

          <Link
            href="#contact-form"
            className="text-accent mt-7 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
          >
            Перейти до форми звернення
            <HiArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </section>
  );
};

const ContactFormSection: ContactPageSectionComponent = () => {
  return (
    <section id="contact-form" className={`${sectionContainerClassName} pb-10`}>
      <div className={twoColLayoutClassName}>
        <div className="lg:pt-2">
          <p className={eyebrowClassName}>Форма звернення</p>
          <h2 className={sectionTitleClassName}>
            Надішліть запит на консультацію
          </h2>

          <p className="text-app mt-4 max-w-lg text-base leading-7">
            Заповніть форму, і ми зв’яжемося з вами для уточнення деталей. Чим
            точніше ви опишете ситуацію, тим швидше можна буде визначити
            подальші кроки.
          </p>

          <p className="text-muted-foreground mt-6 max-w-lg text-sm leading-6">
            Через форму не потрібно надсилати конфіденційні матеріали у повному
            обсязі. Достатньо короткого опису ситуації та контактних даних.
          </p>
        </div>

        <div className={`${panelClassName} p-6 lg:p-8`}>
          <LeadForm mode="public" publicVariant="contacts" source="contacts" />
        </div>
      </div>
    </section>
  );
};

const ContactMapSection: ContactPageSectionComponent = ({
  mapEmbedUrl,
  address,
}) => {
  return (
    <section className={`${sectionContainerClassName} pb-14`}>
      <div className={`${panelClassName} overflow-hidden`}>
        <div className="border-border border-b px-6 py-5 lg:px-8">
          <p className={eyebrowClassName}>Локація</p>
          <h2 className="text-accent mt-2 text-xl font-semibold">
            Як нас знайти
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">{address}</p>
        </div>

        {mapEmbedUrl ? (
          <div className="h-95 w-full">
            <iframe
              src={mapEmbedUrl}
              title="Мапа офісу"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
        ) : (
          <div className="bg-muted flex h-95 items-center justify-center px-6 text-center">
            <div>
              <p className="text-accent text-lg font-semibold">Мапа офісу</p>
              <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
                Додайте `mapEmbedUrl`, коли буде готовий embed URL з Google
                Maps.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const ContactFooterSection: ContactPageSectionComponent = () => (
  <section className="mt-16 lg:mt-20">
    <Footer />
  </section>
);

export const CONTACT_PAGE_SECTIONS: Record<
  ContactPageSectionKey,
  ContactPageSectionComponent
> = {
  header: ContactHeaderSection,
  hero: ContactHeroSection,
  info: ContactInfoSection,
  schedule: ContactScheduleSection,
  form: ContactFormSection,
  map: ContactMapSection,
  footer: ContactFooterSection,
};
