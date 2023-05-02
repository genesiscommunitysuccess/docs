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
| loginEndpoint | The URI to be re-directed after successful authentication | Yes | No default value | String |
| identityProvider | Configuration for each OIDC Provider. Can be repeated if multiple providers have to be configured | Yes | No default value | Object |

Each `identityProvider` configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| client | The client id and secret | Yes | No default value | Object |
| config | Holds the endpoint and verification configuration for the OIDC provider | Yes if `remoteConfig` is not present | No default value | Object |
| remoteConfig | If the OIDC provider has the configuration endpoint `remoteConfig`, this can be used to point to that endpoint for automatic `endpoint` and `verification` configuration | Yes if `config` is not present | No default value | Object |
| scopes | Requested scopes on authorization | No | `openid profile email` | Set |
| onNewUser | Predefined action when a new user logs in | No | `ALLOW_ACCESS` - add the user to the database | Enum (`ALLOW_ACCESS`, `DO_NOTHING`) |
| usernameClaim | The claim to be used as username in the Genesis database. | No | `email`  | String |
| tokenLifeInSeconds | The life time of the issued SSO_TOKEN. | Yes | No default value | Int |
| redirectUri | The URI to handle the code authorization. | Yes | No default value | String |

Each `config` configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| endpoints | Holds the token and authorization endpoints | Yes | No default value | Object |
| verification | Holds configuration for the public key of the JWT issuer, the allowed clock skew and whether validation is enabled | No | No JWT verification | Object |

Each `remoteConfig` configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| url | The OIDC provider configuration endpoint. | Yes | No default value | String |
| verification | Holds configuration for the allowed clock skew and whether validation is enabled | No | No JWT verification | Object |

Each `client` configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| id | The client id provided by the OIDC Provider when application was registered | Yes | No default value | String |
| secret | The client secret provided by the OIDC Provider when application was registered | Yes | No default value | String |


Each `endpoints` configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| token | The OIDC provider `token` endpoint | Yes | No default value | String |
| authorization | The OIDC provider `authorization` endpoint | Yes | No default value | String |


Each `verification` configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| publicKey  | The public key to be used to validate the JWT | No | No default value | String |
| publicKeyUrl | URL to the public key to be used to validate the JWT | No | No default value | String |
| enabled | Enables/disables the validation of the JWT | No | True | Boolean |

:::note
If `verification` is defined, either `publicKey` or `publicKeyUrl` must also be defined.
:::

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

    onNewUser = NewUserStrategy.ALWAYS_ALLOW

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
