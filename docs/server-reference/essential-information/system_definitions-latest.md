# System Definitions

System-definition file is the base of all configurations, scripts, data model, etc. Explained below in detail about each item used in system-definition file

## Example of "genesis-system-definition.kts" file

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

## Items defined:

You can define items at global, system and host level
* **Global**: These properties will be available to all systems. 
* **System**: These properties contain information about particular system and can have free text field. Each system is associated to host/hosts. The content should be indicative of the type of environment the system is running in. Local values can be specified in the Items block. Items at system level override the global values.
* **Host**: Under this section you can define properties of host or hosts(if running in cluster environment). Host block can exist under system section as showed in above example.
  The host name defines what environment we're running in. By default, only one host will be used and change its value to current machine hostname

**MqLayer**: This setting defines the type of Message queue technology. You can choose between `ZeroMQ` and `Aeron` message queues

**DbLayer**: Default value is set to FDB. If you want to use PostgreSQL or Aerospike then you need to change value of DbHost item, for more information follow this [link](/getting-started/get-ready-to-develop/database/#changing-to-postgresql-or-aerospike)

**DbHost**: Contains information of hostname/JDBC connection string pointing to local database.
Ex:
```kotlin
item(name = “DbHost”, value = “jdbc:postgresql://localhost:5432/postgres?user=postgres&password=Password5432”)
```

**Database username and password encryption**
You can add encrypted username and password for database system.
Run command `encryptUserPassWithKey` and you will be asked to supply plain username, password and Genesis Key. Genesis Key is 32 character long.
This will generate encrypted username and password, which can then be added into a system definition file. You can directly add the encrypted values or you can embed these fields into the local system environment variables and refer to them as follows:

```kotlin
item(name = "DbUsername", value = System.getenv("DBUSERNAME"), encrypted = true)
item(name = "DbPassword", value = System.getenv("DBPASSWORD"), encrypted = true)
item(name = "GenesisKey", value = System.getenv("GENESIS_KEY"))
```

**DictionarySource**: This setting defines where you want to store dictionary schema. You can choose between DB dictionary source and FILE dictionary source using this setting. Accepted values `DB` and `FILE`. DB dictionary source is preferred because if you are running a cluster all nodes will refer to the same dictionary. FILE dictionary source has the problem of being only available on each node

**AliasSource**: This setting defines where you want to store dictionary alias schema. The alias schema maps aliases to fields and to tables, and it is updated every time we change the data schema. You can choose between DB alias source and FILE alias source using this setting. Accepted values `DB` and `FILE`. DB alias source is preferred because if you are running a cluster all nodes will refer to the same alias dictionary. FILE alias source has the problem of being only available on each node

**MetricsEnabled**: Default value is false. For more information follow this [link](/server-reference/metrics/metrics)

**ZeroMQProxyInboundPort** and **ZeroMQProxyOutboundPort** are required for the processes that use GENESIS_CLUSTER as a proxy for the update queue (eg.: DbMon, PurgeTables, etc...)

**DbMode**: This setting is needed while using Aerospike database only. Accepted values "VANILLA" and "DURABLE_DELETE"

**ResourcePollerTimeout**: This setting controls how often the genesis daemon process keeps the processes and their metadata up to date

**ReqRepTimeout**: This setting contains the default timeout for the req/rep resources in the system

**MetadataChronicleMapAverageKeySizeBytes**, **MetadataChronicleMapAverageValueSizeBytes**, **MetadataChronicleMapEntriesCount**: These are the settings for chronicle map and are are related to the way processes store their own metadata resources inside /runtime/proc_metadata

**DaemonServerPort**: Defines the port for daemon process, daemon process is the background process which collects information about micro-services

**JVM_OPTIONS**: Defines common JVM options to be applied to all processes defined in the environment.

**DbNamespace**: This item defines different things for different databases we use. 
    1. For FDB database it will be used when creating internal directory layers
    2. For Aerospike database it will represent its namespace
    3. For SQL database we can ignore this item

**ClusterPort**: This setting represents the port used by GENESIS_CLUSTER to establish cluster membership between cluster nodes

**Location**: This item contains the value with 2 characters and used to generate **standard ID** for a given entity. Ex: If Location item defined as "LO" and entity TRADE has field called TRADE_ID defined with sequence "TR"
then generated ID will be `000000000001TRLO1` where "LO" represents Location string

**LogFramework**: Contains name of the logging framework. Supported framework: LOG4J2

**LogFrameworkConfig**: Contains name of the log framework configuration file

If you want to enable SSL for your process communication follow this [link](/server-reference/essential-information/service-definitions/#enable-ssl-for-processes)