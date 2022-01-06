---
sidebar_position: 10
title: Async API
sidebar_label: Async API
id: async

---

The genesis framework heavily relies on [kotlin coroutines](https://kotlinlang.org/docs/coroutines-overview.html) for 
providing high performance applications. The Async API is the preferred API for accessing the database in kotlin, while
the [RxJava API](../rxjava) is also available in koltin, the asynchronous API is not available from java.

## Coroutines overview
 
Coroutines provide support of non-blocking asynchronous operations at the language level, this, makes the code not 
just highly efficient, it means that asynchronous code can be written in a style that appears synchronous.

### Suspend Rather than block

Coroutines are non-blocking and will suspend, rather than block. Traditionally, on the jvm, code waiting on an 
asynchronous operation will block a thread while waiting for completion or a result. For example, when waiting on 
the result of a `Future`, code will often call `get`, which will block the thread until the operation completes. 

Coroutines on the other hand, suspend. This means that code reaches a point at which it can no longer complete and 
needs to wait for a result, it will suspend. It will hand the thread back to the coroutine context, where another 
call might use that thread. Once the asynchronous operations completes, execution is resumed.

### Coroutines

A coroutine is 

### Suspending functions

In kotlin, a function modified with the `suspend` keyword becomes a suspending function. A `suspend` function can only 
be called from a coroutine.  


## Nullable Suspend

Functions that 

## Suspend





## Flow