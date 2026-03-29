export type OfferSectionKey =
  | 'socials'
  | 'header'
  | 'hero'
  | 'content'
  | 'aside'
  | 'footer'
  | 'scrollToTop';

export type OfferLayoutNode =
  | {
      type: 'section';
      key: OfferSectionKey;
      display: boolean;
    }
  | {
      type: 'group';
      key: string;
      display: boolean;
      wrapperClassName?: string;
      items: Array<{
        key: OfferSectionKey;
        display: boolean;
      }>;
    };

export const offerLayout: OfferLayoutNode[] = [
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
    key: 'offer-main',
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
