import React from 'react';
import clsx from 'clsx';
import {
  useCurrentSidebarCategory,
  filterDocCardListItems,
} from '@docusaurus/plugin-content-docs/client';
import type { Props } from '@theme/DocCardList';
import NewCardList from '@site/src/components/NewCardList';
import sidebarItemsData from '@site/static/data/sidebar-items-data.json';

function DocCardListForCurrentSidebarCategory({className}: Props) {
  const category = useCurrentSidebarCategory();
  return <DocCardList items={category.items} className={className} />;
}

export default function DocCardList(props: Props): JSX.Element {
  const {items, className} = props;
  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...props} />;
  }
  const category = useCurrentSidebarCategory();
  const extraCategoryData = sidebarItemsData[category.href];
  let enrichedItems = filterDocCardListItems(items);
  
  if (extraCategoryData?.items) {
  enrichedItems = enrichedItems.map((item) => {
    const extraData = extraCategoryData.items.find(extraItemData => extraItemData.href === item.href) || {};
      return {
        ...item,
        ...extraData,
      };
    });
  } 

  const filteredItems = enrichedItems.map((
    { label: heading, href: link, storyBookHref: storybookLink, description: text, imageUrl  },
  ) => ({ heading, link, storybookLink, text, imageUrl }));

  return (
    <section className={clsx('row', className)}>
      <NewCardList
        xs="12"
        sm="4"
        md="4"
        items={filteredItems}
      />
    </section>
  );
}