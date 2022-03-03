---
title: System definitions
sidebar_label: System definitions
sidebar_position: 1
id: system-definitions

---
# System definitions

The system-definition file **genesis-system-definition.kts** is the basis of all configurations, scripts, data model, etc. This section explains all the different items that are contained in the file.

Here is an example of a **genesis-system-definition.kts** file for an application:

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

## Items defined

As you can see from the example, you can define items at global, system and host level.
* **Global**: These properties will be available to all systems. 
* **System**: These properties contain information about a particular system and can have a free text field. Each system is associated with a host or hosts. The content should specify the type of environment the system is running in. 
Local values can be specified in the this block. **These values override the global values**.
* **Host**: In this section you can define properties of host or hosts (if running in a cluster environment). Host block can exist under system section as showed in above example.
  The host name defines what environment we're running in. By default, only one host will be used and change its value to current machine hostname

**MqLayer**: This setting defines the type of Message queue technology. You can choose between `ZeroMQ` and `Aeron` message queues

**DbLayer**: Default value is set to FDB. If you want to use PostgreSQL or Aerospike then you need to change value of DbHost item

**DbHost**: Contains information of the hostname/JDBC connection string pointing to local database. For example:


```kotlin
item(name = “DbHost”, value = “jdbc:postgresql://localhost:5432/postgres?user=postgres&password=Password5432”)
```

**Database username and password encryption**
You can add an encrypted username and password for the database system.
Run the command `encryptUserPassWithKey`, which will ask you to supply the plain username, password and Genesis Key. Genesis Key is 32 characters long.
This will generate encrypted username and password, which can then be added into a system definition file. You can directly add the encrypted values or you can embed these fields into the local system environment variables and refer to them as follows:

```kotlin
item(name = "DbUsername", value = System.getenv("DBUSERNAME"), encrypted = true)
item(name = "DbPassword", value = System.getenv("DBPASSWORD"), encrypted = true)
item(name = "GenesisKey", value = System.getenv("GENESIS_KEY"))
```

**DictionarySource**: This setting defines where you want to store dictionary schema. You can choose between DB dictionary source and FILE dictionary source using this setting. Accepted values `DB` and `FILE`. DB dictionary source is preferred because if you are running a cluster all nodes will refer to the same dictionary. FILE dictionary source has the problem of being only available on each node

**AliasSource**: This setting defines where you want to store dictionary alias schema. The alias schema maps aliases to fields and to tables, and it is updated every time we change the data schema. You can choose between DB alias source and FILE alias source using this setting. Accepted values `DB` and `FILE`. DB alias source is preferred because if you are running a cluster all nodes will refer to the same alias dictionary. FILE alias source has the problem of being only available on each node

**MetricsEnabled**: Default value is false. For more information, go to the page on [Metrics](/managing-applications/monitor/metrics/metrics/).

**ZeroMQProxyInboundPort** and **ZeroMQProxyOutboundPort** are required for the processes that use GENESIS_CLUSTER as a proxy for the update queue (eg.: DbMon, PurgeTables, etc...)

**DbMode**: This setting is only needed if you use the Aerospike database. Accepted values are "VANILLA" and "DURABLE_DELETE". Default is "VANILLA". (Note: Durable Delete requires Aerospike Server Enterprise Edition 3.10+)

**ResourcePollerTimeout**: This setting controls how often the genesis daemon process keeps the processes and their metadata up to date.

**ReqRepTimeout**: This setting contains the default timeout for the request server resources in the system.

**MetadataChronicleMapAverageKeySizeBytes**, **MetadataChronicleMapAverageValueSizeBytes**, **MetadataChronicleMapEntriesCount**: These are the settings for chronicle map and are related to the way processes store their own metadata resources inside /runtime/proc_metadata

**DaemonServerPort**: This defines the port for daemon process, daemon process is the background process, which collects information about micro-services

**JVM_OPTIONS**: This defines common JVM options to be applied to all processes defined in the environment.

**DbNamespace**: This item defines different things,depending on the databases in use. 
* For an FDB database, it is  used when creating internal directory layers.
* For an Aerospike database it will represent its namespace.
* For an SQL database, you can ignore this item.

**ClusterPort**: This setting specifies the port used by GENESIS_CLUSTER to establish cluster membership between cluster nodes.

**Location**: This item contains a 2-character value used to generate **standard ID** for a given entity. For example, if a Location item defined as "LO" and entity TRADE has a field called TRADE_ID defined with the sequence "TR",
then the generated ID will be `000000000001TRLO1` where "LO" represents Location string.

**LogFramework**: Contains name of the logging framework. Supported framework: LOG4J2

**LogFrameworkConfig**: Contains name of the log framework configuration file.

If you want to enable SSL for your process communication, this is done in the [service definition](/creating-applications/configure-runtime/service-definitions/#enable-ssl-for-processes).