---
title: 'Java Event Handlers'
sidebar_label: 'Java Event Handlers'
id: java-event-handlers
---



Event Handlers can be written in Java using Event Handler [APIs](/database/api-reference/event-handler-api). On this page, we look at Event Handlers written using the [Rx3 Event handlers](/database/api-reference/event-handler-api/#rx3eventhandler)

:::note

We recommend using **Kotlin** to implement Event Handlers.

- **Java** Event Handlers can only be implemented using [**RxJava3**](#rx3) [**Sync**](#sync) Event Handlers.
- Async Event Handlers are widely used in Kotlin events and cannot be used for Java events, as there is no implementation for Kotlin coroutines in Java.



:::

## A simple example of an Event Handler

- This method passes the input message type `CounterParty` as a parameter and expects the output message type `EventReply` to be returned.
- The default name will be `EVENT_<input message type name>`. So, for an input message type declared as `CounterParty`, the event with the name `EVENT_COUNTERPARTY` is automatically registered.

```java
        @Module
        public class EventCounterParty implements Rx3EventHandler<Counterparty, EventReply> {

            private final RxEntityDb entityDb;

            @Inject
            public EventCounterParty(RxEntityDb entityDb) {
                this.entityDb = entityDb;
            }

            @Override
            public Single<EventReply> process(Event<Counterparty> counterpartyEvent) {
                Counterparty counterparty = counterpartyEvent.getDetails();
                return entityDb.insert(counterparty).flatMap(result -> ack(this));
            }
        }
```

## Adding a name
Every `eventHandler` must have a unique name. If you do not provide one, it will be allocated a default name automatically, as shown in the previous example.

It is good practice to provide your own name for each `eventHandler`. For example, if you have insert and modify codeblocks for the same table and you don't name them, then the platform will probably generate identical names for both - which will give you a problem.
Note that the prefix `EVENT_` is automatically added to the name that you specify.

So, below, we modify our previous example by defining the name of the `eventHandler`: COUNTERPARTY_INSERT by overriding messageType method of the Rx3EventHandler. This will automatically become EVENT_COUNTERPARTY_INSERT.

```java

    @Module
    public class EventCounterParty implements Rx3EventHandler<Counterparty, EventReply> {

        private final RxEntityDb entityDb;

        @Inject
        public EventCounterParty(RxEntityDb entityDb) {
            this.entityDb = entityDb;
        }

        @Nullable
        @Override
        public String messageType() {
            return "COUNTERPARTY_INSERT";
        }

        @Override
        public Single<EventReply> process(Event<Counterparty> counterpartyEvent) {
            Counterparty counterparty = counterpartyEvent.getDetails();
            return entityDb.insert(counterparty).flatMap(result -> ack(this));
        }
}
```

## Adding validation

So far, we have overridden the process method in our `eventHandler`. This is where the active instructions are - usually database changes.

If you want to provide some validation before the action, you need to implement the `Rx3ValidatingEventHandler` interface and override `onCommit` and `onValidate` methods.

in the example below, the `onValidate` method will be executed first and the `onCommit` method will only be executed if the `counterparty` field is not null.

```java

    @Module
    public class EventCounterParty implements Rx3ValidatingEventHandler<Counterparty, EventReply> {

        private final RxEntityDb entityDb;

        @Inject
        public EventCounterParty(RxEntityDb entityDb) {
            this.entityDb = entityDb;
        }

        @Nullable
        @Override
        public String messageType() {
            return "COUNTERPARTY_INSERT";
        }

        @NotNull
        @Override
        public Single<EventReply> onCommit(@NotNull Event<Counterparty> event) {
            Counterparty counterparty = event.getDetails();
            return entityDb.insert(counterparty) .flatMap(result -> ack(this));
        }

        @NotNull
        @Override
        public Single<EventReply> onValidate(@NotNull Event<Counterparty> event) {
            Counterparty counterparty = event.getDetails();
            if(counterparty.getName().isEmpty()) {
                return nack(this, "Counterparty should have a name");
            }
            return ack(this);
        }
}
```

### Returning a nack

The `onValidate` method must always return either an `ack()` or `nack(...)`.

Look at the `onValidate` method in the previous example:

- if the counterparty field is empty, the `eventHandler` returns a `nack`, along with a suitable message.
- if the counterparty field has content, then the `eventHandler` returns an `ack`

### Default reply types

So far, we have seen `ack` and `nack.  There is a third reply type: `warningNack`. Let's stop and look at the specifications for all three default reply types:

* `ack`: used to signify a successful result. `ack` takes an optional parameter of `List<Map<String, Any>>`. For example, `ack(listOf(mapOf("TRADE_ID", "1")))`.
* `nack`: used to signify an unsuccessful result. `nack` accepts either a `String` parameter or a `Throwable`. For example, `nack("Error!")` or `nack(myThrowable)`.
* `warningNack`: used to warn the client. `warningNack`, like `nack`, accepts either a `String` parameter or a `Throwable`. For example, `warningNack("Provided User alias $userAlias will override Username $username.")` or `warningNack(myThrowable)`.


## Transactional Event Handlers (ACID)

If you want your  `eventHandler` to comply with ACID, you need to use the RxEntityDb [writeTransaction](/database/database-interface/entity-db/#write-transactions). Any exception or nack returned will result in a complete rollback of all parts of the `onCommit` and `onValidate` (the transaction also covers read commands) methods.

```java

    @Module
    public class EventCounterParty implements Rx3EventHandler<Counterparty, EventReply> {

        private final RxEntityDb entityDb;@Inject

        public EventCounterParty(RxEntityDb entityDb) {
            this.entityDb = entityDb;
        }

        @Nullable
        @Override
        public String messageType() {
            return "COUNTERPARTY_INSERT";
        }

        @Override
        public Single<EventReply> process(Event<Counterparty> counterpartyEvent) {
            Counterparty counterparty = counterpartyEvent.getDetails();
            return entityDb.writeTransaction(txn -> {
                txn.insert(counterparty);
                return ack(this);
            }).map(result -> result.getFirst());
        }
    }
```

### Context Event Handlers

In order to optimise database look-up operations, you might want to use data obtained by the `onValidate` method inside your `onCommit` method. To do this,
implement the Rx3ContextValidatingEventHandler interface, as shown below:

```java

    @Module
    public class ContextEvent implements Rx3ContextValidatingEventHandler<Company, EventReply, String> {
        private final RxEntityDb entityDb;

        @Inject
        public ContextEvent(RxEntityDb entityDb) {
            this.entityDb = entityDb;
        }

        @Nullable
        @Override
        public String messageType() {
            return "CONTEXT_COMPANY_INSERT";
        }

        @NotNull
        @Override
        public Single<EventReply> onCommit(@NotNull Event<Company> event, @Nullable String context) {
            String parsedContext;
            parsedContext = Objects.requireNonNullElse(context, "Missing context");
            Company company = event.getDetails();
            return entityDb.insert(company).flatMap(result -> ack(this, List.of(Map.of("VALUE",parsedContext))));
        }

        @NotNull
        @Override
        public Single<ValidationResult<EventReply, String>> onValidate(@NotNull Event<Company> event) {
            Company company = event.getDetails();
            if(company.getCompanyName().equals("MY_COMPANY")) {
                return ack(this).map(result -> validationResult(result, "Best company in the world"));
            } else {
                return ack(this).map(this::validationResult);
            }
        }
    }
```
