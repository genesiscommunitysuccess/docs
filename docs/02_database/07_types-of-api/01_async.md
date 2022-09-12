---
title: 'Async API'
sidebar_label: 'Async'
id: async
---

[Async](/database/types-of-api/async/) |
[RxJava](/database/types-of-api/rxjava/) 

The Genesis low-code platform relies on [Kotlin coroutines](https://kotlinlang.org/docs/coroutines-overview.html) for providing high-performance applications. The Async API is the preferred API for accessing the database in Kotlin. The [RxJava API](/database/types-of-api/rxjava/) is also available. If you use Java, the asynchronous API is not available.

Coroutines overview[​](/database/types-of-api/async/#coroutines-overviewdirect-link-to-heading)
--------------------------------------------------------------------------------------------------------------------------------------------------------------

Coroutines provide support of non-blocking asynchronous operations at the language level. This makes the code highly efficient; it also means that asynchronous code can be written in a style that appears synchronous.

### Suspend rather than block[​](/database/types-of-api/async/#suspend-rather-than-blockdirect-link-to-heading)

Coroutines are non-blocking and will suspend, rather than block. Traditionally, on the JVM, code waiting on an asynchronous operation will block a thread while waiting for completion or a result. 

For example, when waiting on the result of a `Future`, code will often call `get`, which will block the thread until the operation is completed.

Coroutines, on the other hand, suspend. This means that when code reaches a point at which it can no longer complete and needs to wait for a result, it will suspend. It will hand the thread back to the coroutine context, where another call is able use that thread. Once the asynchronous operation completes, execution is resumed.

### Coroutines[​](/database/types-of-api/async/#coroutinesdirect-link-to-heading)

If you are not familiar with Kotlin coroutines, it is well worth finding out about them. They are very efficient. Both of the following are useful:

- [baeldung.com](https://www.baeldung.com/kotlin/coroutines)
- [Kotlin coroutines documentation](https://kotlinlang.org/docs/coroutines-overview.html)

### Suspending functions[​](/database/types-of-api/async/#suspending-functionsdirect-link-to-heading)

In Kotlin, a function modified with the `suspend` keyword becomes a suspending function. A `suspend` function can only be called from a coroutine.

Nullable suspend[​](/database/types-of-api/async/#nullable-suspenddirect-link-to-heading)
--------------------------------------------------------------------------------------------------------------------------------------------------------

Details to follow. Please bear with us.

Suspend[​](/database/types-of-api/async/#suspenddirect-link-to-heading)
--------------------------------------------------------------------------------------------------------------------------------------

Details to follow. Please bear with us.

Flow[​](/database/types-of-api/async/#flowdirect-link-to-heading)
--------------------------------------------------------------------------------------------------------------------------------

Details to follow. Please bear with us.