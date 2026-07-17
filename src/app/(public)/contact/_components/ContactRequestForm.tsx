import { LeadForm } from '@/app/components';

import {
  eyebrowClassName,
  panelClassName,
  sectionTitleClassName,
  twoColLayoutClassName,
} from './contact.styles';

const ContactRequestForm = () => {
  return (
    <section id="contact-form" className="container pb-10">
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
          <LeadForm publicVariant="contacts" source="contacts" />
        </div>
      </div>
    </section>
  );
};

export default ContactRequestForm;
