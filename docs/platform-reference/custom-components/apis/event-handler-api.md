---
id: event-handler-api
title: Event handler API
sidebar_label: Event handler API
sidebar_position: 3
---

# Custom event handlers

Genesis has 3 different flavours of custom event handlers:
1. Async Event handler - Async event handler uses Kotlin coroutines API for a fully asynchronous behaviour. GPAL event handlers are asynchronous too but creating custom event handler using below APIs is more configurable.
2. RxJava3 - RxJava3 event handlers use RxJava which is a popular library for composing asynchronous and event based programs
3. Sync - Creates synchronous event handlers

## EventHandler

EventHandler is supertype of AsyncEventHandler, Rx3EventHandler and SyncEventHandler

| Name | Signature | Default value | Description |
|---|---|---|---|
| excludeMetadataFields | `fun excludeMetadataFields(): Set<String>` | setOf("RECORD_ID", "TIMESTAMP") | Contains list of metadata fields which needs to be set as optional |
| includeMetadataFields | `fun includeMetadataFields(): Set<String>` | emptySet() | Contains list of metadata fields which needs to be set as mandatory |
| messageType | `fun messageType(): String?` | null | Contains name of the event handler |
| overrideMetadataFields | `fun overrideMetadataFields(): Map<String, OverrideMetaField>` | emptySet() | Contains map of meta-field name to meta-field object. Overrides meta-field properties with new properties provided  |
| requiresPendingApproval | `fun requiresPendingApproval(): Boolean` | false | This is intended where particular system events require a second system user to approve them in order to take effect |

### AsyncEventHandler
`interface AsyncEventHandler<I : Any, O : Outbound> : AsyncEventWorkflowProcessor<I, O>, EventHandler`

| Name | Signature |
|---|---|
| ack | `fun <I : Any> AsyncEventHandler<I, EventReply>.ack(): EventReply` |
| ack | `fun <I : Any> AsyncEventHandler<I, EventReply>.ack(generated: List<Map<String, Any>> = emptyList()): EventReply` |
| nack | `fun <I : Any> AsyncEventHandler<I, EventReply>.nack(throwable: Throwable): EventReply` |
| nack | `fun <I : Any> AsyncEventHandler<I, EventReply>.nack(error: String): EventReply` |

#### AsyncValidatingEventHandler
`interface AsyncValidatingEventHandler<I : Any, O : Outbound> : AsyncEventHandler<I, O>`

Using this interface you can add validation and commit stage

| Name | Signature |
|---|---|
| onCommit | `suspend fun onCommit(message: Event<I>): O` |
| onValidate | `suspend fun onValidate(message: Event<I>): O` |
| process | `override suspend fun process(message: Event<I>): O` |

#### AsyncContextValidatingEventHandler
`interface AsyncContextValidatingEventHandler<I : Any, O : Outbound, C : Any> : AsyncEventHandler<I, O>`

Using this interface you can pass some context information from the validation stage (i.e. onValidate) to the commit stage (i.e. onCommit)

| Name | Signature |
|---|---|
| onCommit | `suspend fun onCommit(message: Event<I>, context: C?): O` |
| onValidate | `suspend fun onValidate(message: Event<I>): ValidationResult<O, C>` |
| process | `override suspend fun process(message: Event<I>): O` |
| validationResult | `fun validationResult(result: O): ValidationResult<O, C>` |
| validationResult | `fun validationResult(result: O, context: C): ValidationResult<O, C>` |

#### Example of AsyncEventHandler

```kotlin
@Module
class CustomCompanyEventHandlerAsync: AsyncValidatingEventHandler<Company, EventReply> {
    override fun messageType(): String = "CUSTOM_COMPANY_EVENT_HANDLER_ASYNC"

    override suspend fun onCommit(message: Event<Company>): EventReply {
        val company = message.details
        // custom code block..
        return ack()
    }

    override suspend fun onValidate(message: Event<Company>): EventReply {
        // custom code block..
        return ack()
    }
}
```

### Rx3EventHandler
`interface Rx3EventHandler<I : Any, O : Outbound> : Rx3EventWorkflowProcessor<I, O>, EventHandler`

Rx3EventHandler implementation has similar methods as AsyncEventHandler

