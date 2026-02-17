export type WhyChooseMeItem = {
  id: string;
  title: string;
  content: string;
};

export const whyChooseMeSection = {
  id: 'why-choose-me',
  schemaType: 'https://schema.org/ProfessionalService',
  header: {
    uptitle: 'Чому обирають мене',
    title: 'Професіоналізм, надійність, результат та індивідуальний підхід',
  },
  image: {
    src: '/images/bg/ivan_roschin_wcm_section.webp',
    alt: 'Адвокат Рощин Іван Геннадійович',
    personName: 'Іван Рощин',
    jobTitle: 'Адвокат',
  },
  lead: {
    line1: 'Я ніколи не програю',
    line2: 'Або я переміг, або чомусь навчився',
    accentWords: ['не програю', 'Або я переміг,'],
  },
  items: [
    {
      id: 'result',
      title: 'Працюю на результат',
      content: 'Кожна справа доводиться до реального результату для клієнта.',
    },
    {
      id: 'approach',
      title: 'Кваліфікований підхід',
      content:
        'Поглиблений аналіз справи та індивідуальні рішення для кожного клієнта.',
    },
    {
      id: 'speed',
      title: 'Оперативність',
      content: 'Швидке реагування на запити та ефективне вирішення завдань.',
    },
    {
      id: 'details',
      title: 'Уважність до деталей',
      content:
        'Нічого не проходить повз увагу, жодна деталь не залишиться без контролю.',
    },
  ] satisfies WhyChooseMeItem[],
};
