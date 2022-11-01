---
title: "Dynamic Layout"
sidebar_label: "Dynamic Layout"
id: dynamic-layout
---

This page is a current PoC of the declarative API to live on top of golden layout using custom web components

:::info
The client can still access the Golden Layout object in order to use it's base API such as for adding new
components into the layout dynamically.
:::

## Defintion

:::info
All names are subject to change until we have agreement. The main purpose of this document is to agree upon the
different components and what their attributes will be.
:::

### Top Level Component `<foundation-layout>`

Top level web component which is used to initialise a custom layout

- **serialisable** : boolean attribute that if set will add controls for saving, loading, and resetting the
  layout. Default false.
- **popout** : boolean attribute that if set will put popout buttons on the header bars. Default false.
- **closable** : boolean attribute that if set will put close buttons on the header bars. Default false.
- **maximise** : boolean attribute that if set will put maximise buttons on the header bars. Default false.

:::info
Even if the layout is not set to serialisable, this would not stop the client from grabbing a reference to the layout
in the DOM and manually saving/loading themselves. This will allow functionality such as being able to have multiple
premade layouts that the user could choose from.
:::

### Layout Sections

#### `<foundation-vertical-split>`

Indicates to the layout system that all immediate children are (by default) to be split equally among the available space of this
component using n-1 vertical split(s). Can be nested within other horizontal and vertical splits.

#### `<foundation-horizontal-split>`

Indicates to the layout system that all immediate children are (by default) to be split equally among the available space of this
component using n-1 horizontal split(s). Can be nested within other horizontal and vertical splits.

#### `<foundation-tab-split>`

Indicates to the layout system that all immediate children are to be added as tabs in the available space of this component,
with a tab for each child. The tabs will be ordered by their position as the children of this tag, and the first child will
be the one which is open by default. Can be nested within horizontal and vertical splits, but cannot have more layout sections inside
of it.

#### Attributes

Each of the three layout sections have the same two _optional_ attributes.

- **height**: number defining the height of this item, relative to the other children of its parent in percent
- **width**: number defining the width of this item, relative to the other children of its parent in percent

### Layout Item `<foundation-layout-item>`

Wrapper component that lives inside of a layout section and wraps the client content. All content must be inside of a layout item
otherwise a runtime error will be thrown when the layout is attempted to be rendered on screen

- **title**: string defining the title of the pane which contains the content
- **closable**: boolean defining whether this element is closeable - if the root layout item is set to be **closable** but a specific
  item is not then it will not show the close button. Default false.
- **height**: number defining the height of this item, relative to the other children of its parent in percent
- **width**: number defining the width of this item, relative to the other children of its parent in percent

### Initialisation `<foundation-layout-init>`

Component which bubbles up an event to the root element to initalise the layout component. This will be the last child of the root element
and if it isn't present then the layout will not correctly instantiate.

#### Discussion

This item is required so solve the issue of knowing when all of the elements are instantiated so we can move them into the layout. To implement
this declarative API we allow the browser to instantiate all of the elements according to the html, and then we use the DOM API to move them into
the layout items that Golden Layout uses. We clearly only want to do this when all the items are instantiated, if we do it in the connected callback
of the root element this runs before all it's children are instantiated so it doesn't work. I theorised three solutions to this, ranked from my least to
most favourite:

1. Let the client handle it - they can grab a reference to the top level element in the DOM and run the golden layout init
2. Use `setTimeout` to have a delay so the child elements have time to instantiate. Could be a configurable length and show a placeholder loading icon.
3. Use the `<foundation-layout-init>` component which will bubble up an event when it is instantiated to the layout root, and at that point it knows
   that all child elements will be on the DOM and the layout can be initiated automatically.

## Examples

Simple example with a vertical split and two items that will take up equal space.

```html
<foundation-layout>
  <foundation-vertical-split>
    <foundation-layout-item title="Component 1">
      <!-- Content -->
    </foundation-layout-item>
    <foundation-layout-item title="Component 2">
      <!-- Content -->
    </foundation-layout-item>
  </foundation-vertical-split>
  <foundation-layout-init></foundation-layout-init>
</foundation-layout>
```

Will be rendered as:

```
+-----------------------------------------------------+
|                                                     |
|              Component 1 Contents                   |
|                                                     |
+-----------------------------------------------------+
|                                                     |
|              Component 2 Contents                   |
|                                                     |
+-----------------------------------------------------+
```

<br/>
Slightly more complicated example:

