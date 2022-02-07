---
id: event-handler-api
title: Event handler API
sidebar_label: Event handler API
sidebar_position: 3
---

# Custom event handlers

Custom event handlers provide a way of implementing business logic in Java or Kotlin outside the Genesis GPAL Event Handler definition, in a more traditional and flexible development approach. Genesis has 3 different flavours of custom event handlers:
- Async. This event handler uses the Kotlin coroutines API to simplify asynchronous development. This is the underlying implementation used in GPAL event handlers.
 - RxJava3. These event handlers use the RxJava3 library, which is a popular option for composing asynchronous event-based programs.
- Sync. This creates synchronous event handlers.

Each custom event handler must define an input message type `I` and an output message type `O` (as GPAL event handlers do). 

## Event handler interface

The event handler interface is the common supertype of AsyncEventHandler, Rx3EventHandler and SyncEventHandler, but it is not meant to be used on its own. It provides basic options for each event handler definition, which can be overriden. See the Kotlin methods explanation below:

| Name | Signature | Default value | Description |
|---|---|---|---|
| excludeMetadataFields | `fun excludeMetadataFields(): Set<String>` | setOf("RECORD_ID", "TIMESTAMP") | Contains a list of metadata fields to be excluded from the event metadata extracted from the input `I`|
| includeMetadataFields | `fun includeMetadataFields(): Set<String>` | emptySet() | Contains a list of metadata fields that need to be included in the event metadata; this must be available in input `I`. A non-empty list will exclude the other fields. |
| messageType | `fun messageType(): String?` | null | Contains the name of the event handler. If undefined, the event handler name will become `EVENT_*INPUT_CLASS_NAME*`. So, for an event handler using an input type called `TradeInsert`, the message type will become `EVENT_TRADE_INSERT`. |
| overrideMetadataFields | `fun overrideMetadataFields(): Map<String, OverrideMetaField>` | emptySet() | Contains a map (key-value entries) of metadata field names to metadata field definitions in the shape of `OverrideMetaField`. This enables you to override the metadata field properties extracted from input `I` |
| requiresPendingApproval | `fun requiresPendingApproval(): Boolean` | false | This is used where particular system events require a second system user to approve them in order to take effect ([see pending approval documentation](/creating-applications/defining-your-application/business-logic/event-handlers/event-handler-pending-approval/))|

## Async
### AsyncEventHandler
This is the most basic definition of an async event handler. You can define an `AsyncEventHandler` by implementing the `AsyncEventHandler` interface, which is defined as:
`interface AsyncEventHandler<I : Any, O : Outbound> : AsyncEventWorkflowProcessor<I, O>, EventHandler`

The only mandatory method to implement this in the interface is:

| Name | Signature |
|---|---|
| process | `fun suspend process(message: Event<I>) : O` |

This method passes the input message type `I` as a parameter and expects the output message type `O` to be returned. The `message` object contains information about the event message, including the flags for `validate`, `requiresApproval` and `ignoreWarnings`.

#### Example

```kotlin
import global.genesis.commons.annotation.Module
import global.genesis.eventhandler.typed.async.AsyncEventHandler
import global.genesis.message.core.event.Event
import global.genesis.message.core.event.EventReply

@Module
class EventCompanyHandlerAsync : AsyncEventHandler<Company, EventReply> {
    override suspend fun process(message: Event<Company>): EventReply {
        val company = message.details
        // custom code block..
        return EventReply.EventAck()
    }
}
```

The methods below are provided as part of `AsyncEventHandler`; they provide an easy way of creating `EventReply` responses.

| Name | Signature |
|---|---|
| ack | `fun <I : Any> AsyncEventHandler<I, EventReply>.ack(): EventReply` |
| ack | `fun <I : Any> AsyncEventHandler<I, EventReply>.ack(generated: List<Map<String, Any>> = emptyList()): EventReply` |
| nack | `fun <I : Any> AsyncEventHandler<I, EventReply>.nack(throwable: Throwable): EventReply` |
| nack | `fun <I : Any> AsyncEventHandler<I, EventReply>.nack(error: String): EventReply` |

