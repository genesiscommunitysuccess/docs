---
title: 'Foundation Login'
sidebar_label: 'Foundation Login'
id: foundation-login
keywords: [web, login, foundation login, frontend, ui, micro-front-ends]
tags:
  - web
  - login
  - foundation login
  - frontend
  - ui
  - micro-front-ends
---

# Foundation Login

Our [API](./docs/api) documentation is separate. Click on the link if you want to view it.

## Introduction

This micro front-end includes a set of identity management functions: authentication (including via SSO) and password reset, for example. Many of the features can be turned on and off as desired, and parts of the login screen (such as the logo) can be customised.

Here is an example of the main login screen: <br/>

![Main login screen example](./docs/img/foundation-login_login-standard.png)

Here is an example of authentication via SSO: <br/>

![Main login screen example](./docs/img/foundation-login_login-sso.png)

<!-- An example of the forgotten password screen: <br/>
![Main login screen example](./docs/img/foundation-login_forgotten-password.png) -->

Here is an example of the change password screen: <br/>

![Main login screen example](./docs/img/foundation-login_change-password.png)

<!-- An example of the request account screen: <br/>
![Main login screen example](./docs/img/foundation-login_request-account.png) -->

## Login set-up

:::info
If you build a project using one of the Genesis seed apps, then the `Login` micro front-end will already be set up for you.
:::

To enable this micro front-end in your application, follow the steps below.

1. Add `@genesislcap/foundation-login` as a dependency in your **package.json** file. 
2. Whenever you change the dependencies of your project, always run the `$ npm run bootstrap` command again. 

You can see more information on the [package.json basics](https://docs.genesis.global/secure/web/micro-front-ends/foundation-login/) page.

```javascript
{
  ...
  "dependencies": {
    "@genesislcap/foundation-login": "latest"
  },
  ...
}
```

:::note
This page assumes you're using the Routing systems that are part of `foundation-ui`, and will cover set-up as part of that routing system.
:::

1. In the Router configuration for your application, import the `Login` class and the `Settings` type. As shown in this example, you need to import `Settings` with an alias to avoid name clashes.

```javascript
import { Login, Settings as LoginSettings } from '@genesislcap/foundation-login';
```

2. Next, you'll want to ensure that your Router config uses your `LoginSettings` as its generic type so that you can configure the login route.
```javascript
export class MainRouterConfig extends RouterConfiguration<LoginSettings> {
	...
}
```

3. Then add the required config to the Router config that you use. For example, you need to set up the `Login` class to be used on the `/login` route, and pass in its required settings. See [customising login](#customising-login).
```javascript
{ path: '', redirect: 'login' },
{
	path: 'login',
	element: Login,
	title: 'Login',
	name: 'login',
	layout: loginLayout,
	// Login settings that are defined in the LoginSettings type
	settings: {
		defaultRedirectUrl: 'protected',
		public: true,
		resetPassword: true,
		ssoToggle: true,
		ssoEnable: false,
	},
	childRouters: true,
},
```

4. You also need to set up things like the `NavigationContributor` in this class.

:::noteExample
An example of this and other required settings for the Router configuration with regard to the login system can be found in the [example in the API reference](./docs/api/foundation-login.login/#example).
:::

5. The functionality of the Login class is configured via the settings block on its route, but the other routes will also have customisation on them too. The main options to set here are:

- `allowAutoAuth` which will log the user back in onto the page when they navigate away if they already have an authenticated session
- `public` which will indicate that a route doesn't require the user to be authenticated to view

```javascript
{
	path: 'admin',
	element: Admin,
	title: 'Admin',
	name: 'admin',
	settings: { allowAutoAuth: true },
},
{
	path: 'info',
	element: Info,
	title: 'Info',
	name: 'info',
	settings: { public: true },
},
```

:::warningWarning
By default, a route that isn't marked public is not. However, a non-public route isn't going to block non-authenticated users automatically from viewing them. This must be implemented in the `NavigationContributor`, as shown in the [previously mentioned example](./docs/api/foundation-login.login.md#example).
:::

## Authentication

For authentication, most configuration is set in the back end. You should familiarise yourself with the [authentication section of the back-end](../../../server/access-control/introduction/).

### Username & password

The standard authentication method is where the user supplies their username and password. Even when SSO is enabled as an authentication method, the user will still have the option to sign in with their normal credentials.

:::noteTip
Setting the `DEFAULT_USER` and `DEFAULT_PASSWORD` environment variables automatically populates the credentials in the login form. This is useful during development, so that developers don't need to write out their credentials continuously.
:::

### SSO

SSO functionality allows the `Login` micro front-end to work with your company's existing authentication system, enabling them to have a single set of credentials - including those built on the Genesis low-code platform. Genesis supports SSO with both JWT and SAML.

Setting up SSO is primarily [a back-end task] and it depends on whether you use [JWT](../../../server/access-control/sso-jwt/), (SAML)(../../../server/access-control/sso-saml/), or [OIDC](../../../server/access-control/sso-oidc/).

However, we cover a small amount of configuration in the [customisation](#enable-sso) part of this documentation.

:::noteInfo
The standard process of SSO is that the SSO authentication provider flow is opened via a redirect in the current page. However, many authentication providers block their system when running in an iframe to prevent [clickjacking attacks](https://owasp.org/www-community/attacks/Clickjacking). Because of this, if the `Login` micro front-end detects that it is running in an iframe, it opens up the authentication provider in a popup instead.
:::

## Customising login

The `Login` micro front-end uses a parameterless constructor. Therefore, the configuration needs to be set via the settings javascript object in the router, as shown in the [set-up step](#login-set-up). See the full [settings API here](./docs/api/foundation-login.settings.md/#remarks).

### Enabling reset password

In the [introduction section](#introduction), the reset password functionality is shown. However, note that this workflow is only enabled if you set the `resetPassword` option to `true`.

### Logo

You will probably want to use your company's logo instead of the Genesis logo. A custom logo can be configured with the `logoSrc`, `logoWidth`, `logoHeight` settings. If you don't want to use a logo, you can instead hide the logo with `hideLogo`.

### Enable SSO

As mentioned in the [authentication](#sso) section, SSO must be configured on the server, but some front-end configuration is required too.

- Setting `ssoToggle` is required to enable the SSO authentication as an option for the user; the user can then enable that flow with a checkbox that controls `ssoEnable`.
- Enabling `ssoEnable` at the route-level sets the SSO flow to be the default.

- Finally, set `defaultRedirectUrl`, which controls where the `Login` micro front-end will take the user back to once they complete the SSO journey. For example, setting option to `/home` will take the user to the `/home` path if they successfully login via SSO.

