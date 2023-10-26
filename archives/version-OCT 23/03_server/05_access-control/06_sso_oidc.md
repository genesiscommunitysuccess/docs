---
title: 'SSO - OIDC'
sidebar_label: 'SSO - OIDC'
id: SSO-oidc
keywords: [OIDC, server, access control, SSO, authentication]
tags:
  - OIDC
  - server
  - access control
  - SSO
  - authentication
---


import CodeBlock from '@theme/CodeBlock';


SSO is a mechanism that enables a user to be authenticated against a single system, and use that authenticated id across multiple applications - including those built on the Genesis low-code platform. This has the advantage that a user is required to log in only once, rather than once per system. [OpenID Connect](https://openid.net/connect/) (OIDC) is a simple identity layer on top of the [OAuth 2.0 protocol](https://oauth.net/2/). It enables applications to:

- verify the identity of the end user based on the authentication performed by an Authorisation Server
- obtain basic profile information about the end user in an interoperable and REST-like manner 


## Message flow
When OIDC is configured and enabled, a user can click on an SSO button in the GUI. This starts the OIDC authentication flow:

1. The user is re-directed to the OpenID provider authentication window.
2. The user identifies him or herself to the OIDC provider.
3. After successful authentication,the OIDC provider sends an authentication code to the Genesis application.
4. Using the sent code, the Genesis application retrieves the user information and validates it.
5. Upon successful validation, the user is redirected back to the Genesis login endpoint with a token.
6. The front end starts the login process into Genesis using this token.

## Prerequisites


OIDC works by connecting the Genesis application and the OpenID Connect (OIDC) provider. Therefore: 

- The Genesis application must be able to connect to the OIDC provider.
- The OIDC provider needs to be aware of the application(s) that can connect to it. 

## Configuring OIDC
Once you have checked the prerequisites, there are two things you need to do:

1. Enable OIDC support in the Router.
2. Configure OIDC.

We shall now look at these in detail.

### Enabling OIDC in the Genesis Router

To enable OIDC on the Genesis Router process, change the Router's config in your _application-name-_**processes.xml** file. The process name is `GENESIS_ROUTER`.

Specifically, you have to add:
- `global.genesis.auth.oidc` and `global.genesis.auth.sso.endpoint` to the `<package .../>` tag
- `auth-oidc-*.jar` and `auth-sso-endpoint-*.jar` to the `<classpath .../>` tag
- the GPAL configuration to the `<script ../>` tag

Finally, make sure that the `<language ../>` tag says `pal`

:::note
Adding `global.genesis.auth.oidc` to the `packages` and `auth-oidc-*.jar` to the `classpath` enables the OIDC integration. And adding `global.genesis.auth.sso.endpoint` and `auth-sso-endpoint-*.jar` enables the endpoints required by the front end.
:::

You can see these additions in the example below:
```xml title='enabling OIDC integration' {6,10}
<process name="GENESIS_ROUTER">
    <start>true</start>
    <groupId>GENESIS</groupId>
    <options>-Xmx512m -DXSD_VALIDATE=false</options>
    <module>router</module>
    <package>global.genesis.router,global.genesis.console,global.genesis.auth.oidc,global.genesis.auth.sso.endpoint</package>
    <config>router-process-config.kts</config>
    <script>genesis-router.kts,position-oidc-config.kts</script>
    <language>pal</language>
    <classpath>genesis-console-*.jar,auth-oidc-*.jar,auth-sso-endpoint-*.jar</classpath>
    <description>Socket, Websocket and HTTP proxy which routes incoming messages to GENESIS microservices</description>
</process>
```

If you require JWT validation, you need the following jars on the `classpath` as well - `jjwt-impl-*.jar,jjwt-jackson-*.jar`

You can see that in the example below. 

```xml title='enabling JWT validation' {10}
<process name="GENESIS_ROUTER">
    <start>true</start>
    <groupId>GENESIS</groupId>
    <options>-Xmx512m -DXSD_VALIDATE=false</options>
    <module>router</module>
    <package>global.genesis.router,global.genesis.console,global.genesis.auth.oidc,global.genesis.auth.sso.endpoint</package>
    <config>router-process-config.kts</config>
    <script>genesis-router.kts,position-oidc-config.kts</script>
    <language>pal</language>
    <classpath>genesis-console-*.jar,auth-oidc-*.jar,auth-sso-endpoint-*.jar,jjwt-impl-*.jar,jjwt-jackson-*.jar</classpath>
    <description>Socket, Websocket and HTTP proxy which routes incoming messages to GENESIS microservices</description>
</process>
```

### Configuration in GPAL
You need to provide the logic that controls how your application interacts with OIDC in order to login your users. You can do this in the file _application-name-_**oidc-config.kts** file. 

Within the configuration file, each OIDC configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| loginEndpoint | The login URI of your application; this is used to initiate the OIDC login | Yes | No default value | String |
| identityProvider | Configuration for each OIDC Provider. Can be repeated if multiple providers have to be configured | Yes | No default value | Object |

Each `identityProvider` configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| client | The client id and secret | Yes | No default value | Object |
| config | Holds the endpoint and verification configuration for the OIDC provider | Yes if `remoteConfig` is not present | No default value | Object |
| remoteConfig | If the OIDC provider has the configuration endpoint `remoteConfig`, this can be used to point to that endpoint for automatic `endpoint` and `verification` configuration | Yes if `config` is not present | No default value | Object |
| scopes | Requested scopes on authorisation | No | `openid profile email` | Set |
| onNewUser | Predefined action when a new user logs in. **This property is now deprecated** in favour of `onFirstLogin` and `onLoginSuccess` | No | `ALLOW_ACCESS` - add the user to the database  | Enum (ALLOW_ACCESS, DO_NOTHING) |
| usernameClaim | The claim to be used as username in the Genesis database. | No | `email`  | String |
| tokenLifeInSeconds | The life time of the issued SSO_TOKEN. | Yes | No default value | Int |
| redirectUri | The URI that handles the code authorisation; in normal OIDC workflow, this is the login URL of your application | Yes | No default value | String |
| onFirstLogin | Configuration for creating `User` and its `UserAttributes`. It's called on first successful login when the user doesn't exist in the database. | No | No default value | Object |
| onLoginSuccess | Callback that is invoked every time after successful authentication. It has access to the database and the `DecodedIdToken` returned by the OIDC Provider | No | No default value | Object |

Each `config` configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| endpoints | Holds the token and authorisation endpoints | Yes | No default value | Object |
| verification | Holds configuration for the public key of the JWT issuer, the allowed clock skew, and whether validation is enabled | No | No JWT verification | Object |

Each `remoteConfig` configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| url | The OIDC provider configuration endpoint. | Yes | No default value | String |
| verification | Holds configuration for the allowed clock skew and whether validation is enabled | No | No JWT verification | Object |
| logout | Configuration for OIDC logout | No | OIDC logout is disabled by default | Object |

Each `client` configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| id | The client id provided by the OIDC Provider when application was registered | Yes | No default value | String |
| secret | The client secret provided by the OIDC Provider when application was registered | Yes | No default value | String |

Each `onFirstLogin` has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| createUser | Returns `User` and `UserAttributes` from the `DecodedIdToken` returned by the OIDC provider | No | No default value | Object |
| createUserPermissions | Configuration for user permissions | No | No default value | Object |

Each `endpoints` configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| token | The OIDC provider `token` endpoint | Yes | No default value | String |
| authorization | The OIDC provider `authorization` endpoint | Yes | No default value | String |
| logout | Configuration for OIDC logout | No | OIDC logout is disabled by default | Object |

Each `verification` configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| publicKey  | The public key to be used to validate the JWT | No | No default value | String |
| publicKeyUrl | URL to the public key to be used to validate the JWT | No | No default value | String |
| enabled | Enables/disables the validation of the JWT | No | True | Boolean |
| allowedClockSkewSeconds | The amount of clock skew in seconds to tolerate when verifying the local time against the `nbf` claim  | No | 0 | Long |

:::note
If `verification` is defined, either `publicKey` or `publicKeyUrl` must also be defined.
:::

Finally, you need to specify an SSOToken authenticator in your _application-name-_**auth-preferences.kts** file:
```kotlin
    authentication {
		ssoToken {}
    }
```

### Configuring the front end
The [front end of your application needs to be configured correctly](../../access-control/sso-front-end-config/) to ensure that the workflow works correctly.

## OIDC logout

Sometimes, applications require functionality where the user logs out of the OIDC provider. By default, this is disabled.

:::note
If a user logs out of the OIDC provider, she or he will also be logged out of all other applications that work with that provider.
:::

There are several steps required to enable OIDC logout. 

### Enable OIDC support in GENESIS_AUTH_MANAGER

First `GENESIS_AUTH_MANAGER` needs to know about the OIDC configuration. In **auth-processes.xml**, add:

- the oidc jars to the `classpath`
- the oidc package to `package`
- the OIDC configuration to `script`

See this in the example below.

```xml title='auth-processes.xml' {6,8,9}
<process name="GENESIS_AUTH_MANAGER">
    <groupId>AUTH</groupId>
    <start>true</start>
    <options>-Xmx256m -DXSD_VALIDATE=false</options>
    <module>auth-manager</module>
    <package>global.genesis.eventhandler,global.genesis.eventhandler.pal,global.genesis.auth.manager,global.genesis.auth.oidc</package>
    <description>Controls the authentication/authorisation setup for users</description>
    <script>auth-preferences.kts,auth-user-eventhandler.kts,auth-profile-eventhandler.kts,auth-mfa-eventhandler.kts,auth-password-eventhandler.kts,position-oidc-config.kts</script>
    <classpath>auth-script-config*,auth-oidc-*.jar</classpath>
    <language>pal</language>
</process>
```

In the example above:
 - the package `global.genesis.auth.oidc` is added to the `package` element
 - the script `position-oidc-config.kts` is added to the `script` element
 - the `auth-oidc-*.jar` files are added to the `classpath` element

### Enable OIDC logout in GPAL

The easiest way to enable OIDC logout in GPAL is by specifying the logout endpoint, as shown in the sample below:

```kotlin title='specifying logout endpoint'
oidc {
    
    identityProvider("oidc") {
        ...

        config {
           ...

            endpoints {
              ...
              logout(path = "https://oidc-provider.com/logout")
            }
        }
        ...
    }
}
```

However, there are providers that have a custom logout mechanism. If the provider is supported by the platform, the `mode` property can be specified, along with the logout endpoint:

```kotlin title='specifying logout endpoint for vendor specific logout'
oidc {
    
    identityProvider("oidc") {
        ...

        config {
           ...

            endpoints {
              ...
              logout(mode = LogoutMode.AUTH0, path = "https://oidc-provider.com/logout")
            }
        }
        ...
    }
}
```

If the provider is not supported by the platform (and in all other cases where a provider has a custom logout mechanism), you can specify a custom `logout` configuration, as shown below:

```kotlin title='specifying custom logout URL'
oidc {
    
    identityProvider("oidc") {
        ...

        config {
           ...

            endpoints {
              ...
              logout{ 
                path = "https://oidc-provider.com/logout"
                addParameter("my-app", "positions")
              }
            }
        }
        ...
    }
}
```

For OIDC configuration that uses a configuration endpoint, you can enable the logout functionality by calling `logout()`:

```kotlin title='using the logout endpoint from the remote configuration'
oidc {
    
    identityProvider("oidc") {
        ...

        remoteConfig {
            ...
            logout()
        }
        ...
    }
}
```

In this case, the logout endpoint specified for the `end_session_endpoint` property will be used. 

If the OIDC provider doesn't expose a logout endpoint through the configuration endpoint, then it can be specified as shown below:

```kotlin title='specifying logout endpoint'
oidc {
    
    identityProvider("oidc") {
        ...

        remoteConfig {
            ...
            logout(path = "https://oidc-provider.com/logout")
        }
        ...
    }
}
```

And for OIDC providers with a custom logout mechanism, the sample below can be used:

```kotlin title='specifying logout endpoint for vendor specific logout'
oidc {
    
    identityProvider("oidc") {
        ...

        remoteConfig {
            ...
            logout(mode = LogoutMode.AUTH0, path = "https://oidc-provider.com/logout")
        }
        ...
    }
}
```

As a last resort, when a provider has a custom logout mechanism that is not supported by the platform, you can specify a custom `logout` configuration, as shown below:

```kotlin title='specifying custom logout URL'
oidc {
    
    identityProvider("oidc") {
        ...

        remoteConfig {
            ...
            logout{ 
              path = "https://oidc-provider.com/logout")
              addParameter("my-app", "positions")
            }
        }
        ...
    }
}
```

## Sample configurations

### Minimal configuration

```kotlin
oidc{
  loginEndpoint = "http://uat-host/login"
  identityProvider("uatOidc"){
    client{
      id = "appplication-id"
      secret = "application-secret"
    }

    config {
      endpoints{
        token = "uat-oidc:1337/token"
        authorization = "uat-odic:1337/auth"
      }
    }

    tokenLifeInSeconds = 5000

    redirectUri = "http://genesis-uat-host/gwf/logon"
  }
}
```

### Minimal remote configuration

```kotlin
oidc{
  loginEndpoint = "http://uat-host/login"
  identityProvider("uatOidc"){
    client{
      id = "appplication-id"
      secret = "application-secret"
    }

    remoteConfig {
      url = "http://uat-oidc/.well-known/openid-configuration"
    }

    tokenLifeInSeconds = 5000

    redirectUri = "http://genesis-uat-host/gwf/logon"
  }
}
```

### Full configuration

```kotlin
oidc{
  loginEndpoint = "http://uat-host/login"
  identityProvider("uatOidc"){
    client{
      id = "appplication-id"
      secret = "application-secret"
    }

    config {
      endpoints{
        token = "uat-oidc:1337/token"
        authorization = "uat-odic:1337/auth"
      }
    
      verification {
        publicKeyUrl = "http://uat-oidc:1377/.well_known/certs.jwks"
      }
    }
    
    scopes("openid", "profile")

    usernameClaim = "name"

    tokenLifeInSeconds = 5000

    redirectUri = "http://genesis-uat-host/gwf/logon"

    onFirstLogin {
        createUser {
            User{
              userName = idToken.subject
            } to userAttributes
        }

        createUserPermissions {
            userProfiles("emp", "genesis")
        }
    }

    onLoginSuccess { 

    }
  }
}
```
