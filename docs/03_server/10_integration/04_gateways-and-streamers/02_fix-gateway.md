---
title: 'FIX Gateways and Streamers - FIX Gateway'
sidebar_label: 'FIX Gateway'
id: fix-gateway
keywords: [server, integration, gateways, streamers, fix-xlator, FIX]
tags:
  - server
  - integration
  - gateways
  - streamers
  - fix-xlator
  - FIX
---

This page shows you how to create a Gateway to connect to a remote system using the FIX (Financial Information eXchange) protocol.

## Creating a Gateway
To create a Gateway:

1. Add the process configuration for the Gateway to the _applicationName_**-processes.xml** file. For example:

```xml
<process name="POSITION_FGW">
    <groupId>POSITION</groupId>
    <start>true</start>
    <options>-Xmx128m -DXSD_VALIDATE=false</options>
    <module>fix-eventhandler</module>
    <package>global.genesis.fix.eventhandler</package>
    <script>position-fix-gateway.kts</script>
    <loggingLevel>INFO,DATADUMP_OFF</loggingLevel>
    <description>FIX Drop Copy Gateway</description>
    <language>pal</language>
</process>
```

2. Create a Kotlin script file named **{app-name}-fix-gateway.kts** under **jvm/{app-name}-script-config**.

There are two ways to configure a FIX gateway. 

- **File-driven configuration**
- **database-driven configuration**.

 Each approach has different benefits.

**File-driven configuration**
In order to use file-driven configuration, you must provide a path to a file in the configuration format expected by the QuickFIXJ engine. This is specified using the `quickFixConfig` property:

```kotlin
fix {
    quickFixConfig = GenesisPaths.genesisHome() + "generated/cfg/default-quickfix.cfg"
    disableDatabaseGateways = true
    disableConfigGateways = false
}
```

