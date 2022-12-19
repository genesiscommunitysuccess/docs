---
title: 'Event Handler - Examples'
sidebar_label: 'Examples'
id: examples
keywords: [server, event handler, examples]
tags:
  - server
  - event handler
  - examples
---



On this page, you can find useful examples of code for an Event Handler. We start with a very basic example, and then we provide further examples to cover key functions, such as exception handling and permissioning.

Also, there is a nice simple example of an `eventHandler` codeblock in our [tutorial](../../../getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/#create-the-eventhandler). 


## Basic
The example below is a simple Event Handler to validate input and insert a record in the database. There is an [`onValidate`](../../../server/event-handler/basics/#adding-validation) block that defines the validation and an [`onCommit`](../../../server/event-handler/basics/#a-simple-example-of-an-event-handler) block that specifies the action that is to be taken.
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
This next snippet is an example of how to reuse data between [onValidate](../../../server/event-handler/basics/#adding-validation) and [onCommit](../../../server/event-handler/basics/#a-simple-example-of-an-event-handler) using a `contextEventHandler`. In the `onValidate` block, we check to see if a trade exists in the database, and we pass it as _context_ to the `onCommit` block so we don't have to do another database lookup.

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
GPAL exception handling differs from the standard Java/Kotlin method. Take a look at this example below. When an exception occurs, the [`onException`](../../../server/event-handler/advanced/#onexception) codeblock extracts the company name from the source request and includes it in the error message.

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
### Permissioning
This is an example of how to add [authorisation](../../../server/event-handler/advanced/#permissioning-and-permissioncodes)
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
And now an example with fixed permissions.

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

## ACID compliance
Below is an example of how to make an Event Handler [ACID](../../../getting-started/glossary/glossary/#acid)-compliant. The opening line declares that this `eventHandler` codeblock is [transactional](../../../server/event-handler/basics/#transactional-event-handlers-acid).

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
The example below is a simple `eventHandler` codeblock that [requires approval](../../../server/event-handler/advanced/#pending-approvals).
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
