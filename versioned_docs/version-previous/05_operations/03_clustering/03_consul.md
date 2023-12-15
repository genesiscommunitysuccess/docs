---
title: 'Operations - Consul Cluster'
sidebar_label: 'Consul Cluster'
id: consul
keywords: [operations, clusters]
tags:
    - database
    - clusters
    - consul
---

The Consul cluster mode uses Hashicorp's Consul for service discovery.

Combining this with the use of an MQTT broker gives you a dynamically scalable Genesis app with automatic failover.

## Prerequisites
### Services
This set-up focuses on the Genesis low-code platform within an HA setup using Hashicorp's Consul for Clustering, which assumes that certain services are already available to Genesis:

 - **A Database** - A database needs to be hosted independently from the platform
 - **A Consul Cluster** - A Consul cluster with an agent on each of the hosts running a Genesis app
 - **An MQTT Broker** - Any message queue broker that supports MQTT, such as Mosquitto or RabbitMQ

:::important
The Genesis low-code platform can run with Consul without MQTT using ZeroMQ.

However, this is not recommended as **MQTT is required for dynamic scaling**.
:::

### Networking
When using Consul mode, all Genesis services within an app need to be able to access all the other Genesis services in the cluster on their defined ports.

The default Genesis services and their ports are:

| Service | Port |
| --- | --- |
| `GENESIS_AUTH_CONSOLIDATOR` | `8005` |
| `GENESIS_AUTH_MANAGER` | `8001` |
| `GENESIS_AUTH_PERMS` | `8003` |
| `GENESIS_CLUSTER` | `9000` |
| `GENESIS_EVALUATOR` | `9015` |
| `GENESIS_ROUTER` | `9017` |

See [Server configuration - service definitions](../../03_server/01_configuring-runtime/04_service-definitions.md) for information on how to set the ports for user-defined services, and how to override the ports dynamically.

The Consul Agents must also be able to access all the services on their defined ports.

## Configuring the app

### Basic configuration
If a Consul agent is running locally to the app on the default port of 8500, then the only config required is:
```kotlin {title="genesis-system-definition.kts"}
systemDefinition {
    global {
        ...
        item(name = "ClusterMode", value = "CONSUL")
        ...
    }
}
```

### Extended configuration
| Item | Description | Default |
| --- | --- | --- |
| `ConsulHostAddress` | IP or hostname of the Consul Agent | `localhost` |
| `ConsulHostPort` | HTTP Port for the Consul Agent | `8500` |
| `ConsulConnectionTimeoutSeconds` | Set the timeout for connecting to the Consul Agent in seconds | `10` |
| `ConsulReadTimeoutSeconds` | Set the timeout for reading from the Consul Agent in seconds | `10` |
| `ConsulWriteTimeoutSeconds` | Set the timeout for writing to the Consul Agent in seconds | `10` |
| `ConsulWatchSeconds` | How long to tell the Consul server to wait for new key/value cache values | `8` |
| `ConsulTtlSeconds` | Timeout for the TTL Consul checks | `15` |
| `ttlPingSeconds` | How often to run the TTL checks and update Consul with the state | `ConsulTtlSeconds` / `2` |
| `deregisterCriticalServiceAfterMins` | Time to wait after a TTL check goes critical before it deregisters the service in minutes | `30` |
| `clusterServiceAffinityGroup` | Group apps for prefered routing. Useful for multi region setups | "" |
| `ConsulServiceNamePattern` | Allows you to template your Consul service names with `{{PROCESS_NAME}}` eg. `my_app_{{PROCESS_NAME}}` | `null` |
| `ConsulNamespaceFormat` | Sets Consul namespace (only used in Consul Enterprise) | `null` |


