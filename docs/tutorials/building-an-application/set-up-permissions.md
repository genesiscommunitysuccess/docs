---
id: permissions
title: Set up user permissions
sidebar_label: Set up user permissions
sidebar_position: 10

---
At this stage, you have a working server with a Ref_data_app and a Trading_app. The Trading_app has a consolidator to calculate the positions, event handlers to control changes to the database and data server and request servers to publish the data to the front end.

Now you want to permission users so that everyone has access to the correct parts of the system.

## The objective

The objective is to use dynamic permissions and permission codes so that specific users have access to specific parts of the application – both functions and data..

We can display the configuration of both in our request server, data server and event handler.

## Set up generic permissions

First, enable the COUNTERPARTY table and COUNTERPARTY_ID field as part of the generic permissions system.

You can read more about it [here](../../platform-reference/authentication-and-authorisation/authorisation.md).

Starting with the server, make sure that you have two USER and USER_ATTRIBUTES records setup: JohnDoe and JaneDoe.

![](/img/jane-and-john-doe.png)

Set two new key values in **site-specific/cfg/genesis-system-definition.kts** to enable the COUNTERPARTY table and COUNTERPARTY_ID field as part of the generic permissions system:

```kotlin
item(name = "ADMIN_PERMISSION_ENTITY_TABLE", value = "COUNTERPARTY")

item(name = "ADMIN_PERMISSION_ENTITY_FIELD", value = "COUNTERPARTY_ID")
```

Take note of how **auth-permissions.auto.xml** looks in generated/cfg before running genesisInstall as this file will change.

Run `genesisInstall`

Run `remap --commit`

**Remap** prompts you to add a new table called USER_COUNTERPARTY_MAP and a new field has been added to USER_ATTRIBUTES. Input `y` to commit the changes. Note: remap won’t work if any server processes are currently running.

After this, go to the USER_ATTRIBUTES table and use the below **DbMon** commands to set the ACCESS_TYPE field for JaneDoe to be ENTITY (instead of ALL).

    table USER_ATTRIBUTES
    
    qsearch USER_NAME==”JaneDoe”
    
    set ACCESS_TYPE ENTITY
    
    writeMode
    
    update USER_ATTRIBUTES_BY_USER_NAME

The generic permissioning settings have been set in place, and are stored in **auth-permissions.auto.xml** in **generated/cfg**. The next time GENESIS_AUTH_MANAGER and GENESIS_AUTH_PERMS are started they will consider the new configuration.

Now go to the **-view-dictionary.kts** file and add the COUNTERPARTY_ID field to ENHANCED_TRADE_VIEW as this field will be used to verify permissions.

![](/img/step-08-add-counterparty_id-to-enhanced_view-in-view-dictionary-with-highlight.png)

Then run the **generateView** maven codegen plugin as below.

![](/img/step-08-run-maven-generateview-codegen-plugin-after-modifying-view.png)

This gives you

![](/img/step-09-file-locations.png)

## Configure dynamic permissions

You can now configure dynamic permissions for trades in our IDE. You need to make these changes to the code for the request server, data server and event handler.
For example, here we add permissioning to a query in the data server:

```kotlin
dataServer {

  query("ALL_TRADES", ENHANCED_TRADE_VIEW) {
    permissioning {
      auth(mapName = "ENTITY_VISIBILITY") {
        ENHANCED_TRADE_VIEW.COUNTERPARTY_ID
      }
    }
  }
}
```

You can add similar code to the queries in your request servers.

Request Server:

```kotlin
requestReplies {

  requestReply("TRADE", TRADE_VIEW) {
    permissioning {
      auth(mapName = "ENTITY_VISIBILITY") {
        TRADE_VIEW.COUNTERPARTY_ID
      }
    }
  }
}
```

Event handlers are slightly different, because the input data class can be customised. The code would look like this (taking the TRADE_INSERT event handler as an example):

