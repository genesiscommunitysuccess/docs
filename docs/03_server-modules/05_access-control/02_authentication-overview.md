---
title: 'Authentication Overview'
sidebar_label: 'Authentication Overview'
id: authentication-overview
---

Authentication can be performed within applications built on the Genesis low-code platform through many techniques. All of these techniques support [Multi-factor Authentication (MFA)](https://en.wikipedia.org/wiki/Multi-factor_authentication) to bring additional security.

Username and Password authentication can be further specified to use one of three solutions:

* INTERNAL
* LDAP
* HYBRID

SSO authentication is further broken down into either:

* [JWT (JSON Web Token)](https://jwt.io/introduction) SSO
* [SAML](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language)

All of these, provide their own configuration settings in the _your-application-_**auth-preferences.kts** file.

So, if your application is called positions, then the file would conventionally be named **positions-auth-preferences.kts**.

## Username and password authentication

Username and password authentication allows users to log in directly to the application built on the Genesis low-code platform. This requires you to choose one of the provided solutions in order control this process.

To specify which one to use, just edit the application's **auth-preferences.kts** file and change the `type` variable in the `authentication` block to match the required value. For example:

```kotlin
security {
  authentication {
    type = AuthType.LDAP
  }
}
```

:::note

If you do not specify an authentication type, INTERNAL authentication is used.

:::

The three values that this can be set to are:

* AuthType.INTERNAL
* AuthType.LDAP
* AuthType.HYBRID

The differences between the solutions associated with each value are as detailed:

### Internal

Internal authentication uses internally stored hashed credentials to authenticate users. It checks user credentials against an internal table. Internal authentication provides the following features:

- User accounts can be locked
- Passwords can be set to expire
- Passwords can be required to conform to configurable standard
- Users can reset or change their password (assuming they can log in first)

Internal authentication is the default authentication behaviour if you don't specify a type in **auth-preferences.kts**.

```kotlin
    authentication {
        type = AuthType.INTERNAL
    }
```

### LDAP

LDAP authentication leverages use of its namesake protocol to authenticate users. 

However, if you specify this, you lose control of the internal authentication functionality. This is because the authentication relies on an external party that cannot be operated from the Application. As a direct consequence, requests to change or reset passwords won't be accepted.

For LDAP authentication, a username must exist inside the internal records of the application. To do this, create a user entry inside the USER table for every LDAP user of the Application. There is no password checking between this login and the Application's internal records; authentication will rely solely on LDAP.

To set up LDAP authentication the `authentication` block of the **auth-preferences.kts** file will need to be configured.

For more information on configuring LDAP authentication, please see [Username and password authentication](/server-modules/access-control/password-authentication/#authentication).

The example below shows LDAP authentication specified, with **userIdType** set to **cn** for the search for the username.

```kotlin
    authentication {
        type = AuthType.LDAP
        url = "localhost"
        port = 389
        // Multiple searchBase elements are allowed -->
        searchBase {
            entry("ou=People,dc=example,dc=com")
        }
        bindDn = "CN=DTADevBindUser,ou=People,dc=example,dc=com"
        bindPassword = "password123"
        userIdType = "cn"
    }
```

### Hybrid

As its name suggests, Hybrid mode is a mix of Internal and LDAP authentication modes, and it checks credentials against both.

First, an internal authentication is performed. If the outcome is successful, another authentication against the LDAP server is performed. The login request is only successful if both authentications are successful.

This enables you to take advantage of all the available functionality of internal mode (locked accounts, expiring passwords, reset/change passwords). However, if passwords are changed or expired, they need to be changed manually in LDAP too, because authentication always happens in both services.

The configuration file takes the same fields as LDAP. You can see this in the example below, where the authentication type has been set to `HYBRID`.

```kotlin
    authentication {
        type = AuthType.HYBRID
        url = "localhost"
        port = 389
        // Multiple searchBase elements are allowed -->
        searchBase {
            entry("ou=People,dc=example,dc=com")
        }
        bindDn = "CN=DTADevBindUser,ou=People,dc=example,dc=com"
        bindPassword = "password123"
        userIdType = "cn"
    }
```

## SSO authentication

SSO authentication allows users to use a single set of credentials to access a range of applications, including those built on the Genesis low-code platform. For more information on SSO technology, please visit the [Single-sign on Wikipedia page](https://en.wikipedia.org/wiki/Single_sign-on)

SSO authentication is a more involved process to enable; thus requires additional file changes detailed in [SSO Authentication](/server-modules/access-control/SSO-authentication/).

Both SSO and password authentication can be used concurrently by applications built on the platform; the use of one does not mandate nor prevent the use of the other.