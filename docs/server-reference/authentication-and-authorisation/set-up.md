---
title: Set up authentication and authorisation
sidebar_label: Set up authentication and authorisation
sidebar_position: 1
id: set-up

---
## Authentication

### Authentication Types

There are several authentication types to choose from when configuring the auth-preferences.xml file: INTERNAL, LDAP and HYBRID.

In order to select one, it is enough to change the type attribute of the authentication field:

```xml
<authentication type="INTERNAL"></authentication>
```

#### Internal

The internal authentication is based on Genesis's own way of authenticating users. It checks user credentials against an internal database table and it allows a certain degree of extra functionality.

User accounts set in this mode can be locked and passwords can be set to expire. In addition, users can also reset/change their password assuming they can login first.

This is the default authentication behaviour if no type is specified in auth-preferences.xml.

#### LDAP

LDAP authentication is available to be used within the AUTH environment as a basic login.

However, we lose control of the internal authentication functionality, as the authentication relies on an external party that cannot be operated from Genesis. As a direct consequence requests to change/reset password won't be accepted.

Note that a username **must** exist inside the internal records if we want to use LDAP authentication. This means a user entry must be created inside the USER database table for every LDAP user we desire to give access. Otherwise every LDAP user could get authenticated, which is not the expected behaviour. There is no password checking against the internal records though, as the authentication will rely solely on LDAP.

The configuration file needs extra parameters in order to set up LDAP authentication:

**url** represents the LDAP server hostname. Default: localhost.

**port** defines the LDAP server port to connect to. Default: 389.

**searchBase** defines the location(s) in the directory from which the LDAP search begins. Default: ou=temp,dc=temp

**userPrefix** is an optional prefix we can add to every username received from login requests in our authentication server. Default: empty string.

**bindDn** is an optional distinguished name which acts as a first LDAP login and it is normally required to perform a search. If this field is not specified no bindings will be used. Default: null

**bindPassword** represents the password associated to the **bindDn** account. Default: null.

**userIdType** defines the attribute to match in the directory search against the provided username. Amongst the most common LDAP implementations we can find three main ways of configuring user names: by using the "uid" attribute, the "cn" attribute or the "sAMAccountName" in Windows. Default: cn.

```xml
<authentication type="LDAP">
    <url>localhost</url>
    <port>389</port>
    <!-- Multiple searchBase elements are allowed -->
    <searchBase>ou=People,dc=example,dc=com</searchBase>
    <userPrefix></userPrefix>
    <bindDn>CN=DTADevBindUser,ou=People,dc=example,dc=com</bindDn>
    <bindPassword>password123</bindPassword>
    <userIdType>cn</userIdType>
</authentication>
```

#### Hybrid

As its name suggests, Hybrid mode is a mix of Internal and LDAP authentication modes and it checks credentials against both.

First an internal authentication will be performed and in case of a successful outcome, another authentication against the LDAP server will take place. Both authentications need to be successful to accept a login request.

In this mode we can take advantage of all the available functionality in internal mode (locked accounts, expiring passwords, reset/change passwords), but on the other hand, if passwords are changed or expired they should be changed manually in LDAP too, as authentication always happens in both services.

The configuration file takes the same fields as LDAP, taking into account that now the authentication type should be changed to HYBRID.

```xml
<authentication type="HYBRID">
    <url>localhost</url>
    <port>389</port>
    <searchBase>ou=People,dc=example,dc=com</searchBase>
    <userPrefix></userPrefix>
    <bindDn>CN=DTADevBindUser,ou=People,dc=example,dc=com</bindDn>
    <bindPassword>password123</bindPassword>
    <userIdType>cn</userIdType>
</authentication>
```

### Authentication Preferences

The authentication preferences/options are specified in auth-preferences.xml and we can make a subdivision of them in three sections: authentication type configuration, password strength related configuration and general configuration.

#### Basic preferences in detail

We can define the following preferences:

