---
title: 'Core components'
sidebar_label: 'Core components'
sidebar_position: 2
id: core-components
---

These core components are part of the Genesis low-code platform. They run automatically, and take away the need for much of the low-level programming that is essential to creating financial markets applications. It's there for you already, so you can concentrate on developing the essential value that is specific to your application.

| Name                                                                                                         | Category       | Description                                                                                                             |
|--------------------------------------------------------------------------------------------------------------|----------------|-------------------------------------------------------------------------------------------------------------------------|
| [Auth Manager](/creating-applications/defining-your-application/access-control/authentic-over/)              | Access control | Industrial-strength authentication handler, with integrations to LDAP, SSO and more                                     |
| [Database API](/reference/developer/api/database/overview/)                                                  | Access control | High-performance persistence service providing an abstracted interface to Postgres, MSSQL, FoundationDB or Aerospike databases |
| [Perms](/creating-applications/defining-your-application/access-control/authentic-over/#generic-permissions) | Access control | Enforces permissions and entitlements to data visibility & events, application-wide                                     |
| [Cluster](/managing-applications/operate/clustering/clusters/)                                               | Orchestration  | Manages node communication for high availability and horizontal scaling in clustered applications                       |
| Connect                                                                                                      | Orchestration  | Front-end-to-server connectivity via high-performance, secure Websocket / http communications                           |
| [Orchestration](/managing-applications/operate/inter-process-messages/internal-messaging/)                   | Orchestration  | Inter-process communication of database record updates                                                                  |
| [Router](/creating-applications/configure-runtime/genesis-router/)                                           | Orchestration  | UI connectivity and load balancing to server services                                                                   |