```html
<foundation-layout serialisable closeable>
  <foundation-horizontal-split>
    <foundation-layout-item title="Component 1" width="25" closeable>
      <!-- Content -->
    </foundation-layout-item>

    <foundation-vertical-split>
      <foundation-layout-item title="Component 2">
        <!-- Content -->
      </foundation-layout-item>
      <foundation-layout-item title="Component 3">
        <!-- Content -->
      </foundation-layout-item>
    </foundation-vertical-split>
  </foundation-horizontal-split>

  <foundation-layout-init></foundation-layout-init>
</foundation-layout>
```

Would render the following:

```
+-------------+---------------------------------------+
|             |                                       |
|             |        Component 2 Contents           |
|  Component  |                                       |
|      1      +---------------------------------------+
|  Contents   |                                       |
|             |        Component 3 Contents           |
|             |                                       |
+-------------+---------------------------------------+
```

Where there is a button to save/load/reset the layout, and component 1 has a close button. By default
component 1 would be 50% width and 2 and 3 would take up the other 50% width, but here we set `25` (percent)
as the width of component 1 layout item.

If instead we had:

```html
<foundation-layout serialisable closeable>
  <foundation-horizontal-split>
    <foundation-layout-item title="Component 1" width="25" closeable>
      <!-- Content -->
    </foundation-layout-item>

    <foundation-vertical-split>
      <foundation-horizontal-split>
        <foundation-layout-item title="Component 2">
          <!-- Content -->
        </foundation-layout-item>
        <foundation-layout-item title="Component 3">
          <!-- Content -->
        </foundation-layout-item>
        <foundation-layout-item title="Component 4">
          <!-- Content -->
        </foundation-layout-item>
      </foundation-horizontal-split>

      <foundation-tab-split>
        <foundation-layout-item title="Component 5">
          <!-- Content -->
        </foundation-layout-item>
        <foundation-layout-item title="Component 6">
          <!-- Content -->
        </foundation-layout-item>
      </foundation-tab-split>
    </foundation-vertical-split>
  </foundation-horizontal-split>

  <foundation-layout-init></foundation-layout-init>
</foundation-layout>
```

Would render the following:

```
+-------------+------------+-------------+------------+
|             |            |             |            |
|             |   Comp 2   |    Comp 3   |   Comp 4   |
|  Component  |            |             |            |
|      1      +------------+-------------+------------+
|  Contents   |_5_|_6_|                               |
|             |        Component 5 Contents           |
|             |                                       |
+-------------+---------------------------------------+
```
Where there is a button to save/load/reset the layout, and component 1 has a close button. Component 1
takes up 25% of the initial width. Components 2,3,4 take up a third of the _remaining_ width between them
(default behaviour) and 5 and 6 are tabbed.

### Incorrect Examples

The following example is invalid:
```html
<foundation-layout>
  <foundation-vertical-split>
    <h1>My splits</h1>
    <foundation-layout-item title="Component 1">
      <!-- Content -->
    </foundation-layout-item>
    <foundation-layout-item title="Component 2">
      <!-- Content -->
    </foundation-layout-item>
  </foundation-vertical-split>
  <foundation-layout-init></foundation-layout-init>
</foundation-layout>
```
This is because there is a child of one of the layout sections which isn't another layout section or
layout item (the `<h1>`). This will throw a runtime error.

<br/>

The following example is invalid:

```html
<foundation-layout>
	<foundation-tab-split>

		<foundation-vertical-split>
			<foundation-layout-item title="Component 1">
				<!-- Content -->
			</foundation-layout-item>
			<foundation-layout-item title="Component 2">
				<!-- Content -->
			</foundation-layout-item>
		</foundation-vertical-split>

		<foundation-layout-item title="Component 3">
			<!-- Content -->
		</foundation-layout-item>

	</foundation-tab-split>
  <foundation-layout-init></foundation-layout-init>
</foundation-layout>
```
This is because you cannot have more layout sections nested inside of a tab split. You will get undefined behaviour.

<br/>

The following example is invalid:

```html
<foundation-layout>
  <foundation-tab-split>
    <foundation-layout-item title="Component 1">
      <!-- Content -->
    </foundation-layout-item>
    <foundation-layout-item title="Component 2">
      <!-- Content -->
    </foundation-layout-item>
  </foundation-tab-split>
</foundation-layout>
```
While this would be a valid layout, we are missing `<foundation-layout-init></foundation-layout-init>` so this layout
will never initialise.
