export type AdminSectionKey =
  | 'socials'
  | 'header'
  | 'sidebar'
  | 'content'
  | 'footer';

export type AdminLayoutNode =
  | {
      type: 'section';
      key: AdminSectionKey;
      display: boolean;
    }
  | {
      type: 'group';
      key: string;
      display: boolean;
      wrapperClassName?: string;
      items: Array<{ key: AdminSectionKey; display: boolean }>;
    };

export const adminLayout: AdminLayoutNode[] = [
  { type: 'section', key: 'socials', display: true },
  { type: 'section', key: 'header', display: true },

  {
    type: 'group',
    key: 'adminShell',
    display: true,
    wrapperClassName: 'mx-auto flex w-full max-w-7xl gap-0 px-0',
    items: [
      { key: 'sidebar', display: true },
      { key: 'content', display: true },
    ],
  },

  { type: 'section', key: 'footer', display: true },
];
