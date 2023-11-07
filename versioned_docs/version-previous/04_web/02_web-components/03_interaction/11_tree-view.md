---
title: "Web Components - Tree view"
sidebar_label: "Tree view"
id: tree-view
keywords: [web, web components, tree view]
tags:
  - web
  - web components
  - tree view
---

As defined by the [W3C](https://w3c.github.io/aria/#tree):

> A tree view widget presents a hierarchical list. Any item in the hierarchy may have child items, and items that have children may be expanded or collapsed to show or hide the children. For example, in a file system navigator that uses a tree view to display folders and files, an item representing a folder can be expanded to reveal the contents of the folder, which may be files, folders, or both.

## Set-up

```ts
import {
  provideDesignSystem,
  alphaTreeView,
  alphaTreeItem,
} from "@genesislcap/alpha-design-system";

provideDesignSystem().register(alphaTreeView(), alphaTreeItem());
```

## Usage

```html live
  <alpha-tree-item>
    Root
    <alpha-tree-item>
      Item 1
      <alpha-tree-item>Sub-item 1</alpha-tree-item>
      <alpha-tree-item>Sub-item 2</alpha-tree-item>
    </alpha-tree-item>
    <alpha-tree-item>Item 3</alpha-tree-item>
  </alpha-tree-item>
```

## Use cases

- A hierarchical list such as a file system

## Additional resources

- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#tree)
