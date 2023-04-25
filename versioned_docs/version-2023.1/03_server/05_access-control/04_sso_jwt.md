---
title: 'Access control - SSO authentication'
sidebar_label: 'SSO authentication'
id: sso-jwt
keywords: [server, access control, SSO, authentication]
tags:
  - server
  - access control
  - SSO
  - authentication
---


import CodeBlock from '@theme/CodeBlock';

Single sign-on (SSO) authentication uses the underlying SSO technology. SSO is a mechanism that allows a user to be authenticated against a single system, and use that authenticated id across multiple applications - including those built on the Genesis low-code platform. This has the advantage that a user is required to log in only once, rather than once per system.

There are two different types of SSO authentication presently supported by the Genesis low-code platform. These are as follows:

* [JWT (JSON Web Token)](https://jwt.io/introduction) SSO
* [SAML](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language).

## Configuring SSO

To enable SSO, you will need to configure it in your _application-name_**-auth-preferences.kts** file.

These following options are available from within the `security` function. For a more detailed look at the **auth-preferences.kts** file, visit the [Password Authentication section](../../../server/access-control/password-authentication/).

### sso
The `sso` function allows you to configure and enable SSO options. It has the following variables to set:

* `enabled` is a boolean value that defines whether the SSO functionality is enabled. Default: true when the `sso` function is invoked, otherwise false.
* `newUserMode` defines behaviour for processing users the first time they log in with SSO. This can take the values of `NewUserMode.REJECT`, `NewUserMode.CREATE_ENABLED`, `NewUserMode.CREATE_DISABLED`. Default `NewUserMode.REJECT`.
  * In the case of `NewUserMode.REJECT`, when a user logs in for the first time with SSO, if they do not already have a user account, they are rejected.
  * In the case of `NewUserMode.CREATE_ENABLED`, when a user logs in for the first time with SSO, if they do not already have a user account, an active account is created for them.
  * In the case of `NewUserMode.CREATE_DISABLED`, when a user logs in for the first time with SSO, if they do not already have a user account, a disabled account is created for them. This will be need to be activated before it can be used.

### passwordRetry
The `passwordRetry` function allows you to configure settings for limiting the rate at which a user can retry passwords and SSO tokens. It allows the following variables to be set:

* `maxAttempts` defines the maximum number of attempts allowed if a user enters an incorrect SSO token. Default: 3
* `waitTimeMins` specifies the time to wait when the maximum number of incorrect attempts is reached. Default: 5.


## JWT SSO

By giving the user a JWT when they authenticate with your identity provider, they can automatically have this identity verified when they attempt to access the application built on the Genesis low-code platform.

By centralising this authentication, you can authorise users access only to the relevant systems using tools like the [Microsoft Azure AD](https://azure.microsoft.com/en-gb/services/active-directory/#overview) component; thus letting you control who you grant access to applications built on the Genesis low-code platform.

:::note

The IT infrastructure or security team at your organisation is usually responsible for setting up and managing your company's JWT authentication service. If a solution is not in place, Genesis can provide detailed instructions and assistance.

:::

## Configuration details

The following data points need to be shared with Genesis to complete the solution. These data points are stored in the database of your Genesis application. These are all stored on the `JWT_CONFIG` table.

* The `DOMAIN` must contain the domain for which this JWT is valid.
* The `PUBLIC_KEY` should contain the public key of the JWT key pair, (the private key is used to sign the JWT at the internal authentication service).
* Alternatively the `PUBLIC_KEY_URL` can be set as a URL to obtain this dynamically. Public keys obtained in this way are expected to be in JSON Web Key Sets format.
* The `REDIRECT_URL` must contain the URL for which the user is redirected to log in, should they not possess a valid JWT.
* The `KEY_ALGORITHM` should be set either to `KeyAlgorithm.RSA` or `KeyAlgorithm.HMAC`.

## How Genesis JWT SSO works

The SSO workflow depends on whether CORS is configured on your internal authentication service to allow the Genesis low-code platform to make direct authentication requests, or not.

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
6. The Genesis platform is reloaded. It recognises that SSO is enabled, but now with the JWT as a parameter. The platform sends an SSO authentication request with the JWT for the specific organisation. If this is successful, an active Session token is returned.

## JWT revalidation

The Auth service provides an Event Handler to clients, which allows for periodic updating and revalidation of a JWT token.

The Event Handler is named ```EVENT_VALIDATE_JWT``` and takes these parameters:-

```kotlin
data class DomainJWT(
    val domain: String,
    val jwt: String
)
```


