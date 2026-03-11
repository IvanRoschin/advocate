export type ServicesSectionKey = 'header' | 'hero' | 'list' | 'footer';

export type ServicesLayoutNode =
  | {
      type: 'section';
      key: ServicesSectionKey;
      display: boolean;
    }
  | {
      type: 'group';
      key: string;
      display: boolean;
      wrapperClassName?: string;
      items: Array<{ key: ServicesSectionKey; display: boolean }>;
    };

export const servicesLayout: ServicesLayoutNode[] = [
  { type: 'section', key: 'header', display: true },

  {
    type: 'group',
    key: 'servicesContent',
    display: true,
    wrapperClassName: 'container py-10 lg:py-14',
    items: [
      { key: 'hero', display: true },
      { key: 'list', display: true },
    ],
  },

  { type: 'section', key: 'footer', display: true },
];
