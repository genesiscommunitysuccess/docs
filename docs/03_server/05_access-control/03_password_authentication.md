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


We will now go through the various configuration options available for authentication. These are located in your _application-name-_**auth-preferences.kts** file.

All of these configuration settings are wrapped within the `security` function.

## security 

The `security` function wraps all other variable and functions within the **auth-preferences.kts** file. From this top level the following variables can be set:

* `sessionTimeoutMins` specifies a time out for the session. Sessions are timed out (logged out) after the value defined here. The front end of your application can monitor web movement, page changes, etc. and perform an [automatic refresh](/server/integration/rest-endpoints/advanced/#event_login_refresh) - in which case, the user is not aware of the logout and the start of the new session. Default: 30 minutes.
* `expiryCheckMins` specifies the time interval (in minutes) used to check for idle sessions in the system. Default: 5 minutes.
* `maxSimultaneousUserLogins` specifies the maximum number of concurrent active sessions a user can maintain. Once this limit has been reached the user cannot activate additional sessions until one or more of the active sessions has been logged out. If the value zero is not defined, or is not a positive integer, then any number of sessions is permitted. Default: 0.

```kotlin
security {
  sessionTimeoutMins = 60 //60 minutes (not the default 30 minutes)
  expiryCheckMins = 10 //5 minutes (not the default 5 minutes)
  maxSimultaneousUserLogins = 5 //5 active sessions (not the default unlimited)
}
```

From within `security` we can also invoke the further functions in order to configure our username and password authentication. These are detailed below.

### authentication
The `authentication` function is used to define common features of all three types of authentication. Within it, many variables can be set, but their use depends on the value given to the `type` variable.

* `type` indicates which of the three types of username and password authentication are to be used. It accepts the values of: `AuthType.INTERNAL`, `AuthType.LDAP` or `AuthType.HYBRID`. Default: `AuthType.INTERNAL`.

For more information about each of these three authentication types please see the [authentication overview](/server/access-control/authentication-overview/#username-and-password-authentication).

The following variables are used to configure an LDAP connection; these are only used when the `type` is either `AuthType.LDAP` or `AuthType.HYBRID`.

* `url` specifies the LDAP server hostname. Default: `localhost`.
* `port` specifies the LDAP server port. Default: 389.
* `searchBases` defines the location(s) in the directory in which the LDAP search begins. Default: an organisational unit of `temp` with a domain component of `temp` (`ou=temp,dc=temp`).
  * This is set by first invoking the `searchBases` function, and repeatedly invoking `searchBase(location)` function(s) within it, where `location` is given as a distinguished name.
* `userGroups` defines the group(s) that the user needs to belong with the LDAP server in order to log in. Default: no groups.
  * This is set by first invoking the `userGroups` function, and repeatedly invoking `userGroup(group)` function(s) within it, where `group` is given as a distinguished name.
* `userPrefix` specifies a prefix added to every username when communicated with the LDAP server. Default: an empty string.
* `bindDn` specifies the distinguished name which represents the application within the LDAP server. Normally LDAP servers do not allow anonymous searches, and thus require this. If `bindDn` is not specified, no bindings will be used. Default: null
* `bindPassword` specifies the password associated with the `bindDn` account. If `bindDn` is not specified, this value is not used. Default: null.
* `userIdType` defines the attribute to match in the directory search against the provided username. Default: `cn`. 
  * Amongst the most common LDAP implementations, you can find three main ways of configuring usernames:
    * using the `uid` attribute (Userid)
    * using the `cn` attribute (Common Name)
    * using the `sAMAccountName` in Windows
* `bypassLoginInternalAuth` this is a boolean flag that prevents internal authorisation checks on login
* `onLoginSuccess` this is a function which is invoked on a successful LDAP login, for example: it allows you to insert a user into the db when it exists in LDAP but not the database.
* `useTLS` this is a boolean value indicating whether or not to use TLS encryption on the connection to the remote LDAP server.

For more information about the various authentication types, please see the [Authentication overview](/server/access-control/authentication-overview/).

### passwordValidation
The `passwordValidation` function enables password validation, and is used to set the variables relating to this validation. 

These following variables are used to configure the application's password validation; thus are only used when `type` is either `AuthType.INTERNAL` or `AuthType.HYBRID`.

* `passwordSalt` defines a system specific salt to be added to your password hashes. This is a security measure that ensures that the same combination of username and password on different applications built on the Genesis low-code platform are stored as different hashes. Default: empty string indicating no additional salting.

In addition, from within `passwordValidation` the `passwordStrength` method can be invoked as below.

#### passwordStrength
The `passwordStrength` function can be called within `passwordValidation` to set many configuration variables. These enable you to specify in detail the mandatory characteristics for the password. 

Within this function, the following variables can be set:

* `minimumLength` specifies the minimum length of password. If null or undefined this assumes there is no minimum limit. Default: null.
* `maximumLength` specifies the maximum length of password. If null or undefined this assumes there is no maximum limit. Default: null.
* `minDigits` specifies the minimum number of numerical digits required in a password. If null or undefined this assumes there is no minimum limit. Default: null.
* `maxRepeatCharacters` specifies the maximum number of the same characters across an entire password. This does not just include consecutive repeat characters, which is controlled by the `repeatCharacterRestrictSize` variable below. If null or undefined this assumes there is no maximum limit. Default: null.
* `minUppercaseCharacters` specifies the minimum number of upper-case characters in a password. If null or undefined this assumes there is no minimum limit. Default: null.
* `minLowercaseCharacters` specifies the minimum number of lower-case characters in a password. If null or undefined this assumes there is no minimum limit. Default: null.
* `minNonAlphaNumericCharacters` specifies the minimum number of non-alphanumeric characters, such as punctuation and other special characters. If null or undefined this assumes there is no minimum limit. Default: null.
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
* `passwordExpiryNotificationDays` specifies how many days before their password expiry, a user is notified. If null or undefined a user not notified in advance of their password expiry. Default: null.

### passwordRetry
The `passwordRetry` function allows you to configure settings for limiting the rate at which a user can retry passwords. It allows the following variables to be set:

* `maxAttempts` specifies the maximum number of attempts allowed if a user enters a wrong password. Default: 3 attempts.
* `waitTimeMins` specifies the time to wait in minutes when the maximum number of incorrect attempts is reached before allowing a user to try again. Default: 5 minutes.

### mfa
The `mfa` function allows you to configure Multi-factor Authentication (MFA). For more information on MFA please see [Wikipedia](https://en.wikipedia.org/wiki/Multi-factor_authentication). From within the `mfa` function the following variables can be set:

* `codePeriodSeconds` specifies how many seconds a Time-based One-time Password (TOTP) remains valid. Default: 30 seconds.
* `codePeriodDiscrepancy` specifies the allowed discrepancy to the TOTP. 1 would mean a single block of each `codePeriodSeconds` either side of the time window. Default: 1.
* `codeDigits` specifies the number of digits used in the TOTP. Default: 6 digits.
* `hashingAlgorithm` specifies which choice of Hashing Algorithm to use. Available choices are: `HashingFunction.SHA1`, `HashingFunction.SHA256` or `HashingFunction.SHA512`. Default: `HashingFunction.SHA1`.
* `issuer` specifies a reference to the Organisation or Entity issuing the MFA. Default: Genesis.
* `label` specifies a label for the MFA. This is typically an email address of the issuing Entity or Organisation. Default: genesis.global.
* `confirmWaitPeriodSecs` specifies the period of time in seconds before a secret has to be confirmed. Default: 300 seconds.
* `secretEncryptKey` specifies the key that is used to encrypt Secrets in the database. If this is null or undefined, Secrets will not be encrypted in the database. Default: null.
* `usernameTableLookUpSalt` specifies the salt with which a username is hashed when stored in the database with the above Secret. If this is null or undefined the username will not be hashed in the database. Default: null.

### loginAck
The `loginAck` function allows you to define additional values to be sent back to the client as part of the `LOGIN_ACK` message. When you call the `loginAck` function, you have to supply a table or view as a parameter. This is the table or view upon which the following functions will be invoked.

#### loadRecord
The `loadRecord` function can be invoked within the `loginAck` function to load a single record from the previously supplied table or view.

#### fields
The `fields` function can be invoked within the `loginAck` function to specify which additional fields should be sent back to the client as part of the LOGIN_ACK message.

### Example
Example configuration:

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

    passwordValidation {
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

    passwordRetry {
        maxAttempts = 3
        waitTimeMins = 5
    }

    sso {
        enabled = false
        newUserMode = NewUserMode.REJECT
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
You need make sure that any connecting client knows the types of functionality that you have configured on the security module. For example, you could offer the client two ways of resetting user passwords: either via an administrator or by sending an email.  This choice can affect how the login dialog is displayed, so it is vital that the connecting client knows this before any user logs in.
Currently, this is the only preference published.
### Request
    MESSAGE_TYPE = EVENT_LOGIN_PREFS
### Response
    MESSAGE_TYPE = EVENT_LOGIN_PREFS_ACK
        DETAILS.PASSWORD_RESET_TYPE = ADMIN/EMAIL

---

## Authentication
Once you have a list of preferences, you can show the correct login dialog and let the user make a login attempt.  The password is provided in plain text, as it is expected you will secure the connection using TLS.
### Login request

    MESSAGE_TYPE = EVENT_LOGIN_AUTH
    DETAILS.USER_NAME = JohnDoe
    DETAILS.PASSWORD = Password123

### Login response
If successful:

    MESSAGE_TYPE = EVENT_LOGIN_AUTH_ACK
    DETAILS.SYSTEM.DATE = 2014-06-18 12:27:01
    DETAILS.HEARTBEAT_INTERVAL_SECS = 30
    DETAILS.SYSTEM.PRODUCT[0].NAME = SBL
    DETAILS.SYSTEM.PRODUCT[0].VERSION = 1.0.0-RELEASE
    DETAILS.SYSTEM.PRODUCT[1].NAME = AUTH
    DETAILS.SYSTEM.PRODUCT[1].VERSION = 1.0.1.RELEASE

If there is a problem the server will return the standard error set with CODE/TEXT details and the error code `LOGIN_AUTH_NACK`.  The following error codes can be provided:

- `UNKNOWN_ACCOUNT` - User is unknown
- `INCORRECT_CREDENTIALS` - User/password combination is invalid
- `LOCKED_ACCOUNT` - Account is locked and needs to be re-activated by administrator
- `PASSWORD_EXPIRED` - Password must be changed
- `LOGIN_FAIL` - Generic error code

### Password change
If the response is `PASSWORD_EXPIRED`, then the GUI can allow the user to change the password, provided they know their existing password.

### Change request
    MESSAGE_TYPE = EVENT_CHANGE_USER_PASSWORD
    DETAILS.USER_NAME = JohnDoe
    DETAILS.OLD_PASSWORD = Password123
    DETAILS.NEW_PASSWORD = Password456

### Change response
If successful:

    MESSAGE_TYPE = EVENT_CHANGE_USER_PASSWORD_ACK

If there's a problem, you will receive a standard error set with type
- `CHANGE_USER_PASSWORD_NACK`.  The error codes that can be returned are currently:
- `TOO_SHORT` - Password length too short.
- `TOO_LONG` - Password length too long.
- `INSUFFICIENT_CHARACTERS` - Covers a few cases so text field may be required, used for things like no digits provided when 1 digit is required.
- `ILLEGAL_MATCH` - Covers a few cases so text field may be required, used for things like repeating characters in password.
- `ILLEGAL_WHITESPACE` - If password contains white space.
- `INSUFFICIENT_CHARACTERISTICS` - May be provided if you have configured passwords to be successful if only 2 of 5.strength checks pass.  Should be provided alongside "real" error codes.
- `ILLEGAL_SEQUENCE` - Numerical/alphabetical sequence detected.

### Reset password
This can only be called by an administrator; it simply specifies a user name and sets the password to blank.

### Reset request
    MESSAGE_TYPE = EVENT_RESET_USER_PASSWORD
    DETAILS.USER_NAME = JohnDoe

#### Reset response
    MESSAGE_TYPE = EVENT_RESET_USER_PASSWORD_ACK

## Post-authentication
Once the user has been authenticated, the server expects heartbeat messages, as defined in the interval setting on the ACK message.  If the GUI misses a configurable number of heartbeats, the session will automatically expire. In response to a heartbeat, the GUI will receive a list of available services and their details.

These services should be contacted on the hosts in the order they are defined in the list. The ordering may change if the server implements a load-balancing strategy. Existing connections can simply ignore the ordering changes, but in a failover or reconnection scenario, the ordering should be adhered to.

### Heartbeat request

    MESSAGE_TYPE = EVENT_HEARTBEAT
    USER_NAME = JohnDoe

### Heartbeat response
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

### Entity management
In the Genesis low-code platform, there are profiles, users and rights.  A profile is a group of users, which can be permissioned.  For example, you could have a SALES_TRADER group in which all users must have the same permissions.  In all cases where you specify either a right for a user/profile, or a user in a profile, the event represents what you want the entity to look like; i.e. if you amend a profile and don't supply a user that previously was part of that profile, then that user will be removed from that profile on the server.

Note the following:

* 2-phase validation is not currently supported
* metadata is not supported on the following transactions.
  User/profile `STATUS` field can be set to `ENABLED`, `DISABLED`, `PASSWORD_EXPIRED` and `PASSWORD_RESET`.
  `PASSWORD_EXPIRED` should prompt the user to enter a new password.
  `PASSWORD_RESET` should do the same but the server expects a blank "current password" field.

### Insert profile

### Insert request

    MESSAGE_TYPE = EVENT_INSERT_PROFILE
    USER_NAME = JohnDoe
    DETAILS.NAME = SALES_TRADERS
    DETAILS.DESCRIPTION = Sales Traders
    DETAILS.STATUS = ENABLED
    DETAILS.RIGHT[0].ID = 00000000000001RISP0
    DETAILS.RIGHT[0].CODE = ORDEN
    DETAILS.RIGHT[1].ID = 00000000000002RISP0
    DETAILS.RIGHT[1].CODE = ORDAM
    DETAILS.USER[0].ID = 00000000000001USSP0
    DETAILS.USER[0].USER_NAME = JohnDoe
    DETAILS.USER[1].ID = 00000000000002USSP0
    DETAILS.USER[1].USER_NAME = james

### Insert response
    MESSAGE_TYPE = EVENT_INSERT_PROFILE_ACK

### Amend profile

### Amend request
  In the example below, the logged-in user (in the second line) is JohnDoe, who is modifying the profile of JaneDoe to give her the profile name JANE SMITH. 

```
    {
  "SOURCE_REF": "1786d2ca-23fd-40c8-a52b-fe002a0fa1f6",
  "USER_NAME": "JohnDoe",
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

### Amend response

```
{
  "GENERATED": [],
  "MESSAGE_TYPE": "EVENT_ACK",
  "SOURCE_REF": "1786d2ca-23fd-40c8-a52b-fe002a0fa1f6"
}
```

### Delete profile

### Delete request
    MESSAGE_TYPE = EVENT_DELETE_PROFILE
    USER_NAME = JohnDoe
    DETAILS.NAME = SALES_TRADERS

### Delete response
    MESSAGE_TYPE = EVENT_DELETE_PROFILE_ACK

### Insert User

### Insert request
    MESSAGE_TYPE = EVENT_INSERT_USER
    USER_NAME = mthompson
    DETAILS.USER_NAME = JohnDoe
    DETAILS.FIRST_NAME = John
    DETAILS.LAST_NAME = Doe
    DETAILS.EMAIL_ADDRESS = john.doe@genesis.global
    DETAILS.STATUS = ENABLED
    DETAILS.RIGHT[0].ID = 00000000000001RISP0
    DETAILS.RIGHT[0].CODE = ORDEN
    DETAILS.RIGHT[1].ID = 00000000000002RISP0
    DETAILS.RIGHT[1].CODE = ORDAM

### Insert response
    MESSAGE_TYPE = EVENT_INSERT_USER_ACK

### Amend user

### Amend request
    MESSAGE_TYPE = EVENT_AMEND_USER
    USER_NAME = mthompson
    DETAILS.ID = 00000000000001USSP0
    DETAILS.USER_NAME = JohnDoe
    DETAILS.FIRST_NAME = John
    DETAILS.LAST_NAME = Doe
    DETAILS.EMAIL_ADDRESS = john.doe@genesis.global
    DETAILS.STATUS = ENABLED
    DETAILS.RIGHT[0].ID = 00000000000001RISP0
    DETAILS.RIGHT[0].CODE = ORDEN
    DETAILS.RIGHT[1].ID = 00000000000002RISP0
    DETAILS.RIGHT[1].CODE = ORDAM

### Amend response
    MESSAGE_TYPE = EVENT_AMEND_USER_ACK

### Delete user

### Delete request
    MESSAGE_TYPE = EVENT_DELETE_USER
    USER_NAME = JohnDoe
    DETAILS.USER_NAME = james

### Delete response
    MESSAGE_TYPE = EVENT_DELETE_USER_ACK
