export type PrivacyPolicySectionKey =
  | 'socials'
  | 'header'
  | 'hero'
  | 'content'
  | 'aside'
  | 'footer'
  | 'scrollToTop';

export type PrivacyPolicyLayoutNode =
  | {
      type: 'section';
      key: PrivacyPolicySectionKey;
      display: boolean;
    }
  | {
      type: 'group';
      key: string;
      display: boolean;
      wrapperClassName?: string;
      items: Array<{
        key: PrivacyPolicySectionKey;
        display: boolean;
      }>;
    };

export const privacyPolicyLayout: PrivacyPolicyLayoutNode[] = [
  {
    type: 'section',
    key: 'socials',
    display: true,
  },
  {
    type: 'section',
    key: 'header',
    display: true,
  },
  {
    type: 'section',
    key: 'hero',
    display: true,
  },
  {
    type: 'group',
    key: 'privacy-main',
    display: true,
    wrapperClassName: 'container pb-10 lg:pb-14',
    items: [
      { key: 'content', display: true },
      { key: 'aside', display: true },
    ],
  },
  {
    type: 'section',
    key: 'footer',
    display: true,
  },
];
