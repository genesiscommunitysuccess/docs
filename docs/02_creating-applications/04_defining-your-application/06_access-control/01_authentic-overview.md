---
title: Authentication overview
sidebar_label: Authentication overview
sidebar_position: 1
id: authentic-over

---


There are three types of authentication that you can specify with the Genesis LCNC Platform: INTERNAL, LDAP and HYBRID.

To specify which one to use, just edit the application's **auth-preferences.xml** file and change the `type` attribute of the `authentication` field. For example:

```xml
<authentication type="INTERNAL"></authentication>
```

## Internal

Internal authentication uses hash values stored in the database to authenticate users. It checks user credentials against an internal database table. Internal authentication provides the following features:

- User accounts can be locked
- Passwords can be set to expire
- Users can reset or change their password (assuming they can login first)

Internal authentication is the default authentication behaviour if you don't specify a type in **auth-preferences.xml**.

### LDAP

LDAP authentication can be used within the AUTH environment as a basic login.

However, if you specify this, you lose control of the internal authentication functionality. This is becuase the authentication relies on an external party that cannot be operated from Genesis. As a direct consequence, requests to change/reset password won't be accepted.

For LDAP authentication, a username **must** exist inside the internal records of the application. To do this, you must create a user entry inside the USER database table for every LDAP user you want to give access to. If you do not do this, all LDAP users could be authenticated, which is unlikely to meet yor security requirements. There is no password checking against the internal records, and the authentication will rely solely on LDAP.

To set up LDAP authentication, the configuration file needs extra parameters:

**url** represents the LDAP server hostname. Default: localhost.

**port** defines the LDAP server port to connect to. Default: 389.

**searchBase** defines the location(s) in the directory from which the LDAP search begins. Default: ou=temp,dc=temp

**userPrefix** is an optional prefix you can add to every username received from login requests in your authentication server. Default: empty string.

**bindDn** is an optional distinguished name which acts as a first LDAP login; it is normally required to perform a search. If this field is not specified, no bindings will be used. Default: null

**bindPassword** represents the password associated with the **bindDn** account. Default: null.

**userIdType** defines the attribute to match in the directory search against the provided username. Amongst the most common LDAP implementations, you can find three main ways of configuring user names: 

* using the "uid" attribute
* using the "cn" attribute
* using  the "sAMAccountName" in Windows. 

Default: cn.

The example below shows LDAP authentication specified, with **userIdType** set to *cn** for the search for the user name.
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

## Hybrid

As its name suggests, Hybrid mode is a mix of Internal and LDAP authentication modes, and it checks credentials against both.

First, an internal authentication is performed. If the outcome is successful, another authentication against the LDAP server is performed. The login request is only successful if both authentications are successful.

This enables you to take advantage of all the available functionality of internal mode (locked accounts, expiring passwords, reset/change passwords). However, if passwords are changed or expired, they need to be changed manually in LDAP too, because authentication always happens in both services.

The configuration file takes the same fields as LDAP. You can see this in the example below, where the authentication type has been set to HYBRID.

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

