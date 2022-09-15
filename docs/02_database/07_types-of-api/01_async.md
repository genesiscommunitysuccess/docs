---
title: 'Async API'
sidebar_label: 'Async'
id: async
---

[Async](/database/types-of-api/async/) |
[RxJava](/database/types-of-api/rxjava/) 

The Genesis low-code platform relies on [Kotlin coroutines](https://kotlinlang.org/docs/coroutines-overview.html) for providing high-performance applications. The Async API is the preferred API for accessing the database in Kotlin. The [RxJava API](/database/types-of-api/rxjava/) is also available. If you use Java, the asynchronous API is not available.

## Coroutines overview[​](/database/types-of-api/async/#coroutines-overviewdirect-link-to-heading)


Coroutines provide support for non-blocking asynchronous operations at the language level. This makes the code highly efficient; it also means that asynchronous code can be written in a style that appears synchronous.

Traditionally, on the JVM, code waiting on an asynchronous operation will block a thread while waiting for completion or a result. For example, when waiting on the result of a `Future`, code will often call `get`, which will block the thread until the operation is completed.

Coroutines avoid this situation; they suspend, rather than block. When code reaches a point at which it can no longer complete and needs to wait for a result, it will suspend. It hands the thread back to the coroutine context, where it can be used by another call. Once the asynchronous operation completes, execution is resumed.

If you are not familiar with Kotlin coroutines, it is well worth finding out about them. They are very efficient. Both of the following are useful sources of information:

- [baeldung.com](https://www.baeldung.com/kotlin/coroutines)
- [Kotlin coroutines documentation](https://kotlinlang.org/docs/coroutines-overview.html)

### Using suspend
In Kotlin, a function modified with the `suspend` keyword becomes a suspending function. A `suspend` function can only be called from a coroutine. There are three types:

- Nullable suspend. This can only return a single value.
- Suspend. This can only return a single value.
- Flow. This can emit multiple values sequentially. A flow is conceptually a stream of data that can be computed asynchronously. The emitted values must be of the same type. For example, a `Flow<Int>` is a flow that emits integer values.
