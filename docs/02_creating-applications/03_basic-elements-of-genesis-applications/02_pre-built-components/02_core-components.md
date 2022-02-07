---
title: 'Core components'
sidebar_label: 'Core components'
sidebar_position: 2
id: core-components
---

These core components are part of the Genesis LCNC Platform. They run automatically, and take away the need for much of the low-level programming that is essential to creating financial markets applications. It's there for you already, so you can concentrate on developing the essential value that is specific to your application.

| Name| Description|
|------------------------------------|--------------|
| [Auth](/creating-applications/defining-your-application/access-control/authentic-over/)            | Industrial-strength authentication handler. Integrations with LDAP, SSO and more        |
| [Perms](/creating-applications/defining-your-application/access-control/authentic-over/#generic-permissions)                    | Enforces permissions and entitlements application-wide|
| [Cluster](/managing-applications/operate/clustering/clusters/)                             |  Manages node communication for high-availability and horizontal scaling         |
| [Router](/creating-applications/configure-runtime/genesis-router/)                               | UI websocket/http connectivity handler and proxy to underlying component/service            | 
| Connect                           | Server connectivity via websocket/http communications            |
| [Database API](/reference/developer/api/entity-db/)                               | High-performance persistence service. Abstracts away underlying database technology for consistent API usage          | 
| Orchestration | Inter-process communication of database record updates           | 


