---
title: 'genesis-system-definitions.kts'
sidebar_label: 'genesis-system-definitions.kts'
id: genesis-system-definitions
---

The system-definition file, **genesis-system-definition.kts**, is the basis of all the configurations, scripts, data models, etc. 

It defines system properties such as:

- the type of Message Queue technology
- the database technology 
- the hostname of the local database
- the database user name and the encrypted password
- whether or not metrics are enabled

The properties can be applied at three different levels:

- the global properties are available to all systems 
- the system properties apply to specific systems; these setting override any similar global settings
- the host properties define the environment that the application is running in


Here is an example of a **genesis-system-definition.kts** file for an application:

- the global properties are defined first (for example, the database technology is FoundationDB)
- the system properties are defined next - in this case, there is only one: DEV
- within DEV, the hosts are defined - in this case, only genesis-serv

```kotlin
package genesis.cfg

systemDefinition {
    global {
        item(name = "MqLayer", value = "ZeroMQ")
        item(name = "DbLayer", value = "FDB")
        item(name = "DictionarySource", value = "DB")
        item(name = "AliasSource", value = "DB")
        item(name = "MetricsEnabled", value = "false")

        item(name = "ZeroMQProxyInboundPort", value = "5001")
        item(name = "ZeroMQProxyOutboundPort", value = "5000")

        item(name = "DbHost", value = "localhost")
        item(name = "DbMode", value = "VANILLA")
        item(name = "GenesisNetProtocol", value = "V2")
        item(name = "ResourcePollerTimeout", value = "5")
        item(name = "ReqRepTimeout", value = "60")
        item(name = "MetadataChronicleMapAverageKeySizeBytes", value = "128")
        item(name = "MetadataChronicleMapAverageValueSizeBytes", value = "1024")
        item(name = "MetadataChronicleMapEntriesCount", value = "512")
        item(name = "DaemonServerPort", value = "4568")
        item(
            name = "JVM_OPTIONS",
            value = "-XX:MaxHeapFreeRatio=70 -XX:MinHeapFreeRatio=30 -XX:+UseG1GC -XX:+UseStringDeduplication -XX:OnOutOfMemoryError=\"handleOutOfMemoryError.sh %p\""
        )
    }

    systems {
        system(name = "DEV") {
            hosts {
                host(name = "genesis-serv")
            }

            item(name = "DbNamespace", value = "genesis")
            item(name = "ClusterPort", value = "6000")
            item(name = "Location", value = "LO")
            item(name = "LogFramework", value = "LOG4J2")
            item(name = "LogFrameworkConfig", value = "log4j2-default.xml")
        }
    }
}
```

Further system-definition information can be found [here](/server/configuring-runtime/system-definitions/).
