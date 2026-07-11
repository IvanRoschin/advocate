export type LayoutSectionNode<TKey extends string> = {
  type: 'section';
  key: TKey;
  display: boolean;
};

export type LayoutGroupItem<TKey extends string> = {
  key: TKey;
  display: boolean;
};

export type LayoutGroupNode<TKey extends string> = {
  type: 'group';
  key: string;
  display: boolean;
  wrapperClassName?: string;
  items: LayoutGroupItem<TKey>[];
};

export type LayoutNode<TKey extends string> =
  | LayoutSectionNode<TKey>
  | LayoutGroupNode<TKey>;

// Для БД / DTO — key: string
export type PageLayoutNode = LayoutNode<string>;
