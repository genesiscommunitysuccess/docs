---
title: 'Examples'
sidebar_label: 'Examples'
id: examples
---

[Introduction](/server-modules/event-handler/introduction)  | [Basics](/server-modules/event-handler/basics) | [Advanced](/server-modules/event-handler/advanced) | [Examples](/server-modules/event-handler/examples) | [Configuring runtime](/server-modules/event-handler/configuring-runtime) | [Testing](/server-modules/event-handler/testing) | [Java event handlers](/server-modules/event-handler/java-event-handlers) | [Testing java event handlers](/server-modules/event-handler/testing-java-event-handlers)

There is a nice simple example of some logic being added to an Event Handler in our [tutorial](/getting-started/go-to-the-next-level/condition-rules/#3-update-the-event-handler). Below we have some other examples of different ways to use an Event Handler.

## Basic
The example below is a simple Event Handler
to validate input and insert a record in the database. There is an [`onValidate`](/server-modules/event-handler/basics/#adding-validation) block that defines the validation and an [`onCommit`](/server-modules/event-handler/basics/#a-simple-example-of-an-event-handler) block that specifies the action that is to be taken.
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

## Carrying context
This next snippet is an example of how to reuse data between 
[onValidate](/server-modules/event-handler/basics/#adding-validation) 
and [onCommit](/server-modules/event-handler/basics/#a-simple-example-of-an-event-handler) using a `contextEventHandler`. In the `onValidate` block we check to see if a trade exists in the database, and we pass it as _context_ to the `onCommit` block so we don't have to do another database lookup.

```kotlin
    contextEventHandler<TradeAlertAck, Trade>(name = "TRADE_ALERT_ACK") {
        onValidate { event ->
            val tradeAlert = event.details
            val tradeId = tradeAlert.tradeId
            val existingTrade = entityDb.get(tradeId)
            require(existingTrade != null) {
                "Failed to find trade with id: $tradeId"
            }
            validationAck(validationContext = existingTrade)
        }
        onCommit { event, context ->
            val tradeAlert = event.details
            val trade = context ?: throw IllegalStateException("Expected trade with id ${tradeAlert.tradeId} as context but it is missing")
            trade.acknowledged = true
            entityDb.modify(trade)
            ack()
        }
    }
```

## Handling exceptions
This is an example of how to use [`onException`](/server-modules/event-handler/advanced/#onexception)
in an Event Handler.
```kotlin
    eventHandler<Company>(name = "COMPANY_INSERT") {
        onException { event, throwable ->
            val company = event.details
            nack("Error when trying to insert company with id ${company.companyId}! ${throwable.message}")
        }

        onCommit { event ->
            val company = event.details
            val result = entityDb.insert(company)
            ack(listOf(mapOf("VALUE" to result.record.companyId)))
        }
    }
```

## Authorisation
### permissioning
This is an example of how to add [authorisation](/server-modules/event-handler/advanced/#permissioning-and-permissioncodes)
to an Event Handler.

```kotlin
    eventHandler<Company>(name = "AUTH_COMPANY_INSERT") {
        permissioning {
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

### fixed permissions
And now an example with [fixed permissions](http://localhost:3000/server-modules/event-handler/advanced/#permissioning-and-permissioncodes).

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

## Transactions
Below is an example of how to make an Event Handler [transactional](http://localhost:3000/server-modules/event-handler/basics/#transactional-event-handlers-acid).

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

## Approval requests
The example below is a simple Event Handler that [requires approval](/server-modules/event-handler/advanced/#pending-approvals).
```kotlin

eventHandler {
    eventHandler<Company> {
        requiresPendingApproval = true
        onCommit { event ->
            val company = event.details
            // custom code block..
            ack()
        }
    }
}
```
