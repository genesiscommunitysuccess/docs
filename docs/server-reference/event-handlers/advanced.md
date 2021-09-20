---
title: Event handler reference
sidebar_label: Event handler reference
id: advanced
sidebar_position: 3

---

## Defining an event handler in GPAL

The following imports are automatically available inside GPAL event handlers:

<CodeBlock className="language-java">{Imports}</CodeBlock>

### Automatic import

:::danger WIP
_details to follow_
:::

The following properties are automatically available inside GPAL event handlers:

```kotlin
val systemDefinition: SystemDefinitionService
val rxDb: RxDb
val entityDb: AsyncEntityDb
val metaData: MetaDataRegistry
val evaluatorPool: EvaluatorPool
val messageDelegator: MessageDelegator
val serviceDetailProvider: ServiceDetailProvider
val genesisHFT: GenesisHFT
val clientConnectionsManager: ClientConnectionsManager
```

### The eventHandler code block

You can define an event handler by creating an **eventHandler** code block. This needs:

* **Inbound and outbound message types**. An event handler requires one inbound message type (e.g. a generated dao entity or a custom defined message) and optionally an outbound message type. If a message type is not defined, the default _EventReply_ message type will apply. For example, `eventHandler<TradeInsert>` and `eventHandler<TradeInsert,TradeInsertReply>`.
* **Optionally, a name**. The prefix `EVENT_` will always be added to this automatically. The default name will be `EVENT_<message type name>`. So, for a message type declared as `OrderInsert`, declaring an event handler block as `eventHandler<OrderInsert>{}` automatically registers the event with the name `EVENT_ORDER_INSERT`.
* **Optionally, a boolean to define if the event handler is transactional or not**. This enables the platform to run the whole **onValidate/onCommit** **blocks in a single ACID transaction if the database engine supports it.

Inside each event handler you can define additional blocks and properties.

### onValidate

You can declare an **onValidate** block to perform validation on each received message. The last value of the code block always needs to be the return message type.

This validation step will be executed whether the event is **validate=true** or **validate=false**.

The **onValidate** block is optional if you are using the default reply message type (**EventReply***)* and will automatically be successful if not defined.

However, it is mandatory when using custom reply message types, and the script will not compile if it is not defined. See the simple example below:

```kotlin
   eventHandler<Company>(name = "COMPANY_INSERT") {
        onValidate { event ->
            val company = event.details
            require(company.companyName != "MY_COMPANY") {
                "We don't accept your company"
            }
            ack()
        }
        onCommit { event ->
            val company = event.details
            val result = entityDb.insert(company)
            ack(listOf(mapOf("COMPANY_ID" to result.record.companyId)))
        }
    }
```

Kotlin’s _require_ method throws an exception with a message if the boolean expression is not what is expected, and the event handler automatically converts that exception into a corresponding **EventNack**.

In order to optimise database lookup operations, you might want to reuse some data obtained within the **onValidate** block inside your **onCommit** block. To do this, you can use context event handlers, as shown below:

```kotlin
    contextEventHandler<Company, String>(name = "CONTEXT_COMPANY_INSERT") {
        onValidate {
            val company = it.details
            if(company.companyName == "MY_COMPANY"){
                validationAck(validationContext = "Best company in the world")
            } else {
                validationAck()
            }
        }
        onCommit { event, context ->
            val parsedContext = context ?: "Missing context"
            val company = event.details
            val result = entityDb.insert(company)
            ack(listOf(mapOf("VALUE" to parsedContext)))
        }
    }
```

:::danger WIP
(There are some refs here that need to be fetched from the source release notes.)
:::

As the  example shows, there is an additional type defined for the context event handler. This is a _String._ This enables us to optionally return a _String_ value from our **onValidate** block (see _validationAck_ logic) and then capture it in our **onCommit** block (see _context_ lambda parameter).

Because we are creating validation context, we need to use the function **validationAck()** and not just **ack()**

If you use a custom reply message type, you won’t be able to use the default **ack()** or **validationAck()** functions.  The custom message type needs to be returned from the method.

