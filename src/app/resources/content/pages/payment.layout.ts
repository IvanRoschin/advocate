export type PaymentSectionKey =
  | 'header'
  | 'orderSummary'
  | 'paymentForm'
  | 'paymentMethods'
  | 'security'
  | 'footer';

export type PaymentLayoutNode =
  | {
      type: 'section';
      key: PaymentSectionKey;
      display: boolean;
    }
  | {
      type: 'group';
      key: string;
      display: boolean;
      wrapperClassName?: string;
      items: Array<{ key: PaymentSectionKey; display: boolean }>;
    };

export const paymentLayout: PaymentLayoutNode[] = [
  { type: 'section', key: 'header', display: true },

  {
    type: 'group',
    key: 'paymentContent',
    display: true,
    wrapperClassName: 'container py-10 lg:py-14',
    items: [
      { key: 'paymentForm', display: true },
      { key: 'orderSummary', display: true },
    ],
  },

  { type: 'section', key: 'paymentMethods', display: true },
  { type: 'section', key: 'security', display: true },
  { type: 'section', key: 'footer', display: true },
];
