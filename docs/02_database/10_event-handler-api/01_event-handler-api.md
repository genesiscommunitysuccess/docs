---
title: 'Event Handler API'
sidebar_label: 'Event Handler API'
id: event-handler-api
---

Custom Event Handlers
=====================

Custom Event Handlers provide a way of implementing business logic in Java or Kotlin outside the Genesis GPAL Event Handler definition, in a more traditional and flexible development approach. Genesis has three different flavours of custom Event Handler:

-   Async. This uses the Kotlin coroutine API to simplify asynchronous development. This is the underlying implementation used in GPAL Event Handlers.
-   RxJava3. This uses the RxJava3 library, which is a popular option for composing asynchronous event-based programs.
-   Sync. This creates synchronous Event Handlers.

##### NOTE

Java event handlers can be implemented using [RxJava3](/database/event-handler-api/event-handler-api/#rx3eventhandler) and [Sync](/database/event-handler-api/event-handler-api/#sync) Event Handlers only. Asynch Event Handlers cannot be used, as there is no implementation for Kotlin coroutines in Java.

We recommend using Kotlin to implement Event Handlers

Configure in processes.xml file[​](/database/event-handler-api/event-handler-api/#configure-in-processesxml-filedirect-link-to-heading)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

You need to add the `global.genesis.eventhandler` package in the package tag of the process; this tag defines which package the process should refer to. For example:

```
  <process name="POSITION_NEW_PROCESS">    <groupId>POSITION</groupId>    <start>true</start>    <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>    <module>position-new-process</module>    <package>global.genesis.eventhandler,position.company.manager</package>    <description>Handles events</description>  </process>
```

Event Handler interface[​](/database/event-handler-api/event-handler-api/#event-handler-interfacedirect-link-to-heading)
----------------------------------------------------------------------------------------------------------------------------------------------------------

The Event Handler interface is the common supertype of AsyncEventHandler, Rx3EventHandler and SyncEventHandler, but it is not meant to be used on its own. It provides basic options for each Event Handler definition, which can be overridden. See the Kotlin methods explanation below:

| Name | Signature | Default value | Description |
| --- | --- | --- | --- |
| excludeMetadataFields | `fun excludeMetadataFields(): Set<String>` | setOf("RECORD_ID", "TIMESTAMP") | Contains a list of metadata fields to be excluded from the event metadata extracted from the input `I` |
| includeMetadataFields | `fun includeMetadataFields(): Set<String>` | emptySet() | Contains a list of metadata fields that need to be included in the event metadata; this must be available in input `I`. A non-empty list will exclude the other fields. |
| messageType | `fun messageType(): String?` | null | Contains the name of the Event Handler. If undefined, the Event Handler name will become `EVENT_*INPUT_CLASS_NAME*`. So, for an Event Handler using an input type called `TradeInsert`, the message type will become `EVENT_TRADE_INSERT`. |
| overrideMetadataFields | `fun overrideMetadataFields(): Map<String, OverrideMetaField>` | emptySet() | Contains a map (key-value entries) of metadata field names to metadata field definitions in the shape of `OverrideMetaField`. This enables you to override the metadata field properties extracted from input `I` |
| requiresPendingApproval | `fun requiresPendingApproval(): Boolean` | false | This is used where particular system events require a second system user to approve them ([pending approval](https://docs.genesis.global/secure/creating-applications/defining-your-application/business-logic/event-handlers/eh-advanced-technical-details/#pending-approvals) in order to take effect) |

Each custom Event Handler must define an input message type `I` and an output message type `O` (these need to be data classes), as GPAL Event Handlers do). In the examples below, `Company` is the input message and `EventReply` is the output message. The `message` object contains event message and has the following properties :

| Name | Default value | Description |
| --- | --- | --- |
| details |  | This has input information, example: Company |
| messageType |  | Name of the Event Handler |
| userName |  | Name of logged-in user |
| ignoreWarnings | false | If set to false, events will not be processed if there are any warnings; you will get EventNack with warning message. If set to true, warning messages will be ignored; processing of events will be stopped only if there are any errors |
| requiresApproval | false | This particular event needs approval from a second user if set to true. For more details, check [Pending Approval](https://docs.genesis.global/secure/creating-applications/defining-your-application/business-logic/event-handlers/eh-advanced-technical-details/#pending-approvals) |
| approvalKey | null | Auto-generated key ID for particular approval request. For more details, check [Pending Approval](https://docs.genesis.global/secure/creating-applications/defining-your-application/business-logic/event-handlers/eh-advanced-technical-details/#pending-approvals) |
| approvalMessage | null | Optional message for approval request. For more details, check [Pending Approval](https://docs.genesis.global/secure/creating-applications/defining-your-application/business-logic/event-handlers/eh-advanced-technical-details/#pending-approvals) |
| reason | null | Optional reason sent as part of event message |

Inject objects[​](https://docs.genesis.global/secure/reference/developer/api/event-handler-api/#inject-objects "Direct link to heading")
----------------------------------------------------------------------------------------------------------------------------------------

Use [@Inject](https://docs.genesis.global/secure/reference/developer/dependency-injection/#inject) to provide instances for any objects needed as part of the dependency injection stage

Async[​](/database/event-handler-api/event-handler-api/#asyncdirect-link-to-heading)
----------------------------------------------------------------------------------------------------------------------

### AsyncEventHandler[​](/database/event-handler-api/event-handler-api/#asynceventhandlerdirect-link-to-heading)

This is the most basic definition of an Async Event Handler. You can define an `AsyncEventHandler` by implementing the `AsyncEventHandler` interface, which is defined as: `interface AsyncEventHandler<I : Any, O : Outbound> : AsyncEventWorkflowProcessor<I, O>, EventHandler`

The only mandatory method to implement this in the interface is:

| Name | Signature |
| --- | --- |
| process | `fun suspend process(message: Event<I>) : O` |

This method passes the input message type `I` as a parameter and expects the output message type `O` to be returned.

Here is an example:

```
import com.google.inject.Injectimport global.genesis.commons.annotation.Moduleimport global.genesis.db.rx.entity.multi.AsyncEntityDbimport global.genesis.eventhandler.typed.async.AsyncEventHandlerimport global.genesis.gen.dao.Companyimport global.genesis.message.core.event.Eventimport global.genesis.message.core.event.EventReply@Moduleclass EventCompanyHandlerAsync @Inject constructor(        private val entityDb: AsyncEntityDb,        private val companyService: CompanyService) : AsyncEventHandler<Company, EventReply> {    override suspend fun process(message: Event<Company>): EventReply {        val company = message.details        // custom code block..        return EventReply.EventAck()    }}
```

The methods below are provided as part of `AsyncEventHandler`; they provide an easy way of creating `EventReply` responses.

| Name | Signature |
| --- | --- |
| ack | `fun <I : Any> AsyncEventHandler<I, EventReply>.ack(): EventReply` |
| ack | `fun <I : Any> AsyncEventHandler<I, EventReply>.ack(generated: List<Map<String, Any>> = emptyList()): EventReply` |
| nack | `fun <I : Any> AsyncEventHandler<I, EventReply>.nack(throwable: Throwable): EventReply` |
| nack | `fun <I : Any> AsyncEventHandler<I, EventReply>.nack(error: String): EventReply` |

Using these helper methods, you could simplify the previous implementation like this:

```
import global.genesis.commons.annotation.Moduleimport global.genesis.eventhandler.typed.async.AsyncEventHandlerimport global.genesis.message.core.event.Eventimport global.genesis.message.core.event.EventReply@Moduleclass EventCompanyHandlerAsync : AsyncEventHandler<Company, EventReply> {    override suspend fun process(message: Event<Company>): EventReply {        val company = message.details        // custom code block..        return ack()    }}
```

### AsyncValidatingEventHandler[​](/database/event-handler-api/event-handler-api/#asyncvalidatingeventhandlerdirect-link-to-heading)

In the previous example, there was no distinction between validation and commit blocks, which is possible in GPAL Event Handlers. In order to have a better separation of concerns using custom Event Handlers, you can implement the `AsyncValidatingEventHandler` interface, which is defined as:

`interface AsyncValidatingEventHandler<I : Any, O : Outbound> : AsyncEventHandler<I, O>`

### Implementation[​](/database/event-handler-api/event-handler-api/#implementationdirect-link-to-heading)

Using this interface, you do not need to override the `process` method; you can split your logic into validation and commit stages. There are various methods of implementing this, which are described below:

| Name | Signature |
| --- | --- |
| onValidate | `suspend fun onValidate(message: Event<I>): O` |
| onCommit | `suspend fun onCommit(message: Event<I>): O` |

Here is an example:

```
import global.genesis.commons.annotation.Moduleimport global.genesis.eventhandler.typed.async.AsyncValidatingEventHandlerimport global.genesis.message.core.event.Eventimport global.genesis.message.core.event.EventReply@Moduleclass TestCompanyHandlerAsync : AsyncValidatingEventHandler<Company, EventReply> {    override suspend fun onValidate(message: Event<Company>): EventReply {        val company = message.details        // custom code block..        return ack()    }    override suspend fun onCommit(message: Event<Company>): EventReply {        val company = message.details        // custom code block..        return ack()    }}
```

If the `validate` flag is received as `true`, only the `onValidate` code block will be executed. If the `validate` flag is received as `false`, both the `onValidate` and `onCommit` blocks will be executed.

### AsyncContextValidatingEventHandler[​](/database/event-handler-api/event-handler-api/#asyncvalidatingeventhandlerdirect-link-to-heading)

In some cases, you might want to carry information from the `onValidate` code block to the `onCommit` code block for efficiency purposes. (For example, if several database look-ups happen in `onValidate` and you want to reuse that information.) Using the `AsyncContextValidatingEventHandler` interface, you can provide this context information from the validation stage to the commit stage. See the interface below: `interface AsyncContextValidatingEventHandler<I : Any, O : Outbound, C : Any> : AsyncEventHandler<I, O>`

### Implementation[​](/database/event-handler-api/event-handler-api/#implementationdirect-link-to-heading)

As with the previous example, when using this interface, you do not need to override the `process` method. The different methods for implementing this are described below:

| Name | Signature |
| --- | --- |
| onValidate | `suspend fun onValidate(message: Event<I>): ValidationResult<O, C>` |
| onCommit | `suspend fun onCommit(message: Event<I>, context: C?): O` |

The `validationResult` methods are provided to help with the context creation:

| Name | Signature |
| --- | --- |
| validationResult | `fun validationResult(result: O): ValidationResult<O, C>` |
| validationResult | `fun validationResult(result: O, context: C): ValidationResult<O, C>` |

The type `C` represents the contextual information we want to provide, and it can be any Java/Kotlin type. Here is an example:

```
import global.genesis.commons.annotation.Moduleimport global.genesis.eventhandler.typed.async.AsyncContextValidatingEventHandlerimport global.genesis.message.core.event.Eventimport global.genesis.message.core.event.EventReplyimport global.genesis.message.core.event.ValidationResult@Moduleclass TestCompanyHandlerAsync : AsyncContextValidatingEventHandler<Company, EventReply, String> {    override suspend fun onValidate(message: Event<Company>): ValidationResult<EventReply, String> {        val company = message.details        // custom code block..        val companyName = company.companyName        return validationResult(ack(), companyName)    }    override suspend fun onCommit(message: Event<Company>, context: String?): EventReply {        if(context != null){            // Do something with the context        }        val company = message.details        // custom code block..        return ack()    }}
```

Rx3[​](database/event-handler-api/event-handler-api/#rx3direct-link-to-heading)
------------------------------------------------------------------------------------------------------------------

The mechanism explained in [Async](/database/event-handler-api/event-handler-api/#async) can be recycled and reapplied in Rx3 Event Handlers.

Rx3EventHandler[​](/database/event-handler-api/event-handler-api/#rx3eventhandlerdirect-link-to-heading)
------------------------------------------------------------------------------------------------------------------------------------------

In a similar fashion to `AsyncEventHandler`, there is an Rx3 implementation flavour. It works in a very similar way to [`AsyncEventHandler`](/database/event-handler-api/event-handler-api/#asynceventhandler), but requires different return types (i.e. we expect to return RxJava3 `Single<O>` type, instead of just the `O` type).

See the interface definition below: `interface Rx3EventHandler<I : Any, O : Outbound> : Rx3EventWorkflowProcessor<I, O>, EventHandler`

### Implementation[​](/database/event-handler-api/event-handler-api/#implementationdirect-link-to-heading-2)

The mandatory method for implementing this is:

| Name | Signature |
| --- | --- |
| process | `fun process(message: Event<I>) : Single<O>` |

### Helper methods[​](/database/event-handler-api/event-handler-api/#helper-methodsdirect-link-to-heading)

| Name | Signature |
| --- | --- |
| ack | `fun <I : Any> Rx3EventHandler<I, EventReply>.ack(): Single<EventReply>` |
| ack | `fun <I : Any> Rx3EventHandler<I, EventReply>.ack(generated: List<Map<String, Any>> = emptyList()): Single<EventReply>` |
| nack | `fun <I : Any> Rx3EventHandler<I, EventReply>.nack(throwable: Throwable): Single<EventReply>` |
| nack | `fun <I : Any> Rx3EventHandler<I, EventReply>.nack(error: String): Single<EventReply>` |

Here is an example:

-   Kotlin
-   Java

```
    import global.genesis.commons.annotation.Module    import global.genesis.eventhandler.typed.rx3.Rx3EventHandler    import global.genesis.gen.dao.Company    import global.genesis.message.core.event.Event    import global.genesis.message.core.event.EventReply    import io.reactivex.rxjava3.core.Single    @Module    class TestCompanyHandlerRx3 : Rx3EventHandler<Company, EventReply> {        override fun process(message: Event<Company>): Single<EventReply> {            return ack()        }    }
```

### Rx3ValidatingEventHandler[​](/database/event-handler-api/event-handler-api/#rx3validatingeventhandlerdirect-link-to-heading)

The same applies to an Rx3ValidatingEventHandler. It is similar to [AsyncValidatingEventHandler](/database/event-handler-api/event-handler-api/#asyncvalidatingeventhandler) in every way, but the return type is still `Single<O>`.

`interface Rx3ValidatingEventHandler<I : Any, O : Outbound> : Rx3EventHandler<I, O>`

### Implementation[​](database/event-handler-api/event-handler-api/#implementationdirect-link-to-heading-3)

| Name | Signature |
| --- | --- |
| onValidate | `fun onValidate(message: Event<I>): Single<O>` |
| onCommit | `fun onCommit(message: Event<I>): Single<O>` |

Here is an example:

-   Kotlin
-   Java

```
    import global.genesis.commons.annotation.Module    import global.genesis.eventhandler.typed.rx3.Rx3ValidatingEventHandler    import global.genesis.gen.dao.Company    import global.genesis.message.core.event.Event    import global.genesis.message.core.event.EventReply    import io.reactivex.rxjava3.core.Single    @Module    class TestCompanyHandlerRx3 : Rx3ValidatingEventHandler<Company, EventReply> {        override fun onValidate(message: Event<Company>): Single<EventReply> {            val company = message.details            // custom code block..            return ack()        }        override fun onCommit(message: Event<Company>): Single<EventReply> {            val company = message.details            // custom code block..            return ack()        }    }
```

### Rx3ContextValidatingEventHandler[​](/database/event-handler-api/event-handler-api/#rx3contextvalidatingeventhandlerdirect-link-to-heading)

And the same goes for `Rx3ContextValidatingEventHandler` in relation to [AsyncContextValidatingEventHandler](/database/event-handler-api/event-handler-api/#asynccontextvalidatingeventhandler).

`interface Rx3ContextValidatingEventHandler<I : Any, O : Outbound, C : Any> : Rx3EventHandler<I, O>`

### Implementation[​](/database/event-handler-api/event-handler-api/#implementationdirect-link-to-heading-2)

| Name | Signature |
| --- | --- |
| onValidate | `fun onValidate(message: Event<I>): Single<ValidationResult<O, C>>` |
| onCommit | `fun onCommit(message: Event<I>, context: C?): Single<O>` |

### Helper methods[​](database/event-handler-api/event-handler-api/#helper-methodsdirect-link-to-heading)

| Name | Signature |
| --- | --- |
| validationResult | `fun validationResult(result: O): ValidationResult<O, C>` |
| validationResult | `fun validationResult(result: O, context: C): ValidationResult<O, C>` |

Here is an example:

-   Kotlin
-   Java

```
    import global.genesis.commons.annotation.Module    import global.genesis.eventhandler.typed.rx3.Rx3ContextValidatingEventHandler    import global.genesis.gen.dao.Company    import global.genesis.message.core.event.Event    import global.genesis.message.core.event.EventReply    import global.genesis.message.core.event.ValidationResult    import io.reactivex.rxjava3.core.Single    @Module    class TestCompanyHandlerRx3 : Rx3ContextValidatingEventHandler<Company, EventReply, String> {        override fun onValidate(message: Event<Company>): Single<ValidationResult<EventReply, String>> {            val company = message.details            // custom code block..            val companyName = company.companyName            return Single.just(validationResult(EventReply.EventAck(), companyName))        }        override fun onCommit(message: Event<Company>, context: String?): Single<EventReply> {            if (context != null) {            // Do something with the context            }            val company = message.details            // custom code block..            return ack()        }    }
```

Sync[​](/database/event-handler-api/event-handler-api/#syncdirect-link-to-heading)
--------------------------------------------------------------------------------------------------------------------

Sync works similarly to [Async](/database/event-handler-api/event-handler-api/#async) and [Rx3](/database/event-handler-api/event-handler-api/#rx3), but in this case, there is no `Single<O>` returned and no `suspend` modifier used for Kotlin coroutines. The expected output of the Event Handler logic is just the `O` type.

### SyncEventHandler[​](/database/event-handler-api/event-handler-api/#synceventhandlerdirect-link-to-heading)

`interface SyncEventHandler<I : Any, O : Outbound> : SyncEventWorkflowProcessor<I, O>, EventHandler`

### Implementation[​](/database/event-handler-api/event-handler-api/#implementationdirect-link-to-heading-5)

| Name | Signature |
| --- | --- |
| process | `fun process(message: Event<I>) : O` |

### Helper methods[​](/database/event-handler-api/event-handler-api/#helper-methodsdirect-link-to-heading-2)

| Name | Signature |
| --- | --- |
| ack | `fun <I : Any> SyncEventHandler<I, EventReply>.ack(): EventReply` |
| ack | `fun <I : Any> SyncEventHandler<I, EventReply>.ack(generated: List<Map<String, Any>> = emptyList()): EventReply` |
| nack | `fun <I : Any> SyncEventHandler<I, EventReply>.nack(throwable: Throwable): EventReply` |
| nack | `fun <I : Any> SyncEventHandler<I, EventReply>.nack(error: String): EventReply` |

Here is an example:

-   Kotlin
-   Java

```
    import global.genesis.commons.annotation.Module    import global.genesis.eventhandler.typed.sync.SyncEventHandler    import global.genesis.gen.dao.Company    import global.genesis.message.core.event.Event    import global.genesis.message.core.event.EventReply    @Module    class TestCompanyHandlerSync : SyncEventHandler<Company, EventReply> {        override fun process(message: Event<Company>): EventReply {            return ack()        }    }
```

### SyncValidatingEventHandler[​](/database/event-handler-api/event-handler-api/#syncvalidatingeventhandlerdirect-link-to-heading)

`interface SyncValidatingEventHandler<I : Any, O : Outbound> : SyncEventHandler<I, O>`

### Implementation[​](/database/event-handler-api/event-handler-api/#implementationdirect-link-to-heading-6)

| Name | Signature |
| --- | --- |
| onValidate | `fun onValidate(message: Event<I>): O` |
| onCommit | `fun onCommit(message: Event<I>): O` |

Here is an example:

-   Kotlin
-   Java

```
    import global.genesis.commons.annotation.Module    import global.genesis.eventhandler.typed.sync.SyncValidatingEventHandler    import global.genesis.gen.dao.Company    import global.genesis.message.core.event.Event    import global.genesis.message.core.event.EventReply    @Module    class TestCompanyHandlerSync : SyncValidatingEventHandler<Company, EventReply> {        override fun onValidate(message: Event<Company>): EventReply {            val company = message.details            return ack()        }        override fun onCommit(message: Event<Company>): EventReply {            val company = message.details            return ack()        }    }
```

### SyncContextValidatingEventHandler[​](/database/event-handler-api/event-handler-api/#synccontextvalidatingeventhandlerdirect-link-to-heading)

`interface SyncContextValidatingEventHandler<I : Any, O : Outbound, C : Any> : SyncEventHandler<I, O>`

### Implementation[​](/database/event-handler-api/event-handler-api/#implementationdirect-link-to-heading-7)

| Name | Signature |
| --- | --- |
| onValidate | `fun onValidate(message: Event<I>): ValidationResult<O, C>` |
| onCommit | `fun onCommit(message: Event<I>, context: C?): O` |

### Helper methods[​](/database/event-handler-api/event-handler-api/#helper-methodsdirect-link-to-heading-3)

| Name | Signature |
| --- | --- |
| validationResult | `fun validationResult(result: O): ValidationResult<O, C>` |
| validationResult | `fun validationResult(result: O, context: C): ValidationResult<O, C>` |

Here is an example:

-   Kotlin
-   Java

```
    import global.genesis.commons.annotation.Module    import global.genesis.eventhandler.typed.sync.SyncContextValidatingEventHandler    import global.genesis.gen.dao.Company    import global.genesis.message.core.event.Event    import global.genesis.message.core.event.EventReply    import global.genesis.message.core.event.ValidationResult    @Module    class TestCompanyHandlerSync : SyncContextValidatingEventHandler<Company, EventReply, String> {        override fun onValidate(message: Event<Company>): ValidationResult<EventReply, String> {            val company = message.details            // custom code block..            val companyName = company.companyName            return validationResult(ack(), companyName)        }        override fun onCommit(message: Event<Company>, context: String?): EventReply {            if (context != null) {                // Do something with the context            }            val company = message.details            // custom code block..            return ack()        }    }
```