```kotlin
  eventHandler<Trade>(name = "TRADE_INSERT") {
    permissions {
      auth(mapName = "ENTITY_VISIBILITY") {
        field { counterpartyId }
      }
    }
    onValidate { event ->
      val message = event.details
      verify {
        entityDb hasEntry Counterparty.ById(message.counterpartyId)
        entityDb hasEntry Instrument.ById(message.instrumentId)
      }
      ack()
    }
    onCommit { event ->
      val trade = event.details
      stateMachine.insert(trade)
      ack()
    }
  }
```

### Testing

You can write unit tests based on auth-perms.

For example, let's edit the `TradingEventHandlerTest` class:

1. Add auth cache override to `GenesisTestConfig`. This will create the ENTITY_VISIBILITY auth cache map as part of the test.

```kotlin
class TradingEventHandlerTest : AbstractGenesisTestSupport<GenesisSet>(
    GenesisTestConfig {
        addPackageName("global.genesis.eventhandler.pal")
        genesisHome = "/GenesisHome/"
        scriptFileName = "trading_app-eventhandler.kts"
        parser = { it }
        initialDataFile = "TEST_DATA.csv"
        addAuthCacheOverride("ENTITY_VISIBILITY")
    }
)
```

2. Add setup function and create two auth cache entries. The below authorises users JohnDoe and TestUser for entities with Counterparty ID = 1.

```kotlin
@Before
fun setUp() {
    authorise("ENTITY_VISIBILITY", "1", "JohnDoe")
    authorise("ENTITY_VISIBILITY", "1", "TestUser")
}
```

3. Create test showing where the user can complete action successfully due to permissions. Note that we are specifying the `userName` field on the `Event` object.

```kotlin
@Test
fun `test insert trade`(): Unit = runBlocking {
    val message = Event(
        details = Trade {
            tradeId = 1
            counterpartyId = "1"
            instrumentId = "2"
        },
        messageType = "EVENT_TRADE_INSERT",
        userName = "JohnDoe"
    )

    val result: EventReply? = messageClient.suspendRequest(message)

    result.assertedCast<EventReply.EventAck>()

    val trade = entityDb.get(Trade.ById(1))
    assertNotNull(trade)
    assertEquals("1", trade.counterpartyId)
    assertEquals("2", trade.instrumentId)
    assertEquals(TradeStatus.NEW, trade.tradeStatus)
}
```

4. Create test showing where the user cannot complete action successfully due to permissions. JaneDoe is not authorised due to not having an entry in the auth cache map ENTITY_VISIBILITY for Counterparty with ID 1 (In fact, at the moment user JaneDoe has no entries at all in the ENTITY_VISIBILITY map).

```kotlin
@Test
fun `test trade insert without permission`(): Unit = runBlocking {
    val message = Event(
        details = Trade {
            tradeId = 1
            counterpartyId = "1"
            instrumentId = "2"
        },
        messageType = "EVENT_TRADE_INSERT",
        userName = "JaneDoe"
    )

    val result: EventReply? = messageClient.suspendRequest(message)

    val eventNack = result.assertedCast<EventReply.EventNack>()
    assertThat(eventNack.error).containsExactly(
        StandardError(
            "NOT_AUTHORISED",
            "User JaneDoe lacks sufficient permissions"
        )
    )
}
```

## Permission Codes

Now you need to look at RIGHT_SUMMARY permission codes.

Permission codes enable you to establish a yes/no type access to resources (request servers, dataserver, event handler), but they don’t act dynamically and they won’t filter rows based on fine-grain criteria (in the way that dynamic permissions would).

For the purpose of this script, we can keep things simple. In reality you would use a GUI to create new rights, create new profiles and assign users to profiles. This would give rights to each user.



In our trading app example we can set two types of rights:

* TRADER (enables the trader to read and write trades - but only for their own related counterparties)
* SUPPORT (enables support to have read-only access to everything)

In terms of definitions, you can add the codes as part of the permissions block in the relevant event handler. For example, for the TRADE_INSERT event handler you could have:

