---
id: change-log-level
title: Change log level
sidebar_label: Change log level
sidebar_position: 13

---

There are many ways to change log level.
Log files are located in ~/run/runtime/logs/ folder.


### Process log level

Process log level can be set between valid levels [ERROR, WARN, INFO, DEBUG, TRACE].
There is another option called DATADUMP_STATUS which sets log level for genesis messages to TRACE
By default all process log levels are set to INFO and DATADUMP_STATUS is set to OFF.

#### Change process log level and datadump at the start of the process

1. Copy trading_app-processes.xml to site-specific
   
```bash
cp ~/run/trading_app/cfg/trading_app-processes.xml site-specific/cfg/
```

2. Add/edit loggingLevel tag in process you would like to change like below example

```xml
    <process name="TRADING_APP_DATASERVER">
        <groupId>TRADING_APP</groupId>
        <start>true</start>
        <options>-Xmx256m</options>
        <module>genesis-pal-dataserver</module>
        <package>global.genesis.dataserver.pal</package>
        <script>chat-dataserver.kts</script>
        <language>pal</language>
        <description>Displays real-time details</description>
        <loggingLevel>DEBUG,DATADUMP_ON</loggingLevel>
    </process> 
```

3. Since there is change in configuration run `genesisInstall`

4. Restart process `TRADING_APP_DATASERVER`

#### Change process log level dynamically

To change process log level dynamically you need to use [LogLevel](/server-reference/operations/commands/#loglevel-script) command.
With this command you will be able to change the log level for specified time.
Below are some examples of its usage

Example 1: Change log level

```
LogLevel -p TRADING_APP_DATASERVER -l TRACE
```

Example 2: Datadump status

```
LogLevel -p TRADING_APP_DATASERVER -DATADUMP_ON
```

Example 3: Datadump nack status for 10 seconds

```
LogLevel -p TRADING_APP_DATASERVER -DATADUMP_NACK_ON -t 10s
```

Example 4: Change log level for class

```
LogLevel -p TRADING_APP_DATASERVER -c DbMon -l DEBUG
```

### Script log level

Logging level in scripts is set by default to "WARN". To change the log level you need to set environment variable GENESIS_LOGGING_LEVEL to any valid level [ERROR, WARN, INFO, DEBUG, TRACE]. Not setting GENESIS_LOGGING_LEVEL or setting a non-valid level will reset log level to default.

Example of using LOG property inside script
```kotlin    
    eventHandler<Trade>(name = "TRADE_INSERT") {
        onValidate { event ->
            val message = event.details
            LOG.info("Validating trade with ID: {}", message.tradeId)
            verify {
                entityDb hasEntry Counterparty.ById(message.counterpartyId)
                entityDb hasEntry Instrument.ById(message.instrumentId)
            }
            ack()
        }
        onCommit { event ->
            val trade = event.details
            LOG.info("Inserting trade with ID: {}", trade.tradeId)
            stateMachine.insert(trade)
            ack()
        }
    }
```