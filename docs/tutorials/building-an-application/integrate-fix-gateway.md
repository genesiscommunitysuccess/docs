---
id: fix-gateway
title: Integrate a FIX gateway
sidebar_label: Integrate a FIX gateway
sidebar_position: 11

---
Now we have the back end of a working trade application, but in many scenarios we will need to integrate our Genesis application with other systems in order to report events. 

In order to achieve this, we can use the Genesis Gateway and Streamer components to construct a data flow that reports to another system running outside of Genesis.

## The objective

The objective is to use the FIX Gateway, Streamer and Streamer-Client modules to construct a real-time, configurable data stream that will send a drop copy FIX execution report each time a trade is entered in our system.

## Configuring the gateway

### 1. Configure the FIX gateway
Create the FIX server configuration by adding the following XML to the trading_app-processes.xml file

```xml
<process name="TRADING_APP_FGW">
    <groupId>TRADING_APP</groupId>
    <start>true</start>
    <options>-Xmx128m -DXSD_VALIDATE=false</options>
    <module>fix-eventhandler</module>
    <package>global.genesis.fix.eventhandler</package>
    <config>trading_app-fgw.xml</config>
    <loggingLevel>INFO,DATADUMP_OFF</loggingLevel>
    <description>FIX Drop Copy Gateway</description>
</process>
```

Add the service definition to the trading_app-service-definitions.xml file
```xml
<service host="localhost" name="TRADING_APP_FGW" port ="11004"/>
```

Create a config file for the FIX gateway under **trading_app-config/src/main/resources/cfg/trading_app-fgw.xml**. 

The file below has commented out sections to change the connection type between CLIENT and SERVER. 
A SERVER configuration will open a socket listener on the specified port and wait for incoming connections.
A CLIENT configuration will initiate a TCP connection to the specified target address.

There are additional properties in this file to configure additional FIX session parameters, SenderId and TargetId (FIX header tag 49 and 56) CompId values, session schedules for scheduled uptime and downtime and FIX protocol version.
The customFieldsOutbound tag allows you to define a code block that will set static fields on any outbound FIX message.
```xml
<fixConnection>
    <quickFixConfig path="/home/trading/run/generated/cfg/trading_app-quickfix.cfg" />
    <fileLogPath path="/home/trading/run/runtime/logs/" />

    <serviceName>DROPCOPY</serviceName>

    <connectionDetails>

        <!--connectionType>CLIENT</connectionType-->
        <connectionType>SERVER</connectionType>

        <!-- Target address valid for connection type of Client only-->
        <!--targetAddresses>
            <targetAddress>127.0.0.1:9092</targetAddress>
        </targetAddresses-->>

        <port>9092</port>


        <!-- Our system -->
        <senderId>GENESIS</senderId>
        <!-- Their system -->
        <targetId>CLIENT</targetId>

        <FIXVersion>FIX.4.4</FIXVersion>

        <!-- Connections will only be reported as DOWN outside of these times -->
        <connectAt>00:00:00</connectAt>
        <disconnectAt>23:59:00</disconnectAt>

    </connectionDetails>

    <!-- Set raw FIX fields before message is sent -->
    <customFieldsOutbound>
        <![CDATA[
        ]]>
    </customFieldsOutbound>
</fixConnection>
```

