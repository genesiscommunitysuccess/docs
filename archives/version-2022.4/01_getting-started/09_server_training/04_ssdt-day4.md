---
title: Server Developer Training - Day four
sidebar_label: Day four
sidebar_position: 5
id: 04_ssdt-day4
keywords: [getting started, developer training, server training, day four]
tags:
    - getting started
    - developer training
    - server training
    - day four
---
This day covers:

- [DictionaryBuilder](#dictionarybuilder)
- [Streamer​](#streamer)
- [Streamer client](#streamer-client)

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## DictionaryBuilder

DictionaryBuilder connects to an RDBMS, parses schemas and uses the resulting information to generate a Genesis dictionary. It supports MSSQL and Oracle databases. 

As a script, it reads the source database and generates the appropriate fields, tables and views in Genesis format. These are stored in three files: 

- **-fields-dictionary.kts**
- **-tables-dictionary.kts**
- **-view-dictionary.kts**

The script accepts a series of [arguments](../../../operations/commands/server-commands/#syntax-23) to establish a connection to the database (e.g. user, password, host, etc) and some specific behaviour (e.g. product name, single dictionary file or composed, etc). Sample below.

```shell
DictionaryBuilder -u TAS -p my_password -db TAS -port 1433 -h db2.ad.genesis.global -t mssql -product tas -o dictionary
```

This is what the script does:
- It tries to connect to the RDBMS currently specified in the arguments. 
- It generates Genesis dictionary fields for column names and their types.
- It creates tables with their fields and keys.

There are a few considerations you should be aware of:

- If a column name (e.g. DATE) is found in several tables, and it always has the same type, only one field will be specified in the dictionary. However, if the same column name is found in different tables with different types, a new field will be created for each type, keeping the column name and adding the table name (e.g. CALENDAR) in the following fashion: DATE_IN_CALENDAR. The script will output this event on screen so you can fix the name and/or type it manually later on.
- The types are mapped from [Java types](https://docs.oracle.com/en/java/javase/11/docs/api/java.sql/java/sql/Types.html) to [Genesis dictionary types](../../../database/fields-tables-views/fields/fields-basics/#field-types). Each database can have its own data types, and the JDBC may interpret them differently. For example, in an early test, TIMESTAMP(8) in an Oracle database was interpreted as type OTHER in java.sql.Types. Therefore, this tool is not 100% accurate; you must check the results for correctness.
- If there is no mapping available for the java.sql.Type retrieved by the column metadata query, it will be mapped by default to the Genesis dictionary type STRING. This event will be shown on standard output too, so you can know that there is an uncommon type that you should take care of.
- Every time a table is successfully parsed, the script will give feedback: TABLE USERS complete.
- Views are not parsed.

Primary keys will be parsed as primary keys in Genesis, whether they are single-column-based or multiple-column-based. Only unique indexes will be parsed as secondary keys. There is no concept of foreign keys in Genesis, so these are ignored. Strings parsed in lower-camel-case format (camelCase) will be transformed to upper-underscore format (UPPER_UNDERSCORE). Further details and type mapping are available [here](../../../operations/commands/server-commands/#type-mapping).

### Exercise 4.1 Running DictionaryBuilder from a local database

:::info ESTIMATED TIME
25 mins
:::

From a local database available, let's create the product *ref_data_app*. All the files we create will start with that name. Then, run `DictionaryBuilder` using a instance in which the platform is installed.

After the run, you should check these files and adjust them to suit your application. For example, look inside the **fields-dictionary.kts** file to see if the field definitions are correct.


:::tip
The command should like this.

```shell
DictionaryBuilder -t MSSQL -U admin -P beONneON*74 -p 1433 -H ref-data-rdb.clatr30sknco.eu-west-2.rds.amazonaws.com -d tradingapp --product ref_data_app -o ref_data_app/ -i 200 --tables alt_counterparty_id,alt_instrument_id,counterparty,instrument
```

Note that we specified the names of the four source tables in the --tables argument of the command. So you could include just a subset of your source database if you wish.

The `dictionaryBuilder` script generates the **fields-dictionary.kts** and **tables-dictionary.kts** files for the data model.
:::

## Streamer​

[Streamer](../../../server/integration/gateways-and-streamers/streamer/) and [Streamer-Client](../../../server/integration/gateways-and-streamers/streamer-client/) components are available to allow the application to route messages. Streamer, representing the Server part, listens to a table or view, and streams data out to streamer clients. In almost all cases, the table or view must be an audit table. It covers both inbound and outbound messages.

### Creating a Streamer

To create a [Streamer](../../../server/integration/gateways-and-streamers/streamer/):

1. Add the `genesis-pal-streamer` dependency in your *{applicationName}-script-config\build.gradle.kts" file. In this training our file is **alpha-script-config\build.gradle.kts**:

```kotlin {3}
dependencies {
    ...
    api("global.genesis:genesis-pal-streamer")
    ...
}

description = "alpha-script-config"
```

2. Create a Kotlin script file named {applicationName}-streamer.kts inside **{applicationName}-script-config/src/main/resources/scripts** folder. Add the following information:
    * A stream name
    * A GPAL index reference for a unique index with a single LONG field, this could refer to a table index or a view index.

The simplest Streamer definition is:
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP)  
}
```

This example creates a stream called `ORDER_OUT`, based on the `ORDERS_OUT` table (or view). The data will be streamed, ordered by timestamp.


3. Add the process configuration for the Streamer to the _applicationName_**-processes.xml** file. In this training our file is **alpha-processes.xml**:

```xml {3-10}
<processes>
    ...
    <process name="ALPHA_STREAMER">
        <start>true</start>
        <options>-Xmx128m -DXSD_VALIDATE=false</options>
        <module>genesis-pal-streamer</module>
        <package>global.genesis.streamer.pal</package>
        <script>alpha-streamer.kts</script>
        <language>pal</language>
    </process>
</processes>
```

4. Next, add the service definition to the {applicationName}-service-definitions.xml file. In this training our file is **alpha-service-definitions.xml**:

```xml {3}
<configuration>
    ...
    <service host="localhost" name="ALPHA_STREAMER" port="11006"/>
</configuration>
```

### Parameters
You can also specify the following optional parameters in a stream block:

`batchSize` - default value 100

`logoffTimeout` - default value 5000

`maxLogons` - default value 1

### Transforming the stream
You can define the following blocks to transform the stream:
* where
* fields
* toGenesisSet

**Where**

Using where, the stream can be filtered. It is available in two versions: one that has the streamed row as a parameter, and one that also has the logon message.

Here, we only stream orders with a quantity greater than 1,000.
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP) {
        where { ordersOut ->
            ordersOut.quantity > 1_000
        }
    }
}
```

In this example, we only stream orders with a quantity greater than 1,000 and where the logon message has provided a secret key.
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP) {
        where { ordersOut, logonMessage ->
            ordersOut.quantity > 1_000 && logonMessage.getString("KEY") == "SECRET"
        }
    }
}
```

**Fields**
The fields tag enables you to transform the output in a similar way to views, data server and req rep definitions. For example, here we output three fields:
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP) {
        fields {
            ORDERS_OUT.CLIENT_ID
            ORDERS_OUT.QUANTITY withPrefix "ORDER"
            ORDERS_OUT.CLIENT_ID withAlias "CLIENT"
        }
    }
}
```

**toGenesisSet**
This enables you to create a custom GenesisSet from the entity:
```kotlin
streams {
    stream("ORDERS_OUT", ORDER_OUT.BY_TIMESTAMP) {
        toGenesisSet { ordersOut ->
            genesisSet {
                "ORDER_QUANTITY" with ordersOut.quantity
                "ORDER" with ordersOut.orderId
            }
        }
    }
}
```

## Streamer Client

[Streamer-Client](../../../server/integration/gateways-and-streamers/streamer-client/) receives data from a streamer server. When data is received, it transforms into the relevant format. It covers both inbound and outbound messages.

Let's see how to create a Streamer Client. It also looks at the syntax of the two types of Streamer Client that are available:

* table or view entity
* GenesisSet

### Creating a Streamer Client
To create a [Streamer-Client](../../../server/integration/gateways-and-streamers/streamer-client/):

1. Add the genesis-pal-streamerclient` dependency in your *{applicationName}-script-config\build.gradle.kts" file. In this training our file is **alpha-script-config\build.gradle.kts**:

```kotlin {3}
dependencies {
    ...
    api("global.genesis:genesis-pal-streamerclient")
    ...
}

description = "alpha-script-config"
```

2. Create a Kotlin script file named {applicationName}-streamer-client.kts inside **{applicationName}-script-config/src/main/resources/scripts** folder, and add the following details:
    * A streamer client name
    * A streamer data source process and stream name
    * One or more `onMessage` tags

The simplest Streamer-Client definition is:
```kotlin
streamerClients {
    streamerClient(clientName = "QUOTE_RESPONSE") {
        dataSource(processName = "TRADING_APP-STREAMER", sourceName = "ORDERS_OUT")
            onMessage {
                send("QUOTE_EVENT_HANDLER", "QUOTE_UPDATE_EVENT")
            }
    }
}
```

This example takes a message from a Streamer and sends it to `QUOTE_EVENT_HANDLER` as a `QUOTE_UPDATE_EVENT`. 

In the `onMessage` block, you can set the Streamer to request only specific messages. It has two operations: 
**where** enables you to make the action conditional.
```kotlin
where { quotes ->
    quotes.price > BigDecimal.ZERO
}
```
**send** directs and optionally formats the outgoing message.
 ```kotlin
send(targetProcess = "QUOTE_HANDLER", messageType = "QUOTE_EVENT")
```

There are two types of Streamer Client: 

- *Table or View entity Streamer Client* 
- * GenesisSet Streamer Client*. 

You can also set in a Streamer Client, such as `isReplayable`,  `eventHandlerBuffer`, `sentWarningRange`, and `receiveWarningRange`. Further information can be found [here](../../../server/integration/gateways-and-streamers/streamer-client/#properties).

In addition, for entity streamers, you can format the message in the same way as you would define the output of a view, Data Server or Request Server. Use `sendFormatted`:

```kotlin
sendFormatted("QUOTE_HANDLER", "QUOTE_EVENT") {
    QUOTES.SYMBOL
    QUOTES.PRICE
}
```


3. Add the configuration for the Streamer Client process to the {applicationName}-processes.xml file. In this training our file is **alpha-processes.xml**:

```xml {3-10}
<processes>
    ...
    <process name="ALPHA_STREAMER_CLIENT">
        <start>true</start>
        <options>-Xmx128m -DXSD_VALIDATE=false</options>
        <module>genesis-pal-streamerclient</module>
        <package>global.genesis.streamerclient.pal</package>
        <script>alpha-streamer-client.kts</script>
        <language>pal</language>
    </process>
</processes>
```

4. Next, add the service definition to the {applicationName}-service-definitions.xml file. In this training our file is **alpha-service-definitions.xml**:

```xml {3}
<configuration>
    ...
    <service host="localhost" name="ALPHA_STREAMER_CLIENT" port="11007"/>
</configuration>
```

## Exercise 4.2 Creating a Streamer solution to control the TRADE_AUDIT table

:::info ESTIMATED TIME
45 mins
:::

We are going to double-check if a record in the *TRADE* table has been audited. To do this, create a boolean field in the *TRADE* table called **BEEN_AUDITED**. Then, create a Streamer solution (Server and Client) to update **BEEN_AUDITED** as soon as the record start the auditing process. You will also have to create an event in the EVENT_HANDLER to be called by the Streamer Client to update **BEEN_AUDITED** to true. 

Create a Streamer called TRADE_AUDIT_STREAM, based on the *TRADE_AUDIT* table ordered by timestamp. The Streamer Client should call the new EVENT to update the *TRADE* field **BEEN_AUDITED**.

Remember that the TRADE table has an [auditing process](../../../getting-started/developer-training/training-content-day4/#adding-audit-to-table-dictionary) that keeps tracking changes in the *TRADE_AUDIT* table. However, the auditing does not have a Timestamp Index yet, so we need to add the attribute `tsKey` as below:

```kotlin {2}
tables {
    table (name = "TRADE", id = 2000, audit = details(id = 2100, sequence = "TR", tsKey = true)) {
        ...
    }
    ...
}
```

:::tip
Don't forget to change the fields and tables files, as well as run the tasks to [generateFields](../../../getting-started/developer-training/training-content-day1/#generatefields) and [generateDao](../../../getting-started/developer-training/training-content-day1/#generatedao).
:::


