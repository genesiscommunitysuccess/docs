---
id: genesis-6.0
title: 'Genesis-6.0'
sidebar_label: 'Genesis-6.0'
sidebar_position: 6

---

# Genesis 6.0

## 6.0.2

- Refactoring and cleaning
- Enhancement of deployment plugin to allow for SendIt with -t and -f options

## 6.0.1

### Highlights

#### Implemented service affinity mechanism in Consul to ensure we can prefer routing/failover to services within the same group (e.g. AZ).

You can now provide a system definition service item called "ClusterServiceAffinityGroup” with a fixed value to ensure that the new Consul based service discovery mechanism prefers connecting to services which were registered with that value as well.

A very simplistic example would be to deploy groups of services to different availability zones in AWS and ensure the “ClusterServiceAffinityGroup” value is populated using an environment variable which contains the name of the availability zone itself. So all services in AZ1 could contain an environment variable with the “AZ1” value and all services in AZ2 would contain an environment variable with the “AZ2” value.

### Bugfixes

- genesis-camel processes can’t start when not running under “ClusterMode” = “CONSUL”.
- Fixed issue happening in backward joins logic when a child has multiple parents and the parent is deleted.
- Fix “withEntity” code generation for field nullability in views.
- Allow view entities as input for event handlers.
- Support Kclass serialization in views.
- Stop “genesisInstall” task from also running “startServer” in genesis deploy plugin.