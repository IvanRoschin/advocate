/**
 * Стартові ціни послуг для публічних сторінок.
 * Узгоджені з прайсом на Kabanchik.ua та товарами в Google Business Profile.
 * Ключ — slug послуги. Якщо slug відсутній, ціна не показується.
 */
export type ServicePrice = {
  /** Мінімальна вартість, грн */
  from: number;
  /** Одиниця, напр. «год»; якщо не задано — за послугу */
  unit?: string;
  /** Коротке уточнення під ціною */
  note?: string;
};

export const SERVICE_PRICES: Record<string, ServicePrice> = {
  'perevirka-ta-analiz-dohovoriv': {
    from: 2500,
    note: 'Висновок з ризиками та правки в режимі рецензування',
  },
  'styahnennya-borhu': {
    from: 2000,
    note: 'Претензія боржнику; позовна заява — від 2 500 грн',
  },
  'oformlennya-spadshchyny': {
    from: 20000,
    note: 'Зокрема поновлення строку прийняття спадщини через суд',
  },
  'vyznachennya-mistsya-prozhyvannya-dytyny': {
    from: 10000,
    note: 'Представництво в суді першої інстанції',
  },
  'podil-mayna-podruzhzhya': {
    from: 20000,
    note: 'Досудове врегулювання та захист у суді',
  },
  'styahnennya-alimentiv': {
    from: 15000,
    note: 'Від подання до примусового виконання',
  },
  'perevirka-nerukhomosti-pered-kupivleyu': {
    from: 5000,
    note: 'Перевірка продавця, об’єкта та договору',
  },
  'suprovid-pry-rozluchenni': {
    from: 20000,
    note: 'Розлучення через суд без вашої участі',
  },
  'skladannya-pozovnoyi-zayavy': {
    from: 2500,
  },
  'yurydychna-konsultatsiya-advokata': {
    from: 500,
    unit: 'год',
    note: 'Усна консультація з цивільних питань',
  },
};

export const formatUah = (value: number) =>
  new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 })
    .format(value)
    .replace(/ | /g, ' ');

export const getServicePrice = (slug?: string): ServicePrice | undefined =>
  slug ? SERVICE_PRICES[slug] : undefined;

export const formatServicePrice = (price: ServicePrice) =>
  `від ${formatUah(price.from)} грн${price.unit ? ` / ${price.unit}` : ''}`;
