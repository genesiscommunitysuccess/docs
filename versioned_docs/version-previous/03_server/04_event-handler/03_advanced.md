---
title: 'Event Handler - advanced'
sidebar_label: 'Advanced'
id: advanced
keywords: [server, event handler, advanced, approval, approvals, pending approvals]
tags:
  - server
  - event handler
  - advanced
  - approval
  - approvals
  - pending approvals
---


## Custom reply message type
If you use a custom reply message type, you won’t be able to use the default `ack()` or `validationAck()` functions.  The custom message type needs to be returned from the method.

For a custom message type called `TradeEvent` defined as:

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

...and a custom message reply type called `CustomTradeEventReply` defined as:

```kotlin
sealed class CustomTradeEventReply : Outbound() {
    class TradeEventValidateAck : CustomTradeEventReply()
    data class TradeEventAck(val tradeId: String) : CustomTradeEventReply()
    data class TradeEventNack(val error: String) : CustomTradeEventReply()
}
```

Add `CustomTradeEventReply` under **&#123;app-name}-messages** and assemble. Once you have built, add `api(project(":&#123;app-name}-messages"))` to your build.gradle.kts file under **&#123;app-name}-script-config/build.gradle.kts**.

...you can now use the following example Event Handler:

```kotlin
    eventHandler<TradeEvent, CustomTradeEventReply>(name = "CUSTOM_TRADE_EVENT") {
        onException { event, throwable ->
            CustomTradeEventReply.TradeEventNack(throwable.message!!)
        }
        onValidate {
            val tradeEvent = it.details
            val notional = tradeEvent.price?.times(tradeEvent.quantity!!.toDouble())
            
            require(notional!! < 1_000_000) { "Trade notional is too high" }
            CustomTradeEventReply.TradeEventValidateAck()
        }
        onCommit { event ->
            val trade = event.details
            val result = entityDb.insert(trade)
            CustomTradeEventReply.TradeEventAck(result.record.tradeId)
        }
    }
```

The following code assumes you have built your fields and tables after you created your `TradeEvent` under **jvm/&#123;app-name}-config** with a primary key of `tradeId`. If intelliJ can't find your `TradeEvent`, go back and build your fields and tables as per the [Data Model Training](../../../getting-started/learn-the-basics/data-model/).

### onException

The `onException` block can capture any exceptions thrown by the `onValidate` and `onCommit` blocks and returns the expected reply message type (as shown in the last example). This function is particularly useful if you are using a custom message type; by default, Event Handlers will attempt to translate exceptions automatically to an `EventNack` message, which might cause compatibility problems if you are using custom replies.

## Permissioning and permissionCodes

As with other GPAL files (e.g. Request Server and Data Server), you can use a `permissioning` block to define both dynamic permissions (AUTH) and fixed permissions (based on RIGHT_SUMMARY rights) on Event Handlers.

### Dynamic permissions
For Event Handlers you need to use any class as event message type instead of table/view, which is similar to custom request-replies.
In the below example we use a generated database entity called `Company` as message type of event `EVENT_AUTH_COMPANY_INSERT`

```kotlin
    eventHandler<Company>(name = "AUTH_COMPANY_INSERT") {
        permissioning {
            auth(mapName = "COMPANY"){
                field { companyName } 
            }
        }

        onCommit { event ->
            val company = event.details
            val result = entityDb.insert(company)
            ack(listOf(mapOf("VALUE" to result.record.companyId)))
        }
    }
```

If you use custom class instead of generated database entities as message-type of events, we recommend that you locate your classes within the messages module of your application. This is where we place all the custom message types for our application. You need to ensure that the _app-name_**-script-config** module has a dependency on the messages module.

```bash
    api(project(":_app-name_-messages"))
```
### Permission codes

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

You can find out more details in our section on [authorisation](../../../server/access-control/authorisation-overview/).


## Auto auditing

If the Event Handler message type is a database-generated entity that is auditable, Genesis automatically creates an audit record to the corresponding audit table for each database write operation. The audit fields are filled with the following values:

