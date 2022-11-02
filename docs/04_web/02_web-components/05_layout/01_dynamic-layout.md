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
- **maximise** : boolean attribute that if set will put maximise buttons on the header bars. Default false.

:::info
Even if the layout is not set to serialisable, this would not stop the client from grabbing a reference to the layout
in the DOM and manually saving/loading themselves. This will allow functionality such as being able to have multiple
premade layouts that the user could choose from.
:::

### Layout Regions

#### `<foundation-layout-region type="vertical">`

Indicates to the layout system that all immediate children are (by default) to be split equally among the available space of this
component using n-1 vertical split(s). Can be nested within other horizontal and vertical regions.

#### `<foundation-layout-region type="horizontal">`

Indicates to the layout system that all immediate children are (by default) to be split equally among the available space of this
component using n-1 horizontal split(s). Can be nested within other horizontal and vertical regions.

#### `<foundation-layout-region type="tabs">`

Indicates to the layout system that all immediate children are to be added as tabs in the available space of this component,
with a tab for each child. The tabs will be ordered according to which child the layout item is (e.g. the second `<foundation-layout-item>`
 of the tab split will be the second tab), and the first child will be the one which is open by default. Can be nested within horizontal
 and vertical regions, but cannot have more layout sections inside of it.

#### Attributes

Each of the three layout sections have the same two _optional_ attributes.

- **height**: number defining the height of this item, relative to the other children of its parent in percent
- **width**: number defining the width of this item, relative to the other children of its parent in percent

:::warning
Currently the DSL team allow specification of sizes in more than just %, pixel width/height for example. This is something we may need to come back
to later. I used % because that is what the Golden Layout API supports, but we could add these extra sizes as part of my substrate API (not MVP though?)
:::

### Layout Item `<foundation-layout-item>`

Wrapper component that lives inside of a layout section and wraps the client content. All content must be inside of a layout item
otherwise a runtime error will be thrown when the layout is attempted to be rendered on screen

- **title**: string defining the title of the pane which contains the content
- **closable**: boolean defining whether this element is closable - Default false.
- **height**: number defining the height of this item, relative to the other children of its parent in percent
- **width**: number defining the width of this item, relative to the other children of its parent in percent

## Examples

Simple example with a vertical split and two items that will take up equal space.

```html
<foundation-layout>
  <foundation-layout-region type="vertical">
    <foundation-layout-item title="Component 1">
      <!-- Content -->
    </foundation-layout-item>
    <foundation-layout-item title="Component 2">
      <!-- Content -->
    </foundation-layout-item>
  </foundation-layout-region type="vertical">
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
<foundation-layout serialisable>
  <foundation-layout-region type="horizontal">
    <foundation-layout-item title="Component 1" width="25" closable>
      <!-- Content -->
    </foundation-layout-item>

    <foundation-layout-region type="vertical">
      <foundation-layout-item title="Component 2">
        <!-- Content -->
      </foundation-layout-item>
      <foundation-layout-item title="Component 3">
        <!-- Content -->
      </foundation-layout-item>
    </foundation-layout-region type="vertical">
  </foundation-layout-region type="horizontal">

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
<foundation-layout serialisable>
  <foundation-layout-region type="horizontal">
    <foundation-layout-item title="Component 1" width="25" closable>
      <!-- Content -->
    </foundation-layout-item>

    <foundation-layout-region type="vertical">
      <foundation-layout-region type="horizontal">
        <foundation-layout-item title="Component 2">
          <!-- Content -->
        </foundation-layout-item>
        <foundation-layout-item title="Component 3">
          <!-- Content -->
        </foundation-layout-item>
        <foundation-layout-item title="Component 4">
          <!-- Content -->
        </foundation-layout-item>
      </foundation-layout-region type="horizontal">

      <foundation-layout-region type="tabs">
        <foundation-layout-item title="Component 5">
          <!-- Content -->
        </foundation-layout-item>
        <foundation-layout-item title="Component 6">
          <!-- Content -->
        </foundation-layout-item>
      </foundation-layout-region type="tabs">
    </foundation-layout-region type="vertical">
  </foundation-layout-region type="horizontal">

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

### Using Directives

You should be able to use [FAST template directives](https://www.fast.design/docs/fast-element/using-directives) such as `repeat`

```javascript
interface Position {
	symbol: string;
}

class Commodities extends FASTElement {
	@observable positions: Position[]

	...
}

const template = html<Commodities>`
<foundation-layout>
	<foundation-layout-region type="horizontal">
		${when(x => x.positions, html<Position>`
			<foundation-layout-item title="${x => x.symbol}">
				<chart symbol="${x => x.symbol}"></chart>
			</foundation-layout-item>`)}
	</foundation-layout-region>
</foundation-layout>`;
```

For an example where the `Commodities` object has three positions you will see the following output:
```
+-----------------------------------------------------+
|              Component 1 Contents                   |
+-----------------------------------------------------+
|              Component 2 Contents                   |
+-----------------------------------------------------+
|              Component 3 Contents                   |
+-----------------------------------------------------+
```


:::note
`<chart>` is just an example component, it doesn't exist within `foundation-ui`.
:::

:::Note to self
I need to check `when` directives
:::

### Incorrect Examples

The following example is invalid:
```html
<foundation-layout>
  <foundation-layout-region type="vertical">
    <h1>My splits</h1>
    <foundation-layout-item title="Component 1">
      <!-- Content -->
    </foundation-layout-item>
    <foundation-layout-item title="Component 2">
      <!-- Content -->
    </foundation-layout-item>
  </foundation-layout-region type="vertical">
</foundation-layout>
```
This is because there is a child of one of the layout regions which isn't another layout region or
layout item (the `<h1>`). This will throw a runtime error.

<br/>

The following example is invalid:

```html
<foundation-layout>
	<foundation-layout-region type="tabs">

		<foundation-layout-region type="vertical">
			<foundation-layout-item title="Component 1">
				<!-- Content -->
			</foundation-layout-item>
			<foundation-layout-item title="Component 2">
				<!-- Content -->
			</foundation-layout-item>
		</foundation-layout-region type="vertical">

		<foundation-layout-item title="Component 3">
			<!-- Content -->
		</foundation-layout-item>

	</foundation-layout-region type="tabs">
</foundation-layout>
```
This is because you cannot have more layout regions nested inside of a tab regions. You will get undefined behaviour.

