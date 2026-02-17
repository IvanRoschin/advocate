export type PracticeItem = {
  id: string;
  title: string;
  text: string;
  link: string;
};

export const practicesSection = {
  id: 'practices',
  schemaType: 'https://schema.org/LegalService',
  header: {
    uptitle: 'практики',
    title: 'Послуги адвоката',
  },
  cta: {
    label: 'Більше послуг',
  },
  items: [
    {
      id: 'business-registration',
      title: 'Реєстрація бізнесу',
      text: 'Реєстрація ФОП, ТОВ, ГО, зміна керівника, адреси, КВЕД',
      link: '/#',
    },
    {
      id: 'contract-work',
      title: 'Договірна робота',
      text: 'Індивідуальний договір, розроблений під клієнта. Максимальний захист інтересів',
      link: '/#',
    },
    {
      id: 'real-estate-check',
      title: 'Перевірка нерухомості',
      text: 'Аналіз ризиків, перевірка забудовника: репутація, судові справи',
      link: '/#',
    },
    {
      id: 'debt-collection',
      title: 'Стягнення боргів',
      text: 'Механізми повернення боргу, досудова робота і примусове стягнення',
      link: '/#',
    },
  ] satisfies PracticeItem[],
};
