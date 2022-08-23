---
title: 'Basics'
sidebar_label: 'Basics'
id: basics
---

[Introduction](/server-modules/event-handler/introduction)  | [Basics](/server-modules/event-handler/basics) | [Advanced](/server-modules/event-handler/advanced) | [Examples](/server-modules/event-handler/examples) | [Configuring runtime](/server-modules/event-handler/configuring-runtime) | [Testing](/server-modules/event-handler/testing) | [Java event handlers](/server-modules/event-handler/java-event-handlers) | [Testing java event handlers](/server-modules/event-handler/testing-java-event-handlers)

Let's make things really simple.
- The Event Handler is the component that enables the application to write to the database.
- You define your application's Event Handler in a Kotlin script file (**.kts**).
- In this file, you define specific `eventHandler` codeblocks, each of which has full access to the database.
- Each `eventHandler` can be invoked from the front end, from other `eventHandler` codeblocks, or from custom components in the application.
- If you use AppGen to build from your dictionary, then a basic **.kts** file will be built automatically for you, creating basic insert, modify and delete `eventHandler` code blocks for all the tables and views in your data model. You can edit this file to customise the component.
- Otherwise, you can build your **.kts** by defining each `eventHandler` codeblock from scratch.

On this page, we'll take you through the basics of creating an Event Handler in simple stages:

