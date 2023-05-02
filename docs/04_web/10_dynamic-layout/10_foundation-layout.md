---
title: 'Foundation Layout'
sidebar_label: 'Foundation Layout'
id: foundation-layout
keywords: [web, layout, foundation layout, frontend, ui, golden layout]
tags:
  - web
  - layout
  - foundation layout
  - frontend
  - ui
  - golden layout
---

# Genesis Foundation UI App Layout

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

### [API Docs](./docs/api/index.md)

## Declarative HTML API

The following example shows the usage of the declarative API with `zero-charts` and the output that it produces.
```html
<foundation-layout ${ref('analyticsLayout')}>
	<foundation-layout-region>
		<foundation-layout-region type="horizontal">
			<foundation-layout-item title="Static Data Bar" registration="bar" closable>
				<foundation-g2plot-chart
					type="bar"
					:config=${(x) => x.barConfig}
					:data=${(x) => x.barData}
				></foundation-g2plot-chart>
			</foundation-layout-item>
		<foundation-layout-region type="vertical">
			<foundation-layout-item title="Static Data Stock" registration="stock" closable>
				<foundation-g2plot-chart
					type="stock"
					:config=${(x) => x.stockConfiguration}
					:data=${(x) => x.stockData}
				></foundation-g2plot-chart>
			</foundation-layout-item>
			<foundation-layout-item title="Static Data Rose" registration="rose" closable>
				<foundation-g2plot-chart
					type="rose"
					:config=${(x) => x.roseConfig}
					:data=${(x) => x.roseData}
					:legendParser=${(x) => x.roseLegendParser()}
				></foundation-g2plot-chart>
			</foundation-layout-item>
		</foundation-layout-region>
	</foundation-layout-region>
</foundation-layout>
```

![Example output of the declarative API with the zero charts](./docs/img/foundation-layout-example.png)

## Set-up

### Basic install

To enable this module in your application, follow the steps below.

1. Add `@genesislcap/foundation-layout` as a dependency in your **package.json** file. Whenever you change the dependencies of your project, ensure you run the `$ npm run bootstrap` command again. You can find more information in the [package.json basics](../../../web/basics/package-json-basics/) page.

```javascript
{
  ...
  "dependencies": {
    "@genesislcap/foundation-layout": "latest"
  },
  ...
}
```

2. Register the layout with the design system. This is probably in a file called **components.ts**, located where you call `.register()` on the design system.

```javascript
FoundationDesignSystem: registerFoundationDesignSystem().register(
	// ...Other registrations
	// add foundationLayoutComponents here
	foundationLayoutComponents,
)
```

- This registers the three custom elements for use in your application. The components will use the prefix of the design system as their prefix. For example, the root component will be `<foundation-layout>` in the `Foundation` design system, and `<zero-layout>` in the `Zero (alpha)` design system.

:::info
For the rest of this document, the components will be referred to with the `foundation-` prefix.
:::

### Custom styling

The required class, template, and base styles are exported as part of the package, allowing a client to customise the styling of the layout system via design system extensions.

:::tip
All the customisable styles of the layout system are contained within the styles for [`<foundation-layout>`](./docs/api/foundation-layout.foundationlayout.md). So if you want to customise the styles in addition to setting the css variables, you only need to set the styles here.
:::

### [Top Level Component `<foundation-layout>`](./docs/api/foundation-layout.foundationlayout.md)

Top level web component, which is used to initialise a custom layout

