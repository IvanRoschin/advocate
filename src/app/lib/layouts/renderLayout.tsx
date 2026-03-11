import { Fragment } from 'react';

import type { ReactNode } from 'react';

type LayoutSectionNode<TSectionKey extends string> = {
  type: 'section';
  key: TSectionKey;
  display: boolean;
};

type LayoutGroupItem<TSectionKey extends string> = {
  key: TSectionKey;
  display: boolean;
};

type LayoutGroupNode<TSectionKey extends string> = {
  type: 'group';
  key: string;
  display: boolean;
  wrapperClassName?: string;
  items: LayoutGroupItem<TSectionKey>[];
};

export type LayoutNode<TSectionKey extends string> =
  | LayoutSectionNode<TSectionKey>
  | LayoutGroupNode<TSectionKey>;

export type LayoutSectionRenderer<TProps> = (props: TProps) => ReactNode;

export type LayoutSectionsMap<TSectionKey extends string, TProps> = Record<
  TSectionKey,
  LayoutSectionRenderer<TProps>
>;

type RenderGroupParams<TSectionKey extends string> = {
  node: LayoutGroupNode<TSectionKey>;
  children: ReactNode[];
  index: number;
};

type RenderLayoutParams<TSectionKey extends string, TProps> = {
  layout: LayoutNode<TSectionKey>[];
  sections: LayoutSectionsMap<TSectionKey, TProps>;
  sectionProps: TProps;
  renderGroup?: (params: RenderGroupParams<TSectionKey>) => ReactNode;
};

const defaultRenderGroup = <TSectionKey extends string>({
  node,
  children,
  index,
}: RenderGroupParams<TSectionKey>) => {
  return (
    <div key={`${node.key}-${index}`} className={node.wrapperClassName}>
      {children}
    </div>
  );
};

export const renderLayout = <TSectionKey extends string, TProps>({
  layout,
  sections,
  sectionProps,
  renderGroup,
}: RenderLayoutParams<TSectionKey, TProps>) => {
  const renderSection = (sectionKey: TSectionKey, uniqueKey: string) => (
    <Fragment key={uniqueKey}>{sections[sectionKey](sectionProps)}</Fragment>
  );

  const renderNode = (node: LayoutNode<TSectionKey>, index: number) => {
    if (!node.display) return null;

    if (node.type === 'section') {
      return renderSection(node.key, `${node.key}-${index}`);
    }

    const children = node.items.flatMap((item, itemIndex) => {
      if (!item.display) return [];

      return [renderSection(item.key, `${node.key}-${item.key}-${itemIndex}`)];
    });

    const groupRenderer = renderGroup ?? defaultRenderGroup;

    return groupRenderer({
      node,
      children,
      index,
    });
  };

  return layout.map(renderNode);
};
