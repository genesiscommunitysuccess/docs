---
title: 'Aerospike'
sidebar_label: 'Aerospike'
id: aerospike
---

Genesis supports [Aerospike](https://aerospike.com/). To connect to Aerospike, use the [system definition items](/server/configuring-runtime/system-definitions/) listed below.

| Setting | Description |
| --- | --- |
| `DbNamespace` | This value must contain the Aerospike namespace you want to use. |
| `DbMode` | This can be one of two values: `VANILLA` for an Aerospike Community installation and `DURABLE_DELETE` if you are using Aerospike Enterprise. |
| `DbHost` | This accepts a host value for the Aerospike server host to connect to. |
| `DbPort` | This sets a port value for the Aerospike server host to connect to. |
| `DbUsername` | This must be the db username. Supports encrypted values. |
| `DbPassword` | This must be the db password. Supports encrypted values. |

Sample configurations[​](/database/database-technology/aerospike/#sample-configurationsdirect-link-to-heading)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### Connection configuration with plain text credentials[​](/database/database-technology/aerospike/#connection-configuration-with-plain-text-credentialsdirect-link-to-heading)

```kotlin
systemDefinition {
    global {
        ...
        item(name = "DbLayer", value = "AEROSPIKE")
        item(name = "DbHost", value = "192.168.10.10")
        item(name = "DbPort", value = "4333")
        item(name = "DbMode", value = "VANILLA")
        item(name = "DbUsername", value = "aerospike_user")
        item(name = "DbPassword", value = "aerospike_password")
        ...
    }
    systems {
        system(name = "DEV") {
            ...
            item(name = "DbNamespace", value = "trades")
            ...
        }
    }
    ...
}
```

### Connection configuration with encrypted credentials[​](/database/database-technology/aerospike/#connection-configuration-with-encrypted-credentialsdirect-link-to-heading)

```kotlin
systemDefinition {
    global {
        ...
        item(name = "DbLayer", value = "AEROSPIKE")
        item(name = "DbHost", value = "192.168.10.10")
        item(name = "DbPort", value = "4333")
        item(name = "DbMode", value = "VANILLA")
        item(name = "DbUsername", value = System.getenv("AEROSPIKE_USERNAME"), encrypted = true)
        item(name = "DbPassword", value = value = System.getenv("AEROSPIKE_PASSWORD"), encrypted = true)
        ...
    }
    systems {
        system(name = "DEV") {
            ...
            item(name = "DbNamespace", value = "trades")
            ...
        }
    }
    ...
}
```

