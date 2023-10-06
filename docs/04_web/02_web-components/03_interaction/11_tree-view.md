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

> A tree view widget presents a hierarchical list. Any item in the hierarchy can have child items, and items that have children may be expanded or collapsed to show or hide the children. For example, in a file system navigator that uses a tree view to display folders and files, an item representing a folder can be expanded to reveal the contents of the folder, which could be files, folders, or both.

## Set-up

```ts
import {
  provideDesignSystem,
  alphaTreeView,
  alphaTreeItem,
} from "@genesislcap/alpha-design-system";

provideDesignSystem().register(alphaTreeView(), alphaTreeItem());
```

## Tree-item

### Attributes
In order to use the `alpha-tree-view`, you need to use `<alpha-tree-item>`. When you declare an `<alpha-tree-item>`, the following attributes are available:

| Name     | type      | Description                                |
|----------|-----------|--------------------------------------------|
| expanded | `boolean` | Expands the node with child nodes attached |
| selected | `boolean` | Selects the item                           |

By default, the `tree-item` starts closed.

### Events

In order to interact with this component, you need to use events. These events can trigger specific functions in your application:

| Name            | Description                               |
|-----------------|-------------------------------------------|
| expanded-change | Fires this event when an item is expanded |
| selected-change | Fires this event when an item is selected |

:::warning
The `@click` event can also be used in this component, but it will be triggered even if the component is disabled.
:::

## Usage

Below are some examples of how to use the `<alpha-tree-view>` and `<alpha-tree-item>` component.

All the examples use the `alpha-design-system`. If you are using any other design system, change the declaration of this component accordingly.

- **Example 1**: A tree view with 3 items and three layers
```html title="Example 1"
<alpha-tree-view>
    <alpha-tree-item>
        Root
        <alpha-tree-item>
            Item 1
            <alpha-tree-item>Sub-item 1</alpha-tree-item>
            <alpha-tree-item>Sub-item 2</alpha-tree-item>
        </alpha-tree-item>
        <alpha-tree-item>Item 3</alpha-tree-item>
    </alpha-tree-item>
</alpha-tree-view>
```
- **Example 2**: A tree view with 3 items and three layers with 1 item disabled and 1 expended
```html title="Example 2"
<alpha-tree-view>
    <alpha-tree-item expended>
        Root
        <alpha-tree-item>
            Item 1
            <alpha-tree-item>Sub-item 1</alpha-tree-item>
            <alpha-tree-item disabled>Sub-item 2</alpha-tree-item>
        </alpha-tree-item>
        <alpha-tree-item>Item 3</alpha-tree-item>
    </alpha-tree-item>
</alpha-tree-view>
```

### Trigger an action
The `<alpha-tree-view>` and `<alpha-tree-item>` components have 2 custom events that can be used.

1. Create a function `functionName1()`, `functionName2()` in the class of the component:

```js {3,6}
export class TEMPLATE extends FASTElement {
    ...
    functionName1(){
        // Write an action here
    }
    functionName2(){
        // Write an action here
    }
    ...
}
```

2. Use the event `@expanded-change` or `@selected-change` to call your function:

```js {5,7}
    ...
    <zero-tree-view>
        <zero-tree-item>
        Root
        <zero-tree-item @expanded-change=${x => x.functionName1()}>
          Item 1
          <zero-tree-item @selected-change=${x => x.functionName2()}>Sub-item 1</zero-tree-item>
          <zero-tree-item>Sub-item 2</zero-tree-item>
        </zero-tree-item>
        <zero-tree-item>Item 3</zero-tree-item>
        </zero-tree-item>
    </zero-tree-view>
    ...
```

Remember that if an `<alpha-tree-item>` has an event attached, then it will replicate to all components inside it.
In this example, `funtionName1()` will be called twice if the sub-item 1 is selected:

```html
<zero-tree-item @selected-change=${x => x.funtionName1()}>
    Item 1
    <zero-tree-item @selected-change=${x => x.funtionName1()}>Sub-item 1</zero-tree-item>
    <zero-tree-item>Sub-item 2</zero-tree-item>
</zero-tree-item>
```

### Try yourself

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
- Navigation panel

## Additional resources

- [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#tree)