* AUDIT_EVENT_TYPE: Event name
* AUDIT_EVENT_DATETIME: Autogenerated
* AUDIT_EVENT_TEXT: Optional “REASON” value sent as part of the event message
* AUDIT_EVENT_USER: Extracted from the event message

To guarantee that the audit record is inserted into the audit table, Genesis provides a parameter to `eventhandler` blocks: `transactional = true | false`.

[Transactional eventhandlers](../../../server/event-handler/basics/#transactional-event-handlers-acid) are [ACID](../../../getting-started/glossary/glossary/#acid)-compliant, which means that they use concept of transactions to guarantee that the audit record is inserted into the audit table. In other words, if `transactional = true` and the `eventHandler` triggered finishes its excecution, then it is guaranteed that the audit record is inserted.

:::warning
Make sure your database supports transactions.
:::

## Auto auditing for Java Event Handlers
The advantage of using Kotlin is that you can set up automatic auditing with a single line of code. However, if you are working in Java, then you need to use [`RxEntityDb`](../../../database/database-interface/entity-db/) to interact with the database, and automatic auditing is not available.

You can solve this by setting up a simple handler and using this in your `eventHandler` codeblock before you write to the table. This will provide your audited records when you insert, modify and delete on the table.

For example:

```java
var auditEntityDb = db.audited(
                    userName,
                    eventType,
                    auditText
            );
            auditEntityDb.modify(trade).subscribe();
```

There is more information about using Java in our page on [Java Event Handlers](../../../server/event-handler/java-event-handlers/)

## Defining state machines

State machines, which define the conditions for moving from one state to another, are defined within your Event Handler files. See more details about these in the section on [Defining your state machines](../../../server/state-machine/introduction/).

## Disabling schema validation

It is possible to disable the automatic JSON Schema validation enforced by default for all type-safe messages for each individual event handler.

To disable schema validation for a specific event, either:

- Override the `schemaValidation` method to `false` in the custom Event Handler definitions. 
or
- Set the `schemaValidation` property to `false` in a GPAL Event Handler.

Here is an example of a custom Event Handler definition:
```kotlin
import global.genesis.commons.annotation.Module
import global.genesis.eventhandler.typed.async.AsyncValidatingEventHandler
import global.genesis.message.core.event.Event
import global.genesis.message.core.event.EventReply

@Module
class TestCompanyHandlerAsync : AsyncValidatingEventHandler<Company, EventReply> {
    // Override schemaValidation here to disable schema validation
    override fun schemaValidation(): Boolean = false
    
    override suspend fun onValidate(message: Event<Company>): EventReply {
        val company = message.details
        // custom code block..
        return ack()
    }

    override suspend fun onCommit(message: Event<Company>): EventReply {
        val company = message.details
        // custom code block..
        return ack()
    }
}
```

or in a GPAL definition:

```kotlin

eventHandler {
    eventHandler<Company> {
        schemaValidation = false
        onCommit { event ->
            val company = event.details
            // custom code block..
            ack()
        }
    }
}
```

See more information about how to define type-safe messages [here](../../../server/network-messages/type-safe-messages/).

## Pending approvals

The Genesis low-code platform has an in-built pending approval mechanism that can be used with Event Handlers. This is useful where particular events require a second user to approve them in order to take effect. Genesis Pending Approvals works with the concepts of “delayed” events and "4-eyes check". 


### Set an event to require approval

To enable the pending approval workflow for an Event Handler implementation, either:

- Override the `requiresPendingApproval` method with an appropriate function in the custom Event Handler definitions. 

or

- Configure the `requiresPendingApproval` block in a GPAL Event Handler.

Both of these options involve implementing a function with the event message as an input and a Boolean value as a return value.

Here is an example of a GPAL Event Handler definition where `event.userName` is used to gain access to the user who triggered the event; if the user name is not **system.user**, it is directed to an approval procedure:

```kotlin
eventHandler {
    eventHandler<Company>("COMPANY_INSERT") {
        // Override requiresPendingApproval here to enable the "pending approval" flow.
        // In this implementation, any user that is not "system.user" needs to go through the approval mechanism.
        // The last line just needs to evaluate to a boolean; if false it does not require approval, if true it does
        requiresPendingApproval { event ->
            event.userName != "system.user"
        }
        onCommit { event ->
            val company = event.details
            // custom code block..
            ack()
        }
    }
}
```

or in a custom Event Handler definition:

```kotlin
package global.genesis.position.samples.events.async

import global.genesis.commons.annotation.Module
import global.genesis.eventhandler.typed.async.AsyncContextValidatingEventHandler
import global.genesis.gen.dao.Company
import global.genesis.message.core.event.Event
import global.genesis.message.core.event.EventReply
import global.genesis.message.core.event.ValidationResult

@Module
class TestCompanyHandlerAsyncContext : AsyncContextValidatingEventHandler<Company, EventReply, String> {
  override suspend fun onValidate(message: Event<Company>): ValidationResult<EventReply, String> {
    val company = message.details
    // custom code block..
    val companyName = company.companyName
    return validationResult(ack(), companyName)
  }

  override suspend fun onCommit(message: Event<Company>, context: String?): EventReply {
    if(context != null){
      // Do something with the context
    }
    val company = message.details
    // custom code block..
    return ack()
  }
}
```

### Pending approval workflow

Events going through a pending approval workflow are validated as usual (i.e. the `onValidate` method is run).  If the validation is successful, the “delayed” event is stored in the `APPROVAL` table in JSON format. 

Assuming the event is inserting, updating or deleting a target database record, it is possible to have multiple `APPROVAL` records associated with a single database entity. So, you should use the event `onValidate` method to check for pre-existing approvals against the entities related to the event if you need to ensure there is only one pending approval per record. 

The `APPROVAL` record is keyed on an auto-generated `APPROVAL_ID` and does not have a direct link to the original record(s). You have to create one or many links by adding “approval entity” details to the payload returned within an `approvableAck` inside the `onValidate` method. These details include the `entityTable` (e.g COUNTERPARTY), `entityKey` (e.g. COUNTERPARTY_ID), as well as an optional `approvalType` to describe what operation is happening on the entity itself (e.g. NEW, UPDATE or REMOVE). 

This approach enables you to decide how to identify the original record (e.g. creating a compound key in the case of multi-field keys). When the approval entity details are provided, the platform creates one or several records in the `APPROVAL_ENTITY` table; it populates it (them) with the details provided and the `APPROVAL_ID` of the `APPROVAL` record. There is also an `APPROVAL_ENTITY_COUNTER`, which is populated by the GENESIS_AUTH_CONSOLIDATOR process by default; this can be handy when you need to know how many approvals are pending for a given entity.

There are other useful properties you can set as part of the `approvableAck` definition. They are all optional and are detailed below:

* `entityDetails` is a list of `ApprovalEntityDetails` with their corresponding `entityTable`, `entityId` and `approvalType` properties (see previous paragraph). By default, this list is empty.
* `approvalMessage` contains the text that is sent back to the client, assuming the event is successfully submitted for approval. The default is "Your request was successful and has been submitted for approval".
* `additionalDetails` can provide context information that is only available from a server-side perspective. This information complements the `APPROVAL_MESSAGE` content provided by the front end.
* `approvalType` is used to state the action that happens when this event is approved: NEW for insertions, UPDATE for amends, REMOVE for removals. If undefined, this defaults to UNKNOWN). Most events will be simple, but of course some could affect multiple entities in different ways, which is why the `entityDetails` parameter can contain many entities, each with their own `approvalType`.

