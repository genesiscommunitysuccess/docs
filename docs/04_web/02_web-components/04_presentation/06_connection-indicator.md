img---
title: 'Web Components - Connection Indicator'
sidebar_label: 'Connection Indicator'
id: connection-indicator
keywords: [web, web components, connection-indicator]
tags:
    - web
    - web components
    - connection-indicator
---

The `connection-indicator` component is used as a visual representation of the websocket connection status.
The indicator light is red while the websocket is disconnected and green while it is connected.

The *optional* label (enabled by the setting `show-label` attribute to `true`) displays the `host url` if connected; otherwise it displays the text `disconnected`.

## Basic Usage

```html live
<alpha-connection-indicator show-label="true"/>
```

## Enabling the connection indicator on the login page

The `connection-indicator` component can be used anywhere with or without the label.
It has already been integrated into the form of the login page and can easily be enabled by setting the `showConnectionIndicator` parameter to `true`.

## Example login route settings

```jsx
{
  path: 'login',
  element: Login,
  title: 'Login',
  name: 'login',
  layout: loginLayout,
  settings: {
    defaultRedirectUrl: 'protected',
    public: true,
    resetPassword: true,
    forgotPassword: true,
    requestAccount: true,
    ssoToggle: true,
    ssoEnable: false,
    showConnectionIndicator: true,
  },
  childRouters: true,
}
```

### Result (connected)
![](/img/connection-indicator-connected.png)

### Result (disconnected)
![](/img/connection-indicator-disconnected.png)
