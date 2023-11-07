---
title: 'Access control - authentication overview'
sidebar_label: 'Authentication overview'
id: authentication-overview
keywords: [server, access control, authentication, overview]
tags:
  - server
  - access control
  - authentication
  - overview
---


There are many different ways for your application to perform authentication. Each method requires the implementation of an 'Authenticator'. The authenticators offered by the Genesis low-code platform are:

* INTERNAL
* LDAP
* [JWT (JSON Web Token)](https://jwt.io/introduction) SSO
* SSO Token

SSO Token authentication covers both [SAML](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language) and [OIDC](https://openid.net/connect/)

Some of these techniques support [Multi-factor Authentication (MFA)](https://en.wikipedia.org/wiki/Multi-factor_authentication) to bring additional security.

Each of these requires its own configuration settings in the application's _application-name-_**auth-preferences.kts** file.

## Username and password authentication

Username and password authentication allow users to log in directly to your application. You must choose one of the  solutions provided in order control this process.

To specify which one to use, just edit the application's **auth-preferences.kts** file and call any of the functions exposed inside the 'authentication' block to register an authenticator instance.

The differences between the solutions associated with each value are detailed below.

### Genesis Password

Genesis Password authentication uses internally stored hashed credentials to authenticate users. It checks user credentials against an internal table. This provides the following features:

- User accounts can be locked.
- Passwords can be set to expire.
- Passwords can be required to conform to a configurable standard.
- Users can reset or change their password (assuming they can log in first).

```kotlin
    authentication {
        genesisPassword {
            validation {
                passwordSalt = ""
                passwordStrength {
                    minimumLength = null
                    maximumLength = 256
                    minDigits = null
                    maxRepeatCharacters = null
                    minUppercaseCharacters = null
                    minLowercaseCharacters = null
                    minNonAlphaNumericCharacters = null
                    restrictWhiteSpace = true
                    restrictAlphaSequences = false
                    restrictQWERTY = true
                    restrictNumericalSequences = true
                    illegalCharacters = ""
                    historicalCheck = null
                    dictionaryWordSize = null
                    restrictDictionarySubstring = false
                    restrictPassword = false
                    restrictUserName = false
                    repeatCharacterRestrictSize = null
                    passwordExpiryDays = null
                    passwordExpiryNotificationDays = null
                }
            }

            retry {
                maxAttempts = 3
                waitTimeMins = 5
            }
        }
	}
```

### LDAP

LDAP authentication uses its namesake protocol to authenticate users. 

LDAP authentication relies on an external party that cannot be operated from your application. So, by setting LDAP, you lose control of the internal authentication functionality. As a direct consequence, requests to change or reset passwords won't be accepted.

For LDAP authentication, a username must exist inside the internal records of the application. To do this, create a user entry inside the USER table for every LDAP user of the application. There is no password checking between this login and the application's internal records; authentication will rely solely on LDAP.

To set up LDAP authentication, a connection to an LDAP server must be configured in the **auth-preferences.kts** file.

For more information on configuring LDAP authentication, see [Username and password authentication](../../../server/access-control/password-authentication/#authentication).

The example below shows LDAP authentication specified, with `userIdType` set to `cn` for the search for the username.

```kotlin
    authentication {
		ldap {
		    connection {
		        url = "localhost"
                port = 389
                searchBases {
				    searchBase {
                        entry("ou=People,dc=example,dc=com")
			        }
                }
                bindDn = "CN=DTADevBindUser,ou=People,dc=example,dc=com"
                bindPassword = "password123"
                userIdType = "cn"	
			}
		}
    }
```

## SSO authentication

SSO authentication enables users to use a single set of credentials to access a range of applications, including those built on the Genesis low-code platform. For more information on SSO technology, see the [Single-sign on Wikipedia page](https://en.wikipedia.org/wiki/Single_sign-on).

SSO authentication is a more involved process to enable; it requires additional file changes, which are detailed in the following pages:

- [SSO - JWT](../../../server/access-control/SSO-jwt/)
- [SSO - SAML](../../../server/access-control/SSO-saml/)
- [SSO - OIDC](../../../server/access-control/SSO-oidc/)

## Using more than one authentication type
Your application can use two or more authentication types concurrently; the use of one does not mandate or prevent the use of the other. Each configured authenticator will be tried in turn to see if a logon message can be successfully authenticated.