Using these helper methods, you could simplify the previous implementation like this:

```kotlin
import global.genesis.commons.annotation.Module
import global.genesis.eventhandler.typed.async.AsyncEventHandler
import global.genesis.message.core.event.Event
import global.genesis.message.core.event.EventReply

@Module
class EventCompanyHandlerAsync : AsyncEventHandler<Company, EventReply> {
    override suspend fun process(message: Event<Company>): EventReply {
        val company = message.details
        // custom code block..
        return ack()
    }
}
```

### AsyncValidatingEventHandler

In the previous example, there was no distinction between validation and commit blocks, which is something we have in GPAL event handlers. In order to have a better separation of concerns using custom event handlers, you can implement the `AsyncValidatingEventHandler` interface, which is defined as:

`interface AsyncValidatingEventHandler<I : Any, O : Outbound> : AsyncEventHandler<I, O>`

#### Implementation
Using this interface, you don't need to override the `process` method; you can split your logic into validation and commit stages. There are various methods of implementing this, which are described below:

| Name | Signature |
|---|---|
| onValidate | `suspend fun onValidate(message: Event<I>): O` |
| onCommit | `suspend fun onCommit(message: Event<I>): O` |


#### Example

```kotlin
import global.genesis.commons.annotation.Module
import global.genesis.eventhandler.typed.async.AsyncValidatingEventHandler
import global.genesis.message.core.event.Event
import global.genesis.message.core.event.EventReply

@Module
class TestCompanyHandlerAsync : AsyncValidatingEventHandler<Company, EventReply> {
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

If the `validate` flag is received as `true`, only the `onValidate` code block will be executed. If the `validate` flag is received as `false`, both the  `onValidate` and `onCommit` blocks will be executed.

### AsyncContextValidatingEventHandler

In some cases, you might want to carry information from the `onValidate` code block to the `onCommit` code block for efficiency purposes (for example, if several database lookups happen in `onValidate` and you want to reuse that information). Using the `AsyncContextValidatingEventHandler` interface, you can provide this context information from the validation stage to the commit stage. See the interface below:
`interface AsyncContextValidatingEventHandler<I : Any, O : Outbound, C : Any> : AsyncEventHandler<I, O>`

#### Implementation
As with the previous example, when using this interface, you don't need to override the `process` method. The different methods for implementing this are described below:

| Name | Signature |
|---|---|
| onValidate | `suspend fun onValidate(message: Event<I>): ValidationResult<O, C>` |
| onCommit | `suspend fun onCommit(message: Event<I>, context: C?): O` |

The `validationResult` methods are provided to help with the context creation:

| Name | Signature |
|---|---|
| validationResult | `fun validationResult(result: O): ValidationResult<O, C>` |
| validationResult | `fun validationResult(result: O, context: C): ValidationResult<O, C>` |

The type `C` represents the contextual information we want to provide, and it can be any Java/Kotlin type. An example in of an implementation could be:

```kotlin
import global.genesis.commons.annotation.Module
import global.genesis.eventhandler.typed.async.AsyncContextValidatingEventHandler
import global.genesis.message.core.event.Event
import global.genesis.message.core.event.EventReply
import global.genesis.message.core.event.ValidationResult

