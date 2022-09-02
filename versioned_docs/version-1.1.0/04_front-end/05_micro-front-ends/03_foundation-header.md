---
title: 'Foundation Header'
sidebar_label: 'Foundation header'
Id: front-end-foundation-header
tags:
  - header
  - sidebar
  - frontend
  - ui
  - mf
  - web
  - micro frontends
---

# Foundation Header

## API Reference

API reference [can be found here.](../foundation-header_apiref/)

## Introduction

The Header micro front-end is a semi-batteries included component. It consists of a navigation bar and flyout menu, with routing and account logout capabilities.

You can customise:

- the icon shown on the navigation bar and flyout menu (this shows the Genesis logo by default).
- navigation links at the left-hand side of the navigation bar.
- the control buttons on the right-hand side of the navigation bar can be shown or hidden, and their behaviour controlled via event listeners
- The contents of the flyout menu.

Here is an example of the navigation bar with three navigation items, and all three control buttons shown.
![Header with the standard genesis logo](/img/foundation-header-standard.png)

This next example is the same as the previous example, except the Genesis logo is replaced with a custom icon.
![Header with a customised logo](/img/foundation-header-replaced-img.png)

In this next example, we have put a set of example options set in the flyout menu.
![The sidebar included with the header opened with some example content](/img/foundation-header-sidebar.png)

## Header Set-up

To enable this micro front-end in your application, follow the steps below.

- Add `@genesislcap/foundation-header` as a dependency in your *package.json* file. Whenever you change the dependencies of your project, ensure you run the bootstrap command again.

```javascript
{
  ...
  "dependencies": {
    "@genesislcap/foundation-header": "latest"
  },
  ...
}
```

:::note
This page assumes you're already using the Login and Routing systems that are part of `foundation-ui` for the logout and routing functionality.

It is possible for you to set up routing manually, but that won't be covered in this tutorial.
:::

- In the top level class of your application, import and dependency inject the Navigation class.
```javascript
import { Navigation } from '@genesislcap/foundation-header';

@customElement({ name, template, styles })
export class MainApplication extends FASTElement {
  @inject(MainRouterConfig) config!: MainRouterConfig;
  @inject(Navigation) navigation!: Navigation;

	...

}
```