- **reload-buffer** : numerical attribute that controls the buffer between how long the layout is reloaded. The default
is 500ms. In this case, the layout is only reloaded if the child elements of the layout region are manipulated
once every 500ms. This is to stop the layout being reloaded over and over for every single item during initialisation.
The higher the value is, the more performant the component is - but the first load will appear to take longer.
- **auto-save-key** : optional string which if set, will enable autosaving the layout under this key in local
storage. See [here](#autosaving-layout) for more.

:::tip
This only applies for usage with the declarative HTML API. When the layout first loads after this amount of time,
it emits an [event](#event).
:::

### [Layout Regions](./docs/api/foundation-layout.foundationlayoutregion.md)

If you don't specify the `type` of the layout region, it defaults to `type="horizontal"`;

- **type**: `vertical`, `horizontal`, `tabs` (default `horizontal`).
- **size**: optional string parameter defining size, [see here](#sizing).

#### `<foundation-layout-region type="vertical">`

Indicates to the layout system that all immediate children are (by default) to be split equally within the available space of this
component using n-1 column split(s). Can be nested within other horizontal and vertical regions.

#### `<foundation-layout-region type="horizontal">`

Indicates to the layout system that all immediate children are (by default) to be split equally among the available space of this
component using n-1 row split(s). Can be nested within other horizontal and vertical regions.

#### `<foundation-layout-region type="tabs">`

Indicates to the layout system that all immediate children are to be added as tabs in the available space of this component,
with a tab for each child. The tabs are ordered according to which child the layout item is (e.g. the second `<foundation-layout-item>`
 of the tab split is the second tab). The first child will be the one that is open by default. Can be nested within horizontal
 and vertical regions, but cannot have more layout sections inside it.

### [Layout Item `<foundation-layout-item>`](./docs/api/foundation-layout.foundationlayoutitem.md)

Wrapper component that lives inside a layout section and wraps the client content. All content must be inside a layout item,
otherwise a runtime error will be thrown when the layout attempts to render itself on screen.

- **title**: string defining the title of the pane that contains the content. Defaults to `Item x`, where `x` is the pane number.
- **closable**: boolean defining whether this element is closable - Default false.
- **size**: optional string parameter defining size, [see here](#sizing).
- **registration**: optional string, which manually sets the registered name for the pane - [see here](#dynamic-registration-and-adding-items). By default, each item that doesn't have the `registration` attribute set will be a string registered sequentially starting at `"1"`.

### Sizing

The layout sections and layout item all have an _optional_ attribute:

- **size**: string defining the size. For rows, it specifies height. For columns, it specifies width. Has format `<number><size-unit>`.
	Currently only supports units `fr` and `%`. Space is first proportionally allocated to items with sizeUnit `%`. If there is any space
	left over (less than 100% allocated), then the remainder is allocated to the items with unit `fr` according to the fractional size.
	If more than 100% is allocated, then an extra 50% is allocated to items with unit `fr` and is allocated to each item according to its
	fractional size. All item sizes are then adjusted to bring the total back to 100%.

:::info
The size defines the size of the component _compared_ to the siblings _within_ the context of the component's parent.
:::

## JavaScript API

The JavaScript API is [accessed through the methods on the root layout object](./docs/api/foundation-layout.foundationlayout.md) and allows for saving/loading the layout state, and dynamically adding items to the layout at runtime.

### Dynamic registration and adding items

To have a pane displayed on the layout system, it must be *registered* with the layout system. When using the [declarative API](#declarative-html-api), the layout system takes care of this for you, but as you start to add items dynamically and then serialise the layout, you need to consider which panes are registered. See [this contained example](#contained-example), which allows the user to add pre-determined items to the layout dynamically.

:::tip
If you are only using the declarative API, and not using any dynamic integrations with JavaScript, then you shouldn't need to set the registration names of any items, as all the same items will be registered when you load a previously saved layout. If you are dynamically adding items as well, it is highly recommended to set the registration names of items manually. This makes it easier to figure out what is and is not registered.
* When using the declarative API, use the `registration` attribute on the `<foundation-layout-item>` component.
* When using the JavaScript API, set the `registration` optional parameter on the [registered element config](./docs/api/foundation-layout.registeredelementconfig.md).
:::

#### [Register Item](./docs/api/foundation-layout.foundationlayout.registeritem.md)

This API enables you to register an item at runtime, but it will not be displayed in the layout. This could be used to register components in anticipation of displaying them when loading a serialised layout - [see this example](#loading-serialised-layouts).

#### [Add Item](./docs/api/foundation-layout.foundationlayout.additem.md)

Add an item that has previously been registered with the layout.

#### [Layout Required Registrations](./docs/api/foundation-layout.foundationlayout.layoutrequiredregistrations.md)

Static function to read a layout config. It returns a list of all the required registrations required to load it in the layout system. [See this example](#loading-serialised-layouts).

#### [Get Current Registrations](./docs/api/foundation-layout.foundationlayout.registereditems.md)

Returns a list of all the items currently registered with the layout system.

:::tip
Use this function over `.layoutRequiredRegistrations(layout: SerialisedLayout)` to get the *current* registrations, because that will miss any items that are currently registered with the layout system, but which are not shown on the layout.
:::

### Serialising layout

The JavaScript API can be used to manually save and load layout states. This only describes the state of the dynamic layout itself. It is the responsibility of any components contained within their layout to serialise their own state, if required.
To enable autosaving the layout see [here](#autosaving-layout).

#### [Get Layout](./docs/api/foundation-layout.foundationlayout.getlayout.md)

Get an object describing the current layout so that it can be restored at a later date. This does not save any data internally to the layout. It is up to the client to store this state where appropriate for later recall (browser local storage, persistence layer, etc.)

#### [Load Layout](./docs/api/foundation-layout.foundationlayout.loadlayout.md)

Loads a serialised layout. All items that are described in the config to load must already be registered with the layout system - using either the declarative or JavaScript API. If there are items missing (could be due either to missing items or to a mismatch of registered names) then a `LayoutUsageError` will be thrown containing the names of the missing items.

## Events

### [Emitted Events](./docs/api/foundation-layout.layoutemitevents.md)

Certain actions that are performed by the user interacting with the layout emit events. See the API document linked for the events and when they're emitted. Interacting with these events allows your client code to dynamically interact with the layout, such as enabling/disabling buttons to add items to the layout when they're removed/added.

### [Received Events](./docs/api/foundation-layout.layoutreceiveevents.md)

Certain events are listened to by the container for each component, enabling the component to interact with the layout. For example, a component could emit an event to change the title of the containing window.
```typescript
this.$emit(eventType, eventDetail)
```
Each event requires a certain detail to process the event - see [the map of events to their required details](./docs/api/foundation-layout.layoutreceiveeventsdetail.md).

## Autosaving layout

There is opt-in functionality provided in the layout to autosave the layout in local storage as the user interacts with it. Set the `auto-save-key` attribute to a unique string on the root element to enable the feature, and this is the key in which the layout will be saved into. As the user performs the following actions: adding an item, removing an item, resizing items using the divider, and dragging items around the layout - the layout will be saved for later recall in local storage.

When you have enabled autosave you are still able to use the manual [serialising commands](#serialising-layout).

### Reloading the layout

The provided function [tryLoadLayoutFromLocalStorage()](./docs/api/foundation-layout.foundationlayout.tryloadlayoutfromlocalstorage.md) is used to rehydrate the layout from local storage, if `auto-save-key` is enabled.
If you are using the declarative API then this function is automatically called for you.

If you are manually registering items (too) using the JavaScript API you must manually call this function, immediately after you have finishing registering all of the items. For an example [see here](#contained-example).

### Layout placeholder

If the layout is auto-loaded with items that are missing from the registration, then a placeholder item is displayed instead. Additionally, the close option is added to the pane. This accounts for you removing an item from a layout that a user has autosaved in their config.

You can change the text of the placeholder using the observable binding `:missingItemPlaceholder`. This is a function which takes a string (the missing registration name) and returns the string to use as the placeholder. A default is set, but you can override it. See the override implementation [in this example](#contained-example).

### Invalidating the cache

As explained in the previous section, a placeholder item is added if an item is no longer registered for the auto-loaded layout. This accounts for removing an item. However, there is the reverse issue: If you are only using the declarative API and you add a new item, if the user already has an autosaved layout then that will be loaded which will effectively hide the new item you've added.

In this case you must invalidate the autosaved layout cache. The cleanest and easiest implementation for you is to add a hash onto the end of your `auto-save-key` which will start a new autosave for this table (and reload the default which will contain your new layout item).

## Contained elements

This section concerns the behaviour of elements inside the layout. If you are using simple elements or Genesis-supplied elements this section is less of a concern, but if you are building complex custom components yourself, you will need this information.

### Element lifecycle

When an item is dragged around the layout, its lifecycle functions `connectedCallback` and `disconnectedCallback` are called.
It is important that the element accounts for this, such as caching data, or resizing correctly.

In the `@genesislcap/foundation-utils` package, there is a mix-in class `LifecycleMixin` which exposes two protected members `shouldRunConnect` and `shouldRunDisconnect`, which can be used to gate certain functionality. For example, if there are parts of `disconnectedCallback` that you don't want to run if the item is being dragged around the layout, you can gate it behind a `(!this.shouldRunDisconnect) return;` early return.

:::warning
At the very least, you must run `super` calls to the lifecycle methods, or else your custom element will not work correctly.
:::

### Element cloning

To enable you to add multiple items from the same `registration`, the layout system clones elements to add to the layout.
This is the case both when items are added with `.addItem()`, and when they are added using the declarative API. Under the hood, this uses the Node [cloneNode](https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode) api.
There are certain limitations to this function, especially when using custom elements with the shadow DOM. [See troubleshooting example](#binding-events-inline-in-the-declarative-api).

In the `@genesislcap/foundation-utils` package, there is a mix-in class `LifecycleMixin` which overrides the `cloneNode` API.

```typescript
// Make a call to `deepClone` and manually clone children
override cloneNode(deep?: boolean): Node {
	const thisClone = this.deepClone();
	if (deep) {
		Array.from(this.childNodes).forEach((child) => {
			thisClone.appendChild(child.cloneNode(true));
		});
	}
	return thisClone;
}

// Create a new element of the same name and copy over attributes
deepClone(): Node {
	const copy = document.createElement(this.tagName.toLowerCase());
	this.getAttributeNames().forEach((at) => copy.setAttribute(at, this.getAttribute(at)));
	return copy;
}
```

You can then extend the cloning functionality for your specific requirements. For example, our charts component needs to copy over `config` and `data` parameters.
```typescript
export class G2PlotChart extends LifecycleMixin(FoundationElement) {
	...
  override deepClone(): Node {
    const copy = super.deepClone() as G2PlotChart;
    copy.config = structuredClone(this.config);
    copy.data = structuredClone(this.data);
    return copy;
  }
	...
}
```
Some items you'll probably want to copy over are `eventListeners` and other non-attribute configuration elements on your custom element.

## Examples

### Simple example

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

### Nested example

A slightly more complicated example:

```html
<foundation-layout>
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

Component 1 has a Close button. By default, Component 1 would be 50% width and 2 and 3 would take up the other 50% width, but here we set `25%`
as the width of Component 1 layout item (width because it is the size in the context of a vertical split).

### Multi-nested example

If instead we had:

```html
<foundation-layout>
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

This would render the following:

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
Component 1 has a Close button. Component 1 takes up 25% of the initial width. Components 2,3,4 take up a third of the _remaining_ width between them
(default behaviour) and 5 and 6 are tabbed.

### `repeat` directive

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
	<foundation-layout-region type="horizontal">
		${when(x => x.positions, html<Position>`
			<foundation-layout-item title="${x => x.symbol}">
				<chart symbol="${x => x.symbol}"></chart>
			</foundation-layout-item>`)}
	</foundation-layout-region>
</foundation-layout>`;
```

For an example where the `Commodities` object has three positions, you will see the following output:
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
`<chart>` is just an example component; it doesn't exist within `foundation-ui`.
:::

### `when` directive

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
layout to reinitialise incorrectly - this will duplicate the panels. For example, you can use the
`when` directive to conditionally render a pane during initialisation, but not to toggle whether to show/hide the pane afterwards.
See [this example](#observables-with-directives).
:::

### Multiple instances

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
This is just an example; you could have more than two layouts on a page or style them with a different method to the grid.
:::

### Adding items dynamically

This is an example of using the JavaScript API to add items onto the layout at runtime. Before reading this example you should familiarise yourself with the [API Section](#javascript-api).

Say you want the user to be able to choose between three different types of item tht can be put onto the layout - a profile-management table, and a pie & column chart.

```typescript
// Can either create an element and initialise it completely using JavaScript
const profileManagement = document.createElement('profile-management');
// Or could grab a reference to one you create via FAST markup
const pieChart = document.getElementById('pie-chart');
// In idiomatic FAST we can have a reference using `ref` directive
// const colChart = this.columnChart;
```

We can then register these elements with the layout system. Registering it with the layout system removes it from its original location.
```typescript
// Using a duplicate registration name is a runtime error
this.layout.registerItem('profile', [profileManagement]);
this.layout.registerItem('pie', [pieChart]);
this.layout.registerItem('colChart', [this.columnChart]);
```

Finally, use the `addItem` API to add a pane onto the layout using a previously registered item.
```typescript
this.layout.addItem({
	registration: 'profile',
	name: 'Profile Management',
	closable: true,
})
```
Using `addItem` with a `registration` that has not been set is a runtime error. Remember `addItem` has an optional second parameter for setting the placement of the new pane.

:::tip
Items registered using the declarative API use the same pool of registration names, so you can also use `addItem` to add them to the layout too.
:::

#### Contained example

This is a complete example of the above, omitting imports.

```typescript
// template
export const template = html<ContainedExample>`
  <div style="display: grid; grid-template-columns: 1fr; grid-auto-rows: minmax(7vh, auto)">
    <div style="display: block; position: relative;">
      <foundation-button @click=${(x) => x.addItem('1')}>Test 1</foundation-button>
      <foundation-button @click=${(x) => x.addItem('2')}>Test 2</foundation-button>
      <foundation-button @click=${(x) => x.addItem('3')}>Test 3</foundation-button>
    </div>
    <div style="display: block; position: relative; grid-row-start: 2; grid-row-end: 12;">
      <foundation-layout
        auto-save-key="layout-preview-contained-example"
        :missingItemPlaceholder=${(x) => x.missingItemOverride()}
        ${ref('containedExampleLayout')}
      ></foundation-layout>
    </div>
  </div>
`;

// class
@customElement({
  name: 'contained-example',
  template,
})
export class ContainedExample extends FASTElement {
  containedExampleLayout: FoundationLayout;
  private _addedPaneCount = 0;

  connectedCallback(): void {
    super.connectedCallback();

    const h1 = document.createElement('h1');
    h1.innerHTML = 'Example 1';
    const p1 = document.createElement('p');
    p1.innerHTML = 'Ex 1';

    const h2 = document.createElement('h2');
    h2.innerHTML = 'Example 2';
    const p2 = document.createElement('p');
    p2.innerHTML = 'Ex 2';

    const h3 = document.createElement('h3');
    h3.innerHTML = 'Example 3';
    const p3 = document.createElement('p');
    p3.innerHTML = 'Ex 3';

    this.containedExampleLayout.registerItem('1', [h1, p1]);
    this.containedExampleLayout.registerItem('2', [h2, p2]);
    this.containedExampleLayout.registerItem('3', [h3, p3]);
    this.containedExampleLayout.tryLoadLayoutFromLocalStorage();
  }

  addItem(registration: string) {
    this.containedExampleLayout.addItem({
      registration,
      title: `${registration} (${(this._addedPaneCount += 1)})`,
      closable: true,
    });
  }

  missingItemOverride = () => (missingItem: string) => `Missing Item: ${missingItem}`;
}
```

### Loading serialised layouts

This is an elaborate example of using the JavaScript API with consideration of the registered names. Before reading this example, you should familiarise yourself with the [API Section](#javascript-api):

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

We can use `layoutRequiredRegistrations()` on the config returned from `getLayout()` to see the registered names that are required to load the layout.

```javascript
const layout = document.querySelector('foundation-layout'); // as FoundatonLayout in TypeScript;
const layoutConfig = layout.getLayout();
console.log(FoundatonLayout.layoutRequiredRegistrations(layoutConfig))
```
This will log `['trades','users']` because these are the two registered panes. You can then load any layout that only contains either/both of these items.

Consider the situation where we dynamically add an item to the right-hand side of the layout.
```javascript
const newItem = document.createElement('p'); //simple example
newItem.innerText = 'Test';

layout.registerItem(test, [newItem]);
const layoutConfigTwo = layout.getLayout()
console.log(FoundationLayout.layoutRequiredRegistrations(layoutConfigTwo));
```
Now we get `[ "test", "trades", "users"]` as the output, because to load `layoutConfigTwo` we now need all three of those registered panes.

Consider now where the user refreshes the page to go back to the original state of the layout with just the two elements added, but then tries to load:

`layoutConfigTwo`:
```javascript
// User has refreshed page

console.log(layout.registeredItems());
// Ouputs ['trades','users']

layout.loadLayout(layoutConfigTwo);
// Uncaught Error: Trying to load layout with extra components. The component(s) not currently loaded are "test"
```
Notice the error message says that the `test` component is missing. This is because it was required as part of the layout when we used `getLayout()`, but it hasn't been added as part of the layout now. If we added the item using `registerItem()` we could subsequently run `layout.loadLayout(layoutConfigTwo);` to  load the layout successfully.

:::warning
Just because an item is not displayed on the layout does not mean it is not registered. `.getLayout()` gets only the current layout config, so you cannot use it to see every single item that is currently registered (unless every item is added). This is why you should use `.registeredItems()` to get the currently registered items.
:::

#### Proactively registering items

Here is a simple approach to ensure that all items are registered when you load a layout; loop through all the items that you could possibly load and register them.

```javascript
const allItems = [
	{registration: 'trades', elements: [...], },
	{registration: 'users', elements: [...], },
	{registration: 'profiles', elements: [...], },
	{registration: 'notifications', elements: [...], },
];

allItems.forEach(({registration, elements}) => {
	layout.registerItem(registration, elements);
})
```
Now all those items will be registered with the layout for potential use when calling `loadLayout()`, or added using `addItem()`.

#### Reactively registering items

Alternatively, you could query the current layout and the layout you want to load to see if there are any missing registered items; you can then register the missing ones. Using our previous examples:

```javascript
const currentRegistrations = FoundatonLayout.registeredItems();
// ['trades','users']
const requiredRegistrations = FoundatonLayout.layoutRequiredRegistrations(layoutConfigTwo);
// ['test','trades','users']

// We can see 'test' is missing and therefore we should register it
layout.registerItem(test, [element]);
```

:::info
Only items _missing_ from the `requiredRegistrations` is an issue. If there are items in the `currentRegistrations` that are not in `requiredRegistrations`, this is *not* an issue - because these will simply be unused registrations.
:::

:::warning
If you are calling `registerItem` manually and are using the autosave feature, [see here](#reloading-the-layout).
:::

## Incorrect examples

The following section contains examples of incorrect usage, which are useful for troubleshooting.

### Non-layout child

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
This is because there is a child of one of the layout regions which isn't another layout region or layout item (the `<h1>`). This will throw a runtime error.

### Layout region in tabs

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
This is because you cannot have more layout regions nested inside a tab region. You will get undefined behaviour.


### Multiple items in root

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

### Nested item

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
This is because you cannot have `<foundation-layout-item>` inside other `<foundation-layout-item>`. You will get a runtime error.

### Observables with directives

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
But as the user clicks the toggle button, the `Index Chart` will not be taken away and added back in.
Instead, it will be added as a duplicate every time the observable is set true. Additionally, the contents
of the panel will be wiped as duplicates are added.

To work around this, you would use FAST directives inside custom web components inside the layout.

### Binding events inline in the declarative API
The following example is invalid:

```html
<foundation-layout>
		<foundation-layout-item>
			<input type="checkbox" @change=${(x,c) => x.doSomething()} />
		</foundation-layout-item>
</foundation-layout>
```

Because of a limitation in the [cloneNode() API](https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode), event listeners are *not* copied.
This process is part of the process of adding an item to the layout, using both the declarative HTML and JavaScript APIs. So while you will see
a checkbox on the screen as part of the layout, the event listener will *not* fire when you `change` the checkbox. This applies to all items and events.

The idiomatic FAST way of implementing this event binding is to create a custom element and attach the event internally.

```typescript
// template
export const exampleComponentTemplate = html<ExampleComponent>`
  <template>
    <input type="checkbox" ${ref('checkbox')} @change=${(x, c) => x.doSomething()} />
  </template>
`;

// model
@customElement({
  name: 'example-component',
  template: exampleComponentTemplate,
})
export class ExampleComponent extends FASTElement {
  checkbox: Checkbox;
	doSomething() { } // do something important
}
```

You can then use the custom component in the layout:

```html
<foundation-layout>
		<foundation-layout-item>
			<example-component><example-component/>
		</foundation-layout-item>
</foundation-layout>
```

### New layout item not displaying
Say you have the following layout, [the simple example](#simple-example), with autosave enabled.
```html
<foundation-layout auto-save-key="simple-example">
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

The user of your layout will move things around and this will cache the layout. Say you then update the layout to add an item.
```html
<foundation-layout auto-save-key="simple-example">
  <foundation-layout-region type="horizontal">
    <foundation-layout-item title="Component 1">
      <!-- Content -->
    </foundation-layout-item>
    <foundation-layout-item title="Component 2">
      <!-- Content -->
    </foundation-layout-item>
    <foundation-layout-item title="Component 3">
      <!-- Content -->
    </foundation-layout-item>
  </foundation-layout-region>
</foundation-layout>
```

You and the user will only see the first two items like before. This is because the cached layout is being loaded, which does not contain the
new item. To fix this you must [invalidate the cache](#invalidating-the-cache).

## License

Note: this project provides front end dependencies and uses licensed components listed in the next section, thus licenses for those components are required during development. Contact [Genesis Global](https://genesis.global/contact-us/) for more details.