@Module
class TestCompanyHandlerAsync : AsyncContextValidatingEventHandler<Company, EventReply, String> {
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

## Rx3

The mechanism explained in [Async](#async) can be recycled and reapplied in Rx3 event handlers. 

### Rx3EventHandler

In a similar fashion to `AsyncEventHandler`, there is an Rx3 implementation flavour. It works in a very similar way to [`AsyncEventHandler`](#asynceventhandler), but requires different return types (i.e. we expect to return RxJava3 `Single<O>` type, instead of just the `O` type).

See the interface definition below:
`interface Rx3EventHandler<I : Any, O : Outbound> : Rx3EventWorkflowProcessor<I, O>, EventHandler`

#### Implementation
The mandatory method for implementing this is:

| Name | Signature |
|---|---|
| process | `fun process(message: Event<I>) : Single<O>` |

#### Helper methods

| Name | Signature |
|---|---|
| ack | `fun <I : Any> Rx3EventHandler<I, EventReply>.ack(): Single<EventReply>` |
| ack | `fun <I : Any> Rx3EventHandler<I, EventReply>.ack(generated: List<Map<String, Any>> = emptyList()): Single<EventReply>` |
| nack | `fun <I : Any> Rx3EventHandler<I, EventReply>.nack(throwable: Throwable): Single<EventReply>` |
| nack | `fun <I : Any> Rx3EventHandler<I, EventReply>.nack(error: String): Single<EventReply>` |

#### Example

```kotlin
import global.genesis.commons.annotation.Module
import global.genesis.eventhandler.typed.rx3.Rx3EventHandler
import global.genesis.message.core.event.Event
import global.genesis.message.core.event.EventReply
import io.reactivex.rxjava3.core.Single

@Module
class TestCompanyHandlerRx3 : Rx3EventHandler<Company, EventReply> {
    override fun process(message: Event<Company>): Single<EventReply> {
        return ack()
    }
}
```

### Rx3ValidatingEventHandler
The same applies to an Rx3ValidatingEventHandler. It is similar to [AsyncValidatingEventHandler](#asyncvalidatingeventhandler) in every way, but the return type is still `Single<O>`.

`interface Rx3ValidatingEventHandler<I : Any, O : Outbound> : Rx3EventHandler<I, O>`

#### Implementation

| Name | Signature |
|---|---|
| onValidate | `fun onValidate(message: Event<I>): Single<O>` |
| onCommit | `fun onCommit(message: Event<I>): Single<O>` |

#### Example

```kotlin
import global.genesis.commons.annotation.Module
import global.genesis.eventhandler.typed.rx3.Rx3ValidatingEventHandler
import global.genesis.message.core.event.Event
import global.genesis.message.core.event.EventReply
import io.reactivex.rxjava3.core.Single

@Module
class TestCompanyHandlerRx3 : Rx3ValidatingEventHandler<Company, EventReply> {
    override fun onValidate(message: Event<Company>): Single<EventReply> {
        val company = message.details
        // custom code block..
        return ack()
    }

    override fun onCommit(message: Event<Company>): Single<EventReply> {
        val company = message.details
        // custom code block..
        return ack()
    }
}
```

### Rx3ContextValidatingEventHandler
And the same goes for `Rx3ContextValidatingEventHandler` in relation to [AsyncContextValidatingEventHandler](#asynccontextvalidatingeventhandler).

`interface Rx3ContextValidatingEventHandler<I : Any, O : Outbound, C : Any> : Rx3EventHandler<I, O>`

#### Implementation

| Name | Signature |
|---|---|
| onValidate | `fun onValidate(message: Event<I>): Single<ValidationResult<O, C>>` |
| onCommit | `fun onCommit(message: Event<I>, context: C?): Single<O>` |

#### Helper methods

| Name | Signature |
|---|---|
| validationResult | `fun validationResult(result: O): ValidationResult<O, C>` |
| validationResult | `fun validationResult(result: O, context: C): ValidationResult<O, C>` |


#### Example

```kotlin
import global.genesis.commons.annotation.Module
import global.genesis.eventhandler.typed.rx3.Rx3ContextValidatingEventHandler
import global.genesis.message.core.event.Event
import global.genesis.message.core.event.EventReply
import global.genesis.message.core.event.ValidationResult
import io.reactivex.rxjava3.core.Single

@Module
class TestCompanyHandlerRx3 : Rx3ContextValidatingEventHandler<Company, EventReply, String> {
    override fun onValidate(message: Event<Company>): Single<ValidationResult<EventReply, String>> {
        val company = message.details
        // custom code block..
        val companyName = company.companyName
        return Single.just(validationResult(EventReply.EventAck(), companyName))
    }

    override fun onCommit(message: Event<Company>, context: String?): Single<EventReply> {
        if (context != null) {
            // Do something with the context
        }
        val company = message.details
        // custom code block..
        return ack()
    }
}
```

## Sync
Sync works similarly to [Async](#async) and [Rx3](#rx3), but in this case, there is no `Single<O>` returned and no `suspend` modifier used for Kotlin coroutines. The expected output of the event handler logic is just the `O` type.

### SyncEventHandler

`interface SyncEventHandler<I : Any, O : Outbound> : SyncEventWorkflowProcessor<I, O>, EventHandler`

#### Implementation

| Name | Signature |
|---|---|
| process | `fun process(message: Event<I>) : O` |

#### Helper methods

| Name | Signature |
|---|---|
| ack | `fun <I : Any> SyncEventHandler<I, EventReply>.ack(): EventReply` |
| ack | `fun <I : Any> SyncEventHandler<I, EventReply>.ack(generated: List<Map<String, Any>> = emptyList()): EventReply` |
| nack | `fun <I : Any> SyncEventHandler<I, EventReply>.nack(throwable: Throwable): EventReply` |
| nack | `fun <I : Any> SyncEventHandler<I, EventReply>.nack(error: String): EventReply` |

#### Example

```kotlin
import global.genesis.commons.annotation.Module
import global.genesis.eventhandler.typed.sync.SyncEventHandler
import global.genesis.message.core.event.Event
import global.genesis.message.core.event.EventReply

@Module
class TestCompanyHandlerSync : SyncEventHandler<Company, EventReply> {
    override fun process(message: Event<Company>): EventReply {
        return ack()
    }
}
```

#### SyncValidatingEventHandler

`interface SyncValidatingEventHandler<I : Any, O : Outbound> : SyncEventHandler<I, O>`

#### Implementation

| Name | Signature |
|---|---|
| onValidate | `fun onValidate(message: Event<I>): O` |
| onCommit | `fun onCommit(message: Event<I>): O` |

#### Example

```kotlin
import global.genesis.commons.annotation.Module
import global.genesis.eventhandler.typed.sync.SyncValidatingEventHandler
import global.genesis.message.core.event.Event
import global.genesis.message.core.event.EventReply

@Module
class TestCompanyHandlerSync : SyncValidatingEventHandler<Company, EventReply> {
    override fun onValidate(message: Event<Company>): EventReply {
        val company = message.details
        return ack()
    }

    override fun onCommit(message: Event<Company>): EventReply {
        val company = message.details
        return ack()
    }
}
```


#### SyncContextValidatingEventHandler
`interface SyncContextValidatingEventHandler<I : Any, O : Outbound, C : Any> : SyncEventHandler<I, O>`

#### Implementation

| Name | Signature |
|---|---|
| onValidate | `fun onValidate(message: Event<I>): ValidationResult<O, C>` |
| onCommit | `fun onCommit(message: Event<I>, context: C?): O` |

#### Helper methods

| validationResult | `fun validationResult(result: O): ValidationResult<O, C>` |
| validationResult | `fun validationResult(result: O, context: C): ValidationResult<O, C>` |

#### Example
```kotlin
import global.genesis.commons.annotation.Module
import global.genesis.eventhandler.typed.sync.SyncContextValidatingEventHandler
import global.genesis.message.core.event.Event
import global.genesis.message.core.event.EventReply
import global.genesis.message.core.event.ValidationResult

@Module
class TestCompanyHandlerSync : SyncContextValidatingEventHandler<Company, EventReply, String> {
    override fun onValidate(message: Event<Company>): ValidationResult<EventReply, String> {
        val company = message.details
        // custom code block..
        val companyName = company.companyName
        return validationResult(ack(), companyName)
    }

    override fun onCommit(message: Event<Company>, context: String?): EventReply {
        if (context != null) {
            // Do something with the context
        }
        val company = message.details
        // custom code block..
        return ack()
    }
}
```