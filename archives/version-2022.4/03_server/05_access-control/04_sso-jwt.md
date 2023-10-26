---
title: 'SSO - JWT'
sidebar_label: 'SSO - JWT'
id: SSO-jwt
keywords: [JWT, web token, server, access control, SSO, authentication]
tags:
  - JWT
  - web token
  - server
  - access control
  - SSO
  - authentication
---


import CodeBlock from '@theme/CodeBlock';

SSO is a mechanism that enables a user to be authenticated against a single system, and use that authenticated id across multiple applications - including those built on the Genesis low-code platform. This has the advantage that a user is required to log in only once, rather than once per system.

There are three different types of SSO authentication presently supported by the Genesis low-code platform. These are:

* [JWT (JSON Web Token)](https://jwt.io/introduction) SSO
* [SAML](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language)
* [OpenID Connect](https://openid.net/connect/)


## JWT SSO

By giving a user a JSON web token (JWT) when they authenticate with your identity provider, they can automatically have their identity verified when they attempt to access your Genesis application.

You can authorise the user's access to specific relevant systems (and no others), using tools such as the [Microsoft Azure AD](https://azure.microsoft.com/en-gb/services/active-directory/#overview) component. So you have control over who has access to your Genesis applications.

:::note

The IT infrastructure or security team at your organisation is usually responsible for setting up and managing your company's JWT authentication service. If a solution is not in place, Genesis can provide detailed instructions and assistance.

:::
## Message flow

The SSO workflow depends on whether or not CORS is configured on your internal authentication service to allow the Genesis low-code platform to make direct authentication requests, or not.

### CORS enabled

If CORS is enabled, the SSO workflow is:

1. An unauthenticated user navigates to the Genesis application. For example: **https://your-subdomain.genesisapplication.com/**.
2. The Genesis web platform recognises that SSO is enabled from the subdomain and that the user is not authenticated.
3. A request is made to the Genesis back end to request the URL for the specific authentication service.
4. The Genesis web platform makes an HTTPS request to your organisation's authentication service, which will include the end user’s internal authentication parameters.
5. The authentication service authenticates and builds a JWT with relevant user data, signs the JWT and sends it back to the Genesis web platform.
6. With the signed JWT, the Genesis web platform makes an SSO authentication request for the specific organisation. If this is successful, an active Session token is returned.

### CORS not configured

This set-up uses the browser’s redirect functionality, so the user experience might not be as seamless.

If CORS is not enabled, the SSO workflow is:

1. An unauthenticated user navigates to the Genesis application. For example: **https://your-subdomain.genesisapplication.com/**.
2. The Genesis web platform recognises that SSO is enabled from the subdomain and that the user is not authenticated.
3. A request is made to the Genesis back end framework to request the URL for the specific authentication service.
4. A redirect is triggered for the browser to the internal authentication service, which will include the end user’s internal authentication parameters. A return parameter to **https://your-subdomain.genesisapplication.com/** is also part of the request.
5. The authentication service authenticates and builds a JWT with relevant user data, signs the JWT and sends a redirect trigger to the browser for **https://your-subdomain.genesisapplication.com/**, which includes the JWT as a request parameter.
6. The Genesis platform is reloaded. It recognises that SSO is enabled, but now with the JWT as a parameter. The platform sends an SSO authentication request with the JWT for the specific organisation. If this is successful, an active session token is returned.


## Prerequisites

Make sure that the`JWT_CONFIG` table of your application is correctly configured:

* The `DOMAIN` must contain the domain for which this JWT is valid.
* The `PUBLIC_KEY` should contain the public key of the JWT key pair, (the private key is used to sign the JWT at the internal authentication service).
* Alternatively the `PUBLIC_KEY_URL` can be set as a URL to obtain this dynamically. Public keys obtained in this way are expected to be in JSON Web Key Sets format.
* The `REDIRECT_URL` must contain the URL for which the user is redirected to log in, should they not possess a valid JWT.
* The `KEY_ALGORITHM` should be set either to `KeyAlgorithm.RSA` or `KeyAlgorithm.HMAC`.

## Configuring SSO

To enable SSO, you need to configure it in your _application-name_**-auth-preferences.kts** file.

The following options are available from within the `security` function. For a more detailed look at the **auth-preferences.kts** file, visit the [Password Authentication section](../../../server/access-control/password-authentication/).

### sso
The `sso` function enables you to configure and enable SSO options. You can set the following variables:

* `enabled` is a boolean value that defines whether the SSO functionality is enabled. Default: `true` when the `sso` function is invoked, otherwise `false`.
* `onFirstLogin` is a function that is called when a user has been authenticated for the first time and doesn't yet exist in the database. Here you can define two things:
  * how a `User` and its `UserAttributes` will be created from the token after the user has been authenticated using the `createUser` function
  * which user permissions are allocated using `createUserPermissions`
* `onLoginSuccess` is a function that is called each time the user is authenticated. Inside the function, you have access to the actual token that was used for authentication and database access.
* `newUserMode` **is now deprecated** in favour of `onFirstLogin` and `onLoginSuccess`. This property defines behaviour for processing users the first time they log in with SSO. This can take the values of `NewUserMode.REJECT`, `NewUserMode.CREATE_ENABLED`, `NewUserMode.CREATE_DISABLED`. Default `NewUserMode.REJECT`.
  * In the case of `NewUserMode.REJECT`, when a user logs in for the first time with SSO, if they do not already have a user account, they are rejected.
  * In the case of `NewUserMode.CREATE_ENABLED`, when a user logs in for the first time with SSO, if they do not already have a user account, an active account is created for them.
  * In the case of `NewUserMode.CREATE_DISABLED`, when a user logs in for the first time with SSO, if they do not already have a user account, a disabled account is created for them. This will need to be activated before it can be used.


:::note
When using a JWT, the `maxAttempts` property in the [password retry config](../../../server/access-control/password-authentication/#passwordretry) 
refers to the maximum number of attempts allowed if a user enters an incorrect SSO token.
:::

## Revalidating the token

To allow for periodic updating and revalidation of a JWT token, the Auth service provides an Event Handler. This is called `EVENT_VALIDATE_JWT`. It takes the following parameters:

```kotlin
data class DomainJWT(
    val domain: String,
    val jwt: String
)
```

