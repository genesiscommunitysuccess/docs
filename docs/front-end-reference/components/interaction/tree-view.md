# tree-view

As defined by the [W3C](https://w3c.github.io/aria/#tree):

> A tree view widget presents a hierarchical list. Any item in the hierarchy may have child items, and items that have children may be expanded or collapsed to show or hide the children. For example, in a file system navigator that uses a tree view to display folders and files, an item representing a folder can be expanded to reveal the contents of the folder, which may be files, folders, or both.

## Setup

```ts
import { provideDesignSystem, alphaTreeView, getTreeItem } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaTreeView(), getTreeItem());
```

## Usage

```js preview-story
import { html } from '@microsoft/fast-element';
import { provideDesignSystem, alphaTreeItem, getTreeView } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaTreeItem(), getTreeView());

export const usageStory = () => html`
  <alpha-tree-view>
    Root
    <alpha-tree-item>
      Item 1
      <alpha-tree-item>Sub-item 1</alpha-tree-item>
      <alpha-tree-item>Sub-item 2</alpha-tree-item>
    </alpha-tree-item>
    <alpha-tree-item>Item 2</alpha-tree-item>
  </alpha-tree-view>
`;
```

## Use cases

Primarily used to present a hierarchical list such as a file system. A tree view can also be served as a flat list.

## Additional resources

- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#tree)
- [Fast documentation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/tree-view/README.md)
- [Fast specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/tree-view/tree-view.spec.md)
- [Fast styles implementation](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-components/src/tree-view/tree-view.styles.ts)
