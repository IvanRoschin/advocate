import type { ReactNode } from 'react';
import { Fragment } from 'react';

export type LayoutSectionNode<TSectionKey extends string> = {
  type: 'section';
  key: TSectionKey;
  display: boolean;
};

export type LayoutGroupItem<TSectionKey extends string> = {
  key: TSectionKey;
  display: boolean;
};

export type LayoutGroupNode<TSectionKey extends string> = {
  type: 'group';
  key: string;
  display: boolean;
  wrapperClassName?: string;
  items: readonly LayoutGroupItem<TSectionKey>[];
};

export type LayoutNode<TSectionKey extends string> =
  | LayoutSectionNode<TSectionKey>
  | LayoutGroupNode<TSectionKey>;

export type LayoutSectionComponent<TProps> = (
  props: Readonly<TProps>
) => ReactNode;

export type LayoutSectionsMap<TSectionKey extends string, TProps> = Readonly<
  Record<TSectionKey, LayoutSectionComponent<TProps>>
>;

type RenderGroupParams<TSectionKey extends string> = {
  node: LayoutGroupNode<TSectionKey>;
  children: ReactNode[];
  index: number;
};

type RenderLayoutParams<TSectionKey extends string, TProps> = {
  layout: readonly LayoutNode<TSectionKey>[];
  sections: LayoutSectionsMap<TSectionKey, TProps>;
  sectionProps: Readonly<TProps>;
  renderGroup?: (params: RenderGroupParams<TSectionKey>) => ReactNode;
};

const defaultRenderGroup = <TSectionKey extends string>({
  node,
  children,
  index,
}: RenderGroupParams<TSectionKey>) => (
  <div key={`${node.key}-${index}`} className={node.wrapperClassName}>
    {children}
  </div>
);

export const renderLayout = <TSectionKey extends string, TProps>({
  layout,
  sections,
  sectionProps,
  renderGroup,
}: RenderLayoutParams<TSectionKey, TProps>): ReactNode[] => {
  const groupRenderer = renderGroup ?? defaultRenderGroup;

  const renderSection = (sectionKey: TSectionKey, key: string): ReactNode => {
    const Section = sections[sectionKey];

    return <Fragment key={key}>{Section(sectionProps)}</Fragment>;
  };

  return layout.map((node, index) => {
    if (!node.display) return null;

    if (node.type === 'section') {
      return renderSection(node.key, `${node.key}-${index}`);
    }

    const children: ReactNode[] = [];

    for (const [itemIndex, item] of node.items.entries()) {
      if (!item.display) continue;

      children.push(
        renderSection(item.key, `${node.key}-${item.key}-${itemIndex}`)
      );
    }

    return groupRenderer({
      node,
      children,
      index,
    });
  });
};
