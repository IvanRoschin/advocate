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
    wrapperClassName: 'flex w-full min-w-0 items-start gap-0',
    items: [
      { key: 'sidebar', display: true },
      { key: 'content', display: true },
    ],
  },
];