Create a QFIXJ config for the FIX gateway. This file is used to configure the QuickFIXJ library directly and uses a properties file format. For more details on QuickFIXJ configuration, refer to the library documentation [here](https://www.quickfixj.org/usermanual/2.3.0/usage/configuration.html).
```text
[SESSION]
BeginString=FIX.4.4
ConnectionType=acceptor
SocketConnectHost=127.0.0.1
SocketAcceptPort=9092
FileLogPath=/home/tradingapp/run/runtime/logs/
HeartBtInt=30

ResetOnDisconnect=Y
ResetOnLogon=Y
ResetOnLogout=Y

SenderCompID=GENESIS
TargetCompID=CLIENT
StartTime=00:00:00
EndTime=23:59:00

UseDataDictionary=Y
DataDictionary=/home/tradingapp/run/generated/cfg/FIX44_ref.xml

ValidateFieldsHaveValues=N
ValidateFieldsOutOfOrder=N
ValidateIncomingMessage=N
ValidateSequenceNumbers=N
ValidateUnorderedGroupFields=N
ValidateUserDefinedFields=N

AllowUnknownMsgFields=Y 
```

### 2. Configure the Streamer
Now we have the configuration for a FIX gateway, we need to configure the Streamer and Streamer-Client components to allow us to route messages to it. Let's begin with the Streamer.

Create the FIX Streamer configuration by adding the following XML to the trading_app-processes.xml file
```xml
<process name="TRADING_APP_FGW_STREAMER">
    <groupId>TRADING_APP</groupId>
    <start>true</start>
    <options>-Xmx128m -DXSD_VALIDATE=false</options>
    <module>genesis-pal-streamer</module>
    <package>global.genesis.streamer.pal</package>
    <script>trading_app-fgw-streamer.kts</script>
    <loggingLevel>INFO,DATADUMP_OFF</loggingLevel>
    <language>pal</language>
</process>
```
Add the service definition to the trading_app-service-definitions.xml file
```xml
<service host="localhost" name="TRADING_APP_FGW" port ="11004"/>
```
 
Create a config file for the stream at trading_app-script-config/src/main/resources/scripts/trading-app-fgw-streamer.xml. We will define two filtered streams, one for NEW trades and one for ALLOCATED trades.
```kotlin
streams {
    stream("NEW_TRADES", TRADE.BY_ID) {
        maxLogons = 1
        logoffTimeout = 5000
        batchSize = 100
        where { record ->
            record.tradeStatus == TradeStatus.NEW
        }
    }

    stream("BOOKED_TRADES", TRADE.BY_ID) {
        maxLogons = 1
        logoffTimeout = 5000
        batchSize = 100
        where { record ->
            record.tradeStatus == TradeStatus.ALLOCATED
        }
    }
} 
```
### 3. Configure FIX-XLator Plugin for the Streamer Client
The FIX-Xlator plugin allows you to use a number of extension functions designed to make working with QuickFIX message classes in your streamer and streamer client scripts much easier. 
It also allows you to generate type safe accessors for custom message fields based on a custom dictionary.
The reference documentation including how to structure the FIX messages module in your project can be found [here](../../platform-reference/integrations/external-systems/fix-xlator.md)

### 4. Configure the Streamer Client
In order to complete our FIX drop copy workflow, we need a Streamer Client to listen to the stream, convert any TRADE objects to a FIX message format and forward them on to the Gateway.

Create the FIX Streamer-Client configuration by adding the following XML to the trading_app-processes.xml file
```xml
<process name="TRADING_APP_FGW_STREAMER_CLIENT">
    <groupId>TRADING_APP</groupId>
    <start>true</start>
    <options>-Xmx128m -DXSD_VALIDATE=false</options>
    <module>genesis-pal-streamerclient</module>
    <package>global.genesis.streamerclient.pal</package>
    <script>trading_app-fgw-streamer-client.kts</script>
    <loggingLevel>INFO,DATADUMP_OFF</loggingLevel>
    <classpath>trading_app-fix-messages*</classpath>
    <language>pal</language>
  </process>
```

Add the service definition to the trading_app-service-definitions.xml file
```xml
<service host="localhost" name="TRADING_APP_FGW_STREAMER_CLIENT" port ="11006"/>
```

Create a config file for the client based on the previously created Trade Stream.

Note that if you wish to extract logic within the script to additional functions to keep the code tidy, the functions must be defined in the file before the GPAL streamer-client definition.
```kotlin
import global.genesis.fix.messagespec.DateConvertersImpl.asLocalDateTime
import global.genesis.quickfix.field.FIX44.*

plugins {
    plugin(FixXlatorPlugin)
}

fixConfiguration {
    version = FIX44
}

fun formatExecutionReport(input: GenesisSet) : ExecutionReport {
    val executionReport = ExecutionReport()
    executionReport.set(OrderID("${input.getLong("TRADE_ID")}-SYNTH"))

    val noPartyIDsGroup = ExecutionReport.NoPartyIDs()
    noPartyIDsGroup.set(PartyID(input.getString("COUNTERPARTY_ID")))
    noPartyIDsGroup.set(PartyIDSource(PartyIDSource.PROPRIETARY_CUSTOM_CODE))
    noPartyIDsGroup.set(PartyRole(PartyRole.ENTERING_FIRM))
    executionReport.addGroup(noPartyIDsGroup)

    noPartyIDsGroup.set(PartyID(input.getString("ENTERED_BY")))
    noPartyIDsGroup.set(PartyIDSource(PartyIDSource.PROPRIETARY_CUSTOM_CODE))
    noPartyIDsGroup.set(PartyRole(PartyRole.ENTERING_TRADER))
    executionReport.addGroup(noPartyIDsGroup)

    executionReport.set(ExecID(input.getLong("TRADE_ID").toString()))
    executionReport.set(ExecType(ExecType.TRADE))
    executionReport.set(OrdStatus(OrdStatus.FILLED))

    val instrument = Instrument()
    instrument.set(Symbol(input.getString("INSTRUMENT_ID")))
    instrument.set(SecurityID(input.getString("INSTRUMENT_ID")))
    executionReport.set(instrument)

    executionReport.set(Side(deriveFIXSide(input.getString("SIDE"))))

    val quantity = input.getBigDecimal("QUANTITY")
    if (quantity != null) {
        executionReport.set(OrderQty(quantity))
        executionReport.set(LastQty(quantity))
        executionReport.set(CumQty(quantity))
    }
    executionReport.set(LeavesQty(0.0))

    val price = input.getDouble("PRICE")
    if (price != null) {
        executionReport.set(Price(price))
        executionReport.set(LastPx(price))
    }

    val dateTime = input.getDate("TRADE_DATETIME")
    if (dateTime != null)
        executionReport.set(TransactTime(dateTime.asLocalDateTime()))

    return executionReport
}

fun deriveFIXSide(side : String?) : Char {
    return when(side) {
        "BUY" -> Side.BUY
        "B" -> Side.BUY
        "SELL" -> Side.SELL
        "S" -> Side.SELL
        else -> Side.UNDISCLOSED
    }
}

streamerClients {
    streamerClient("EXEC_REPORTS") {
        dataSource(processName = "TRADING_APP_FGW_STREAMER", sourceName = "NEW_TRADES")
        isReplayable = true
        onMessage {
            send(targetProcess = "TRADING_APP_FGW", messageType = "EVENT_SEND_RAW_FIX_MESSAGE") { input, output ->
                output["FIX_DATA"] = formatExecutionReport(input).toString()
            }
        }
    }
}
```

## Testing the gateway

### 1. Install the Genesis FIX module distribution
Download and unzip genesisproduct-fix-5.2.0-bin.zip in the run directory with the other distributions.

### 2. Connect a FIX client
Connect a FIX client to the server port you have specified.

### 3. Enter a TRADE_INSERT event
Using REST or a front-end app, such as Genesis Console, send an EVENT_TRADE_INSERT message with a trade state of NEW. You should see that your fix client receives an execution report message.