One further proprty, `approvableAck`, can be used in both custom EventHandler definitions and GPAL Event Handlers. Here is an example of `approvableAck` in action for a GPAL Event Handler `onValidate` block below.

```kotlin
eventHandler {
  eventHandler<Company>("COMPANY_AMEND") {
    // Override requiresPendingApproval here to enable the "pending approval" flow.
    // In this implementation, any user that is not "system.user" needs to go through requires going through the approval mechanism.
    // The last line just needs to evaluate to a boolean; if false it does not require approval, if true it does
    requiresPendingApproval { event ->
      event.userName != "system.user"
    }
    onValidate { event ->
      val company = event.details
      // custom validation code block..
      return approvableAck(
        entityDetails = listOf(
          // One or many entities can be affected with a single event, so we can provide the whole list here
          ApprovalEntityDetails(
            entityTable = "COMPANY",
            entityId = event.details.companyId.toString(),
            approvalType = ApprovalType.UPDATE
          )
        ),
        approvalMessage = "Company update for ${event.details.companyId} has been sent for approval.",
        approvalType = ApprovalType.UPDATE,
        additionalDetails = "Sensitive update, tread carefully"
      )
    }
    onCommit { event ->
      val company = event.details
      // custom code block..
      ack()
    }
  }
}
```