**authentication** represents the authentication type to be used by the platform. There are three authentication types (INTERNAL, LDAP and DEFAULT) and they are explained in detail in the "Authentication Types" subsection. Default: INTERNAL.

**passwordStrength** is a complex field made of many options that allow a detailed specification of the password mandatory characteristics. These are the following:

* **minimumLength** represents minimum length of password. Default: null.
* **maximumLength** represents maximum length of password. Default: null.
* **minDigits** represents minimum number of digits in password. Default: null.
* **maxRepeatCharacters** represents maximum number of same characters in password. Default: null.
* **minUppercaseCharacters** represents minimum number of uppercase characters in a password. Default: null.
* **minLowercaseCharacters** represents minimum number of lowercase characters in a password. Default: null.
* **minNonAlphaNumericCharacters** represents minimum number of characters which do not belong to common letters or numbers (e.g. !?/-_"). Default: null.
* **restrictWhitespace** restricts the usage of whitespaces in passwords. Default: true.
* **restrictAlphaSequences** restricts alphabetical sequences in passwords (e.g. abcdefg). Sequences bigger or equal to 5 characters won't be allowed if active. Default: false.
* **restrictQWERTY** restricts QWERTY sequences in passwords (e.g. qwertyuiop). Sequences bigger or equal to 5 characters won't be allowed if active. Default: true.
* **restrictNumericalSequences** restricts numerical sequences in passwords (e.g. 123456). Sequences bigger or equal to 5 numbers won't be allowed if active. Default: true.
* **illegalCharacters** contains characters we don't want to accept in user passwords. In the example shown below we can see three banned characters: $, £ and ^. Default: empty.
* **historicalCheck** if present prevents reuse of passwords used by the user for the configured number of historical uses. Default: null.
* **dictionaryWordSize** if present prevents use of english words of the configured length. Default: null.
* **repeatCharacterRestrictSize** if present prevents use of repeated characters of the configured length. Default: null.
* **restrictUserName** if present prevents use of the user's username as part of their password. Default: false.
* **passwordExpiryDays** if present forces a password to expire after the configured number of days. Default: null.
* **passwordExpiryNotificationDays** if present a user should be notfied by the configured number of days before their password expires. Default: null.

**heartbeat** represents a message sent periodically to the platform's authentication module from every user so the platform can determine who is still connected to it. The authentication module then replies with an acknowledgement in exchange.

* **intervalSecs** is the number of seconds to wait between sending one heartbeat message and the next one. This number is sent from the user client's connection to the authentication module. Default: null.

**sessionTimeoutMins** is the time to wait before timing out an idle session with a user client. A user client may very well be answering heartbeats but at the same time being idle (i.e. not using the platform). This timeout represents the number of minutes a user needs to be idle to be logged out of the platform. Default: 30.

**expiryCheckMins** represents the time interval used to check for idle sessions in the system. Default: 5.

**passwordRetry** defines the maximum number of attempts to be tolerated if a user enters a wrong password and the time to wait in case of reaching this number. Default: maxAttempts="3" and waitTimeMins="5".

**maxSimultaneousUserLogins** defines the maximum number of active sessions any one user can maintain. To login once this limit is reached, then another session must be logged out. If the given value is zero, not defined or not a positive integer, then any number of sessions is permitted.

**loginAckFields** is an optional xml block that allows us to define additional values to be sent back to the client as part of the LOGIN_ACK message. It follows a classic *join* xml definition similar to the ones used in [request reply](../../request-servers/configure) and [data server](../../data-servers/configure) modules.

**mfa** is config for Multi-factor Authentication (MFA)
* **codePeriodSeconds** How long an TOTP should work for. Default: 30.
* **codePeriodDiscrepancy** Discrepany to the above allowed. 1 means a block of each codePeriodSeconds either side of the time window. Default: 1.
* **codeDigits** Number of digits used in the TOTP. Default: 6.
* **hashingAlgorithm** Choice of Hashing Alogirthm SHA1, SHA256 or SHA512. Default: SHA1.
* **issuer** A reference to the Organsition or Entity issuing the MFA. Default: Genesis.
* **label** A label, tyipcally an email address of the issuing Entity or Organisation. Default: genesis.global.
* **confirmWaitPeriodSecs** The period of time before a secret has to be confirmed. Default: 300.
* **secretEncryptKey** If present Secrets will be encrypted in the database. Default: null.
* **usernameTableLookUpSalt** If present username will be hashed using the configured key in the database. Default: null.


Example configuration:

```xml
<security>

    <authentication type="INTERNAL"></authentication>

    <passwordStrength>
        <minimumLength value="5" />
        <maximumLength value="10" />
        <minDigits value="1" />
        <maxRepeatCharacters value="5" />
        <minUppercaseCharacters value="1" />
        <minLowercaseCharacters value="2" />
        <minNonAlphaNumericCharacters value="1" />

        <restrictWhitespace value="true"/>
        <restrictAlphaSequences value="false"/>
        <restrictQWERTY value="true"/>
        <restrictNumericalSequences value="true"/>

        <illegalCharacters>
            <![CDATA[ $£^ ]]>
        </illegalCharacters>

    </passwordStrength>

    <mfa>
      <codePeriodSeconds value ="30"/>
      <codePeriodDiscrepancy value ="1"/>
      <codeDigits value ="6"/>
      <hashingAlgorithm value ="SHA512"/>
      <issuer value ="Genesis"/>
      <label value ="admin@genesis.global"/>
      <confirmWaitPeriodSecs value="60"/>
      <secretEncryptKey value="abc"/>
      <usernameTableLookUpSalt value="xyz"/>
    </mfa>

    <heartbeat>
        <intervalSecs value="30" />
    </heartbeat>

    <sessionTimeoutMins>20</sessionTimeoutMins>
    <expiryCheckMins>5</expiryCheckMins>

    <passwordRetry maxAttempts="3" waitTimeMins="5" />
    
    <!-- Optional -->
    <loginAckFields>
        <tables>
            <table name="COLOUR" alias="c">
                <join key="COLOUR_BY_USER_ID">
                    <![CDATA[
                    c.setString('USER_ID', user.getString('USER_ID'))
                    ]]>
                </join>
            </table>
            <table name="PET" alias="p">
                <join key="PET_BY_USER_ID">
                    <![CDATA[
                    p.setString('USER_ID', user.getString('USER_ID'))
                    ]]>
                </join>
            </table>
        </tables>

        <fields>
            row.setString("COLOUR", c.getString("COLOUR_NAME"))
            row.setString("PET", p.getString("PET_NAME"))
        </fields>
    </loginAckFields>

</security>

```

### Message Flows

Security messages can be split into three categories.
- Pre-authentication
- Authentication
- Post-authentication

All requests below are capable of returning an error with a code of INTERNAL_ERROR which will be used as a last resort.

#### Pre-authentication
Pre-authentication messages can be sent by a client without the user being logged in.
##### Login Preferences
We need to advertise to any connecting client the types of functionality that are available/configured on the security module.  For example, we may offer the client two ways of resetting user passwords, either via an administrator or by sending an email.  This choice can affect how the login dialog is displayed, hence this information needs to be made available before the user logs in.
Currently this is the only preference published.
###### Request
    MESSAGE_TYPE = EVENT_LOGIN_PREFS
###### Response
    MESSAGE_TYPE = EVENT_LOGIN_PREFS_ACK
        DETAILS.PASSWORD_RESET_TYPE = ADMIN/EMAIL
#### Authentication
Once we have a list of preferences, we can show the correct login dialog and let the user make a login attempt.  The password is provided in plain text, as it is expected we will secure the connection using TLS.
##### Login
###### Request

    MESSAGE_TYPE = EVENT_LOGIN_AUTH
       DETAILS.USER_NAME = JohnDoe
       DETAILS.PASSWORD = Password123

###### Response
If successful:

    MESSAGE_TYPE = EVENT_LOGIN_AUTH_ACK
        DETAILS.SYSTEM.DATE = 2014-06-18 12:27:01
        DETAILS.HEARTBEAT_INTERVAL_SECS = 30
            DETAILS.SYSTEM.PRODUCT[0].NAME = SBL
            DETAILS.SYSTEM.PRODUCT[0].VERSION = 1.0.0-RELEASE
            DETAILS.SYSTEM.PRODUCT[1].NAME = AUTH
            DETAILS.SYSTEM.PRODUCT[1].VERSION = 1.0.1.RELEASE

If there is a problem the server will return the standard error set with CODE/TEXT details and the error code LOGIN_AUTH_NACK.  The following error codes can be provided:

- UNKNOWN_ACCOUNT - User is unknown
- INCORRECT_CREDENTIALS - User/password combination is invalid
- LOCKED_ACCOUNT - Account is locked and needs to be re-activated by administrator
- PASSWORD_EXPIRED - Password must be changed
- LOGIN_FAIL - Generic error code

##### Password Change
If the response is PASSWORD_EXPIRED, then the GUI can allow the user to change the password provided they know their existing password.
###### Request
    MESSAGE_TYPE = EVENT_CHANGE_USER_PASSWORD
        DETAILS.USER_NAME = JohnDoe
        DETAILS.OLD_PASSWORD = Password123
        DETAILS.NEW_PASSWORD = Password456
###### Response
If successful:

    MESSAGE_TYPE = EVENT_CHANGE_USER_PASSWORD_ACK
If there's a problem, we will receive a standard error set with type
- CHANGE_USER_PASSWORD_NACK.  The error codes that can be returned are currently:
- TOO_SHORT - Password length too short
- TOO_LONG - Password length too long
- INSUFFICIENT_CHARACTERS - Covers a few cases so text field may be required, used for things like no digits provided when 1 digit is required.
- ILLEGAL_MATCH - Covers a few cases so text field may be required, used for things like repeating characters in password
- ILLEGAL_WHITESPACE - If password contains white space
- INSUFFICIENT_CHARACTERISTICS - May be provided if we have configured passwords to be successful if only 2 of 5 strength checks pass.  Should be provided alongside "real" error codes.
- ILLEGAL_SEQUENCE - Numerical/alphabetical sequence detected

##### Reset Password
Can only be called by an administrator, simply specifies a user name and will set the password to blank.
###### Request
    MESSAGE_TYPE = EVENT_RESET_USER_PASSWORD
        DETAILS.USER_NAME = JohnDoe
###### Response
    MESSAGE_TYPE = EVENT_RESET_USER_PASSWORD_ACK
#### Post-authentication
Once the user is authenticated, the server will expect heartbeat messages, as defined in the interval setting on the ACK message.  If the GUI misses a configurable number of heartbeats, the session will be expired.  In response to a heartbeat, the GUI will receive a list of available services and their details.

These services should be contacted on the hosts as they are defined in the list.  The ordering may change if the server is implementing a load balancing strategy.  Existing connections can simply ignore the ordering changes, but in a fail over or reconnection scenario, the ordering should be adhered to.

###### Request

    MESSAGE_TYPE = EVENT_HEARTBEAT
    USER_NAME = JohnDoe
###### Response
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


##### Rights polling
The GUI can receive rights from a process called AUTH_DATASERVER.  The view USER_RIGHTS displays all users and codes.  A logged in user should automatically set the Filter expression to be USER_NAME=='xxx' to receive push updates to user privileges.

##### Entity Management
We have the concept of profiles, users and rights.  A profile is a group of users, which can be permissioned.  For example we may have a SALES_TRADER group in which all users must have the same permissions.  In all cases where we're specifying either a right for a user/profile, or a user in a profile, the transaction represents what we want the entity to look like, i.e. if we amend a profile and don't supply a user that previously was part of that profile, then that user will be removed from that profile on the server.

It's worth noting we do not support meta data on the following transactions, as the model is currently too complex for our meta data.  Also, we do not currently support 2 phase validation.

User/profile STATUS field can be ENABLED/DISABLED/PASSWORD_EXPIRED/PASSWORD_RESET.
PASSWORD_EXPIRED should prompt the user to enter a new password.
PASSWORD_RESET should do the same but the server expects a blank "current password" field.

##### Insert profile
###### Request

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
###### Response
    MESSAGE_TYPE = EVENT_INSERT_PROFILE_ACK
##### Amend Profile
###### Request
    MESSAGE_TYPE = EVENT_AMEND_PROFILE
    USER_NAME = JohnDoe
        DETAILS.ID = 000000000001PRSP0
        DETAILS.NAME = SALES_TRADERS_AMEND
        DETAILS.DESCRIPTION = Sales Traders (Amended)
        DETAILS.STATUS = ENABLED
            DETAILS.RIGHT[0].ID = 00000000000001RISP0
            DETAILS.RIGHT[0].CODE = ORDEN
            DETAILS.RIGHT[1].ID = 00000000000002RISP0
            DETAILS.RIGHT[1].CODE = ORDAM
            DETAILS.RIGHT[2].ID = 00000000000003RISP0
            DETAILS.RIGHT[2].CODE = ORDEL
            DETAILS.USER[0].ID = 00000000000001USSP0
            DETAILS.USER[0].USER_NAME = JohnDoe
###### Response
    MESSAGE_TYPE = EVENT_AMEND_PROFILE_ACK
##### Delete Profile
###### Request
    MESSAGE_TYPE = EVENT_DELETE_PROFILE
    USER_NAME = JohnDoe
        DETAILS.NAME = SALES_TRADERS
###### Response
    MESSAGE_TYPE = EVENT_DELETE_PROFILE_ACK
##### Insert User
###### Request
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
###### Response
    MESSAGE_TYPE = EVENT_INSERT_USER_ACK
##### Amend User
###### Request
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
###### Response
    MESSAGE_TYPE = EVENT_AMEND_USER_ACK
##### Delete User
###### Request
    MESSAGE_TYPE = EVENT_DELETE_USER
    USER_NAME = JohnDoe
        DETAILS.USER_NAME = james
###### Response
    MESSAGE_TYPE = EVENT_DELETE_USER_ACK


## Authorisation

Authorisation is achieved by permissioning dynamically. This means you can control access to information in increasingly precise ways, for example:

* The whole entity
* Specific rows
* Specific columns

Effectively, you have three levels of control:

**High level**

You could hide an entire grid from the UI, for example. So one group could view reference data, but this would be hidden from the other groups. Or, you could hide an entire data server. For this, you use RIGHT_CODE. This is like a switch – you can either see it or not, depending on whether the code is TRUE or FALSE.

**Entity level**

This is row or column-level access to information. Different users all view the same grid, but each one sees different data. This is, best explained with these simple examples:

* You can have user A, user B and user C all having the RIGHT_CODE to view a specific grid, but each one sees different trades in that grid. This enables you to separate different trading desks, for example.
* Each user might only have access to trades for specific customers.
* By including these permissions in an event handler,  user A can only enter a trade on behalf of a specific set of clients and user B can only enter trades on behalf of a different set of clients.

Similarly, you can have different users seeing different columns in the same grid. This could be used for a support function, for example, where you don’t want the support team to see specific columns of sensitive data, such as who the client for a trade is. It can be specified by using GPAL.

### Users, profiles and rights

We have users, profiles and right codes.

A profile can have zero to many rights codes and zero to many users.

So, if you have, say three roles, Trader, Support, and Operations, you set up the rights codes for each of these three profiles and then allocate each user to the appropriate profile. A user can have more than one profile, so you could allocate a superuser to all three profiles; that superuser would have the rights of all three profiles.

You cannot allocate rights codes directly to a specific user. But there is nothing to stop you from creating a profile that has only one user.

This information is held on the following tables:

* PROFILE_RIGHT. For each profile, this lists the entities that the profile has the right to view.
* PROFILE_USER. For each profile, this lists the users who have been allocated (and therefore, who have the rights in the relevant PROFILE_RIGHT table).
* RIGHT_SUMMARY. This is created automatically by the system in real time. It maps all users to their rights.

In this way, the rights are easily accessible at speed. The AUTH_MANAGER process manages this automatically. So if you add a new user or you update a profile with new rights, the RIGHT_SUMMARY table is updated immediately and all the users in that profile receive the new right automatically.

If the profile has write access to an entity, then it automatically includes read rights.

### Loading a list of users

If you need to load a list of users and profiles you can use **SendIt** to send the list to the database, but it does not update the RIGHT_SUMMARY table automatically. After loading the database, you need to run the script **consolidateRights** to update the RIGHT_SUMMARY table.

### Good practice, bad practice

With this route, you can allocate rights to profiles and users to rights – and  change them. There is no change to the code needed.  However, our advice is to be as granular as possible at the start, because it is more difficult to introduce that granularity at a later point.  If you create a new right, you have to change the code.

### Entity level (row level)

The GENESIS_AUTH_PERMS process runs automatically on start-up and creates a memory-mapped file that acts as a big key-value pair – for example, User J has access to Counterparty 1, User J has access to Counterparty 2, User K has access to Counterparty 1, User K has access to Counterparty 4, etc. If there is no appropriate entry in the file, the user won’t have access.

You must keep the process running, as it maintains itself automatically whenever any permissions change. If a permission is changed this way, then the change is automatically reflected on screen. If I have a grid on screen with 4 trades from Counterparty 1 and my permission to view that counterparty are withdrawn, those 4 trades disappear from my screen immediately.

In many cases, you want different people to have access to different functions and different information, based on their roles.  In Genesis, users are not permissioned individually for these purposes. Instead, permissioning is based on roles. You define what information and functions are available to a role, and then you allocate users to these roles. We refer to this as dynamic authorisation. There is nothing to stop you creating a role that has only one user, of course.

### General approach

On startup, the GENESIS_AUTH_PERMS process performs an initial scan of all entities. For each entity found, it performs authorisation against every user in the system. This builds a full map of permissioned users.

By default, any updates to the entity and the USER table will be automatically processed to permission new entities as they are entered into the database.

Entries are stored in a memory-mapped file located in **$GENESIS_HOME/runtime/authCache**.

If you need to clear out the entries by hand, simply delete everything in that directory and restart GENESIS_AUTH_PERMS.

More than one permission map per table may be created.

### Auth generic permissions model

#### Intro

The generic permissions model available in auth automatically builds “auth-perms” maps and also ensures all the admin transactions, dataservers and request reply resources are authorised correctly on a multi-tenant basis. This generic approach might not work for every use case, but it should be good enough for many development scenarios and therefore should cover all the basics out of the box.

#### Configuration
There is a field called ACCESS_TYPE in the USER_ATTRIBUTES table which will determine what authorisation method should be applied for a particular user.
```kotlin
field(name = "ACCESS_TYPE", type = ENUM("ALL", "ENTITY", "MULTI_ENTITY", default = "ALL")) 
```

*Note*: Only ALL and ENTITY are in working condition at the moment.

Users with ACCESS_TYPE set to ENTITY (e.g. the entity could be represented by COUNTERPARTY_ID) will be restricted in both visibility and entitlements to their own entity.

The inner working of this new feature is also controlled by two system definition items:

```kotlin
systemDefinition {
    global {
        item(name = "ADMIN_PERMISSION_ENTITY_TABLE", value = "COUNTERPARTY")
        item(name = "ADMIN_PERMISSION_ENTITY_FIELD", value = "COUNTERPARTY_ID")
    }
}
```

These two items will change the structure of auth-tables-dictionary.kts and auth-permissions.templt.xml to accomodate the defined table and field and ensure table/permission data structure is built correctly.

USER_ATTRIBUTES table definition in auth-tables-dictionary.kts below:
```kotlin
val permissionsField = SysDef.systemDefinition["ADMIN_PERMISSION_ENTITY_FIELD"].orElse(null)

table(name = "USER_ATTRIBUTES", id = 1007, audit = details(1052, "AA")) {
    Fields.USER_NAME
    Fields.USER_TYPE
    Fields.ACCESS_TYPE
    if (permissionsField != null) {
        Fields[permissionsField]
    }
    Fields.ADDRESS_LINE1
    Fields.ADDRESS_LINE2
    Fields.ADDRESS_LINE3
    Fields.ADDRESS_LINE4
    Fields.CITY
    Fields.REGION
    Fields.POSTAL_CODE
    Fields.COUNTRY
    Fields.TITLE
    Fields.WEBSITE
    Fields.MOBILE_NUMBER
    Fields.TELEPHONE_NUMBER_DIRECT
    Fields.TELEPHONE_NUMBER_OFFICE
    primaryKey {
        Fields.USER_NAME
    }
}
```
The permissions field will be added dynamically to USER_ATTRIBUTES so it can be used in our auth transactions to control entitlements.

The following table will be created as well (ignore MULTI_ENTITY setup for now, still in development) which will be used internally to manage AUTH_PERMS results.:

```kotlin
val permissionsTable = SysDef.systemDefinition["ADMIN_PERMISSION_ENTITY_TABLE"].orElse(null)

if (permissionsTable != null && permissionsField != null) {

    table(name = "USER_${permissionsTable}_MAP", id = 1012) {
        Fields.USER_NAME
        Fields[permissionsField]
        primaryKey {
            Fields.USER_NAME
        }
        indices {
            nonUnique(name = "USER_${permissionsTable}_MAP_BY_${permissionsField}") {
                Fields[permissionsField]
            }
        }
    }
}
```
Two auth maps exist in auth-permissions.templt.xml to control row visibility of users (in auth dataserver and auth request reply) and also the generic entities. See below:
```xml
<entity name="USER_VISIBILITY"
        tableName="USER"
        maxEntries="2000"
        idField="USER_NAME">
    <updateOn tableName="USER_ATTRIBUTES">
        <entities>
            <![CDATA[
                getUserRecord(rxDb, genericRecord.getString("USER_NAME")).toFlowable()
        ]]>
        </entities>
        <users>
            <![CDATA[
                getUserRecord(rxDb, genericRecord.getString("USER_NAME")).toList()
        ]]>
        </users>
    </updateOn>
    <![CDATA[
        final DbRecord targetUser = user
        return Flowable.fromIterable(users).map { permissionedUser ->
            final String userName = permissionedUser.getString("USER_NAME")
            if(user.getString("ACCESS_TYPE") == "ALL"){
                new AuthEntry(userName, entityId, true)
            } else {
                new AuthEntry(userName, entityId, targetUser.getString("{{ADMIN_PERMISSION_ENTITY_FIELD}}") == permissionedUser.getString("{{ADMIN_PERMISSION_ENTITY_FIELD}}"))
            }
        }
        ]]>
</entity>

<!-- If multi has not been defined -->
<entity name="ENTITY_VISIBILITY"
        tableName="USER_{{ADMIN_PERMISSION_ENTITY_TABLE}}_MAP"
        maxEntries="20000"
        idField="{{ADMIN_PERMISSION_ENTITY_FIELD}}" >
    <![CDATA[
        final Set<String> validUsers = getUsernamesForEntity(rxDb, entityId, null)
        return Flowable.fromIterable(users).map { user ->
            final String userName = user.getString("USER_NAME")
            if(user.getString("ACCESS_TYPE") == "ALL"){
                new AuthEntry(userName, entityId, true)
            } else {
                new AuthEntry(userName, entityId, userName in validUsers)
            }
        }
    ]]>
</entity>
```
An example of using ENTITY_VISIBILITY in a dataserver/request-reply can be something like this:

```kotlin
query("ALL_BID_OFFER_SELLER_DEALER", BID_OFFER_SELLER_VIEW) {
    permissioning {
        auth(mapName = "ENTITY_VISIBILITY") {
            BID_OFFER_SELLER_VIEW.SELLER_DEALER_ID
        }
        config {
            backJoins = true
        }
    }
}
```

### Adding authorisation to the data server and request server

The code for permissioning specific queries must be inserted into your data servers and request servers.

The dynamic authorisation definition in GPAL dataserver/requestserver has 4 settings which can be used in any combination.

#### Grouping

Auth definitions can now be grouped with “and” or “or” operators. This means you could have two simple permission maps, for example, one by counterparty and another one for forbidden symbols. This would require a user to have those two permissions at once in order to see the row. Alternatively, you could have two permission maps (one for buyer and one for seller). A user would be allowed to see a row if they have a seller or buyer profile, but users without one of the those profiles would be denied access.

##### AND grouping

This example shows an AND grouping:

```kotlin
permissioning {
    auth(mapName = "ENTITY_VISIBILITY") {
        TRADE.COUNTERPARTY_ID
    } and auth(mapName = "SYMBOL_RESTRICTED") {
        TRADE.SYMBOL
    }
}
```

##### OR grouping

This example shows OR grouping

```kotlin
permissioning {
    auth(mapName = "ENTITY_VISIBILITY") {
        BID_OFFER.BUYER_ID
    } or auth(mapName = "ENTITY_VISIBILITY") {
        BID_OFFER.SELLER_ID
    }
}
```

#### Where clauses

You can define a where clause if you only want to show a row in specific cases. Authorisation definitions using a where clause first evaluate the where clause against the permission map. This functionality on its own is not that useful, as for a single auth permissions map the content of the where clause could be moved to the query where clause instead. However, it shines when using auth grouping, because you can filter rows based on individual user permissions.

This example shows different where clauses based on user role.

```kotlin
permissioning {
    auth(mapName = "ENTITY_VISIBILITY") {
        BID_OFFER_BIDDER_VIEW.CLIENT_ID
        where { view ->
            !(BidState.DRAFT == view.bidState && !(BidBookState.OPEN == view.bidBookState ||(BidBookState.UPCOMING == view.bidBookState)) )
        }
    } or
    auth(mapName = "ENTITY_VISIBILITY") {
        BID_OFFER_BIDDER_VIEW.BUYER_DEALER_ID
        where { view ->
            !((BidBookState.UPCOMING == view.bidBookState || BidBookState.OPEN == view.bidBookState) && DealerRole.PRINCIPAL == view.dealerRole)
        }
    }
}
```

#### HideFields

You can also have different column visibility levels based on user authorisation and row content.

The example below hides the LAST_TRADED_PRICE column value for a particular instrument code.

```kotlin
permissioning {
    auth(mapName = "EXCHANGE") {
        INSTRUMENT_DETAILS.EXCHANGE_ID
        hideField { userName, rowData ->
            if(rowData.instrumentCode == "ALLL3") LAST_TRADED_PRICE
            else null
        }
    }
}
```

#### EnrichedAuth

Our permission model could require access to client enriched data, so dataservers have an additional level of auth functionality which takes this data into account.

Example below:

```kotlin
query("ALL_TRADES_WITH_ENRICHED_AUTH", TRADE_VIEW) {
    permissioning {
        enrichedAuth(mapName = "TRADE_VISIBILITY", enrichedEntity = FAVOURITE_TRADES) {
            TRADE_VIEW.TRADE_ID
            FAVOURITE_TRADES.USER_NAME
        }
    }
    enrich(FAVOURITE_TRADES){
        join { userName, row ->
            FavouriteTrades.ByTradeIdAndUserName(
                userName = userName,
                tradeId = row.tradeId
            )
        }
        fields {
            derivedField("FAVOURITE", BOOLEAN) { row, userData ->
                userData != null
            }
        }
    }
    config {
        compression = true
    }
}
```