| Name | Signature |
|---|---|
| ack | `fun <I : Any> Rx3EventHandler<I, EventReply>.ack(): Single<EventReply>` |
| ack | `fun <I : Any> Rx3EventHandler<I, EventReply>.ack(generated: List<Map<String, Any>> = emptyList()): Single<EventReply>` |
| nack | `fun <I : Any> Rx3EventHandler<I, EventReply>.nack(throwable: Throwable): Single<EventReply>` |
| nack | `fun <I : Any> Rx3EventHandler<I, EventReply>.nack(error: String): Single<EventReply>` |

#### Rx3ValidatingEventHandler
`interface Rx3ValidatingEventHandler<I : Any, O : Outbound> : Rx3EventHandler<I, O>`

| Name | Signature |
|---|---|
| onCommit | `override fun process(message: Event<I>): Single<O>` |
| onValidate | `fun onValidate(message: Event<I>): Single<O>` |
| process | `fun onCommit(message: Event<I>): Single<O>` |

#### Rx3ContextValidatingEventHandler
`interface Rx3ContextValidatingEventHandler<I : Any, O : Outbound, C : Any> : Rx3EventHandler<I, O>`

| Name | Signature |
|---|---|
| onCommit | `fun onCommit(message: Event<I>, context: C?): Single<O>` |
| onValidate | `fun onValidate(message: Event<I>): Single<ValidationResult<O, C>>` |
| process | `override fun process(message: Event<I>): Single<O>` |
| validationResult | `fun validationResult(result: O): ValidationResult<O, C>` |
| validationResult | `fun validationResult(result: O, context: C): ValidationResult<O, C>` |

#### Example of Rx3EventHandler

```kotlin
@Module
class Rx3EventHandler: Rx3ValidatingEventHandler<Company, EventReply> {
    override fun messageType(): String = "CUSTOM_COMPANY_EVENT_HANDLER_RX3"

    override fun onCommit(message: Event<Company>): Single<EventReply> {
        val company = message.details
        // custom code block..
        return ack()
    }

    override fun onValidate(message: Event<Company>): Single<EventReply> {
        // custom code block..
        return ack()
    }
}
```

### SyncEventHandler
`interface SyncEventHandler<I : Any, O : Outbound> : SyncEventWorkflowProcessor<I, O>, EventHandler`

SyncEventHandler implementation has similar methods as AsyncEventHandler

| Name | Signature |
|---|---|
| ack | `fun <I : Any> SyncEventHandler<I, EventReply>.ack(): EventReply` |
| ack | `fun <I : Any> SyncEventHandler<I, EventReply>.ack(generated: List<Map<String, Any>> = emptyList()): EventReply` |
| nack | `fun <I : Any> SyncEventHandler<I, EventReply>.nack(throwable: Throwable): EventReply` |
| nack | `fun <I : Any> SyncEventHandler<I, EventReply>.nack(error: String): EventReply` |

#### SyncValidatingEventHandler

`interface SyncValidatingEventHandler<I : Any, O : Outbound> : SyncEventHandler<I, O>`

| Name | Signature |
|---|---|
| onCommit | `fun onCommit(message: Event<I>): O` |
| onValidate | `fun onValidate(message: Event<I>): O` |
| process | `override fun process(message: Event<I>): O` |

#### SyncContextValidatingEventHandler
`interface SyncContextValidatingEventHandler<I : Any, O : Outbound, C : Any> : SyncEventHandler<I, O>`

| Name | Signature |
|---|---|
| onCommit | `fun onCommit(message: Event<I>, context: C?): O` |
| onValidate | `fun onValidate(message: Event<I>): ValidationResult<O, C>` |
| process | `override fun process(message: Event<I>): O` |
| validationResult | `fun validationResult(result: O): ValidationResult<O, C>` |
| validationResult | `fun validationResult(result: O, context: C): ValidationResult<O, C>` |

#### Example of SyncEventHandler

```kotlin
@Module
class SyncCompanyEventHandler : SyncValidatingEventHandler<Company, EventReply>{
    override fun messageType(): String = "CUSTOM_COMPANY_EVENT_HANDLER_SYNC"

    override fun onCommit(message: Event<Company>): EventReply {
        val company = message.details
        // custom code block..
        return ack()
    }

    override fun onValidate(message: Event<Company>): EventReply {
        // custom code block..
        return ack()
    }
}
```