The platform provides two Data Server queries that contain Pending approval information: `ALL_APPROVAL_ALERTS` and `ALL_APPROVAL_ALERTS_AUDITS`


**Example APPROVAL DB record**


```
-------------------------------------------------------------------------------------------
TIMESTAMP                                2023-02-27 15:33:42.364(n:0,s:1019)      NANO_TIMESTAMP      
ACTIONED_BY                              JaneDee                                  STRING              
APPROVAL_ID                              fdef7802-6bd1-4c51-a232-6a4bc2325598A... STRING              
APPROVAL_KEY                             fac1be9f-1653-4ecf-9050-d13cc2d2cdb4A... STRING              
APPROVAL_MESSAGE                         Cancelled                                STRING              
APPROVAL_REQUESTED_AT                    2023-02-27 15:33:38.450 +0000            DATETIME            
APPROVAL_STATUS                          CANCELLED                                ENUM[PENDING APPROVED CANCELLED REJECTED_BY_USER REJECTED_BY_SERVICE]
APPROVAL_TYPE                            REMOVE                                   ENUM[NEW UPDATE REMOVE UNKNOWN]
DESTINATION                              COUNTERPARTY_EVENT_HANDLER               STRING              
EVENT_DETAILS                            ISSUER_ID = 3                            STRING              
EVENT_MESSAGE                            {"DETAILS":{"COUNTERPARTY_ID":3},"MES... STRING              
MESSAGE_TYPE                             EVENT_COUNTERPARTY_DELETE                STRING              
USER_NAME                                JaneDee                                  STRING              
-------------------------------------------------------------------------------------------
```

**Example APPROVAL_ENTITY record**

```
-------------------------------------------------------------------------------------------
TIMESTAMP                                2023-02-27 15:33:38.459(n:0,s:1004)      NANO_TIMESTAMP      
APPROVAL_ID                              fdef7802-6bd1-4c51-a232-6a4bc2325598A... STRING              
APPROVAL_TYPE                            REMOVE                                   ENUM[NEW UPDATE REMOVE UNKNOWN]
ENTITY_ID                                3                                        STRING              
ENTITY_TABLE                             COUNTERPARTY                             STRING              
-------------------------------------------------------------------------------------------
```

### Available pending approval events

Once in the `APPROVAL` table, the pending event can be cancelled, rejected or accepted by sending the following event messages to GENESIS_CLUSTER: 

- EVENT_PENDING_APPROVAL_ACCEPT
- EVENT_PENDING_APPROVAL_CANCEL
- EVENT_PENDING_APPROVAL_REJECT

All messages require a valid `APPROVAL_ID` and `APPROVAL_MESSAGE` in their metadata.

### Configuring allowed approvers: basic

The platform ensures that users cannot approve or reject their own events, but they can cancel them. To complement this, users that have not created a specific pending approval event can only accept or reject, not cancel. 

Additional levels of control (e.g. based on user groups) can be added at three points:

