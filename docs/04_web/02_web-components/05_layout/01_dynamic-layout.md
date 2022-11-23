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
- **reload-buffer** : numerical attribute that controls the buffer between how long the layout is reloaded. The default
is 500ms and in this case the layout will only be reloaded if the child elements of the layout region are manipulated
once every 500ms. This is to stop the layout being reloaded over and over for every single item during initialisation.
The higher the value is the more performant the component is, but the first load will appear to take longer.

:::info
Even if the layout is not set to serialisable, this would not stop the client from grabbing a reference to the layout
in the DOM and manually saving/loading themselves. This will allow functionality such as being able to have multiple
premade layouts that the user could choose from.
:::

### Layout Regions

If you don't specify the `type` of the layout region it will default to `type="horizontal"`;

- **type**: `vertical`, `horizontal`, `tabs` (default `horizontal`).
- **size**: optional string parameter defining size, [see here](#sizing).

#### `<foundation-layout-region type="vertical">`

Indicates to the layout system that all immediate children are (by default) to be split equally among the available space of this
component using n-1 row split(s). Can be nested within other horizontal and vertical regions.

#### `<foundation-layout-region type="horizontal">`

Indicates to the layout system that all immediate children are (by default) to be split equally among the available space of this
component using n-1 column split(s). Can be nested within other horizontal and vertical regions.

#### `<foundation-layout-region type="tabs">`

Indicates to the layout system that all immediate children are to be added as tabs in the available space of this component,
with a tab for each child. The tabs will be ordered according to which child the layout item is (e.g. the second `<foundation-layout-item>`
 of the tab split will be the second tab), and the first child will be the one which is open by default. Can be nested within horizontal
 and vertical regions, but cannot have more layout sections inside of it.

### Layout Item `<foundation-layout-item>`

Wrapper component that lives inside of a layout section and wraps the client content. All content must be inside of a layout item
otherwise a runtime error will be thrown when the layout is attempted to be rendered on screen

- **title**: string defining the title of the pane which contains the content. Defaults to `Item x`, where `x` is the pane number.
- **closable**: boolean defining whether this element is closable - Default false.
- **size**: optional string parameter defining size, [see here](#sizing).

### Sizing

The layout sections and layout item all have an _optional_ attribute:

- **size**: string defining the size. For rows, it specifies height. For columns, it specifies width. Has format `<number><size-unit>`.
	Currently only supports units `fr` and `%`. Space is first proportionally allocated to items with sizeUnit `%`. If there is any space
	left over (less than 100% allocated), then the remainder is allocated to the items with unit `fr` according to the fractional size.
	If more than 100% is allocated, then an extra 50% is allocated to items with unit `fr` and is allocated to each item according to its
	fractional size. All item sizes are then adjusted to bring the total back to 100%.

:::info
The size is defining the size of the component _compared_ to the siblings _within_ the context of the component's parent.
:::

:::warning
Currently the DSL team allow specification of sizes in more than just %, pixel width/height for example. This is something we may need to come back
to later. I used % because that is what the Golden Layout API supports, but we could add these extra sizes as part of my substrate API (not MVP though?)
:::

## Examples

### Simple Example

Simple example with a vertical split and two items that will take up equal space.

```html
<foundation-layout>
  <foundation-layout-region type="horizontal">
    <foundation-layout-item title="Component 1">
      <!-- Content -->
    </foundation-layout-item>
    <foundation-layout-item title="Component 2">
      <!-- Content -->
    </foundation-layout-item>
  </foundation-layout-region>
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

### Nested Example

Slightly more complicated example:

```html
<foundation-layout serialisable>
  <foundation-layout-region type="vertical">
    <foundation-layout-item title="Component 1" size="25%" closable>
      <!-- Content -->
    </foundation-layout-item>

    <foundation-layout-region type="horizontal">
      <foundation-layout-item title="Component 2">
        <!-- Content -->
      </foundation-layout-item>
      <foundation-layout-item title="Component 3">
        <!-- Content -->
      </foundation-layout-item>
    </foundation-layout-region>
  </foundation-layout-region>

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
component 1 would be 50% width and 2 and 3 would take up the other 50% width, but here we set `25%`
as the width of component 1 layout item (width because it is the size in the context of a vertical split).

### Multi-Nested Example

If instead we had:

```html
<foundation-layout serialisable>
  <foundation-layout-region type="vertical">
    <foundation-layout-item title="Component 1" size="25%" closable>
      <!-- Content -->
    </foundation-layout-item>

    <foundation-layout-region type="horizontal">
      <foundation-layout-region type="vertical">
        <foundation-layout-item title="Component 2">
          <!-- Content -->
        </foundation-layout-item>
        <foundation-layout-item title="Component 3">
          <!-- Content -->
        </foundation-layout-item>
        <foundation-layout-item title="Component 4">
          <!-- Content -->
        </foundation-layout-item>
      </foundation-layout-region>

      <foundation-layout-region type="tabs">
        <foundation-layout-item title="Component 5">
          <!-- Content -->
        </foundation-layout-item>
        <foundation-layout-item title="Component 6">
          <!-- Content -->
        </foundation-layout-item>
      </foundation-layout-region>
    </foundation-layout-region>
  </foundation-layout-region>

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

### `repeat` Directive

You can use [FAST template directives](https://www.fast.design/docs/fast-element/using-directives) such as `repeat`

```javascript
interface Position {
	symbol: string;
}

class Commodities extends FASTElement {
	positions: Position[] // Not @observable - see following section

	...
}

const template = html<Commodities>`
<foundation-layout>
	<foundation-layout-region type="vertical">
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

### `when` Directive

Using the `when` directive:

```javascript
@customElement({
	name: 'my-element',
	template,
})
class Analytics extends FASTElement {
	showIndexFunds = true; // not @observable
}

var template = html<Analytics>`
	<button class="toggle">Toggle Index</button>
	<foundation-layout>
		<foundation-layout-region>
			<foundation-layout-item>
				<chart type="stocks"></chart>
			</foundation-layout-item>

			${when(x => x.showIndexFunds, html`
				<foundation-layout-item>
					<chart type="index-funds"></chart>
				</foundation-layout-item>
			`)}

		</foundation-layout-region>
	</foundation-layout>
`;
```

You would see both items rendered like this:
```
+---------------------------------------------+
|              Stocks Chart                   |
+---------------------------------------------+
|              Index  Chart                   |
+---------------------------------------------+
```

If you had `showIndexFunds = false;` then only the `Stocks Chart` would be rendered.

:::danger
Directives are for initialising the layout only and should *not* be used with changing `@observable` attributes which would cause the
layout to reinitialise incorrectly - this will duplicate the panels and remove their contents. For example, you can use the
`when` directive to conditionally render a pane during initialisation, but not to toggle whether to show/hide the pane afterwards.
See [this example](#observables-with-directives).
:::

### Multiple Instances

Consider the following example:
```html
<div class="container" style="display: grid; grid-template-columns: 1fr; grid-auto-rows: minmax(46vh, auto)">
	<div style="display: block; position: relative;">
		<foundation-layout>
			<foundation-layout-region>
				<foundation-layout-item><h1>Item 1</h1></foundation-layout-item>
				<foundation-layout-item><h1>Item 2</h1></foundation-layout-item>
			</foundation-layout-region>
		</foundation-layout>
	</div>
	<div style="display: block; position: relative;">
		<foundation-layout>
			<foundation-layout-region type="vertical">
				<foundation-layout-item><h1>Item 3</h1></foundation-layout-item>
				<foundation-layout-item><h1>Item 4</h1></foundation-layout-item>
			</foundation-layout-region>
		</foundation-layout>
	</div>
</div>
```

This describes the following layout:
```
+---------------------------------------------+
|                   Item 1                    |
+---------------------------------------------+
|                   Item 2                    |
+---------------------------------------------+

+----------------------+----------------------+
|                      |                      |
|       Item 3         |        Item 4        |
|                      |                      |
+----------------------+----------------------+
```
Here a grid region has been used to style two completely separate instances of the dynamic layout. Even though we have named each
`<h1>` sequentially, the two layouts are completely separate and the default titles of each tab (Item 1 and Item 2 for both layouts),
will reflect this. You can configure each layout separately, and you cannot drag layout items from one layout into the other one.

:::info
This is just an example, you could have more than two layouts on a page or style them with a different method to the grid.
:::

## Incorrect Examples

### Non-Layout Child

The following example is invalid:
```html
<foundation-layout>
  <foundation-layout-region type="horizontal">
    <h1>My splits</h1>
    <foundation-layout-item title="Component 1">
      <!-- Content -->
    </foundation-layout-item>
    <foundation-layout-item title="Component 2">
      <!-- Content -->
    </foundation-layout-item>
  </foundation-layout-region>
</foundation-layout>
```
This is because there is a child of one of the layout regions which isn't another layout region or
layout item (the `<h1>`). This will throw a runtime error.

### Layout Region in Tabs

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
		</foundation-layout-region>

		<foundation-layout-item title="Component 3">
			<!-- Content -->
		</foundation-layout-item>

	</foundation-layout-region>
</foundation-layout>
```
This is because you cannot have more layout regions nested inside of a tab regions. You will get undefined behaviour.


### Multiple Items in Root

The following example is invalid:

```html
<foundation-layout>
		<foundation-layout-item title="Component 1">
			<!-- Content -->
		</foundation-layout-item>
		<foundation-layout-item title="Component 2">
			<!-- Content -->
		</foundation-layout-item>
		<foundation-layout-item title="Component 3">
			<!-- Content -->
		</foundation-layout-item>
</foundation-layout>
```
This is because you cannot have multiple layout elements as the immediate child of the layout root. You will get a runtime error.

### Nested Item

The following example is invalid:

```html
<foundation-layout>
		<foundation-layout-item title="Component 1">
			<foundation-layout-item title="Component 2">
				<!-- Content -->
			</foundation-layout-item>
			<foundation-layout-item title="Component 3">
				<!-- Content -->
			</foundation-layout-item>
		</foundation-layout-item>
</foundation-layout>
```
This is because you cannot have `<foundation-layout-item>` inside of other `<foundation-layout-item>`. You will get a runtime error.

### Observables with Directives

The following is invalid:

```javascript
@customElement({
	name: 'my-element',
	template,
})
class Analytics extends FASTElement {
	@observable showIndexFunds = true;

	toggleShowIndexFunds() {
		this.showIndexFunds = !this.showIndexFunds;
	}
}

var template = html<Analytics>`
	<button
		class="toggle"
		@click=${x => x.toggleShowIndexFunds()}
	>Toggle Index</button>
	<foundation-layout>
		<foundation-layout-region>
			<foundation-layout-item>
				<chart type="stocks"></chart>
			</foundation-layout-item>

			${when(x => x.showIndexFunds, html`
				<foundation-layout-item>
					<chart type="index-funds"></chart>
				</foundation-layout-item>
			`)}

		</foundation-layout-region>
	</foundation-layout>
`;
```

Initially you will see both items correctly rendered like this:
```
+---------------------------------------------+
|              Stocks Chart                   |
+---------------------------------------------+
|              Index  Chart                   |
+---------------------------------------------+
```
But as the user clicks the toggle button the `Index Chart` will not be taken away and added back in.
Instead it will be added as a duplicate every time the observable is set true. Additionally the contents
of the panel will be wiped as duplicates are added.

To work around this you would use of FAST directives inside of custom web components inside of the layout.
<!-- In future you would correctly implement this behaviour by interacting with the JavaScript API. -->