```kotlin
  eventHandler<Trade>(name = "TRADE_INSERT") {
    permissions {
      permissionCodes = listOf("TRADER")
      auth(mapName = "ENTITY_VISIBILITY") {
        field { counterpartyId }
      }
    }
    onValidate { event ->
      val message = event.details
      verify {
        entityDb hasEntry Counterparty.ById(message.counterpartyId)
        entityDb hasEntry Instrument.ById(message.instrumentId)
      }
      ack()
    }
    onCommit { event ->
      val trade = event.details
      stateMachine.insert(trade)
      ack()
    }
  }
```

This means only users with the TRADER permission code will be able to use that event handler. You can add similar code to the request servers and data servers, as below, but for these we will also add the SUPPORT code to allow SUPPORT users to have read-only access to trades.

Request Server:

```kotlin
requestReplies {

  requestReply("TRADE", TRADE_VIEW) {
    permissioning {
      permissionCodes = listOf("TRADER", "SUPPORT")
      auth(mapName = "ENTITY_VISIBILITY") {
        TRADE_VIEW.COUNTERPARTY_ID
      }
    }
  }
}
```

Data Server:

```kotlin
dataServer {

  query("ALL_TRADES", ENHANCED_TRADE_VIEW) {
    permissioning {
      permissionCodes = listOf("TRADER", "SUPPORT")
      auth(mapName = "ENTITY_VISIBILITY") {
        ENHANCED_TRADE_VIEW.COUNTERPARTY_ID
      }
    }
  }
}
```

### Testing

The permission mechanism is driven by the RIGHT_SUMMARY table, which contains an association between a user and a right-code.

Now we need to write unit tests for this. As an example we will test the Event Handler.

1. Modify the setup function. We are adding another entry to the ENTITY_VISIBILITY auth cache map for user JamieDoe. Also we are adding all of our users to the RIGHT_SUMMARY table.

```kotlin
@Before
fun setUp() {
    authorise("ENTITY_VISIBILITY", "1", "JohnDoe")
    authorise("ENTITY_VISIBILITY", "1", "TestUser")
    authorise("ENTITY_VISIBILITY", "1", "JamieDoe")

    val trader = DbRecord.dbRecord("RIGHT_SUMMARY") {
        "USER_NAME" with "JohnDoe"
        "RIGHT_CODE" with "TRADER"
    }
    val support = DbRecord.dbRecord("RIGHT_SUMMARY") {
        "USER_NAME" with "JaneDoe"
        "RIGHT_CODE" with "SUPPORT"
    }
    val testUser = DbRecord.dbRecord("RIGHT_SUMMARY") {
        "USER_NAME" with "TestUser"
        "RIGHT_CODE" with "TRADER"
    }
    val jamieDoe = DbRecord.dbRecord("RIGHT_SUMMARY") {
        "USER_NAME" with "TestUser"
        "RIGHT_CODE" with "SUPPORT"
    }
    rxDb.insert(trader).blockingGet()
    rxDb.insert(support).blockingGet()
    rxDb.insert(testUser).blockingGet()
    rxDb.insert(jamieDoe).blockingGet()
}
```

2. Create a test for inserting a trade without the correct permission code.

```kotlin
@Test
fun `test trade insert due to incorrect permission code`(): Unit = runBlocking {
    val message = Event(
        details = Trade {
            tradeId = 1
            counterpartyId = "1"
            instrumentId = "2"
        },
        messageType = "EVENT_TRADE_INSERT",
        userName = "JamieDoe"
    )

    val result: EventReply? = messageClient.suspendRequest(message)

    val eventNack = result.assertedCast<EventReply.EventNack>()
    assertThat(eventNack.error).containsExactly(
        StandardError(
            "NOT_AUTHORISED",
            "User JamieDoe lacks sufficient permissions"
        )
    )
}
```

User JamieDoe has the correct entry in the ENTITY_VISIBILITY auth cache map for Counterparty with ID = 1. But their RIGHT_CODE is SUPPORT, and so they are not authorised to enter a trade -  because the event handler requires the RIGHT_CODE to be TRADER.