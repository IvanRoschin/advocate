export type ClientSectionKey =
  | 'socials'
  | 'header'
  | 'sidebar'
  | 'content'
  | 'footer';

export type ClientLayoutNode =
  | {
      type: 'section';
      key: ClientSectionKey;
      display: boolean;
    }
  | {
      type: 'group';
      key: string;
      display: boolean;
      wrapperClassName?: string;
      items: Array<{ key: ClientSectionKey; display: boolean }>;
    };

export const clientLayout: ClientLayoutNode[] = [
  { type: 'section', key: 'socials', display: true },
  { type: 'section', key: 'header', display: true },
  {
    type: 'group',
    key: 'clientShell',
    display: true,
    wrapperClassName: 'flex w-full min-w-0 items-start gap-0',
    items: [
      { key: 'sidebar', display: true },
      { key: 'content', display: true },
    ],
  },
];
