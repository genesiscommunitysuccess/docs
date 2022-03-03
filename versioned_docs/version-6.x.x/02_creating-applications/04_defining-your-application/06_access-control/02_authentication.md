---
title: Authentication
sidebar_label: Authentication
sidebar_position: 2
id: authentication

---


## Authentication preferences

You can set the authentication preferences for your applicatin in the file **auth-preferences.xml**. These can be configured in three different sections:

* authentication type 
* password strength 
* general 

### Basic preferences in detail

You can define the following preferences:

#### authentication
This represents the authentication type to be used by the platform. There are three authentication types (INTERNAL, LDAP and DEFAULT) and they are explained in detail in the "Authentication Types" subsection. Default: INTERNAL.

#### passwordStrength
This is a complex field made of many options. These enable you to specify in detail the mandatory characteristics for the password. The options are:

* **minimumLength** this represents the minimum length of password. Default: null.
* **maximumLength** this represents the maximum length of password. Default: null.
* **minDigits** this represents the minimum number of digits required in a password. Default: null.
* **maxRepeatCharacters** this represents the maximum number of the same characters in a password. Default: null.
* **minUppercaseCharacters** this represents the minimum number of upper-case characters in a password. Default: null.
* **minLowercaseCharacters** this represents the minimum number of lower-case characters in a password. Default: null.
* **minNonAlphaNumericCharacters** this represents minimum number of characters which do not belong to common letters or numbers (e.g. !?/-_"). Default: null.
* **restrictWhitespace** this restricts the usage of whitespaces in passwords. Default: true.
* **restrictAlphaSequences** this restricts alphabetical sequences in passwords (e.g. abcdefg). Sequences bigger or equal to 5 characters won't be allowed if this is active. Default: false.
* **restrictQWERTY** this restricts QWERTY sequences in passwords (e.g. qwertyuiop). Sequences bigger or equal to 5 characters won't be allowed if this is active. Default: true.
* **restrictNumericalSequences** restricts numerical sequences in passwords (e.g. 123456). Sequences bigger or equal to 5 numbers won't be allowed if active. Default: true.
* **illegalCharacters** contains characters you don't want to accept in user passwords. In the example shown below, you can see three banned characters: $, £ and ^. Default: empty.
* **historicalCheck** if present, this prevents reuse of passwords for the specified number of historical uses. Default: null.
* **dictionaryWordSize** if present, this prevents use of English words of the specified length. Default: null.
* **repeatCharacterRestrictSize** if present, this prevents the use of repeated characters of the specified length. Default: null.
* **restrictUserName** if present, this prevents use of the user's username as part of their password. Default: false.
* **passwordExpiryDays** if present, this forces a password to expire after the specified number of days. Default: null.
* **passwordExpiryNotificationDays** if present, a user shall be notfied by the specified number of days before their password expires. Default: null.

#### heartbeat
A heartbeat message is automatically sent from every logged-in user to the platform's authentication module. This ensures that the platform can determine who is still connected to it. The authentication module then replies with an acknowledgement in exchange.

* **intervalSecs** is the number of seconds to wait between sending one heartbeat message and the next one. This number is sent from the user client's connection to the authentication module. In the example confih=guration on this page, the heartbeat is set to be sent every 30 seconds. Default: null.

#### sessionTimeoutMins
This specifies the time to wait before timing out an idle session with a user client. A user client may very well be answering heartbeats but at the same time being idle (i.e. not using the platform). This timeout represents the number of minutes a user needs to be idle to be logged out of the platform. Default: 30.

#### expiryCheckMins
This represents the time interval (in minutes) used to check for idle sessions in the system. Default: 5.

#### passwordRetry
This has two options:
- **maxAttempts** defines the maximum number of attempts allowed if a user enters a wrong password. 
- **waitTimeMins** specifies the time to wait when the maximum number of incorrect attempts is reached. Default: maxAttempts="3" and waitTimeMins="5".

#### maxSimultaneousUserLogins
This defines the maximum number of active sessions any one user can maintain. Once this limit has been reached, then the user cannot login again until another session has been logged out. If the specified value is zero, is not defined or is not a positive integer, then any number of sessions is permitted.

#### loginAckFields
This is an optional xml block that enables you to define additional values to be sent back to the client as part of the LOGIN_ACK message. It follows a classic *join* xml definition similar to the ones used in [request server](/creating-applications/defining-your-application/user-interface/request-servers/request-servers/) and [data server](/creating-applications/defining-your-application/user-interface/data-servers/data-servers/) modules.

#### mfa
This is a set of parameters that enable you to configure Multi-factor Authentication (MFA).
* **codePeriodSeconds** How long a Time-based One-time Password (TOTP) remains valid. Default: 30.
* **codePeriodDiscrepancy** Discrepancy to the above allowed. 1 means a block of each codePeriodSeconds either side of the time window. Default: 1.
* **codeDigits** Number of digits used in the TOTP. Default: 6.
* **hashingAlgorithm** Choice of Hashing Algorithm: SHA1, SHA256 or SHA512. Default: SHA1.
* **issuer** A reference to the Organsition or Entity issuing the MFA. Default: Genesis.
* **label** A label, typcally an email address of the issuing Entity or Organisation. Default: genesis.global.
* **confirmWaitPeriodSecs** The period of time before a secret has to be confirmed. Default: 300.
* **secretEncryptKey** If present, the Secrets will be encrypted in the database. Default: null.
* **usernameTableLookUpSalt** If present, the username will be hashed using the configured key in the database. Default: null.


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

## Message flows

Security messages can be split into three categories.
- Pre-authentication
- Authentication
- Post-authentication

All requests below are capable of returning an error with a code of INTERNAL_ERROR, which will be used as a last resort.

### Pre-authentication
Pre-authentication messages can be sent by a client without the user being logged in
#### Login preferences
You need make sure that any connecting client knows the types of functionality that you have configured on the security module. For example, you could offer the client two ways of resetting user passwords: either via an administrator or by sending an email.  This choice can affect how the login dialog is displayed, so it is vital that the connecting client knws this before any user logs in.
Currently, this is the only preference published.
##### Request
    MESSAGE_TYPE = EVENT_LOGIN_PREFS
##### Response
    MESSAGE_TYPE = EVENT_LOGIN_PREFS_ACK
        DETAILS.PASSWORD_RESET_TYPE = ADMIN/EMAIL
### Authentication
Once you have a list of preferences, you can show the correct login dialog and let the user make a login attempt.  The password is provided in plain text, as it is expected you will secure the connection using TLS.
#### Login
##### Request

    MESSAGE_TYPE = EVENT_LOGIN_AUTH
       DETAILS.USER_NAME = JohnDoe
       DETAILS.PASSWORD = Password123

##### Response
If successful:

    MESSAGE_TYPE = EVENT_LOGIN_AUTH_ACK
        DETAILS.SYSTEM.DATE = 2014-06-18 12:27:01
        DETAILS.HEARTBEAT_INTERVAL_SECS = 30
            DETAILS.SYSTEM.PRODUCT[0].NAME = SBL
            DETAILS.SYSTEM.PRODUCT[0].VERSION = 1.0.0-RELEASE
            DETAILS.SYSTEM.PRODUCT[1].NAME = AUTH
            DETAILS.SYSTEM.PRODUCT[1].VERSION = 1.0.1.RELEASE

If there is a problem, the server will return the standard error set with CODE/TEXT details and the error code LOGIN_AUTH_NACK.  The following error codes can be provided:

- UNKNOWN_ACCOUNT - User is unknown
- INCORRECT_CREDENTIALS - User/password combination is invalid
- LOCKED_ACCOUNT - Account is locked and needs to be re-activated by administrator
- PASSWORD_EXPIRED - Password must be changed
- LOGIN_FAIL - Generic error code

#### Password change
If the response is PASSWORD_EXPIRED, then the GUI can allow the user to change the password, provided they know their existing password.
##### Request
    MESSAGE_TYPE = EVENT_CHANGE_USER_PASSWORD
        DETAILS.USER_NAME = JohnDoe
        DETAILS.OLD_PASSWORD = Password123
        DETAILS.NEW_PASSWORD = Password456
##### Response
If successful:

    MESSAGE_TYPE = EVENT_CHANGE_USER_PASSWORD_ACK
If there's a problem, you will receive a standard error set with type
- CHANGE_USER_PASSWORD_NACK.  The error codes that can be returned are currently:
- TOO_SHORT - Password length too short
- TOO_LONG - Password length too long
- INSUFFICIENT_CHARACTERS - Covers a few cases so text field may be required, used for things like no digits provided when 1 digit is required.
- ILLEGAL_MATCH - Covers a few cases so text field may be required, used for things like repeating characters in password
- ILLEGAL_WHITESPACE - If password contains white space
- INSUFFICIENT_CHARACTERISTICS - May be provided if you have configured passwords to be successful if only 2 of 5 strength checks pass.  Should be provided alongside "real" error codes.
- ILLEGAL_SEQUENCE - Numerical/alphabetical sequence detected

#### Reset password
This can only be called by an administrator; it simply specifies a user name and sets the password to blank.
##### Request
    MESSAGE_TYPE = EVENT_RESET_USER_PASSWORD
        DETAILS.USER_NAME = JohnDoe
##### Response
    MESSAGE_TYPE = EVENT_RESET_USER_PASSWORD_ACK
### Post-authentication
Once the user has been authenticated, the server expects heartbeat messages, as defined in the interval setting on the ACK message.  If the GUI misses a configurable number of heartbeats, the session will be expired.  In response to a heartbeat, the GUI will receive a list of available services and their details.

These services should be contacted on the hosts in the order they are defined in the list.  The ordering may change if the server implements a load-balancing strategy.  Existing connections can simply ignore the ordering changes, but in a failover or reconnection scenario, the ordering should be adhered to.

##### Request

    MESSAGE_TYPE = EVENT_HEARTBEAT
    USER_NAME = JohnDoe
##### Response
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


#### Rights polling
The GUI can receive rights from a process called AUTH_DATASERVER. The view USER_RIGHTS displays all users and codes.  A logged-in user should automatically set the Filter expression to be USER_NAME=='xxx' to receive push updates to user privileges.

#### Entity management
In the Genesis LCNC Platform, there are profiles, users and rights.  A profile is a group of users, which can be permissioned.  For example, you could have a SALES_TRADER group in which all users must have the same permissions.  In all cases where you specify either a right for a user/profile, or a user in a profile, the event represents what you want the entity to look like; i.e. if you amend a profile and don't supply a user that previously was part of that profile, then that user will be removed from that profile on the server.

Note the following:

* 2-phase validation is not curren;y supported
* meta data is not supported on the following transactions.
User/profile STATUS field can be ENABLED/DISABLED/PASSWORD_EXPIRED/PASSWORD_RESET.
PASSWORD_EXPIRED should prompt the user to enter a new password.
PASSWORD_RESET should do the same but the server expects a blank "current password" field.

#### Insert profile
##### Request

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
##### Response
    MESSAGE_TYPE = EVENT_INSERT_PROFILE_ACK
#### Amend Profile
##### Request
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
##### Response
    MESSAGE_TYPE = EVENT_AMEND_PROFILE_ACK
#### Delete Profile
##### Request
    MESSAGE_TYPE = EVENT_DELETE_PROFILE
    USER_NAME = JohnDoe
        DETAILS.NAME = SALES_TRADERS
##### Response
    MESSAGE_TYPE = EVENT_DELETE_PROFILE_ACK
#### Insert User
##### Request
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
##### Response
    MESSAGE_TYPE = EVENT_INSERT_USER_ACK
#### Amend User
##### Request
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
##### Response
    MESSAGE_TYPE = EVENT_AMEND_USER_ACK
#### Delete User
##### Request
    MESSAGE_TYPE = EVENT_DELETE_USER
    USER_NAME = JohnDoe
        DETAILS.USER_NAME = james
##### Response
    MESSAGE_TYPE = EVENT_DELETE_USER_ACK

## Single Sign On (SSO)
You can read about SSO [here](/creating-applications/defining-your-application/access-control/sso/).