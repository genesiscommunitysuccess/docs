---
title: "Dynamic Layout"
sidebar_label: "Dynamic Layout"
id: dynamic-layout
---

This page is a current PoC of the declarative API to live on top of golden layout using custom web components

### [API Docs](./docs/api/index.md)

## Declarative HTML API

The following example shows the usage of the declarative API with `zero-charts` and the output it will produce.
```html
<foundation-layout>
	<foundation-layout-region>
		<foundation-layout-item closable title="Pie">
			<zero-charts
				type="rose"
				:config=${(x) => x.roseConfig}
				:data=${(x) => x.roseData}
			></zero-charts>
		</foundation-layout-item>
		<foundation-layout-region type="vertical">
			<foundation-layout-item title="Positions Area Chart">
				<zero-charts type="area" :config=${(x) => x.areaConfig}>
					<charts-datasource
						resourceName="ALL_POSITIONS"
						server-fields="INSTRUMENT_NAME QUANTITY"
						charts-fields="type value"
						isSnapshot="true"
					></charts-datasource>
				</zero-charts>
			</foundation-layout-item>
			<foundation-layout-item title="Positions Column Chart">
				<zero-charts type="column" :config=${(x) => x.columnConfig}>
					<charts-datasource
						resourceName="ALL_POSITIONS"
						server-fields="INSTRUMENT_NAME QUANTITY"
						charts-fields="type value"
						isSnapshot="true"
					></charts-datasource>
				</zero-charts>
			</foundation-layout-item>
		</foundation-layout-region>
	</foundation-layout-region>
</foundation-layout>
```

![Example output of the declarative API with the zero charts](/img/foundation-layout-example.png)

### [Top Level Component `<foundation-layout>`](./docs/api/foundation-layout.foundationlayout.md)

Top level web component which is used to initialise a custom layout

  layout. Default false.
- **popout** : boolean attribute that if set will put popout buttons on the header bars. Default false.
- **maximise** : boolean attribute that if set will put maximise buttons on the header bars. Default false.
- **reload-buffer** : numerical attribute that controls the buffer between how long the layout is reloaded. The default
is 500ms and in this case the layout will only be reloaded if the child elements of the layout region are manipulated
once every 500ms. This is to stop the layout being reloaded over and over for every single item during initialisation.
The higher the value is the more performant the component is, but the first load will appear to take longer.

### [Layout Regions](./docs/api/foundation-layout.foundationlayoutregion.md)

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

### [Layout Item `<foundation-layout-item>`](./docs/api/foundation-layout.foundationlayoutitem.md)

Wrapper component that lives inside of a layout section and wraps the client content. All content must be inside of a layout item
otherwise a runtime error will be thrown when the layout is attempted to be rendered on screen

