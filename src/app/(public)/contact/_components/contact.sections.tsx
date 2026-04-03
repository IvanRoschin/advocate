import type { ReactNode } from 'react';

import Link from 'next/link';
import {
  HiArrowTopRightOnSquare,
  HiEnvelope,
  HiMapPin,
  HiPhone,
} from 'react-icons/hi2';

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
  workHours?: Array<{
    day: string;
    hours: string;
  }>;
  mapEmbedUrl?: string;
};

export type ContactPageSectionComponent = (
  props: ContactPageProps
) => ReactNode;

const sectionContainerClassName = 'container';
const twoColLayoutClassName =
  'grid gap-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)]';
const infoGridClassName = 'grid gap-4 md:grid-cols-2 xl:grid-cols-3';

const cardClassName =
  'border-border bg-card rounded-2xl border shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]';

const cardInnerClassName = 'p-6 lg:p-8';

const eyebrowClassName =
  'text-accent text-[11px] font-semibold uppercase tracking-[0.22em]';

const sectionTitleClassName =
  'title-app text-accent mt-3 text-2xl font-semibold tracking-tight lg:text-3xl';

const mutedPanelClassName =
  'border-border bg-background rounded-2xl border px-4 py-4';

const ContactHeaderSection: ContactPageSectionComponent = () => <Header />;

