---
title: 'Asynch API'
sidebar_label: 'Asynch API'
id: asynch
---



The Genesis low-code platform relies on [Kotlin coroutines](https://kotlinlang.org/docs/coroutines-overview.html) for providing high-performance applications. 

The Async API is the preferred API for accessing the database in Kotlin. However, you can also use [RxJava API](/database/types-of-api/rxjava/). The asynchronous API is not available from Java.

Coroutines overview[​](/database/types-of-api/asynch/#coroutines-overviewdirect-link-to-heading)
--------------------------------------------------------------------------------------------------------------------------------------------------------------

Coroutines provide support of non-blocking asynchronous operations at the language level. This, makes the code not just highly efficient, it means that asynchronous code can be written in a style that appears synchronous.

## Suspend rather than block[​](/database/types-of-api/asynch/#suspend-rather-than-blockdirect-link-to-heading)

Coroutines are non-blocking and will suspend, rather than block. Traditionally, on the jvm, code waiting on an asynchronous operation will block a thread while waiting for completion or a result. For example, when waiting on the result of a `Future`, code will often call `get`, which will block the thread until the operation is completed.

Coroutines, on the other hand, suspend. This means that when code reaches a point at which it can no longer complete and needs to wait for a result, it will suspend. It will hand the thread back to the coroutine context, where another call might use that thread. Once the asynchronous operation is completed, execution is resumed.

## Coroutines[​](/database/types-of-api/asynch/#coroutinesdirect-link-to-heading)

We shall provide useful information here as soon as possible. Please bear with us.

## Suspending functions[​](/database/types-of-api/asynch/#suspending-functionsdirect-link-to-heading)

In Kotlin, a function modified with the `suspend` keyword becomes a suspending function. A `suspend` function can only be called from a coroutine.

Nullable suspend[​](/database/types-of-api/asynch/#nullable-suspenddirect-link-to-heading)
--------------------------------------------------------------------------------------------------------------------------------------------------------

Details to follow. Please bear with us.

Suspend[​](/database/types-of-api/asynch/#suspenddirect-link-to-heading)
--------------------------------------------------------------------------------------------------------------------------------------

Details to follow. Please bear with us.

Flow[​](/database/types-of-api/asynch/#flowdirect-link-to-heading)
--------------------------------------------------------------------------------------------------------------------------------

Details to follow. Please bear with us.