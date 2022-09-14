---
title: 'Foundation Login'
sidebar_label: 'Foundation login'
Id: front-end-foundation-login
tags:
  - header
  - sidebar
  - frontend
  - ui
  - mf
  - web
  - micro frontends
---

# Foundation Login

## API Reference

API reference [can be found here.](../foundation-login_apiref/)

## Introduction

This micro-frontend includes many identity management functionalities that the user would want to use: authentication (including via SSO) and password reset for example. Many of the features can be turned on and off as desired, and parts of the login screen such as the logo can be customised.

An example of the main login screen: <br/>
![Main login screen example](/img/foundation-login_login-standard.png)

An example of authentication via SSO: <br/>
![Main login screen example](/img/foundation-login_login-sso.png)

An example of the forgotten password screen: <br/>
![Main login screen example](/img/foundation-login_forgotten-password.png)

An example of the change password screen: <br/>
![Main login screen example](/img/foundation-login_change-password.png)

An example of the request account screen: <br/>
![Main login screen example](/img/foundation-login_request-account.png)

## Login Set-up

To enable this micro front-end in your application, follow the steps below.

- Add `@genesislcap/foundation-login` as a dependency in your *package.json* file. Whenever you change the dependencies of your project, ensure you run the `$ npm run bootstrap` command again.

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
This page assumes you're using the Routing systems that are part of `foundation-ui`, and will cover setup as part of that routing system.
:::

- In the router configuration for your application import the `Login` class and the `Settings` type. As shown in this example you might want to import `Settings` with an alias to avoid name clashes.
```javascript
import { Login, Settings as LoginSettings } from '@genesislcap/foundation-login';
```

- Next you'll want to ensure that your router config uses your `LoginSettings` as its generic type so you can configure the login route.
```javascript
export class MainRouterConfig extends RouterConfiguration<LoginSettings> {
	...
}
```

- Then you want to add the required config into the router config that you use. For example you'll want to setup the `Login` class to be used on the `/login` route, and pass in its required settings. See [customising login](#customising-login).
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
		forgotPassword: true,
		requestAccount: true,
		ssoToggle: true,
		ssoEnable: false,
	},
	childRouters: true,
},
```

- You'll also want to set up things like the `NavigationContributor` in this class.

:::noteExample
An example of this and other required settings for the router configuration with regards to the login system can be found in the [example in the API reference](../foundation-login_apiref/foundation-login.login/#example).
:::

- The functionality of the Login class is configured via the settings block on its route, but the other routes will also have customisation on them too. The main options to set here are `allowAutoAuth` which will log the user back in onto the page when they navigate away if they already have an authenticated session, and `public` which will indicate that a route doesn't require the user to be authenticated to view.

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
By default a route that isn't marked public is not. However, a non-public route isn't going to automatically block non-authenticated users from viewing them, this functionality must be impelmented in the `NavigationContributor` as shown in the [previously mentioned example](../foundation-login_apiref/foundation-login.login/#example).
:::

## Authentication

With regards to authentication, most configuration is set in the back-end. You should familiarise yourself with the [authentication section of the back-end](docs/03_server/05_access-control/01_introduction.md).

### Username & Password

The standard authentication method is the user supplying their username and password. Even when SSO is enabled as an authentication method the user will still have the option to sign in with their normal credentials.

:::noteTip
Setting the `DEFAULT_USER` and `DEFAULT_PASSWORD` environment variables will automatically populate the credentials in the login form which can be useful during development so developers don't need to continuously write out their credentials.
:::

### SSO

SSO functionality allows the `Login` micro-frontend to work with your companies existing authentication system allowing them to have a single set of credentials - incluidng those built on the Genesis low-code platform. Genesis supports SSO with both JWT and SAML.

Setting up SSO is primarily [a back-end task](docs/03_server/05_access-control/04_sso_authentication.md), however there is a small amount of configuration covered in [the customisation part of this documentation](#enable-sso).

:::noteInfo
The standard process of SSO is that the SSO authentication provider flow is opened via a redirect in the current page. However, many authentication providers will block their system when running in an iframe to prevent [clickjacking attacks](https://owasp.org/www-community/attacks/Clickjacking). Because of this, if the `Login` micro-frontend detects that it is running in an iframe it will open up the authentication provider in a popup instead.
:::

## Customising Login

The `Login` micro-frontend uses a parameterless constructor and therefore the configuration needs to be set via the settings javascript object in the router as shown in the [setup step](#login-set-up). See the full [settings API here](../foundation-login_apiref/foundation-login.settings/#remarks).

### Enabled Functionality

In the [introduction section](#introduction) the reset password, request account, and forgotten password functionalities are shown. However, these flows must be enabled with the `resetPassword`, `requestAccount`, `forgotPassword` options.

### Logo

You will likely want to use your company's logo instead of the Genesis logo. A custom logo can be configured with the `logoSrc`, `logoWidth`, `logoHeight` settings. If you don't want to use a logo you can instead hide the logo with `hideLogo`.

### Enable SSO

As mention in the [authentication](#sso) section SSO must be configured on the server, but some front-end configuration is required too. Setting `ssoToggle` is required to enable the SSO authentication as an option for the user, and then the user can enable that flow with a checkbox that controls `ssoEnable`. Enabling `ssoEnable` at the route level will set the SSO flow to be the default.

Finally, set `defaultRedirectUrl` which controls where the `Login` micro-frontend will take the user back to once they complete the SSO journey. For example, setting option to `/home` will take the user to the `/home` path if they successfully login via SSO.