For a custom message type called **TradeEvent** defined as:

```kotlin
data class TradeEvent(
    val price: Double,
    val quantity: Int,
){
    init{
        require(price > 0) { "Price cannot be negative "}
        require(quantity > 0) { "Quantity cannot be negative "}
    }
}
```

With a custom message reply type called **CustomTradeEventReply** defined as:

```kotlin
sealed class CustomTradeEventReply : Outbound() {
    class TradeEventValidateAck : CustomTradeEventReply()
    data class TradeEventAck(val tradeId: String) : CustomTradeEventReply()
    data class TradeEventNack(val error: String) : CustomTradeEventReply()
}
```

Please see example event handler below:

```kotlin
    eventHandler<TradeEvent, CustomTradeEventReply>(name = "CUSTOM_TRADE_EVENT") {
        onException { event, throwable ->
            TradeEventNack(throwable.message!!)
        }
        onValidate {
            val tradeEvent = it.details
            require((tradeEvent.price * tradeEvent.quantity.toDouble()) < 1_000_000) { "Trade notional is too high" }
            TradeEventValidateAck()
        }
        onCommit {
            TradeEventAck("Trade1")
        }
    }
```

### onCommit

The **onCommit** block will be called when an event message is received with “validate = false” and has successfully passed the **onValidate** **block. This is the place where you perform the real changes to the system, whether it is a database update or uploading a report to a third party. The last value of the code block always needs to be the return message type.

### onException

The **onException** block can capture any exceptions thrown by the **onValidate** **and **onCommit** blocks and returns the expected reply message type (as shown in the last example). This function is particularly useful if you are using a custom message type, as by default EventHandlers will attempt to translate exceptions automatically to an **EventNack** message, which might cause compatibility problems if you are using custom replies.

### permissions and permissionCodes

As with other GPL files (e.g. reqrep and dataserver), you can use a **permissions** block to define both dynamic permissions (AUTH) and fixed permissions (based on RIGHT_SUMMARY rights) if the event message type is a generated database entity. See the example below:

```kotlin
    eventHandler<Company>(name = "AUTH_COMPANY_INSERT") {
        permissions {
            auth(mapName = "COMPANY"){
                COMPANY.COMPANY_NAME
            }
        }

        onCommit { event ->
            val company = event.details
            val result = entityDb.insert(company)
            ack(listOf(mapOf("VALUE" to result.record.companyId)))
        }
    }
```

If your message type is not a database-generated entity,  you can still define fixed **permissionCodes** outside the permissions block:

```kotlin
    eventHandler<Company>(name = "AUTH_COMPANY_INSERT") {
        permissionCodes = listOf("INSERT_TRADE")
        onCommit { event ->
            val company = event.details
            val result = entityDb.insert(company)
            ack(listOf(mapOf("VALUE" to result.record.companyId)))
        }
    }
```

### ACID guaranteed

Any event handlers can be declared as **transactional = true** to ensure that the whole **onValidate** and **onCommit** blocks are executed in a single ACID-guaranteed transaction. This is especially useful when the database changes for each operation need to read and modify multiple table records in a consistent way.

For example, if we need to insert a new record and create an audit record for this operation, you want to guarantee that both operations succeed - or that both operations are rolled back if something goes wrong.

See the example below for defining an event handler this way (a transactional event handler):

```kotlin
    eventHandler<Company>(name = "COMPANY_INSERT", transactional = true) {
        onValidate {
            ack()
        }
        onCommit { event ->
            val company = event.details
            entityDb.insert(company)
            ack(listOf(mapOf("VALUE" to "SUCCESS!")))
        }
    }
```

### AutoAuditing

If the event handler message type is a database-generated entity that is auditable, Genesis automatically creates an audit record to the corresponding audit table for each database write operation. The audit fields are filled with the following values:

AUDIT_EVENT_TYPE → Event name
AUDIT_EVENT_DATETIME → Autogenerated
AUDIT_EVENT_TEXT → Optional “REASON” value sent as part of the event message
AUDIT_EVENT_USER → Extracted from the event message