- [a very simple example file](#a-simple-example-of-an-event-handler)
- [giving each `eventHandler` codeblock a name](#adding-a-name)
- [adding validation](#adding-validation)
- [returning a nack](#returning-a-nack)
- [transactional `eventHandler` codeblocks](#transactional-event-handlers-acid)
- [the process flow for `eventHandler` codeblocks](#processing-onvalidate-and-oncommit)
- [more information on validation](#more-information-about-onvalidate)
- [context Event Handlers](#context-event-handlers)

By the end of that, you'll have some very useful knowledge, and you'll be ready to move on to the [advanced](/server-modules/event-handler/advanced/) page.

It is possible to define an Event Handler in Java, and we have included Java [examples](/server-modules/event-handler/java-event-handlers/). However, we strongly advise you to create your Event Handler using Kotlin; it is a considerably more efficient method.

## A simple example of an Event Handler

Here is a simple example of an Event Handler file. It defines a single `eventHandler`, which inserts a counterparty into the database, using the [entityDb](/database/database-interface/entity-db/).

- First, note that there is an `eventHandler` statement for containing all your `eventHandler`codeblocks. This is necessary whether the file contains one `eventHandler`, or hundreds.
- The single `eventHandler` is of type `<Counterparty>`, which has been created in advance for the COUNTERPARTY table. It defines a single `eventHandler` of type `<Counterparty>`.
- The `eventHandler` inserts a counterparty into the database, using the [entityDb](/database/database-interface/entity-db/).

```kotlin
    eventHandler {
        eventHandler<Counterparty> {
            onCommit { event ->
                val counterparty = event.details
                entityDb.insert(counterparty)
                ack()
            }
        }
    }
```

## Adding a name

Every `eventHandler` in your **.kts** must have a unique name. If you do not provide one, it will be allocated automatically. In the previous example, the `eventHandler` will automatically be named EVENT_COUNTERPARTY.

It is good practice to provide your own name for each `eventHandler`. For example, if you have insert and modify codeblocks for the same table and you don't name them, then the platform will probably generate identical names for both - which will give you a problem.
Note that the prefix `EVENT_` is automatically added to the name that you specify.

If you do not define a name, a default name will be allocated automatically. The default name will be `EVENT_<message type name>`. So, for a message type declared as `OrderInsert`, declaring an Event Handler block as `eventHandler<OrderInsert>{}` automatically registers the event with the name `EVENT_ORDER_INSERT`.

So, below, we modify our previous example by defining the name of the `eventHandler`: COUNTERPARTY_INSERT. This will automatically become EVENT_COUNTERPARTY_INSERT.

```kotlin
eventHandler<Counterparty>(name = "COUNTERPARTY_INSERT") {
    onCommit { event ->
        val counterparty = event.details
        entityDb.insert(counterparty)
        ack()
    }
}
```

## Adding validation

So far, we have provided an `onCommit`block in our `eventHandler`. This is where the active instructions are usually database changes.

If you want to provide some validation before the action, you need to have an `onValidate` block before the `onCommit`. The last value of the code block must always be the return message type.

In this case, we have used the kotlin [require](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) function to check that the `counterparty` field is not empty.

The `onCommit` block will only be executed if the `counterparty` field is not null.

```kotlin
    eventHandler<Counterparty>(name = "COUNTERPARTY_INSERT") {
        onValidate { event ->
            val counterparty = event.details
            require(counterparty.name != null) { "Counterparty should have a name" }
            ack()
        }
        onCommit { event ->
            val counterparty = event.details
            entityDb.insert(counterparty)
            ack()
        }
    }
```

## Returning a value
The `onCommit` block must always return either an `ack()` or `nack(...)`. In the previous examples, it has always been an `ack()`.

Now consider a scenario where you might want to return a `nack(...)`. In this case, there is no `onValidate` block.

In the `onCommit` block:
- if the counterparty field is empty, the `eventHandler` returns a `nack`, along with a suitable message.
- if the counterparty field has content, then the `eventHandler` returns an `ack`

```kotlin
eventHandler<Counterparty>(name = "COUNTERPARTY_INSERT") {
    onCommit { event ->
        val counterparty = event.details
        if (counterparty.name == null) {
            nack("Counterparty should have a name")
        } else {
            entityDb.insert(counterparty)
            ack()
        }
    }
}
```

### Default reply types

So far, we have seen `ack` and `nack`. There is a third type: `warningNack`. Let's stop and look at the specifications for all three default reply types:

* `ack`: used to signify a successful result. `ack` takes an optional parameter of `List<Map<String, Any>>`. For example, `ack(listOf(mapOf("TRADE_ID", "1")))`.
* `nack`: used to signify an unsuccessful result. `nack` accepts either a `String` parameter or a `Throwable`. For example, `nack("Error!")` or `nack(myThrowable)`.
* `warningNack`: used to warn the client. `warningNack`, like `nack`, accepts either a `String` parameter or a `Throwable`. For example, `warningNack("Provided User alias $userAlias will override Username $username.")` or `warningNack(myThrowable)`.


## Transactional Event Handlers (ACID)
If you want your  `eventHandler` to comply with [ACID](/getting-started/glossary/glossary/#acid), you can declare it to be  `transactional = true`. Any exception returned will result in a complete rollback of all parts of the `onCommit` and `onValidate` (the transaction also covers read commands) blocks. While an exception will trigger a rollback, the transaction will commit if a `nack` or `ack` is returned.

```kotlin
    eventHandler<Counterparty>(transactional = true) {
        onCommit { event ->
            val counterparty = event.details
            entityDb.insert(counterparty)
            ack()
        }
    }
```

 Whether it is a database update or uploading a report to a third party. It will be called when an event message is received with `validate = false` and has successfully passed the `onValidate` block. The last value of the code block must always be the return message type.

## Processing onValidate and onCommit
The incoming message that triggers an Event Handler can have `validate` set to `true` or `false`. This controls whether the Event Handler simply performs some validation or it executes its complete set of processing. 

### validate = true
The key thing about this setting is that it means that only the `onValidate` block is executed, not the `onCommit` block. Here is the precise process flow:

![](/img/eh-validate-true.png)
### validate = false
With this setting, both the `onValidate` codeblock and the `onCommit` codeblock will be executed. Here is the precise process flow:

![](/img/eh-validate-false.png)
## More information about onValidate
As you will have seen above, an `onValidate` codeblock will be executed whether the incoming message has `validate=true` or `validate=false`.The `onValidate` block is optional if you are using the default reply message type (`EventReply`) and will automatically be successful if not defined.

However, note that an `onValidate` codeblock is mandatory when using custom reply message types; the script will not compile if there is no `onValidate` codeblock. See the simple example below:

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

Kotlin’s `require` method throws an exception with a message if the boolean expression is not what is expected, and the Event Handler automatically converts that exception into a corresponding `EventNack`.

### Context Event Handlers
In order to optimise database look-up operations, you might want to use data obtained by the `onValidate` block inside your `onCommit` block. To do this, 
use context Event Handlers, as shown below:

```kotlin
    contextEventHandler<Company, String>(name = "CONTEXT_COMPANY_INSERT") {
        onValidate {
            val company = it.details
            if(company.companyName == "MY_COMPANY") {
                validationAck(validationContext = "Best company in the world")
            } else {
                validationAck()
            }
        }
        onCommit { event, context ->
            val parsedContext = context ?: "Missing context"
            val company = event.details
            val result = entityDb.insert(company)
            ack(listOf(mapOf("VALUE" to parsedContext)))
        }
    }
```

As the  example shows, there is an additional type defined for the context Event Handler. This is a `String`. It gives you the option of returning a `String` value from the `onValidate` block (see _validationAck_ logic), which can then be captured it in the `onCommit` block (see _context_ lambda parameter).

Because the example creates a validation context, the function `validationAck()` is used at the end of the `onValidate` block, and not just `ack()`.

