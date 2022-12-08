---
title: 'Update Queue - ZeroMQ'
sidebar_label: 'ZeroMQ'
id: zeromq
keywords: [operations, update queue, zeromq]
tags:
    - operations
    - update queue
    - zeromq
---

The Genesis low-code platform uses ZeroMQ out of the box to provide a zero-configuration decentralised peer-to-peer update queue.

It works by the GENESIS_CLUSTER process knowing (via [clustering](../03_clustering/01_overview.md)) all nodes within the cluster to be able to broadcast and consume from.

ZeroMQ is best suited for fixed-sized deployments.

Using [MQTT](03_mqtt.md) is recommended for setups that require dynamic scaling.

### Proxy Mode
All processes have a ZeroMQ port, which is their process port + 10000. Additionally, GENESIS_CLUSTER has two additional ports (`ZeroMQProxyInboundPort` and `ZeroMQProxyOutboundPort`) to act as proxy ports. This is necessary so that:

 - Scripts can publish to ZeroMQ without having an allocated port
 - To run in ZeroMQ “proxy” mode

The platform can be configured to run with or without proxy mode, and this setting applies to all processes.

When running under non-proxy mode, each process will bind to its ZeroMQ port and all other processes need to connect to that port to receive updates. This mode isn't recommended for large apps, as 10 microservices will have 10 publishers which will give us 100 connections.

When in non-proxy mode, all processes need to connect to the GENESIS_CLUSTER proxy ports, as scripts or other non-genesis processes could be publishing updates through those.

When running under proxy mode, each process will connect to the `ZeroMQProxyInboundPort` to publish data and subscribe to the `ZeroMQProxyOutboundPort` to receive data, therefore reducing the total number of connections.

### ZeroMQ Configuration Options

ZeroMQ is the default MQ system in Genesis, but it can be set explicitly with the following config:

```kotlin {title="genesis-system-definition.kts"}
systemDefinition {
    global {
        ...
        item(name = "MqLayer", value = "ZeroMQ")
        ...
    }
}
```

Other config values that are available are listed below:

| Config Item | Description | Default |
| --- | --- | --- |
| `ZeroMQProxyInboundPort` (required) | The port used for ZeroMQ inbound connections | - |
| `ZeroMQProxyOutboundPort` (required) | The port used for ZeroMQ outbound connections | - |
| `ZeroMQProxyModeEnabled` | Enable [proxy mode](#proxy-mode) (reccomended for large apps) | `false` |
| `ZeroMQProxyUnicastRelayEnabled` | Creates a point to point connection between GENESIS_CLUSTER processes for all the nodes in the cluster. This connection will be used to send any local update queue events to the remote nodes in the cluster in order to ensure every node has access to all the updates | `false` |

:::important
If you are using a cloud environment that does not allow multicast traffic (e.g. AWS), then  `ZeroMQProxyModeEnabled` and `ZeroMQProxyUnicastRelayEnabled` need to be set to `true`
:::