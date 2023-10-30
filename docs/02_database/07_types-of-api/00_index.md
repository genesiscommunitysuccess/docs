---
title: 'Introduction'
sidebar_label: 'Types of API'
id: types-of-API
keywords: [ database, types of api, api, types ]
tags:
  - database
  - types of api
  - api
  - types
---

The version to use depends on the context. It depends on whether you are writing code in Kotlin or Java, and also
whether there is a need to write asynchronous (async) or synchronous (blocking) code.

|        | Asynchronous                | Blocking                      |
|--------|-----------------------------|-------------------------------|
| Kotlin | [`AsyncEntityDb`](../async) | [`SyncEntityDb`](../blocking) |
| Java   | [`RxEntityDb`](../rxjava)   | [`SyncEntityDb`](../blocking) |

The difference between blocking and async code is that if the code needs to wait on the database, in
blocking code, the thread will block until the database responds. In async code, the thread will not block,
rather it will resume once the database responds. The general rule is that blocking code is easier to write, and
async code is more performant. Another thing to bear in mind is that within a single code path, you should not
mix blocking and async code in a single code path. Doing so can lead to unexpected deadlocks.

We have two flavours of async API, Kotlin coroutines and RxJava.

Coroutines are a language feature of Kotlin, and allow you to write async code in a blocking style. Functions are
marked as `suspend`, and can be called from other functions marked as `suspend` or from a context. However,
as this is a Kotlin language feature, these functions cannot be called from Java.

RxJava is a library that implements the reactive programming paradigm. It works with Java's type system, providing
generic return types that callers can then subscribe to and receive results.

Within the framework; especially in GPAL, a coroutine context is always provided, therefore in order to avoid mixing
blocking and async code, we recommend using the `AsyncEntityDb`.

In all other cases it depends on your requirements. Especially when writing in Java, RxJava code can be very verbose
and difficult to read. In these cases, we recommend using the `SyncEntityDb` when performance is not a concern. If
performance is a concern, we recommend using Kotlin and the `AsyncEntityDb`. However, if this is not an option, then
the `RxEntityDb` is the best option.