- Set a reference to the `navigation` object on the FAST router when you instantiate it, this will allow us to set up navigation functionality from the navigation bar in the [navigation items step.](#navigation-items)
```javascript
// fast-router will likely have other attributes such as :config too
const MainTemplate: ViewTemplate<MainApplication> = html`
  <fast-router :navigation=${(x) => x.navigation}></fast-router>
`;
```

- Add the `foundation-header` tag as part of the html that you set as the markup for the `defaultLayout` in your router configuration.
```javascript
export const defaultLayout = new FASTElementLayout(html`
<div class="container">
	<!-- show-luminance-toggle-button boolean attribute added to show that button on the navigation bar -->
	<foundation-header show-luminance-toggle-button></foundation-header>
	<!-- Other markup -->
</div>`);

export class MainRouterConfig extends RouterConfiguration<LoginSettings> {

	...

	public configure() {
		this.title = 'Example app';
		this.defaultLayout = defaultLayout;
		...
	}
}
```

## Customising the header

### Icon

By default, the navigation bar and flyout menu show the Genesis logo. You can override this by setting the `logoSrc` attribute. For example:

```html
<foundation-header logoSrc="https://icotar.com/avatar/genesis"></foundation-header>
```
The `logoSrc` defines the image that you want to display. Adding this attribute will update the logo on both the flyout and navigation bar. Omit the attribute to leave the Genesis logo.

### Navigation items

You can add navigation items can be added to the left-hand side of the navigation bar. For each element, you can set `slot="routes"` attribute, so that navigation is controlled via a `@click` event. The following is a really basic example for adding a 'Home' button:

```javascript
html`
<foundation-header
	<zero-button
		slot="routes"
		value="1"
		@click=${(x, c) => c.parent.navigation.navigateTo("home")}
	>Home</zero-button>
></foundation-header>`;
```
The `navigation` object referenced via the `parent` object is why the `navigation` object is added as an attribute to the `fast-router` in the [setup step](#header-setup). From it, the `navigateTo` method can be called, which allows the user to navigate around the finished application from the navigation buttons.

Moving on from this basic example, a dynamic set of routes can be configured, using the `repeat` directive from FAST.

- Add the routes configuration into an array in the router configuration class.
```javascript
export class MainRouterConfig extends RouterConfiguration<LoginSettings> {

	// New configuration added to existing MainRouterConfig class
	public allRoutes = [
		{ index: 1, path: 'protected', title: 'Home', icon: 'home', variant: 'solid' },
		{ index: 2, path: 'admin', title: 'Admin', icon: 'cog', variant: 'solid' },
		{ index: 3, path: 'reporting', title: 'Reporting', variant: 'solid' },
	];

	...
}
```

- When setting the navigation items, use the `repeat` directive to iterate over the defined routes and create a navigation item for each.

The following example creates a button with an associated logo for each of the three defined routes:

```javascript
html`
<foundation-header
	${repeat(
		(x) => x.config.allRoutes,
		html`
			<zero-button
				appearance="neutral-grey"
				slot="routes"
				value="${(x) => x.index}"
				@click=${(x, c) => c.parent.navigation.navigateTo(x.path)}
			>
				<zero-icon variant="${(x) => x.variant}" name="${(x) => x.icon}"></zero-icon>
				${(x) => x.title}
			</zero-button>
		`
	)}
></foundation-header>`;
```

### Control buttons

There are three control buttons that can be shown or hidden on the right-hand side of the navigation bar (these are hidden by default). Each one of them is a boolean attribute that can be added where the `<foundation-header>` tag is defined. Each one dispatches an associated event when clicked.

| Logo          | Toggle Attribute             | Dispatched Event          |
|---------------|------------------------------|---------------------------|
| Moon          | show-luminance-toggle-button | luminance-icon-clicked    |
| Misc          | show-misc-toggle-button      | misc-icon-clicked         |
| Notifications | show-notification-button     | notification-icon-clicked |

Implementing the functionality of the buttons is up to the client. For example:

- Define the functionality of the event callback in the class of a class which is a parent to the router.

```javascript
export class MainApplication extends FASTElement {

	onMiscButtonPressed() {
		// ... do something
	}
	...
}
```

- Set the event listener in the parent html to call the defined functionality.
```javascript
// fast-router will likely have other attributes such as :config too
const MainTemplate: ViewTemplate<MainApplication> = html`
  <fast-router
		:navigation=${(x) => x.navigation}
		@misc-icon-clicked=${(x) => x.onMiscButtonPressed()}
	>
	</fast-router>
`;
```

### Menu contents

To set the content of the flyout menu, add the content in the html within an element that has the `slot="menu-contents"` attribute.
```html
<foundation-header>
	<div slot="menu-contents">
		<!-- Example markup -->
		<p>GROUP SLOT</p>
		<zero-tree-view>
			<zero-tree-item>
				<zero-icon variant="solid" name="location-arrow"></zero-icon>
				Slot Tree Item
			</zero-tree-item>
			<zero-tree-item>
				<zero-icon variant="solid" name="location-arrow"></zero-icon>
				Slot Tree Item
			</zero-tree-item>
		</zero-tree-view>
		<p>GROUP SLOT 2</p>
		<zero-tree-view>
			<zero-tree-item>
				<zero-icon variant="solid" name="location-arrow"></zero-icon>
				Slot Tree Item 2
			</zero-tree-item>
			<zero-tree-item>
				<zero-icon variant="solid" name="location-arrow"></zero-icon>
				Slot Tree Item 2
			</zero-tree-item>
		</zero-tree-view>
	</div>
</foundation-header>
```
