---
title: 'Core components'
sidebar_label: 'Core components'
sidebar_position: 20
id: core-components
---

These core components are part of the Genesis LCNC Platform. They run automatically, and take away the need for much of the low-level programming that is essential to creating financial markets applications. It's there for you already, so you can concentrate on developing the essential value that is specific to your application.

| Name| Description|
|------------------------------------|--------------|
| [Auth](/platform-reference/authentication-and-authorisation/authentication/)            | Industrial-strength authentication handler. Integrations with LDAP, SSO and more        |
| [Perms](/platform-reference/authentication-and-authorisation/authorisation-over/#generic-permissions)                    | Enforces permissions and entitlements application-wide|
| [Cluster](/platform-reference/infrastructure/clusters/)                             |  Manages node communication for high-availability and horizontal scaling         |
| [Router](/platform-reference/essential-information/genesis-router/)                               | UI websocket/http connectivity handler and proxy to underlying component/service            | 
| Connect                           | Server connectivity via websocket/http communications            |
| [Database API](/platform-reference/data-model/entity-db/)                               | High-performance persistence service. Abstracts away underlying database technology for consistent API usage          | 
| Orchestration | Inter-process communication of database record updates           | 