const ContactHeroSection: ContactPageSectionComponent = ({
  phone,
  email,
  city,
}) => {
  return (
    <section className={`${sectionContainerClassName} py-10 lg:py-16`}>
      <div className={`${twoColLayoutClassName} lg:items-end`}>
        <div className="min-w-0">
          <Breadcrumbs />

          <div className="border-border bg-background text-accent mt-6 inline-flex items-center rounded-full border px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase">
            Адвокатська допомога • Консультації • Представництво
          </div>

          <h1 className="title-app text-accent mt-5 max-w-4xl text-4xl font-semibold tracking-tight lg:text-6xl">
            Контакти та юридична консультація
          </h1>

          <p className="text-app mt-6 max-w-3xl text-base leading-7 lg:text-lg">
            Якщо вам потрібна правова допомога, консультація або супровід
            справи, зв’яжіться зручним для вас способом. Допоможемо оцінити
            ситуацію, визначити ризики та обрати оптимальний формат захисту
            ваших інтересів.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`tel:${phone.replaceAll(' ', '')}`}
              className="bg-accent inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Зателефонувати
            </Link>

            <Link
              href={`mailto:${email}`}
              className="border-border text-accent hover:bg-muted inline-flex min-h-12 items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition-colors"
            >
              Написати на email
            </Link>
          </div>
        </div>

        <aside className={`${cardClassName} overflow-hidden`}>
          <div className="bg-muted/50 border-border border-b px-6 py-5 lg:px-8">
            <p className={eyebrowClassName}>Швидкий контакт</p>
            <h2 className="text-accent mt-2 text-2xl font-semibold">{city}</h2>
          </div>

          <div className="space-y-6 p-6 lg:p-8">
            <div>
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

            <div>
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

            <div className={mutedPanelClassName}>
              <p className="text-accent text-sm leading-6 font-medium">
                Первинна комунікація можлива телефоном або письмовим зверненням.
              </p>
            </div>
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
  return (
    <section className={`${sectionContainerClassName} pb-10`}>
      <div className={infoGridClassName}>
        <article className={`${cardClassName} h-full ${cardInnerClassName}`}>
          <div className="text-accent flex items-center gap-4">
            <span className="bg-accent/10 inline-flex h-11 w-11 items-center justify-center rounded-xl">
              <HiPhone className="h-5 w-5" />
            </span>

            <div>
              <h2 className="text-lg font-semibold">Телефон</h2>
              <p className="text-muted-foreground text-sm">
                Для консультації та запису
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`tel:${phone.replaceAll(' ', '')}`}
              className="text-accent text-base font-semibold underline-offset-4 hover:underline"
            >
              {phone}
            </Link>
          </div>
        </article>

        <article className={`${cardClassName} h-full ${cardInnerClassName}`}>
          <div className="text-accent flex items-center gap-4">
            <span className="bg-accent/10 inline-flex h-11 w-11 items-center justify-center rounded-xl">
              <HiEnvelope className="h-5 w-5" />
            </span>

            <div>
              <h2 className="text-lg font-semibold">Email</h2>
              <p className="text-muted-foreground text-sm">
                Для звернень і документів
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`mailto:${email}`}
              className="text-accent text-base font-semibold underline-offset-4 hover:underline"
            >
              {email}
            </Link>
          </div>
        </article>

        <article className={`${cardClassName} h-full ${cardInnerClassName}`}>
          <div className="text-accent flex items-center gap-4">
            <span className="bg-accent/10 inline-flex h-11 w-11 items-center justify-center rounded-xl">
              <HiMapPin className="h-5 w-5" />
            </span>

            <div>
              <h2 className="text-lg font-semibold">Адреса</h2>
              <p className="text-muted-foreground text-sm">
                Особистий прийом за домовленістю
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <p className="text-app text-base font-medium">{address}</p>
            <p className="text-muted-foreground text-sm">{city}</p>
          </div>
        </article>
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
  return (
    <section className={`${sectionContainerClassName} pb-10`}>
      <div className={twoColLayoutClassName}>
        <div className={`${cardClassName} h-full ${cardInnerClassName}`}>
          <p className={eyebrowClassName}>Графік роботи</p>

          <h2 className={sectionTitleClassName}>Консультації та запис</h2>

          <p className="text-app mt-4 max-w-2xl text-base leading-7">
            Для зручності клієнтів консультації та зустрічі можуть проводитися
            за попереднім записом. У термінових питаннях рекомендуємо телефонний
            зв’язок.
          </p>

          <div className="divide-border mt-6 divide-y">
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

        <aside className={`${cardClassName} h-full ${cardInnerClassName}`}>
          <p className={eyebrowClassName}>Підготовка</p>

          <h3 className={sectionTitleClassName}>
            Як підготуватись до консультації
          </h3>

          <div className="text-app mt-5 space-y-4 text-sm leading-6">
            <p>Коротко опишіть обставини справи та ключове питання.</p>
            <p>Підготуйте документи, які можуть мати значення для аналізу.</p>
            <p>
              Вкажіть бажаний формат зв’язку: дзвінок, email або особиста
              зустріч.
            </p>
          </div>

          <div className="mt-8 border-t pt-6">
            <Link
              href="#contact-form"
              className="text-accent inline-flex items-center gap-2 text-sm font-semibold"
            >
              Перейти до форми звернення
              <HiArrowTopRightOnSquare className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
};

const ContactFormSection: ContactPageSectionComponent = () => {
  return (
    <section id="contact-form" className={`${sectionContainerClassName} pb-10`}>
      <div className={twoColLayoutClassName}>
        <aside className={`${cardClassName} h-full ${cardInnerClassName}`}>
          <p className={eyebrowClassName}>Форма звернення</p>

          <h2 className={sectionTitleClassName}>
            Надішліть запит на консультацію
          </h2>

          <p className="text-app mt-4 text-base leading-7">
            Заповніть форму, і ми зв’яжемося з вами для уточнення деталей. Чим
            точніше ви опишете ситуацію, тим швидше можна буде визначити
            подальші кроки.
          </p>

          <div className={`${mutedPanelClassName} mt-6`}>
            <p className="text-muted-foreground text-sm leading-6">
              Через форму не потрібно надсилати конфіденційні матеріали у
              повному обсязі. Достатньо короткого опису ситуації та контактних
              даних.
            </p>
          </div>
        </aside>

        <div className={`${cardClassName} h-full ${cardInnerClassName}`}>
          <LeadForm mode="public" publicVariant="contacts" />
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
      <div className={`${cardClassName} overflow-hidden`}>
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