To see the format of QuickFIXJ and the configuration options, take a look at the [QuickFIXJ config](https://www.quickfixj.org/usermanual/2.3.0/usage/configuration.html).

File-driven configuration enables multiple sessions to use the same port, which is more efficient in terms of performance. However, sessions cannot be started and stopped independently of each other.

**Database-driven configuration**
Below is an example of configuring the Gateway for database-driven configuration.

In a database-driven configuration, a single FIX session is created for each record in the FIX_SESSION table in the Genesis Application database.

The table exposes the following properties to define a session: 


| Field Name                         | Type                                               |
|------------------------------------|----------------------------------------------------|
| TIMESTAMP                          | NANO_TIMESTAMP                                     |
| CONNECTION_NAME                    | STRING                                             |
| FIX_CONNECTION_TYPE                | ENUM[INITIATOR ACCEPTOR]                           |
| FIX_DATA_DICTIONARY                | STRING                                             |
| FIX_END_TIME                       | STRING                                             |
| FIX_HEARTBEAT_INTERVAL             | INT                                                |
| FIX_HOSTNAME                       | STRING                                             |
| FIX_PORT                           | INT                                                |
| FIX_SESSION_ENABLED                | BOOLEAN                                            |
| FIX_SESSION_TEMPLATE               | STRING                                             |
| FIX_START_TIME                     | STRING                                             |
| FIX_TIME_ZONE                      | STRING                                             |
| FIX_VERSION                        | STRING                                             |
| PROCESS_NAME                       | STRING                                             |
| SENDER_ID                          | STRING                                             |
| SENDER_LOCATION_ID                 | STRING                                             |
| SENDER_SUB_ID                      | STRING                                             |
| SESSION_QUALIFIER                  | STRING                                             |
| TARGET_ID                          | STRING                                             |
| TARGET_LOCATION_ID                 | STRING                                             |
| TARGET_SUB_ID                      | STRING                                             |

You must also define a QuickFIXJ config file to use as template for the session configuration. The template defines the default properties that are common across multiple sessions.

Each session defined in the database references which template to use as the source for common properties through the `FIX_SESSION_TEMPLATE` field. 

An example template:
```
[DEFAULT]
ResetOnDisconnect=Y
ResetOnLogon=Y
ResetOnLogout=Y

ValidateFieldsHaveValues=N
ValidateFieldsOutOfOrder=N
ValidateIncomingMessage=N
ValidateSequenceNumbers=N
ValidateUnorderedGroupFields=N
ValidateUserDefinedFields=N

AllowUnknownMsgFields=Y
```

An example GPAL configuration to enable database sessions:

```kotlin
fix {
    databaseSessionTemplates("default-quickfix.cfg")
    disableDatabaseGateways = false
    disableConfigGateways = true
}
```

Database-driven configuration enables sessions to be created dynamically, and to be started and stopped at runtime while the system is up, completely independently from one another. 

Each session must specify a unique port (if accepting connection), which is less efficient in terms of IO performance.

It is also possible to use both database configuration and config configuration at the same time.

## Additional configuration options

| Field Name                             | Default Value    | Description              |
|----------------------------------------|---------------------------------------------|
| outboundRoutingTag                     | 0                | Used for outbound messages. Value from SOURCE_ID from send message event will be copied to this tag in the outbound message.                                                    |  
| inboundRoutingTag                      | 0                | Used for inbound messages. Value from this tag number will be set on the INTERNAL_TARGET field on the resulting FIX_IN record.                                                  |
| isOutboundInHeader                     | true             | True if the value of `outboundRoutingTag` should be obtained from the message header, rather than the body.                                                                     |
| isInboundInHeader                      | true             | True if the value of `inboundRoutingTag` should be obtained from the message header, rather than the body.                                                                      |
| fileLogPath                            | null             | Path to the directory where QuickFIXJ session logs will be stored, if using logFactoryImpl = FILE.                                                                             |
| quickFixConfig                         | null             | Path to the QuickFIXJ  session configuration file, if using file-driven configuration.                                                                                          |
| isFixLoggingEnabled                    | true             | Set to true to enable FIX session logs using the configured `LogFactoryImpl`.                                                                                                  |
| isPersistToFixIn                       | false            | Set to true to enable persistence of inbound messages to FIX_IN table.                                                                                                          |
| isPersistToFixOut                      | false            | Set to true to enable persistence of outbound messages to FIX_OUT table.                                                                                                        |
| genesisFlakeRxSequence                 | false            | Set to true to use gFlake as FIX_IN record timestamps (see GFlake).                                                                                                              |
| isPersistToFixInBatching               | false            | Set to true to ensure writes to the FIX_IN table are batched. This is more performant, but at the risk of potential data loss.                                           |
| batchSize                              | 0                | Max number of records per write batch when using `isPersistToFixInBatching`.                                                                                                    |
| batchIntervalMs                        | 0                | Max time between write batches when using `isPersistToFixInBatching`.                                                                                                           |
| stopOnDatabaseInsertFailure            | false            | Set to true to trigger a forced session disconnection and sequence recovery when a record fails to be written to FIX_IN. Used with `isPersistToFixIn`.                        |
| recoverFromLastFixInTargetSequence     | false            | Set to true to use the FIX_IN table to determine the expected target sequence number when session is started.                                                                   |
| disableConfigGateways                  | false            | Set to true to disable initialisation of FIX sessions from configuration files.                                                                                                 |
| disableDatabaseGateways                | false            | Set to true to disable initialisation of FIX sessions from database records.                                                                                                    |                         
| disableProcessStatusCheck              | false            | Set to true to prevent individual FIX sessions from setting the process state to WARNING when a session is not connected during its expected schedule.                          |
| authenticateLogonCredentials           | false            | Set to true to do application-level verification of session username and password on session Logon based on records in the `FIX_SESSION_AUTH` table.                            |
| passwordSalt                           | ""               | Optional salt to be used when validating passwords. Use with `authenticateLogonCredentials`.                                                                                    |
| threadModel                            | SINGLE           | Thread-handling model for QuickFIXJ  sessions. Options are `SINGLE`, `THREAD_PER_SESSION` and `IO_THREAD`. This is a delicate setting and should be used with care.             |
| messageStoreImpl                       | MEMORY           | QuickFIXJ message store implementation for sequence number storage and session recovery. Valid values are `MEMORY`, `FILE` and `DATABASE`.                                    |
| logFactoryImpl                         | FILE             | QuickFIXJ log factory implementation for session logs. Valid values are `FILE`, `CONSOLE`, `SLF4J` and `NONE`.                                                                |
| validateSessionStatusOnLogon           | false            | Set to true to enable safeguard mechanism to prevent the same FIX session logging on twice. Used when running multiple FIX gateway processes in an active-active configuration. |
| updateSessionStatusInterval            | 0                | The time between session status update writes to the database, as part of `validateSessionStatusOnLogon`.                                                                       |
| sessionStatusValidityPeriod            | 30000            | The amount of time that must elapse before the system treats a record in FIX_SESSION_STATUS as stale. Used as part of `validateSessionStatusOnLogon`                      |

### Thread model
The threadModel configuration property is related to performance and high-volume FIX streams, such as market-data feeds. 

- `SINGLE` mode uses a single thread to process messages across all sessions. This is the default configuration, and a good way of keeping the hardware footprint on the FIX Gateway processes relatively small.
- `THREAD_PER_SESSION` uses a single message-processing thread per session. It is a good option if you have a large number of sessions or if sessions are latency-sensitive when processing messages, because messages from one session will never be queued behind those from another session.
- `IO_THREAD` is for high-performance FIX message streams only, and should be used with care. In this mode, there is no hand-off to a processing thread from the MINA IO Thread. When using the other thread model options, the default behaviour of the FIX engine is to queue messages on an unbounded in-memory queue. The MINA IO thread writes to the queue, and the message-processor thread reads from this queue. 
However, under extremely high message volumes, this queue can fill up and cause memory pressure and significant garbage collection overhead, which can degrade application performance. Removing this queue prevents this issue, pushing back pressure all the way to the TCP/IP stack and preventing application failure. It is *imperative* that the FIX processing logic is written in such a way that there are no blocking operations performed on the IO thread. 
This means avoiding using `MessageStoreImpl.DATABASE` and any blocking ops in any custom message publishers. Any delay in processing TCP traffic can cause significant performance degradation, due to the data-throttling method in the TCP protocol.

### Session status validation
Session status validation is a feature that was introduced for applications running multiple clustered FIX gateways in an active-active configuration, using a TCP load balancer to balance sessions across a pool of instances.

To prevent clients connecting to the system on multiple nodes, you can enable `validateSessionStatusOnLogon`. This causes the node that has an active session to update the `FIX_SESSION_STATUS` table every *N* milliseconds, where N is defined by `updateSessionStatusInterval` configuration key.

When processing any FIX Logon message, the node checks the status and the write time of the corresponding `FIX_SESSION_STATUS` record in the Genesis database. If the record shows the session as connected, and the write time is within the period defined by `sessionStatusValidityPeriod`, the logon will be rejected.
