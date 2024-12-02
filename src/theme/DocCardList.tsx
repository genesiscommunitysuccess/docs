import React from 'react';
import clsx from 'clsx';
import {
  useCurrentSidebarCategory,
  filterDocCardListItems,
} from '@docusaurus/plugin-content-docs/client';
import type { Props } from '@theme/DocCardList';
import CardList from '@site/src/components/Card/CardList';
import sidebarItemsData from '@site/static/data/sidebar-items-data.json';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function DocCardListForCurrentSidebarCategory({className}: Props) {
  const category = useCurrentSidebarCategory();
  return <DocCardList items={category.items} className={className} />;
}

function stripBaseUrlPrefix(url) {
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.customFields.baseUrlEnv
  if (url.startsWith(baseUrl)) {
    return `/${url.slice(baseUrl.length)}`;
  }
  return url; 
}

export default function DocCardList(props: Props): JSX.Element {
  const {items, className} = props;
  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...props} />;
  }
  const category = useCurrentSidebarCategory();

  const extraCategoryData = sidebarItemsData[stripBaseUrlPrefix(category.href)];
  let enrichedItems = filterDocCardListItems(items);

  if (extraCategoryData?.items) {
  enrichedItems = enrichedItems.map((item) => {
    const extraData = extraCategoryData.items.find(extraItemData => extraItemData.href === stripBaseUrlPrefix(item.href)) || {};
      return {
        ...item,
        ...extraData,
      };
    });
  }

  const filteredItems = enrichedItems.map((
    { label: heading, href: link, description: text, imageUrl  },
  ) => ({ heading, link, text, imageUrl }));

  return (
    <section className={clsx('row', className)}>
      <CardList
        xs="12"
        sm="4"
        md="4"
        items={filteredItems}
      />
    </section>
  );
}