- **title**: string defining the title of the pane which contains the content. Defaults to `Item x`, where `x` is the pane number.
- **closable**: boolean defining whether this element is closable - Default false.
- **size**: optional string parameter defining size, [see here](#sizing).
- **registration**: optional string which manually sets the registered name for the pane- [see here](#dynamic-registration-and-adding-items). By default each item that doesn't have the `registration` attribute set will be a string registered sequentially starting at `"1"`.

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

## JavaScript API

The JavaScript API is [accessed through the methods on the root layout object](./docs/api/foundation-layout.foundationlayout.md) and allows for saving/loading the layout state, and dynamically adding items to the layout at runtime.

### Dynamic Registration and Adding Items

To have pane displayed on the layout system it must be *registered* with the layout system. When using the [declarative API](#declarative-html-api) the layout system takes care of this for you, but as you start to dynamically add items and then serialise the layout you need to consider which panes are registered.

:::tip
If you are only using the declarative API then you shouldn't need to set the registration names of any items as all the same items will be registered when you load a previously saved layout. If you are dynamically adding items too though it is highly recommended to manually set the registration names of items to make it easier to figure out what is and is not registered.
* When using the declarative API use the `registration` attribute on the `<foundation-layout-item>` component
* When using the JavaScript API set the `registration` optional parameter on the [registered element config](./docs/api/foundation-layout.registeredelementconfig.md).
:::

#### [Register Item](./docs/api/foundation-layout.foundationlayout.registeritem.md)

This API allows you to register an item at runtime, but it will not be displayed in the layout. This could be used to register components in anticipation of displaying them when loading a serialised layout - [see this example](#loading-serialised-layouts).

#### [Add Item](./docs/api/foundation-layout.foundationlayout.additem.md)

Register and add a pane to the layout at runtime.

#### [Get Registered Items](./docs/api/foundation-layout.foundationlayout.getregisterednames.md)

Static function to read a layout and return all of the registered names it requires to be loaded. [See this example](#loading-serialised-layouts).

### Serialising Layout

The JavaScript API can be used to save and load layout states. This only describes the state of the dynamic layout itself, it is the responsibility of any components contained within their layout to serialise their own state if required.

#### [Get Layout](./docs/api/foundation-layout.foundationlayout.getlayout.md)

Get an object describing the current layout so it can be restored at a later date. This does not save any data internally to the layout, it is up to the client to store this state where appropriate for later recall (browser local storage, persistence layer, etc.)

#### [Load Layout](./docs/api/foundation-layout.foundationlayout.loadlayout.md)

Loads a serialised layout. All items that are described in the config to load must already be registered with the layout system either with the declarative or JavaScript API. If there are items missing (could either be due to missing items or registered names mismatc) then a `LayoutUsageError` will be thrown containing the names of the missing items.

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

### Loading Serialised Layouts

This is an elaborate example of using the JavaScript API with consideration of the registered names. Before reading this example you should familiarise yourself with the [API Section](#javascript-api).

Consider the following example:
```html
<foundation-layout>
  <foundation-layout-region type="horizontal">
    <foundation-layout-item title="Trades" registration="trades">
      <!-- Content -->
    </foundation-layout-item>
    <foundation-layout-item title="Users" registration="users">
      <!-- Content -->
    </foundation-layout-item>
  </foundation-layout-region>
</foundation-layout>
```
We can use `getRegisteredNames()` on the config returned from `getLayout()` to see the registered names required to load the layout.
```javascript
const layout = document.querySelector('foundation-layout'); // as FoundatonLayout in TypeScript;
const layoutConfig = layout.getLayout();
console.log(FoundatonLayout.getRegisteredNames(layoutConfig))
```
This will log `['trades','users']` because these are the two registered panes. You can then load any layout that only contains either/both of these items.

Consider the situation where we dynamically add an item to the right hand side of the layout.
```javascript
const newItem = document.createElement('p'); //simple example
newItem.innerText = 'Test';

layout.addItem({
	elements: [newItem],
	registration: 'test',
});
const layoutConfigTwo = layout.getLayout()
console.log(FoundationLayout.getRegisteredNames(layoutConfigTwo));
```
Now we get `[ "test", "trades", "users"]` as the output, because to load `layoutConfigTwo` we now need all three of those registered panes.

Consider now where the user refreshes the page so are back to the original state of the layout with just the two elements added but we then try and load `layoutConfigTwo`:
```javascript
// User has refreshed page

console.log(FoundatonLayout.getRegisteredNames(layout.getLayout()));
// Ouputs ['trades','users']

layout.loadLayout(layoutConfigTwo);
// Uncaught Error: Trying to load layout with extra components. The component(s) not currently loaded are "test"
```
Notice the error message says that the `test` component is missing, this is because it was required as part of the layout when we used `getLayout()` but it hasn't been added as part of the layout now. If we added the item using either `registerItem()` or `addItem()` (which uses `registerItem` as part of the process of adding it to the layout) we could subsequently run `layout.loadLayout(layoutConfigTwo);` to successfully load the layout.

#### Proactively Registering Items

A simple approach you could take to ensure all items are registered for when you load a layout is to loop through all of your possible items that you could load and register them.
```javascript
const allItems = [
	{registration: 'trades', elements: [...], },
	{registration: 'users', elements: [...], },
	{registration: 'profiles', elements: [...], },
	{registration: 'notifications', elements: [...], },
];

allItems.forEach((reg) => {
	layout.registerItem(reg);
})
```
Now all of those items will be registered with the layout for potential use when calling `loadLayout()`.

#### Reactively Registering Items

Alternatively you could query the current layout and the layout we want to load to see if there are any missing registered items, and if so we can register them. Using our previous examples:
```javascript
const currentRegistrations = FoundatonLayout.getRegisteredNames(layout.getLayout());
// ['trades','users']
const requiredRegistrations = FoundatonLayout.getRegisteredNames(layoutConfigTwo);
// ['test','trades','users']

// We can see 'test' is missing and therefore we should register it
layout.registerItem({registration: 'test', elements: [...]});
```

:::info
Only items _missing_ from the `requiredRegistrations` is an issue. If there are items in the `currentRegistrations` that are not in `requiredRegistrations` this is *not* an issue because these will simply be unused registrations.
:::

## Incorrect Examples

The following section contains examples of incorrect usage for troubleshooting.

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
