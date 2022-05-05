---
sidebar_position: 4
title: Aerospike
sidebar_label: Aerospike
id: aerospike

---



## System definitions
For the Aerospike layer, take note of the following system definition items in the [**genesis-system-definitions.kts**](/creating-applications/configure-runtime/system-definitions/) file:


| Setting   | Description   |  
|----------|-------------|
| `DbNamespace` | This value must contain the Aerospike namespace you want to use. |
| `DbMode` | This can be one of two values: "VANILLA" for an Aerospike Community installation and "DURABLE_DELETE" if you are using Aerospike Enterprise. |  
| `DbHost` | This accepts a host value for the Aerospike server host to connect to.|
|`DbPort`.| This sets a port value for the Aerospike server host to connect to. |  
| `DbUsername` | This must be the db username. |  
| `DbPassword` | This must be the db password.|

