---
title: 'Update Queue - MQTT'
sidebar_label: 'MQTT'
id: mqtt
keywords: [operations, update queue, mqtt]
tags:
    - operations
    - update queue
    - mqtt
---

The Genesis low-code platform provides the option to use an external MQTT broker such as [Mosquitto](https://mosquitto.org/) or [RabbitMQ](https://www.rabbitmq.com/) as the transport mechanism for the Genesis update queue.

Using a centralised external broker is highly recommended for complex, large or dynamically scaled clusters, as it reduces the complexity and overhead of peer-to-peer connectivity.

### MQTT Configuration Options

To use MQTT in your Genesis application, you will need to set the `MqLayer` in the system definition.

```kotlin {title="genesis-system-definition.kts"}
systemDefinition {
    global {
        ...
        item(name = "MqLayer", value = "MQTT")
        ...
    }
}
```

Other config values that are available are listed below:

| Config Item | Description | Default |
| --- | --- | --- |
| `MqttBrokerUrl` | The URL of the MQTT broker | `tcp://localhost:1883` |
| `MqttQos` | The MQTT Quality of Service level <br/><br/>At most once (0) <br/>At least once (1) <br/>Exactly once (2) | `2` |
| `MqttClientId` | A template pattern for the client ID using HOSTNAME and PROCESS_NAME | `genesis/{{HOSTNAME}}/{{PROCESS_NAME}}` |
| `MqttQueueNamePattern` | A template pattern for the queue name using TABLE_NAME | `genesis/database/{{TABLE_NAME}}` |
| `MqttThreadPoolSize` | Number of threads to use  | `4` |
| `MqttUsername` | MQTT Username | `null` |
| `MqttPassword` | MQTT Password | `null` |
| `MqttTlsVerify` | Setting to `false` ignores certificate verification. This should only be set to `false` in a dev or test environment. | `true` |