- to the front end
- to the event `onValidate` method
- specified in the server-side configuration

To configure the allowed approvers using server-side configuration:

1. Create a new GPAL approval file; its name must end in **-approval.kts** (e.g. **_test_-approval.kts**). 

2. Add the file name to the GENESIS_CLUSTER `<script></script>` element in the site-specific version of the **genesis-processes.xml**. See the sample file below:

```kotlin
import global.genesis.session.RightSummaryCache

val rightSummaryCache = inject<RightSummaryCache>()

pendingApproval {
    insert {
        true
    }

    accept {
      val userAttributes = entityDb.get(UserAttributes.byName(userName))
      userAttributes?.accessType == AccessType.INTERNAL
    }

    cancel {
        true
    }

    reject {
      rightSummaryCache.userHasRight(userName, "REJECT_PENDING_APPROVAL")
    }
}
```

You can replace the "true" return values with Kotlin code in each of the relevant blocks, or not define them at all, as they will return "true" by default.

The platform makes the following objects accessible to the `insert` block:

* `insertMessage` - an instance of the `PendingApprovalInsert` class, which is used to populate the `APPROVAL` table if successful. The content of this class consists of several properties:
    * `approvalMessage` - contains the original approval message text sent by the user who initiated the action.
    * `messageType` - represents the original EVENT name (e.g. EVENT_TRADE_INSERT).
    * `destination` - is the process name this event was originally targeting (e.g. POSITION_EVENT_HANDLER).
    * `eventMessage` - contains the JSON object representing the original message payload.
    * `approvalType` - equivalent to the property with the same name provided as part of `approvableAck` (see [earlier section](#pending-approvals)).
    * `additionalDetails` - equivalent to the property with the same name provided as part of `approvableAck` (see [earlier section](#pending-approvals)).
    * `generated` - equivalent to the property named `entityDetails` provided as part of `approvableAck` (see [earlier section](#pending-approvals)).
* `userName` - a string property containing the user name who triggered the event.
* `messageType` - a shortcut property accessor for the `messageType` value stored inside `insertMessage`.
* `eventMessage` - a shortcut property accessor for the `eventMessage` value stored inside `insertMessage`.

The following objects are accessible within the `accept`, `cancel` and `reject` blocks:

* `userName` - a string property containing the user name who triggered the pending approval event (e.g. accept, reject or cancel).
* `pendingApproval` - the pending approval record stored in the database. The type of this property is the "Approval" database entity (see [table entities](../../../database/data-types/table-entities/)).
* `approvalMessage` - an instance of the `ApprovalMessage` class, which represents the payload of the message sent to EVENT_PENDING_APPROVAL_ACCEPT, EVENT_PENDING_APPROVAL_CANCEL and EVENT_PENDING_APPROVAL_REJECT. It contains two properties:
    * `approvalMessage` - the message text sent by the user who initiated this pending approval action
    * `approvalId` - contains the APPROVAL_ID used to identify the APPROVAL record we are handling as part of this action
* `messageType` - a shortcut property accessor for the `messageType` value stored inside `pendingApproval`.
* `eventMessage` - a shortcut property accessor for the `eventMessage` value stored inside `pendingApproval`.

The following properties are automatically available for the whole scope of the **-approval.kts** file:

```kotlin
val systemDefinition: SystemDefinitionService
val rxDb: RxDb
val entityDb: AsyncEntityDb
val evaluatorPool: EvaluatorPool
val networkConfiguration: NetworkConfiguration
val serviceDetailProvider: ServiceDetailProvider
val serviceDiscovery: ServiceDiscovery
val injector: Injector
```

As shown in the previous code example, you can perform database lookups to retrieve additional information and return `true` only if the necessary rights or attributes are in place. For example, if your system has the concept of internal and external users, and you only want to allow internal users to accept pending events, then you could check your custom user "ACCESS_TYPE" field as follows:

```kotlin
pendingApproval {
    accept {
        val userAttributes = entityDb.get(UserAttributes.byName(userName))
        userAttributes?.accessType == AccessType.INTERNAL
    }
}
```

### Configuring allowed approvers: advanced

You might have noticed that the original type-safe event message types are lost inside the **-approval.kts** file, as the content of `eventMessage` inside `APPROVAL` table (and also inside `PendingApprovalInsert`) is a serialised JSON string. You can deserialise the original type-safe objects using the `selectPredicate` method combined with multiple `onEvent` predicates. These methods are available in all the `pendingApproval` code blocks: `insert`, `accept`, `cancel` and `reject`.

- `selectPredicate` is a function that accepts an indeterminate number of functions returning a boolean value, as well as a mandatory `default` function to handle messages that do not fall into any defined category. The `default` function  provides a [GenesisSet](../../03_server/09_network-messages/02_genesisset.md) object with the contents of the original message payload.
- `onEvent` works very similarly to any other GPAL [Event Handler definition](#defining-an-event-handler-in-gpal). It enables you to treat the incoming message in the same way as you would have done within the original Event Handler; however, each function must return a boolean expression.


Please see the example below for custom logic using a table called "RESTRICTED_SYMBOL" to prevent restricted symbols from being added to the system, as well as checking user right codes:

```kotlin
import global.genesis.session.RightSummaryCache

val rightSummaryCache = inject<RightSummaryCache>()

pendingApproval {
  accept {
    selectPredicate(
      onEvent<TradeInsert>("TRADE_INSERT") { event ->
        val tradeInsert = event.details
        val stockInRestrictedList = entityDb.get(RestrictedSymbol.bySymbol(tradeInsert.symbol))
        // Deny any operation on restricted symbols.
        if (stockInRestrictedList != null) {
          false
        } else {
          rightSummaryCache.userHasRight(userName, "TRADE_INSERT")
        }
      },
      onEvent<TradeAmend>("TRADE_AMEND") { event ->
        val tradeAmend = event.details
        val stockInRestrictedList = entityDb.get(RestrictedSymbol.bySymbol(tradeAmend.symbol))
        // Deny any operation on restricted symbols.
        if (stockInRestrictedList != null) {
          false
        } else {
          rightSummaryCache.userHasRight(userName, "TRADE_AMEND")
        }
      },
      onEvent<TradeDelete>("TRADE_DELETE") { event ->
        val tradeDelete = event.details
        val stockInRestrictedList = entityDb.get(RestrictedSymbol.bySymbol(tradeDelete.symbol))
        // Deny any operation on restricted symbols.
        if (stockInRestrictedList != null) {
          false
        } else {
          rightSummaryCache.userHasRight(userName, "TRADE_DELETE")
        }
      },
      // If the message can't be deserialized we will use a default fallback to genesisSet.
      default = { genesisSet ->
        true
      }
    )
  }
}
```
### System rejects

An approval process deliberately delays events. So it is possible that by the time a pending approval action is approved, the underlying data has changed enough to cause the delayed event to fail when executed. When this happens, the pending approval record will be marked as REJECTED_BY_SYSTEM in its `APPROVAL_STATUS` field.

The platform provides an event designed to help you to reject events directly from the back end without human intervention. "EVENT_PENDING_APPROVAL_SYSTEM_REJECT" is an event that can be used to satisfy any specific requirements that fall outside the functionality of the pending approval system. The event is only accessible by back-end services. It takes two parameters:

- `approvalMessage` is the text of the message to be sent when the message is rejected. 
- `approvalKey` is a unique identifier for each pending approval record. This identifier is never exposed to the front end, so only back-end services have access to it. That makes it impossible to trigger this event unless you have access to the database system. You need to obtain the `approvalKey` programatically so that you can supply it as a parameter value.

Let us look at an example. Consider a solution that needs to submit trades to an external system every day at midnight for confirmation purposes. Once the trades have been submitted, their content cannot be changed anymore, unless a separate amendment process is started outside the Genesis application. The system has a pending approval system that enables users to amend the content of each "Trade" database record to provide extra security.

Once a "Trade" record has been submitted at midnight, you need to prevent any pending approval events from amending the content of the trade records in the system, as this could cause inconsistencies between the external system and the Genesis system. To prevent this, you could run a job that automatically rejects all pending approval records at midnight every day.

Here is an example GPAL script that could be run every day at midnight to reject all the pending records. 

```kotlin
import global.genesis.clustersupport.service.ServiceDiscovery
import global.genesis.message.core.event.ApprovalSystemRejectMessage
import global.genesis.message.core.event.Event
import global.genesis.pal.shared.inject
import kotlin.system.exitProcess

val serviceDiscovery: ServiceDiscovery = injector.inject()
val client = serviceDiscovery.resolveClientByResource("EVENT_PENDING_APPROVAL_SYSTEM_REJECT")
if (client == null || !client.isConnected) {
    println("Unable to find service exposing EVENT_PENDING_APPROVAL_SYSTEM_REJECT")
    exitProcess(1)
} else {
    suspendable {
        entityDb.getBulk<Approval>()
            .filter { it.approvalStatus == ApprovalStatus.PENDING }
            .collect { approval ->
                val reply: EventReply? = client.suspendRequest(
                    Event(
                        messageType = "EVENT_PENDING_APPROVAL_SYSTEM_REJECT",
                        userName = "SYSTEM",
                        details = ApprovalSystemRejectMessage(
                            approvalKey = approval.approvalKey,
                            approvalMessage = "Rejected by system"
                        )
                    )
                )
                when (reply) {
                    is EventReply.EventAck ->
                        println("Successfully rejected APPROVAL_ID: $&#123;approval.approvalId}")
                    is EventReply.EventNack ->
                        println("Failed to rejected APPROVAL_ID: $&#123;approval.approvalId}: $reply")
                    else ->
                        println("Unexpected response from pending approval system: $reply")
                }
            }
    }
}
```

## Defining an Event Handler in GPAL

In most cases, you will create [Event Handlers](../../../server/event-handler/introduction/) in a kts file using GPAL. This offers a method with succinct code and a good degree of flexibility.

However, you can also implement Event Handlers as a set of classes. Typically, this is useful where you have a complex requirement for business logic and database interaction. For example, a kts file of 1,000 lines is difficult to test and maintain; in this case, a set of individual classes is much more convenient.

For implementing an Event Handler as a set of classes, there are three different options:

-   Async. This uses the Kotlin coroutine API to simplify asynchronous development. This is the underlying implementation used in GPAL Event Handlers. You can only create Async Event Handlers using Kotlin.
-   RxJava3. This uses the RxJava3 library, which is a popular option for composing asynchronous event-based programs. You can create RxJava3 Event Handlers using either Kotlin or Java.
-   Sync. This creates synchronous Event Handlers. You can create Sync Event Handlers using either Kotlin or Java.

:::note

Java Event Handlers can be implemented using [RxJava3](../../../server/api-reference/event-handler-api/#rx3eventhandler) and [Sync](../../../server/api-reference/event-handler-api/#sync) Event Handlers only. Async Event Handlers cannot be used, as there is no implementation for Kotlin coroutines in Java.

**We recommend using Kotlin to implement Event Handlers.**
:::

If you would like to know more about creating an event handler in GPAL, please visit our [event-handler-api](../../../server/api-reference/event-handler-api) page.

### Available properties

The following properties are automatically available inside GPAL Event Handlers:

```kotlin
val systemDefinition: SystemDefinitionService
val rxDb: RxDb
val entityDb: AsyncEntityDb
val metaData: MetaDataRegistry
val evaluatorPool: EvaluatorPool
val messageDelegator: MessageDelegator
val networkConfiguration: NetworkConfiguration
val serviceDetailProvider: ServiceDetailProvider
val genesisHFT: GenesisHFT
val injector: Injector
val clientConnectionsManager: ClientConnectionsManager
val typedEventManager: TypedEventManager
```
