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
  const { siteConfig } = useDocusaurusContext();
  
  // Get extra data for this category
  let extraCategoryData = null;
  try {
    extraCategoryData = sidebarItemsData[stripBaseUrlPrefix(category.href, siteConfig)];
  } catch (error) {
    // If we can't get extra data, just continue without it
  }
  
  let enrichedItems = filterDocCardListItems(category.items);

  if (extraCategoryData?.items) {
    enrichedItems = enrichedItems.map((item) => {
      const extraData = extraCategoryData.items.find(extraItemData => extraItemData.href === stripBaseUrlPrefix(item.href, siteConfig)) || {};
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

function stripBaseUrlPrefix(url, siteConfig) {
  const baseUrl = siteConfig.customFields.baseUrlEnv;
  if (url.startsWith(baseUrl)) {
    return `/${url.slice(baseUrl.length)}`;
  }
  return url; 
}

export default function DocCardList(props: Props): JSX.Element {
  const {items, className} = props;
  const { siteConfig } = useDocusaurusContext();
  
  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...props} />;
  }

  // Try to get extra data based on current URL
  let extraCategoryData = null;
  try {
    // Get current path from window.location (only in browser)
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      
      // Find matching category data based on current path
      const categoryKey = Object.keys(sidebarItemsData).find(key => {
        const normalizedKey = key.replace('/develop/', '/develop/');
        return currentPath.includes(normalizedKey);
      });
      
      if (categoryKey) {
        extraCategoryData = sidebarItemsData[categoryKey];
      }
    }
  } catch (error) {
    console.warn('DocCardList: Could not get extra data:', error);
  }

  let enrichedItems = filterDocCardListItems(items);

  if (extraCategoryData?.items) {
    enrichedItems = enrichedItems.map((item) => {
      const extraData = extraCategoryData.items.find(extraItemData => extraItemData.href === stripBaseUrlPrefix(item.href, siteConfig)) || {};
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
