---
id: sso
title: Single Sign-on
sidebar_label: Single Sign-on
sidebar_position: 2

---

## Introduction

Single sign-on is a mechanism that enables you to authenticate users in your systems, and subsequently tell a genesis global solution that the user has been authenticated. If you use single sign-on with JWT (JSON Web Token) a user is automatically verified with the identity provider when they sign in. The user is then allowed to access a genesis global solution without being prompted to enter separate sign-in credentials.

At the core of single sign-on is a security mechanism that allows the genesis global solution to trust the sign-in requests it gets from your systems. The genesis global solution only grants access to users who have been authenticated by your internal AD component.

## JWT SSO

In its simplest form, Genesis SSO relies on a technology called JSON Web Token (JWT) for securing the exchange of user authentication data.

### Internal JWT authentication service

The IT infrastructure/security team at an organisation is usually responsible for setting up and managing the company's JWT authentication service. If a solution isn’t in place, genesis global will provide a detailed instruction and assistance on how this is set up.

### Configuration details

The following data points need to be shared with genesis global to complete the solution. These data points are stored in the database of the specific genesis solution.

The public key of the JWT RSA key pair, (the private key is used to sign the JWT at the internal authentication service).

The URL to the internal JWT authentication service.

### How Genesis JWT SSO works

The  SSO workflow depends on whether CORS is configured on the internal authentication service to allow the genesis web platform to make direct authentication requests, or not.

#### CORS enabled

If CORS is enabled, the SSO workflow is:

