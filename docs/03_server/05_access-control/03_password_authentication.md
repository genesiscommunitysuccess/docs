---
title: 'Access control - username and password authentication'
sidebar_label: 'Username and password authentication'
id: password-authentication
keywords: [server, access control, password, authentication]
tags:
  - server
  - access control
  - password
  - authentication
---


This page describes the various configuration options available for authentication. These are located in your _application-name-_**auth-preferences.kts** file.

All these configuration settings are wrapped within the `security` function.

## The security function

The `security` function wraps all other variables and functions within the **auth-preferences.kts** file. From this top level, you can set the following variables:

* `sessionTimeoutMins` specifies a time out for the session. Sessions are timed out (logged out) after the value defined here. The front end of your application can monitor web movement, page changes, etc. and perform an [automatic refresh](../../../server/integration/rest-endpoints/advanced/#event_login_refresh) - in which case, the user is not aware of the logout and the start of the new session. Default: 30 minutes.
* `expiryCheckMins` specifies the time interval (in minutes) used to check for idle sessions in the system. Default: 5 minutes.
* `maxSimultaneousUserLogins` specifies the maximum number of concurrent active sessions a user can maintain. Once this limit has been reached, the user cannot activate additional sessions until one or more of the active sessions has been logged out. If the value zero is not defined, or is not a positive integer, then any number of sessions is permitted. Default: 0.

```kotlin
security {
  sessionTimeoutMins = 60 //60 minutes (not the default 30 minutes)
  expiryCheckMins = 10 //5 minutes (not the default 5 minutes)
  maxSimultaneousUserLogins = 5 //5 active sessions (not the default unlimited)
}
```

From within `security` there is a wide range of functions you can call in order to configure the username and password authentication. These are detailed below.

## authentication
The `authentication` function is used to define common features of all three types of authentication. Within it, many variables can be set, but their use depends on the value given to the `type` variable.

* `type` indicates which of the three types of username and password authentication are to be used. It accepts the values of: 
    - `AuthType.INTERNAL`
    - `AuthType.LDAP` 
    - `AuthType.HYBRID`

    The default is `AuthType.INTERNAL`.

For more information about each of these three authentication types, see the [authentication overview](../../../server/access-control/authentication-overview/#username-and-password-authentication).

### LDAP
Within the scope of the `authentication` function, you can insert an `ldap` block in order to define connections to one or more LDAP servers. 

- To define a connection to a single server, call the `connection` function and set the relevant details. 
- To define connections to more than one server, simply call the `connection` function multiple times.

When using multiple LDAP connections, the connections will be used in the order specified to authenticate a login request. Only one server need return a successful result for the login to be successful.

The following variables are used to configure an LDAP connection; these are only used when the `type` is either `AuthType.LDAP` or `AuthType.HYBRID`. 

* `url` specifies the LDAP server hostname. Default: `localhost`.
* `port` specifies the LDAP server port. Default: 389.
* `searchBases` defines the location(s) in the directory in which the LDAP search begins. Default: an organisational unit of `temp` with a domain component of `temp` (`ou=temp,dc=temp`).
  * This is set by first invoking the `searchBases` function, and repeatedly invoking `searchBase(location)` function(s) within it, where `location` is the exact name of the application on the LDAP server.
* `userGroups` defines the group(s) that the user needs to belong with the LDAP server in order to log in. Default: no groups.
  * This is set by first invoking the `userGroups` function, and repeatedly invoking `userGroup(group)` function(s) within it, where `group` is the specific name of a group.
* `userPrefix` specifies a prefix added to every username when communicating with the LDAP server. Default: an empty string.
* `bindDn` specifies the exact name of the application within the LDAP server. Normally, LDAP servers do not allow anonymous searches, so this name is essential. If `bindDn` is not specified, no bindings will be used. Default: null
* `bindPassword` specifies the password for the `bindDn`account. If `bindDn` is not specified, this value is not used. Default: null.
* `userIdType` defines the attribute to match in the directory search against the provided username. Default: `cn`. 
  * Amongst the most common LDAP implementations, you can find three main ways of configuring usernames:
    * using the `uid` attribute (Userid)
    * using the `cn` attribute (Common Name)
    * using the `sAMAccountName` in Windows
* `bypassLoginInternalAuth` this is a boolean flag that prevents internal authorisation checks on login
* `onFirstLogin` is a function that is called the first time a user has been authenticated who doesn't already exist in the database. Here you can define two things:
  * how the `User` and its `UserAttributes` will be created from the token after the user has been authenticated using the `createUser` function
  * which user permissions are allocated using `createUserPermissions`
* `onLoginSuccess` this is a function which is invoked on a successful LDAP login: for example, it allows you to insert a user into the db when it exists in LDAP but not the database.
* `useTLS` this is a boolean value indicating whether or not to use TLS encryption on the connection to the remote LDAP server.

For more information about the various authentication types, see the [Authentication overview](../../../server/access-control/authentication-overview/).

## genesisPassword
The `genesisPassword` groups all configuration options when you are using `type = AuthType.INTERNAL`. 

### passwordRetry
The `passwordRetry` function has been deprecated in favour of the `retry` function within the `genesisPassword` configuration.

### validation
The `validation` function enables password validation, and is used to set the variables relating to this validation. 

The following variables can be used to configure the application's password validation; these can only used when `type` is either `AuthType.INTERNAL` or `AuthType.HYBRID`.

* `passwordSalt` defines a system-specific salt to be added to your password hashes. This is a security measure that ensures that the same combination of username and password on different applications built on the Genesis low-code platform are stored as different hashes. Default: empty string indicating no additional salting.

* `passwordStrength` can be called to set a range of configuration variables. These enable you to specify in detail the mandatory characteristics for the password. 

    * `minimumLength` specifies the minimum length of password. If null or undefined this assumes there is no minimum limit. Default: null.
    * `maximumLength` specifies the maximum length of password. If null or undefined this assumes there is no maximum limit. Default: null.
    * `minDigits` specifies the minimum number of numerical digits required in a password. If null or undefined, this assumes there is no minimum limit. Default: null.
    * `maxRepeatCharacters` specifies the maximum number of the same characters across an entire password. This does not just include consecutive repeat characters, which is controlled by the `repeatCharacterRestrictSize` variable below. If null or undefined, this assumes there is no maximum limit. Default: null.
    * `minUppercaseCharacters` specifies the minimum number of upper-case characters in a password. If null or undefined this assumes there is no minimum limit. Default: null.
    * `minLowercaseCharacters` specifies the minimum number of lower-case characters in a password. If null or undefined this assumes there is no minimum limit. Default: null.
    * `minNonAlphaNumericCharacters` specifies the minimum number of non-alphanumeric characters, such as punctuation and other special characters. If null or undefined, this assumes there is no minimum limit. Default: null.
    * `restrictWhitespace` specifies if whitespace characters are prevented from being used in passwords. Default: true.
    * `restrictAlphaSequences` specifies if alphabetical sequences in passwords (e.g. abcdefg) are restricted. Sequences greater than or equal to five characters won't be permitted if this is true. Default: false.
    * `restrictQWERTY` specifies if QWERTY sequences in passwords (e.g. qwertyuiop) are restricted. Sequences greater or equal to five characters won't be permitted if this is true. Default: true.
    * `restrictNumericalSequences` specifies if numerical sequences in passwords (e.g. 123456) are restricted. Sequences greater or equal to five numbers won't be allowed if active. Default: true.
    * `illegalCharacters` specifies which characters are not permitted in user passwords. Default: empty.
    * `historicalCheck` specifies how many previous passwords to check against, in order to prevent password re-use. If null or undefined no historical check is performed. Default: null.
    * `restrictPassword` specifies if the password should differ from a list of the worst passwords stored within the application. Default: false.
    * `restrictDictionarySubstring` specifies if any dictionary word of four or more characters can be included in a password (either forwards or backwards). Default: false.
    * `restrictUserName` specifies if the user's username is restricted as part of their password. Default: false.
    * `repeatCharacterRestrictSize` specifies the number of consecutive repeated characters that make a password restricted. If null or undefined this assumes there is no limit. Default: null.
    * `passwordExpiryDays` specifies how many days before a password expires. If null or undefined this assumes there is no limit. Default: null.
    * `passwordExpiryNotificationDays` specifies how many days before their password expiry, a user is notified. If null or undefined, a user is not notified in advance of their password expiry. Default: null.

### retry
The `retry` function enables you to configure settings for limiting the rate at which a user can retry passwords. You can set the following variables:

* `maxAttempts` specifies the maximum number of attempts allowed if a user enters a wrong password. Default: 3 attempts.
* `waitTimeMins` specifies the time to wait in minutes when the maximum number of incorrect attempts is reached before allowing a user to try again. Default: 5 minutes.

### selfServiceReset 

The `selfServiceReset` function enables the self-service reset workflow. In this, users authenticated with the internal auth type can request an email to reset their password. For this workflow, you must have Genesis Notify configured with a working email gateway. When a user requests a reset, an email is sent to their configured 
email address, with a link to a password reset page. This link is valid for a preconfigured timeout.

:::note

In the interest of security, this response will always receive an ACK, even if there is a problem in identifying the user or email address. In the case of a problem with the request, details will be provided in the auth manager log file.

:::

The `selfServiceReset` function  has the following options: 

* `timeoutInMinutes` - the time in minutes that a reset link remains valid 
* `coolDownInMinutes` - the time in minutes between before the next password reset can be made 
* `notifyTopic` - the email topic in Genesis Notify to be used 
* `redirectUrl` - the url to use for the redirect
* `acceptClientUrl` - boolean flag; if true, the reset will use the client provided reset url

:::warning

You can set `acceptClientUrl` to `true` in a development environment. For security, always set it to `false` in all other environments. Always. 

:::

### resetMessage

The `resetMessage` function enables users to configure the email sent when a reset is requested. It has the following options: 

* `subject` the subject line of the email
* `body` the body of the email

Both the subject and the body support templating. Values surrounded by double curly braces `{{ }}` will be replaced when the email is sent. The following values are available: 

* `RESET_URL` the reset url
* `TIMEOUT` the time the url is valid for
* `USER` the user record, properties on this record should be access using lowerCamelCase, e.g. `{{ USER.firstName }}`
* any system definition or environment variable available

### mfa
The `mfa` function enables you to configure Multi-factor Authentication (MFA). There is more information on MFA on [Wikipedia](https://en.wikipedia.org/wiki/Multi-factor_authentication). From within the `mfa` function, you can set the following variables:

* `codePeriodSeconds` specifies how many seconds a Time-based One-time Password (TOTP) remains valid. Default: 30 seconds.
* `codePeriodDiscrepancy` specifies the allowed discrepancy to the TOTP. 1 would mean a single block of each `codePeriodSeconds` either side of the time window. Default: 1.
* `codeDigits` specifies the number of digits used in the TOTP. Default: 6 digits.
* `hashingAlgorithm` specifies which choice of Hashing Algorithm to use. Available choices are: `HashingFunction.SHA1`, `HashingFunction.SHA256` or `HashingFunction.SHA512`. Default: `HashingFunction.SHA1`.
* `issuer` specifies a reference to the Organisation or Entity issuing the MFA. Default: Genesis.
* `label` specifies a label for the MFA. This is typically an email address of the issuing Entity or Organisation. Default: genesis.global.
* `confirmWaitPeriodSecs` specifies the period of time in seconds before a secret has to be confirmed. Default: 300 seconds.
* `secretEncryptKey` specifies the key that is used to encrypt Secrets in the database. If this is null or undefined, Secrets will not be encrypted in the database. Default: null.
* `usernameTableLookUpSalt` specifies the salt with which a username is hashed when stored in the database with the above Secret. If this is null or undefined, the username will not be hashed in the database. Default: null.

### loginAck
The `loginAck` function enables you to define additional values to be sent back to the client as part of the `LOGIN_ACK` message. When you call the `loginAck` function, you have to supply a table or view as a parameter. The following functions will be invoked on this table or view:

#### loadRecord
The `loadRecord` function can be invoked within the `loginAck` function to load a single record from the previously supplied table or view.

#### fields
The `fields` function can be invoked within the `loginAck` function to specify which additional fields should be sent back to the client as part of the LOGIN_ACK message.

#### customLoginAck

The `customLoginAck` function enables you to modify the list of permissions, profiles and user preferences returned to the client as part of the `LOGIN_ACK` message. For this purpose, the `User` entity is provided as a parameter, as well as three properties:

* permissions - a mutable list containing all the right codes associated to the user. Given its mutability, codes can be added or removed.
* profiles - a mutable list containing all the profiles associated with the user.  Given its mutability, profiles can be added or removed.
* userPreferences - a [GenesisSet](../../../server/inter-process-messages/genesisset/) object containing additional fields provided as part of the [loginAck](#loginack) function. This `GenesisSet` can be modified to provide additional fields or remove existing ones.

### Example
Here is an example configuration:

```kotlin
import global.genesis.auth.manager.AuthType
import global.genesis.auth.manager.data.HashingFunction
import global.genesis.auth.manager.security.sso.jwt.NewUserMode
import global.genesis.db.entity.DbEntity
import global.genesis.dictionary.pal.view.IndexedDataStructure
import global.genesis.gen.config.tables.USER_ATTRIBUTES.ACCESS_TYPE
import global.genesis.gen.config.tables.USER_ATTRIBUTES.ADDRESS_LINE1
import global.genesis.gen.config.tables.USER_ATTRIBUTES.USER_TYPE

security {
    sessionTimeoutMins = 30
    expiryCheckMins = 5
    maxSimultaneousUserLogins = 0

    authentication {
        type = AuthType.LDAP
		ldap {
			connection {
				url = "localhost"
                port = 389
                searchBase {
                    searchBase("ou=temp,dc=temp")
                }
                userGroups {
                }
                userPrefix = ""
                bindDn = null
                bindPassword = null
                userIdType = "cn"
			}
		}

        genesisPassword {
            validation {
                passwordSalt = ""
                passwordStrength {
                    minimumLength = null
                    maximumLength = null
                    minDigits = null
                    maxRepeatCharacters = null
                    minUppercaseCharacters = null
                    minLowercaseCharacters = null
                    minNonAlphaNumericCharacters = null
                    restrictWhiteSpace = true
                    restrictAlphaSequences = false
                    restrictQWERTY = true
                    restrictNumericalSequences = true
                    illegalCharacters = "\$£^"
                    historicalCheck = 0
                    restrictDictionarySubstring = false
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

    sso {
        enabled = false
    }

    mfa {
        codePeriodSeconds = 30
        codePeriodDiscrepency = 1
        codeDigits = 6
        usernameTableLookUpSalt = null
        secretEncryptKey = null
        hashingAlgorithm = HashingFunction.SHA1
        issuer = "Genesis"
        label = "genesis.global"
        confirmWaitPeriodSecs = 300
    }

    loginAck(USER_ATTRIBUTES) {
        loadRecord { UserAttributes.byUserName(userName) }
        fields {
            USER_TYPE
            ACCESS_TYPE withPrefix "USER"
            ADDRESS_LINE1
        }
    }

    customLoginAck { user ->
      if(user.userName == "TestUser"){
        permissions += listOf("TEST_USER_INSERT", "TEST_USER_AMEND", "TEST_USER_DELETE")
        profiles += listOf("TEST_ADMIN")
        userPreferences = userPreferences.apply {
          setString("TEST_VALUE", "TEST")
        }
      }
    }
}
```

## Message flows

Security messages can be split into three categories.
- Pre-authentication
- Authentication
- Post-authentication

All requests below are capable of returning an error with a code of INTERNAL_ERROR, which will be used as a last resort.

---

## Pre-authentication
Pre-authentication messages can be sent by a client without the user being logged in.

### Login preferences
You must make sure that any connecting client knows the types of functionality that you have configured on the security module. For example, you could offer the client two ways of resetting user passwords: either via an administrator or by sending an email.  This choice can affect how the login dialog is displayed, so it is vital that the connecting client knows this before any user logs in.
Currently, this is the only preference published.
#### Request
    MESSAGE_TYPE = EVENT_LOGIN_PREFS
#### Response
    MESSAGE_TYPE = EVENT_LOGIN_PREFS_ACK
        DETAILS.PASSWORD_RESET_TYPE = ADMIN/EMAIL

---

## Authentication
Once you have a list of preferences, you can show the correct login dialog and let the user make a login attempt.  The password is provided in plain text, as it is expected that you will secure the connection using TLS.
### Login request

    MESSAGE_TYPE = EVENT_LOGIN_AUTH
    DETAILS.USER_NAME = JohnWolf
    DETAILS.PASSWORD = FullMoon1

### Login response
If successful:

    MESSAGE_TYPE = EVENT_LOGIN_AUTH_ACK
    DETAILS.SYSTEM.DATE = 2014-06-18 12:27:01
    DETAILS.HEARTBEAT_INTERVAL_SECS = 30
    DETAILS.SYSTEM.PRODUCT[0].NAME = SBL
    DETAILS.SYSTEM.PRODUCT[0].VERSION = 1.0.0-RELEASE
    DETAILS.SYSTEM.PRODUCT[1].NAME = AUTH
    DETAILS.SYSTEM.PRODUCT[1].VERSION = 1.0.1.RELEASE

If there is a problem, the server will return the standard error set with CODE/TEXT details and the error code `LOGIN_AUTH_NACK`.  The following error codes can be provided:

- `UNKNOWN_ACCOUNT` - User is unknown
- `INCORRECT_CREDENTIALS` - User/password combination is invalid
- `LOCKED_ACCOUNT` - Account is locked and needs to be re-activated by administrator
- `PASSWORD_EXPIRED` - Password must be changed
- `LOGIN_FAIL` - Generic error code

### Password change
If the response is `PASSWORD_EXPIRED`, then the GUI can allow the user to change the password, provided they know their existing password.

#### Change request
    MESSAGE_TYPE = EVENT_CHANGE_USER_PASSWORD
    DETAILS.USER_NAME = JohnWolf
    DETAILS.OLD_PASSWORD = Password123
    DETAILS.NEW_PASSWORD = Password456

#### Change response
If successful:

    MESSAGE_TYPE = EVENT_CHANGE_USER_PASSWORD_ACK

If there's a problem, you will receive a standard error set with type `CHANGE_USER_PASSWORD_NACK`.  

The error codes that can be returned are currently:
- `TOO_SHORT` - Password length too short.
- `TOO_LONG` - Password length too long.
- `INSUFFICIENT_CHARACTERS` - Covers a few cases so text field may be required, used for things like no digits provided when 1 digit is required.
- `ILLEGAL_MATCH` - Covers a few cases so text field may be required, used for things like repeating characters in password.
- `ILLEGAL_WHITESPACE` - If password contains white space.
- `INSUFFICIENT_CHARACTERISTICS` - May be provided if you have configured passwords to be successful if only 2 of 5.strength checks pass.  Should be provided alongside "real" error codes.
- `ILLEGAL_SEQUENCE` - Numerical/alphabetical sequence detected.

### Reset password
This can only be called by an administrator; it simply specifies a user name and sets the password to blank.

#### Reset request
    MESSAGE_TYPE = EVENT_RESET_USER_PASSWORD
    DETAILS.USER_NAME = JohnWolf

#### Reset response
    MESSAGE_TYPE = EVENT_RESET_USER_PASSWORD_ACK

## Post-authentication
Once the user has been authenticated, the server expects heartbeat messages, as defined in the interval setting on the ACK message.  If the GUI misses a configurable number of heartbeats, the session will automatically expire. In response to a heartbeat, the GUI will receive a list of available services and their details.

These services should be contacted on the hosts in the order they are defined in the list. The ordering may change if the server implements a load-balancing strategy. Existing connections can simply ignore the ordering changes, but in the event of failover or reconnection, the ordering should be adhered to.

### Heartbeat

#### Heartbeat request

    MESSAGE_TYPE = EVENT_HEARTBEAT
    USER_NAME = JohnWolf

#### Heartbeat response
    MESSAGE_TYPE = EVENT_HEARTBEAT_ACK
    DETAILS.SERVICE[0].NAME = SBL_EVENT_HANDLER
    DETAILS.SERVICE[0].ENCRYPTED = false
    DETAILS.SERVICE[0].HOST[0].NAME = genesisserv1
    DETAILS.SERVICE[0].HOST[0].PORT = 9001
    DETAILS.SERVICE[0].HOST[1].NAME = genesisserv2
    DETAILS.SERVICE[0].HOST[1].PORT = 9001
    DETAILS.SERVICE[1].NAME = SBL_DATA_SERVER
    DETAILS.SERVICE[1].ENCRYPTED = false
    DETAILS.SERVICE[1].HOST[0].NAME = genesisserv1
    DETAILS.SERVICE[1].HOST[0].PORT = 9002
    DETAILS.SERVICE[1].HOST[1].NAME = genesisserv2
    DETAILS.SERVICE[1].HOST[1].PORT = 9002


### Rights polling
The GUI can receive rights from a process called `AUTH_DATASERVER`. The view `USER_RIGHTS` displays all users and codes. A logged-in user should automatically set the Filter expression to be `USER_NAME`=='xxx' to receive push updates to user privileges.

## Entity management
In the Genesis low-code platform, there are profiles, users and rights.  A profile is a group of users, which can be permissioned.  For example, you could have a SALES_TRADER group in which all users must have the same permissions.  In all cases where you specify either a right for a user/profile, or a user in a profile, the event represents what you want the entity to look like; i.e. if you amend a profile and don't supply a user that previously was part of that profile, then that user will be removed from that profile on the server.

Note the following:

* 2-phase validation is not currently supported
* metadata is not supported on the following transactions.
  User/profile `STATUS` field can be set to `ENABLED`, `DISABLED`, `PASSWORD_EXPIRED` and `PASSWORD_RESET`.
  `PASSWORD_EXPIRED` should prompt the user to enter a new password.
  `PASSWORD_RESET` should do the same but the server expects a blank "current password" field.

### Insert profile

#### Insert request

    MESSAGE_TYPE = EVENT_INSERT_PROFILE
    USER_NAME = JohnWolf
    DETAILS.NAME = SALES_TRADERS
    DETAILS.DESCRIPTION = Sales Traders
    DETAILS.STATUS = ENABLED
    DETAILS.RIGHT[0].ID = 00000000000001RISP0
    DETAILS.RIGHT[0].CODE = ORDEN
    DETAILS.RIGHT[1].ID = 00000000000002RISP0
    DETAILS.RIGHT[1].CODE = ORDAM
    DETAILS.USER[0].ID = 00000000000001USSP0
    DETAILS.USER[0].USER_NAME = JohnWolf
    DETAILS.USER[1].ID = 00000000000002USSP0
    DETAILS.USER[1].USER_NAME = james

#### Insert response
    MESSAGE_TYPE = EVENT_INSERT_PROFILE_ACK

### Amend profile

#### Amend request
  In the example below, the logged-in user (in the second line) is JohnWolf, who is modifying the profile of JaneDoe to give her the profile name JANE SMITH. 

```
    {
  "SOURCE_REF": "1786d2ca-23fd-40c8-a52b-fe002a0fa1f6",
  "USER_NAME": "JohnWolf",
  "SESSION_AUTH_TOKEN": "sIsXX3IBqyIESUD38AgA71ycR8W7KVzg",
  "MESSAGE_TYPE": "EVENT_AMEND_USER",
  "DETAILS": {
    "USER_NAME": "JaneDoe",
    "LAST_LOGIN": 1670236873948,
    "LAST_NAME": "Smith",
    "FIRST_NAME": "Jane",
    "ONLINE": true,
    "COMPANY_NAME": null,
    "STATUS": "ENABLED",
    "EMAIL_ADDRESS": "jane.doe@genesis.global",
    "COMPANY_ID": null,
    "USER_TYPE": "USER",
    "ACCESS_TYPE": "ENTITY",
    "ADDRESS_LINE1": null,
    "ADDRESS_LINE2": null,
    "ADDRESS_LINE3": null,
    "ADDRESS_LINE4": null,
    "CITY": null,
    "REGION": null,
    "POSTAL_CODE": null,
    "COUNTRY": null,
    "TITLE": null,
    "WEBSITE": null,
    "MOBILE_NUMBER": null,
    "TELEPHONE_NUMBER_DIRECT": null,
    "TELEPHONE_NUMBER_OFFICE": null,
    "COUNTERPARTY_ID": null,
    "ROW_REF": "6889579003422704324",
    "USER_PROFILES": [
      "SUPPORT",
      "TRADER",
      "USER_ADMIN"
    ]
  },
  "IGNORE_WARNINGS": true,
  "VALIDATE": false
}
```

#### Amend response

```
{
  "GENERATED": [],
  "MESSAGE_TYPE": "EVENT_ACK",
  "SOURCE_REF": "1786d2ca-23fd-40c8-a52b-fe002a0fa1f6"
}
```

### Delete profile

#### Delete request
    MESSAGE_TYPE = EVENT_DELETE_PROFILE
    USER_NAME = JohnWolf
    DETAILS.NAME = SALES_TRADERS

#### Delete response
    MESSAGE_TYPE = EVENT_DELETE_PROFILE_ACK

### Insert User

#### Insert request
    MESSAGE_TYPE = EVENT_INSERT_USER
    USER_NAME = mthompson
    DETAILS.USER_NAME = JohnWolf
    DETAILS.FIRST_NAME = John
    DETAILS.LAST_NAME = Wolf
    DETAILS.EMAIL_ADDRESS = john.doe@genesis.global
    DETAILS.STATUS = ENABLED
    DETAILS.RIGHT[0].ID = 00000000000001RISP0
    DETAILS.RIGHT[0].CODE = ORDEN
    DETAILS.RIGHT[1].ID = 00000000000002RISP0
    DETAILS.RIGHT[1].CODE = ORDAM

#### Insert response
    MESSAGE_TYPE = EVENT_INSERT_USER_ACK

### Amend user

#### Amend request
    MESSAGE_TYPE = EVENT_AMEND_USER
    USER_NAME = mthompson
    DETAILS.ID = 00000000000001USSP0
    DETAILS.USER_NAME = JohnWolf
    DETAILS.FIRST_NAME = John
    DETAILS.LAST_NAME = Doe
    DETAILS.EMAIL_ADDRESS = john.doe@genesis.global
    DETAILS.STATUS = ENABLED
    DETAILS.RIGHT[0].ID = 00000000000001RISP0
    DETAILS.RIGHT[0].CODE = ORDEN
    DETAILS.RIGHT[1].ID = 00000000000002RISP0
    DETAILS.RIGHT[1].CODE = ORDAM

#### Amend response
    MESSAGE_TYPE = EVENT_AMEND_USER_ACK

### Delete user

#### Delete request
    MESSAGE_TYPE = EVENT_DELETE_USER
    USER_NAME = JohnDoe
    DETAILS.USER_NAME = james

### Delete response
    MESSAGE_TYPE = EVENT_DELETE_USER_ACK
