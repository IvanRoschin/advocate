import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi2';

import {
  eyebrowClassName,
  sectionTitleClassName,
  twoColLayoutClassName,
} from './contact.styles';

type Props = {
  workHours?: Array<{ day: string; hours: string }>;
};

const ContactSchedule = ({
  workHours = [
    { day: 'Понеділок — П’ятниця', hours: '09:00 — 18:00' },
    { day: 'Субота', hours: 'За попереднім записом' },
    { day: 'Неділя', hours: 'Вихідний' },
  ],
}: Props) => {
  const prepTips = [
    'Коротко опишіть обставини справи та ключове питання.',
    'Підготуйте документи, які можуть мати значення для аналізу.',
    'Вкажіть бажаний формат зв’язку: дзвінок, email або особиста зустріч.',
  ];

  return (
    <section className="container pb-10">
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

export default ContactSchedule;