1. An unauthenticated user navigates to the genesis application.  
   Example: [https://your-subdomain.genesisapplication.com/](https://your-subdomain.genesisapplication.com/ "https://your-subdomain.genesisapplication.com/")
2. The genesis web platform recognises that SSO is enabled from the subdomain and that the user is not authenticated.
3. A request is made to the genesis back-end framework to request the URL for the specific authentication service.
4. The genesis web platform makes an http request to your organisation's authentication service, which will include the end user’s internal authentication parameters.
5. The authentication service authenticates and builds a JWT with relevant user data, signs the JWT and sends it back to the genesis web platform.
6. With the signed JWT the genesis web platform makes an SSO authentication request for the specific organisation. If this is successful, an active Session token is returned.

#### CORS not configured

This setup uses the browser’s redirect functionality, so the user experience might not be  as seamless.

This is the SSO workflow if CORS is enabled, the SSO workflow is:

1. An unauthenticated user navigates to the genesis application.Example: [https://your-subdomain.genesisapplication.com/](https://your-subdomain.genesisapplication.com/ "https://your-subdomain.genesisapplication.com/")
2. The genesis web platform recognises that SSO is enabled from the subdomain and that the user is not authenticated.
3. A request is made to the genesis back-end framework to request the URL for the specific authentication service.
4. A redirect is triggered for the browser to the internal authentication service which will include the end user’s internal authentication parameters. A return parameter to [https://your-subdomain.genesisapplication.com/](https://your-subdomain.genesisapplication.com/ "https://your-subdomain.genesisapplication.com/") is also part of the request.
5. The authentication service authenticates and builds a JWT with relevant user data, signs the JWT and sends a redirect trigger to the browser for [https://your-subdomain.genesisapplication.com/](https://your-subdomain.genesisapplication.com/ "https://your-subdomain.genesisapplication.com/") which includes the JWT as a request parameter.
6. The genesis platform is reloaded, recognises SSO is enabled but now with the JWT as a parameter. The platform  sends an SSO authentication request with the JWT for the specific organisation. If this is successful, an active Session token is returned.

## SAML SSO

SAML is an SSO protocol that can be used to authenticate users within a genesis system. It works by connecting a Service Provider (SP) - the genesis application in this case - and an Identity Provider (IDP), which would be an external party.

The workflow is:

1. The SP and the IDP communicate using the user's web browser, and do not need to be accessible to each other.
2. Once SAML is enabled, a user can click on an SSO button in the GUI. This starts the SAML authentication flow.
3. The user is directed to a genesis end point that generates the authentication (authn) request
4. The user is redirected to the IDP, with the authn request as a query parameter
5. The user identifies him or herself to the IDP.
6. The user is redirected back to the genesis SAML end point, with a response as a query parameter.
7. The response is validated, and the user is redirected back to the genesis logon end point with a token.
8. The front end starts the login process into genesis using this token.

For more information, see wikipedia

### Definitions

| Term | Meaning | Example |
| --- | --- | --- |
| IDP | Identity Provider | The authentication source, for example the client  |
| SP | Service Provider | The service for which the user needs to be authenticated, for example a genesis application |
| MetaData | For an IDP and SP to work  together, certain parts of the configuration needs to be shared; this is the meta data. An SP would need to know the IDP meta data, and the IDP might need to know the SP meta data | see below  |

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

### Requirements

Before starting:

1\.	Ensure you have access to the IDP meta data (this is generated by the idp)

2\.	Enable SAML support in the router.

3\.	Configure SAML.

### How to enable SAML

SAML has to be enabled on the GENESIS_ROUTER service. Do this by changing the router **processes.xml** config for the module.

```xml
    <process name="GENESIS_ROUTER">
        <start>true</start>
        <groupId>GENESIS</groupId>
        <options>-Xmx512m -DXSD_VALIDATE=false</options>
        <module>router</module>
        <package>global.genesis.router#global.genesis.console#global.genesis.auth.saml</package>
        <config>genesis-router.xml</config>
        <classpath>genesis-console-5.1.*.jar,auth-saml-*.jar</classpath>
        <description>Socket, Websocket and HTTP proxy which routes incoming messages to GENESIS microservices</description>
    </process>
```

Specifically `global.genesis.auth.saml` needs to be added to the `<package …/>` tag and `auth-saml-*.jar` needs to be added to the `<classpath …/>` tag.

Additionally, you will need a `{product}-saml-config.kts` file, as below:

```
    saml {
        strictMode = false
        debugMode = true
        // this should be the extrenally facing genesis url:
        loginEndpoint = "https://octosso.genesislab.global" 
        tokenLifeInSeconds = 3000
    
        serviceProvider {
            // this should be the url for accessing the router
            entityId = "https://octosso.genesislab.global/gwf" 
        }
    
        // for every identity provider we support we need one of these
        identityProvider("citi") {
            // we need the idp meta data, either a file:
            metadataUrl = "citimetadata.xml" 
            // or a url (idp should be accessible from genesis box):
            metadataUrl = "http://localhost:8080/simplesaml/saml2/idp/metadata.php?output=xml" // idp meta data endpoint
    
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

Further, advanced configuration is available in the file onelogin.saml.properties. You will need to use this in case you need to configure a key for signing the authn request.

Once this is configured, a service provider meta data endpoint will be available on: `https://{url}/gwf/saml/metadata?idp={idp name}`.

### Enabling users for SAML

To enable users to be signed in using SAML, you must add the users to the USER, USER_ATTRIBUTES and SSO_USER tables.

In the SSO_USER table:

* SSO_METHOD must be set to SAML
* SSO_SOURCE must be set to the identity provider name defined in the **saml-config.kts** file.

The genesis user name should be the user’s email address.

### Testing SAML

In order to test the SAML flow, you can use a docker image found here. To run the image locally, run the following docker command:

```bash
docker run -p 8080:8080 -p 8443:8443 -e SIMPLESAMLPHP_SP_ENTITY_ID=https://10.40.4.92/gwf/saml/metadata?idp=test -e SIMPLESAMLPHP_SP_ASSERTION_CONSUMER_SERVICE=https://10.40.4.92/gwf/saml/logon?idp=test -e SIMPLESAMLPHP_SP_SINGLE_LOGOUT_SERVICE=https://10.40.4.92/gwf/saml/logout?idp=test -d kristophjunge/test-saml-idp
```

You will need to replace the IP with the address/IP of your genesis instance, and replace test with the name of the identify provider.

### OpenID Connect & OAuth 2.0

Support for OpenID Connect & OAuth 2.0 is part of the genesis 2022 H1 technical roadmap.