---
title: 'Access control - SSO authentication'
sidebar_label: 'SSO authentication'
id: SSO-authentication
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


## SAML SSO

SAML is an SSO protocol that can be used to authenticate users on the Genesis platform. It works by connecting a Service Provider (SP) - the Genesis application in this case - and an Identity Provider (IDP), which would be an external party.

The SP and the IDP communicate using the user's web browser, and do not need to be accessible to each other.

Once SAML is enabled, a user can click on an SSO button in the GUI. This starts the SAML authentication flow:


1. The user is directed to a Genesis endpoint, which generates the authentication (authn) request.
2. The user is redirected to the IDP, with the authn request as a query parameter.
3. The user identifies him or herself to the IDP.
4. The user is redirected back to the Genesis SAML endpoint, with a response as a query parameter.
5. The response is validated, and the user is redirected back to the Genesis login endpoint with a token.
6. The front end starts the login process into Genesis using this token.

For more information, see [wikipedia](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language).

This workflow is described in more detail in the section on [Front-to-back flow](../../../server/access-control/SSO-authentication/#front-to-back-flow).

### Definitions


| Term | Meaning                                      | Example                                                                                     |
| --- |----------------------------------------------|---------------------------------------------------------------------------------------------|
| IDP | Identity Provider.                            | The authentication source, for example your your User management solution.                   |
| SP | Service Provider.                             | The service for which the user needs to be authenticated, for example a Genesis application. |
| MetaData | Configuration shared between the IDP and SP. | See below.                                                                                   |


```xml
<?xml version="1.0"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" entityID="http://localhost:8080/simplesaml/saml2/idp/metadata.php">
  <md:IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIIDXTCCAkWgAwIBAgIJALmVVuDWu4NYMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMTYxMjMxMTQzNDQ3WhcNNDgwNjI1MTQzNDQ3WjBFMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzUCFozgNb1h1M0jzNRSCjhOBnR+uVbVpaWfXYIR+AhWDdEe5ryY+CgavOg8bfLybyzFdehlYdDRgkedEB/GjG8aJw06l0qF4jDOAw0kEygWCu2mcH7XOxRt+YAH3TVHa/Hu1W3WjzkobqqqLQ8gkKWWM27fOgAZ6GieaJBN6VBSMMcPey3HWLBmc+TYJmv1dbaO2jHhKh8pfKw0W12VM8P1PIO8gv4Phu/uuJYieBWKixBEyy0lHjyixYFCR12xdh4CA47q958ZRGnnDUGFVE1QhgRacJCOZ9bd5t9mr8KLaVBYTCJo5ERE8jymab5dPqe5qKfJsCZiqWglbjUo9twIDAQABo1AwTjAdBgNVHQ4EFgQUxpuwcs/CYQOyui+r1G+3KxBNhxkwHwYDVR0jBBgwFoAUxpuwcs/CYQOyui+r1G+3KxBNhxkwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAAiWUKs/2x/viNCKi3Y6blEuCtAGhzOOZ9EjrvJ8+COH3Rag3tVBWrcBZ3/uhhPq5gy9lqw4OkvEws99/5jFsX1FJ6MKBgqfuy7yh5s1YfM0ANHYczMmYpZeAcQf2CGAaVfwTTfSlzNLsF2lW/ly7yapFzlYSJLGoVE+OHEu8g5SlNACUEfkXw+5Eghh+KzlIN7R6Q7r2ixWNFBC/jWf7NKUfJyX8qIG5md1YUeT6GBW9Bm2/1/RiO24JTaYlfLdKK9TYb8sG5B+OLab2DImG99CJ25RkAcSobWNF5zD0O6lgOo3cEdB/ksCq3hmtlC/DlLZ/D8CJ+7VuZnS1rR2naQ==</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:KeyDescriptor use="encryption">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIIDXTCCAkWgAwIBAgIJALmVVuDWu4NYMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMTYxMjMxMTQzNDQ3WhcNNDgwNjI1MTQzNDQ3WjBFMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzUCFozgNb1h1M0jzNRSCjhOBnR+uVbVpaWfXYIR+AhWDdEe5ryY+CgavOg8bfLybyzFdehlYdDRgkedEB/GjG8aJw06l0qF4jDOAw0kEygWCu2mcH7XOxRt+YAH3TVHa/Hu1W3WjzkobqqqLQ8gkKWWM27fOgAZ6GieaJBN6VBSMMcPey3HWLBmc+TYJmv1dbaO2jHhKh8pfKw0W12VM8P1PIO8gv4Phu/uuJYieBWKixBEyy0lHjyixYFCR12xdh4CA47q958ZRGnnDUGFVE1QhgRacJCOZ9bd5t9mr8KLaVBYTCJo5ERE8jymab5dPqe5qKfJsCZiqWglbjUo9twIDAQABo1AwTjAdBgNVHQ4EFgQUxpuwcs/CYQOyui+r1G+3KxBNhxkwHwYDVR0jBBgwFoAUxpuwcs/CYQOyui+r1G+3KxBNhxkwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAAiWUKs/2x/viNCKi3Y6blEuCtAGhzOOZ9EjrvJ8+COH3Rag3tVBWrcBZ3/uhhPq5gy9lqw4OkvEws99/5jFsX1FJ6MKBgqfuy7yh5s1YfM0ANHYczMmYpZeAcQf2CGAaVfwTTfSlzNLsF2lW/ly7yapFzlYSJLGoVE+OHEu8g5SlNACUEfkXw+5Eghh+KzlIN7R6Q7r2ixWNFBC/jWf7NKUfJyX8qIG5md1YUeT6GBW9Bm2/1/RiO24JTaYlfLdKK9TYb8sG5B+OLab2DImG99CJ25RkAcSobWNF5zD0O6lgOo3cEdB/ksCq3hmtlC/DlLZ/D8CJ+7VuZnS1rR2naQ==</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="http://localhost:8080/simplesaml/saml2/idp/SingleLogoutService.php"/>
    <md:NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:transient</md:NameIDFormat>
    <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="http://localhost:8080/simplesaml/saml2/idp/SSOService.php"/>
  </md:IDPSSODescriptor>
</md:EntityDescriptor>
```

### Pre-requisites

Before starting, ensure you have access to the IDP metadata (this is generated by the IDP). Once you have checked this, there are two things you need to do:

1. Enable SAML support in the Router
2. Configure SAML.

We shall now look at these in detail.

### How to enable SAML in the Genesis Router

You must enable SAML on the Genesis Router service. Do this by changing the router config in you _application-name-_**processes.xml** file. The process name is `GENESIS_ROUTER`.

Specifically, you have to add:

- `global.genesis.auth.saml` to the `<package …/>` tag
- `auth-saml-*.jar` to the `<classpath …/>` tag

You can see these additions in the example below:

```xml
    <process name="GENESIS_ROUTER">
        <start>true</start>
        <groupId>GENESIS</groupId>
        <options>-Xmx512m -DXSD_VALIDATE=false</options>
        <module>router</module>
        <package>global.genesis.router,global.genesis.console,global.genesis.auth.saml</package>
        <script>genesis-router.kts</script>
        <classpath>genesis-console-5.2.*.jar,auth-saml-*.jar</classpath>
        <description>Socket, Websocket and HTTP proxy which routes incoming messages to GENESIS microservices</description>
    </process>
```


Additionally, you need a _application-name-_**saml-config.kts** file, as below:

```kotlin
    saml {
        strictMode = false
        debugMode = true
        // this should be the URL of the application logon screen
        loginEndpoint = "https://sso.genesislab.global/login" 
        tokenLifeInSeconds = 3000
    
        serviceProvider {
            // this should be the url for accessing the router
            entityId = "https://sso.genesislab.global/gwf" 
        }
    
        // for every identity provider we support we need one of these
        identityProvider("genesis") {
            // we need the IDP metadata, either a file:
            metadataUrl = "genesismetadata.xml" 
            // or a url (IDP should be accessible from genesis box):
            metadataUrl = "http://localhost:8080/simplesaml/saml2/idp/metadata.php?output=xml" // IDP metadata endpoint
    
            // where do we get the email address from
            mapNameIdToUser()
            // or 
            mapToAttribute("email")
    
            // optional -> add url parameter to auth request
            modifyRequest { config ->
                addParameter("PartnerSpId", config.settings.spEntityId)
            }
        }
    }
```
Note that the 'loginEndpoint' is the URL the front-end will be redirected to once a the full SAML workflow has completed and an SSO_TOKEN has been issued. 
If this URL is a redirect, the SSO_TOKEN query parameter may be lost. 
Additionally, if the web server is doing routing via scripts, navigating to this URL may throw a 404 Not Found error. The remedy in this case is to add an override for 404 errors to redirect back to your application logon screen. 
An example of how to do this in NGINX is here:
```
error_page 404 =200 /index.html;
```

Advanced configuration is defined in the file **onelogin.saml.properties**. You need to use this if - for example - you need to configure a key for signing the authn request.

Once this is configured, a service provider metadata endpoint will be available on: `https://{url}/gwf/saml/metadata?idp={idp name}`.

Other endpoints provided are:

- The `ssoLoginUrl`
  - The format of this is: `https://{appHost}{ssoLoginRoute}?idp={id}` where:
    - `appHost` is hostname of the app, e.g. dev-position2
    - `ssoLoginRoute` is `/gwf/saml/login` by default (this is configurable)
    - `id` is the ID of the selected identity provider
  - For example: `https://dev-position2/gwf/saml/login?idp=provider1`

- the `ssoListEndpoint`
  - By default, this is `gwf/saml/list` (configurable)
  - This endpoint returns a list of identity providers:
  ```
  [
  {ID:'provider1', DESCRIPTION:'Description 1'},
  {ID:'provider2', DESCRIPTION:'Description 2'}
  ]
  ```

### Enabling users for SAML

To enable users to be able to sign in using SAML, you must add them to the `USER`, `USER_ATTRIBUTES` and `SSO_USER` tables within your Genesis application.

In the `SSO_USER` table:

* `SSO_METHOD` must be set to SAML
* `SSO_SOURCE` must be set to the identity provider name defined in the **saml-config.kts** file.

The Genesis username should be the user’s email address.

### Front-to-back flow

This section provides a more detailed description of the workflow between a Genesis application SP and an external IDP. The flow assumes the following settings:

- `ssoToggle` is set to true in the Genesis application’s `config.ts`, this ensures that the ‘Enable SSO?’ checkbox is displayed on the application's login page.
- 'Enable SSO’ is checked, either manually in the UI, or `ssoEnable` is set to true by default in the config.
- In the front end, the following has been added to `src/routes/config.ts`:

```javascript
this.routes.map(
      {path: '', redirect: 'login'},
      {
        path: 'login',
        element: Login,
        title: 'Login',
        name: 'login',
        layout: loginLayout,
        settings: {
          ...
          ssoToggle: true,
          ssoEnable: true,
        },
        childRouters: true,
      },
      {path: 'protected', element: Protected, title: 'Protected', name: 'protected', settings: {allowAutoAuth: true}},
      {path: 'admin', element: Admin, title: 'Admin', name: 'admin', settings: {allowAutoAuth: true}},
      {path: 'reporting', element: Reporting, title: 'Reporting', name: 'reporting', settings: {allowAutoAuth: true}},
    );

```

1. The front end hits **ssoListEndpoint** - by default - this is `gwf/saml/list` (This is configurable).
2. **ssoListEndpoint** returns a list of identity providers:
   ```
   [
   {ID:'provider1', DESCRIPTION:'Description 1'},
   {ID:'provider2', DESCRIPTION:'Description 2'}
   ]
   ```
3. Identity providers are parsed and the dropdown is populated on the login page.
4. The user selects an identity provider using the dropdown (or keeps the preselected default). Then the user clicks the '**SSO Login**' button.
5. The browser redirects to the **ssoLoginUrl**, which might be, for example: `https://dev-position2/gwf/saml/login?idp=provider1`.
6. The server sends the user to the identity provider’s login page.
7. The user logs in using their SSO credentials.

8. The server redirects the client back to the client-app with a new url param: `SSO_TOKEN`.

9. The front end checks for the presence of an `SSO_TOKEN` url param. If found, it stores it in session storage and uses it to perform an ‘SSO Login’.
10. The server responds with an ACK and the user is now logged in. If there is an error, a NACK is returned and the login fails.

### Testing SAML

### Server - setting up local SAML

In order to test the SAML flow, first, you need to run SAML locally. You can do this using a docker container, for example:

```bash
docker run -p 8080:8080 -p 8443:8443 -e SIMPLESAMLPHP_SP_ENTITY_ID=https://localhost/gwf/saml/metadata?idp=test -e SIMPLESAMLPHP_SP_ASSERTION_CONSUMER_SERVICE=https://localhost/gwf/saml/logon?idp=test -e SIMPLESAMLPHP_SP_SINGLE_LOGOUT_SERVICE=https://localhost/gwf/saml/logout?idp=test -d kristophjunge/test-saml-idp
```
In the above command, you need to replace:

- _IP_ with the address/IP of your Genesis instance
- _test_  with the name of the IDP

Then, make sure that auth saml has been added to the genesis router configuration in **processes.xml**, for example:

```xml
<process name="GENESIS_ROUTER">
    <start>true</start>
    <groupId>GENESIS</groupId>
    <options>-Xmx512m -DXSD_VALIDATE=false</options>
    <module>router</module>
    <package>global.genesis.router,global.genesis.console,global.genesis.auth.saml</package>
    <script>genesis-router.kts</script>
    <language>pal</language>
    <classpath>genesis-console-*.jar,auth-saml-*.jar</classpath>
    <description>Socket, Websocket and HTTP proxy which routes incoming messages to GENESIS microservices</description>
</process>
```

Next, in your application's **jvm/{application-name}-site-specific** directory, create an _application-name-_**saml-config.kts** file with the following SAML details:

```kotlin
    saml {
        strictMode = false
        debugMode = true
    
        loginEndpoint = "http://localhost:6060/login" 
        tokenLifeInSeconds = 3000
    
        serviceProvider {
            // this should be the url for accessing the router
            entityId = "http://localhost/gwf" 
        }
    
        // for every identity provider we support we need one of these
        identityProvider("test") {
            metadataUrl = "http://localhost:8080/simplesaml/saml2/idp/metadata.php?output=xml" // IDP metadata endpoint
    
            // where do we get the email address from
            mapToAttribute("email")
        }
    }
```

4. Now you are ready to add some users.

* Add user to USER table with username “user1@example.com”

* Add user to SSO_USER table:

"SSO_SOURCE","SSO_METHOD","SSO_DETAILS","USER_NAME”
SSO_SOURCE = Identity Provider (as per above SAML config ’test’)
SSO_METHOD = SAML
SSO_DETAILS = an internal identifier (for example, TRADE_DESK_1)
USER_NAME = user1@example.com

* Add user to USER_ATTRIBUTES table:
  "TELEPHONE_NUMBER_DIRECT","MOBILE_NUMBER","USER_NAME","TELEPHONE_NUMBER_OFFICE","REGION","ADDRESS_LINE1","ADDRESS_LINE2","ADDRESS_LINE3","CITY","COUNTRY","ADDRESS_LINE4","POSTAL_CODE","USER_TYPE","ACCESS_TYPE","TITLE","WEBSITE”
  Only three are relevant!
  USER_NAME = user1@example.com
  USER_TYPE = USER
  ACCESS_TYPE = ALL

5. With the users set up, you can run your server.

### Running the user interface


1. Run an NGINX proxy docker container: for example:


```bash
docker run -it --rm -d -p 80:80 -p 443:443 --name **genesis**-console-proxy --add-host localnode:$(ifconfig eth0 | grep inet | grep -v inet6 | awk '{print $2}') genesisglobal-docker-internal.jfrog.io/genesis-console-proxy
```

2. In **package.json**, change the API_HOST property to `"API_HOST": "wss://localhost/gwf/"`

3. Now you can run the front end.

`Test Metadata File (testMetadata.xml)`

```bash
docker run -it --rm -d -p 80:80 -p 443:443 --name genesis-console-proxy --add-host
```


Here is some test metadata you can use:

```xml
<?xml version="1.0"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
                     entityID="http://localhost:8080/simplesaml/saml2/idp/metadata.php">
    <md:IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
        <md:KeyDescriptor use="signing">
            <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                <ds:X509Data>
                    <ds:X509Certificate>
                        MIIDXTCCAkWgAwIBAgIJALmVVuDWu4NYMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMTYxMjMxMTQzNDQ3WhcNNDgwNjI1MTQzNDQ3WjBFMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzUCFozgNb1h1M0jzNRSCjhOBnR+uVbVpaWfXYIR+AhWDdEe5ryY+CgavOg8bfLybyzFdehlYdDRgkedEB/GjG8aJw06l0qF4jDOAw0kEygWCu2mcH7XOxRt+YAH3TVHa/Hu1W3WjzkobqqqLQ8gkKWWM27fOgAZ6GieaJBN6VBSMMcPey3HWLBmc+TYJmv1dbaO2jHhKh8pfKw0W12VM8P1PIO8gv4Phu/uuJYieBWKixBEyy0lHjyixYFCR12xdh4CA47q958ZRGnnDUGFVE1QhgRacJCOZ9bd5t9mr8KLaVBYTCJo5ERE8jymab5dPqe5qKfJsCZiqWglbjUo9twIDAQABo1AwTjAdBgNVHQ4EFgQUxpuwcs/CYQOyui+r1G+3KxBNhxkwHwYDVR0jBBgwFoAUxpuwcs/CYQOyui+r1G+3KxBNhxkwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAAiWUKs/2x/viNCKi3Y6blEuCtAGhzOOZ9EjrvJ8+COH3Rag3tVBWrcBZ3/uhhPq5gy9lqw4OkvEws99/5jFsX1FJ6MKBgqfuy7yh5s1YfM0ANHYczMmYpZeAcQf2CGAaVfwTTfSlzNLsF2lW/ly7yapFzlYSJLGoVE+OHEu8g5SlNACUEfkXw+5Eghh+KzlIN7R6Q7r2ixWNFBC/jWf7NKUfJyX8qIG5md1YUeT6GBW9Bm2/1/RiO24JTaYlfLdKK9TYb8sG5B+OLab2DImG99CJ25RkAcSobWNF5zD0O6lgOo3cEdB/ksCq3hmtlC/DlLZ/D8CJ+7VuZnS1rR2naQ==
                    </ds:X509Certificate>
                </ds:X509Data>
            </ds:KeyInfo>
        </md:KeyDescriptor>
        <md:KeyDescriptor use="encryption">
            <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                <ds:X509Data>
                    <ds:X509Certificate>
                        MIIDXTCCAkWgAwIBAgIJALmVVuDWu4NYMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMTYxMjMxMTQzNDQ3WhcNNDgwNjI1MTQzNDQ3WjBFMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzUCFozgNb1h1M0jzNRSCjhOBnR+uVbVpaWfXYIR+AhWDdEe5ryY+CgavOg8bfLybyzFdehlYdDRgkedEB/GjG8aJw06l0qF4jDOAw0kEygWCu2mcH7XOxRt+YAH3TVHa/Hu1W3WjzkobqqqLQ8gkKWWM27fOgAZ6GieaJBN6VBSMMcPey3HWLBmc+TYJmv1dbaO2jHhKh8pfKw0W12VM8P1PIO8gv4Phu/uuJYieBWKixBEyy0lHjyixYFCR12xdh4CA47q958ZRGnnDUGFVE1QhgRacJCOZ9bd5t9mr8KLaVBYTCJo5ERE8jymab5dPqe5qKfJsCZiqWglbjUo9twIDAQABo1AwTjAdBgNVHQ4EFgQUxpuwcs/CYQOyui+r1G+3KxBNhxkwHwYDVR0jBBgwFoAUxpuwcs/CYQOyui+r1G+3KxBNhxkwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAAiWUKs/2x/viNCKi3Y6blEuCtAGhzOOZ9EjrvJ8+COH3Rag3tVBWrcBZ3/uhhPq5gy9lqw4OkvEws99/5jFsX1FJ6MKBgqfuy7yh5s1YfM0ANHYczMmYpZeAcQf2CGAaVfwTTfSlzNLsF2lW/ly7yapFzlYSJLGoVE+OHEu8g5SlNACUEfkXw+5Eghh+KzlIN7R6Q7r2ixWNFBC/jWf7NKUfJyX8qIG5md1YUeT6GBW9Bm2/1/RiO24JTaYlfLdKK9TYb8sG5B+OLab2DImG99CJ25RkAcSobWNF5zD0O6lgOo3cEdB/ksCq3hmtlC/DlLZ/D8CJ+7VuZnS1rR2naQ==
                    </ds:X509Certificate>
                </ds:X509Data>
            </ds:KeyInfo>
        </md:KeyDescriptor>
        <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
                                Location="http://localhost:8080/simplesaml/saml2/idp/SingleLogoutService.php"/>
        <md:NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:transient</md:NameIDFormat>
        <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
                                Location="http://localhost:8080/simplesaml/saml2/idp/SSOService.php"/>
    </md:IDPSSODescriptor>
</md:EntityDescriptor>
```

## OpenID Connect SSO

[OpenID Connect](https://openid.net/connect/) is a simple identity layer on top of the [OAuth 2.0 protocol](https://oauth.net/2/). It allows applications to verify the identity of the End-User based on the authentication performed by an Authorization Server, as well as to obtain basic profile information about the End-User in an interoperable and REST-like manner. It works by connecting the Genesis application and the OpenID Connect (OIDC) provider. The Genesis application must be able to connect to the OIDC provider and the OIDC provder needs to be aware of the application(s) that can connect to it. 

Once OIDC is configured and enabled, a user can click on an SSO button in the GUI. This starts the OIDC authentication flow:
1. The user is re-directed to the OpenID provider authentication window
2. The user identifies him or herself to the OIDC provider
3. After succesful authentication the OIDC provider sends authentication code to the Genesis application
4. Using the sent code the Genesis application retrieves user information and validates it
5. Upon successful validation the user is redirected back to the Genesis login endpoint with a token
6. The front end starts the login process into Genesis using this token

### Pre-requisites

Before starting, ensure you have access to the OIDC provider. Once you have checked this, there are two things you need to do:

1. Enable OIDC support in the Router
2. Configure OIDC.

We shall now look at these in detail.

### How to enable OIDC in the Genesis Router

You must enable OIDC on the Genesis Router process. Do this by changing the router config in your _application-name-_**processes.xml** file. The process name is `GENESIS_ROUTER`.

Specifically, you have to add:
- `genesis.auth.oidc` and `global.genesis.auth.sso.endpoint` to the `<package .../>` tag
- `auth-oidc-*.jar` and `auth-sso-endpoint-*.jar` to the `<classpath .../>` tag
- add the GPAL configuration to the `<script ../>` tag
- make sure that the `<language ../>` tag say `pal`

:::note
Adding `genesis.auth.oidc` to the `packages` and `auth-oidc-*.jar` to the `classpath` enables the OIDC integration. And adding `global.genesis.auth.sso.endpoint` and `auth-sso-endpoint-*.jar` enables the required endpoints by the front-end
:::

You can see these additions in the example below:
```xml
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

If you require JWT validation you will need the following jars on the `classpath` as well - `jjwt-impl-*.jar,jjwt-jackson-*.jar`

Example having the required jars for JWT validation:
```xml
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

Additionally, you need a _application-name-_**oidc-config.kts** file. This file contains the GPAL configuration. Each OIDC configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| loginEndpoint | The URI to be re-directed after successful authentication | Yes | No default value | String |
| identityProvider | Configuration for each OIDC Provider. Can be repeated if multiple providers have to be configured | Yes | No default value | Object |

Each `identityProvider` configuration has the following properties:

| Property name | Description | Mandatory | Default value | Type |
| --- | ------ | --- | --- | --- |
| client | The client id and secret | Yes | No default value | Object |
| endpoints | Holds the token and authorization endpoints | Yes | No default value | Object |
| verification | Holds configuration for the public key of the JWT issuer | No | No JWT verification | Object |
| scopes | Requested scopes on authorization | No | `openid profile email` | Set |
| onNewUser | Predefined action when a new user logs in | No | `ALLOW_ACCESS` - add the user to the database  | Enum (ALLOW_ACCESS, DO_NOTHING) |
| usernameClaim | The claim to be used as username in the Genesis database. | No | `email`  | String |
| tokenLifeInSeconds | The life time of the issued SSO_TOKEN. | Yes | No default value | Int |
| redirectUri | The URI to handle the code authorization. | Yes | No default value | String |

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

:::note
If `verification` is defined either `publicKey` or `publicKeyUrl` must be defined.
:::

### Sample configurations

### Minimal configuration

```kotlin
oidc{
  loginEndpoint = "http://uat-host/login"
  identityProvider("uat-oidc"){
    client{
      id = "appplication-id"
      secret = "application-secret"
    }

    endpoints{
      token = "uat-oidc:1337/token"
      authorization = "uat-odic:1337/auth"
    }

    tokenLifeInSeconds = 5000

    redirectUri = "http://genesis-uat-host/gwf/logon"
}
```


### Full configuration

```kotlin
oidc{
  loginEndpoint = "http://uat-host/login"
  identityProvider("uat-oidc"){
    client{
      id = "appplication-id"
      secret = "application-secret"
    }

    endpoints{
      token = "uat-oidc:1337/token"
      authorization = "uat-odic:1337/auth"
    }
    
    verification {
      publicKeyUrl = "http://uat-oidc:1377/.well_known/certs.jwks"
    }
    
    scopes("openid", "profile")

    onNewUser = NewUserStrategy.ALWAYS_ALLOW

    usernameClaim = "name"

    tokenLifeInSeconds = 5000

    redirectUri = "http://genesis-uat-host/gwf/logon"
}
```