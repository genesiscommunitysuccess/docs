---
title: 'Access control - introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [server, access control, introduction]
tags:
  - server
  - access control
  - introduction
---


The Genesis low-code platform has a collection of access control mechanisms to ensure that:

- only authenticated users can have access to your application
- within the application, users have access to specific data and functions, which is controlled dynamically.

The platform can use a variety of authentication functions, including Single Sign-On (SSO) authentication, username and password authentication, and Multi-factor authentication.

The password authentication can be configured to use an internal store of users, LDAP to communicate with an external service, or a combination of both.

For more information about LDAP, see [Wikipedia](https://en.wikipedia.org/wiki/Lightweight_Directory_Access_Protocol).

Once a user has been authenticated, the authorisation systems allow for a user's access to be further restricted to particular function and items of data.

This authorisation is performed on a group basis, not on individual users; however, you can have groups with only one member.

