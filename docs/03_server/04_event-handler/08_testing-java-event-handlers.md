---
title: 'Testing Java Event Handlers'
sidebar_label: 'Testing Java Event Handlers'
id: testing-java-event-handlers
---

[Introduction](/server/event-handler/introduction)  | [Basics](/server/event-handler/basics) | [Advanced](/server/event-handler/advanced) | [Examples](/server/event-handler/examples) | [Configuring runtime](/server/event-handler/configuring-runtime) | [Testing](/server/event-handler/testing) | [Java event handlers](/server/event-handler/java-event-handlers) | [Testing java event handlers](/server/event-handler/testing-java-event-handlers)

## Integration testing

The Genesis Platform provides the `AbstractGenesisTestSupport` abstract class that enables end-to-end testing of specific areas of your application.

In this case, build `GenesisTestConfig` with the following information:

- Set packages: `global.genesis.eventhandler` this is the standard package name from the framework, which is needed for all Java events/custom events. Make sure you
name the package where you defined the events. In the example below, it is `global.genesis.position.samples.events.rxjava`
- Set genesis home
- Set initial data: we want to ensure that we have a database, seeded with information

```java
public class TradingEventHandlerTest extends AbstractGenesisTestSupport<EventResponse> {
        public TradingEventHandlerTest() {
            super(GenesisTestConfig.builder()
                .setPackageNames(List.of("global.genesis.eventhandler","global.genesis.position.samples.events.rxjava"))
                .setGenesisHome("/GenesisHome/")
                .setInitialDataFiles("seed-data.csv")
                .setParser(EventResponse.Companion)
                .build()
        );
    }
}
```

For more information about `AbstractGenesisTestSupport`, see the [Testing pages](/operations/testing/integration-testing/#abstractgenesistestsupport).

Once you have set up your configuration, you can start writing tests against your Event Handler.

## Writing tests

Let's write some tests for the simple Event Handler defined below:

```java
        @Module
        public class EventTrade implements Rx3ValidatingEventHandler<Trade, EventReply> {

            private final RxEntityDb entityDb;

            @Inject
            public EventTrade(RxEntityDb entityDb) {
                this.entityDb = entityDb;
            }

            @Nullable
            @Override
            public String messageType() {
                return "TRADE_INSERT";
            }

            @NotNull
            @Override
            public Single<EventReply> onCommit(@NotNull Event<Trade> tradeEvent) {
                    Trade trade = tradeEvent.getDetails();
                    return entityDb.writeTransaction(txn -> {
                    Trade result = txn.insert(trade).blockingGet().getRecord();
                    return ack(this, List.of(Map.of("TRADE_ID", result.getTradeId())));
                }).map(result -> result.getFirst());
            }

            @NotNull
            @Override
            public Single<EventReply> onValidate(@NotNull Event<Trade> event) {
                Trade trade = event.getDetails();
                if (entityDb.get(Counterparty.byId(trade.getCounterpartyId())).blockingGet() == null) {
                    return Single.just(new StandardError("INTERNAL_ERROR", "COUNTERPARTY ById(counterpartyId=" + trade.getCounterpartyId() +") not found in database").toEventNackError());
                } else if (entityDb.get(Instrument.byId(trade.getInstrumentId())).blockingGet() == null) {
                    return Single.just(new StandardError("INTERNAL_ERROR", "INSTRUMENT ById(instrumentId=" + trade.getInstrumentId() +") not found in database").toEventNackError());
                }
                return ack(this);
            }
        }
```

### Simple test

Below is an example of a simple test.

First, this creates an `Event` object, setting the event details and specifying the intended Event Handler for the message "EVENT_TRADE_INSERT" and username.

Second, it sends a message to the Event Handler using `getMessageClient().request(event, EventReply.class)`. The result is first verified to be an `EventAck`. 

Finally, it checks that the inserted trade can be retrieved from the database.:

```java
    @Test
    public void testTradeInsert() throws InterruptedException {
        Trade trade = Trade.builder()
            .setTradeId("1")
            .setCounterpartyId("CP1")
            .setInstrumentId("I2")
            .setSide("BUY")
            .setPrice(1.123)
            .setQuantity(1000)
            .build();
        Event event = new Event(trade, "EVENT_TRADE_INSERT", "JohnDoe");
        EventReply reply = getMessageClient().request(event, EventReply.class).blockingGet();
        assertEquals(reply, new EventReply.EventAck(List.of(Map.of("TRADE_ID", trade.getTradeId()))));
        Trade result = getRxDb().entityDb().get(Trade.byId("1")).blockingGet();
        assertNotNull(result);
    }
```


### Error response test

You may also want to test a negative case, where you expect to receive an error as a response.

In the example below, we expect the response to be of type `EventNack` when we try to insert a wrong instrument ID. As in the Event Handler above, there is a check to see if the instrument exists in the database.

```java
    @Test
    public void testTradeInsertWrongInstrumentId() throws InterruptedException {
        Trade trade = Trade.builder()
            .setTradeId("1")
            .setCounterpartyId("CP1")
            .setInstrumentId("DOESNOTEXIST")
            .setSide("BUY")
            .setPrice(1.213)
            .setQuantity(100)
            .build();
        Event event = new Event(trade, "EVENT_TRADE_INSERT_JAVA", "JohnDoe");
        EventReply reply = getMessageClient().request(event, EventReply.class).blockingGet();
        GenesisError genesisError = new StandardError("INTERNAL_ERROR", "INSTRUMENT ById(instrumentId=DOESNOTEXIST) not found in database");
        assertEquals(reply, new EventReply.EventNack(List.of(), List.of(genesisError)));
    }
```

### Testing with authorisation

### Set-up

To test that the Event Handler authorisation works correctly, you need to do some setting up.

First, make sure that your authorisation set-up is designed to behave as follows:

- A user who enters a trade must have an entry in the "ENTITY_VISIBILITY" auth map; the entity code for this user must match the `counterpartyId` of the trade.
- The user must have an entry in the "RIGHT_SUMMARY" table with "RIGHT_CODE" as "TRADER".

Second, you need to modify the previous example Event Handler so that only authorised users can insert trades.

You can find an [Event example](/database/api-reference/authorisation-api) in our Authorization API pages written in Kotlin.

```java
    @Module
    public class EventTrade implements Rx3EventHandler<Trade, EventReply> {

        private final RxEntityDb entityDb;
        private final RxDb rxDb;
        private final RightSummaryCache rightSummaryCache;

        private Authority authCache;

        @Inject
        public EventTrade(RxEntityDb entityDb, RxDb rxDb, RightSummaryCache rightSummaryCache) {
            this.entityDb = entityDb;
            this.rightSummaryCache = rightSummaryCache;
            this.rxDb = rxDb;
        }

        @Inject
        public void init() {
            this.authCache = AuthCache.newReader("ENTITY_VISIBILITY", rxDb.getUpdateQueue());
        }

        @Nullable
        @Override
        public String messageType() {
            return "TRADE_INSERT_JAVA";
        }

        @Override
        public Single<EventReply> process(Event<Trade> tradeEvent) {
            String userName = tradeEvent.getUserName();

            if(rightSummaryCache.userHasRight(userName, "TRADER")){
                Trade trade = tradeEvent.getDetails();
                return entityDb.writeTransaction(txn -> {
                    Trade result = txn.insert(trade).blockingGet().getRecord();
                    return ack(this, List.of(Map.of("TRADE_ID", result.getTradeId())));
                }).map(result -> result.getFirst());
            }
            return Single.just(new StandardError("NOT_AUTHORISED", "User " + userName + " lacks sufficient permissions").toEventNackError());
        }
    }
```

Third, you need to specify the auth cache override in the `GenesisTestConfig`:

```java
    public class TradingEventHandlerTest extends AbstractGenesisTestSupport<EventResponse> {
        public TradingEventHandlerTest() {
            super(GenesisTestConfig.builder()
                .setPackageNames(List.of("global.genesis.eventhandler","global.genesis.rxjava"))
                .setGenesisHome("/GenesisHome/")
                .setInitialDataFiles("TEST_DATA.csv")
                .setAuthCacheOverride(List.of("ENTITY_VISIBILITY"))
                .setParser(EventResponse.Companion)
                .build()
            );
        }
    }
```

Fourth, in your test set-up, let's authorise one user to be able to insert trades and another who is not.

```java
    @Before
    public void setUp() {
        authorise("ENTITY_VISIBILITY", "CP1", "TraderUser");
        getRxDb().insert(RightSummary.builder().setRightCode("TRADER").setUserName("TraderUser").build().toDbRecord()).blockingGet();
        getRxDb().insert(RightSummary.builder().setRightCode("SUPPORT").setUserName("SupportUser").build().toDbRecord()).blockingGet();
    }
```

For more information on authorisation, see the [authorisation docs](/server/access-control/authorisation-overview).

### Tests

After you have set things up. Now you can create the tests themselves.

Below is a test that verifies that only Traders can enter trades:

```java
    @Test
    public void testTradeInsertedByTrader() {
        Trade trade = Trade.builder()
            .setTradeId("1")
            .setCounterpartyId("CP1")
            .setInstrumentId("I2")
            .setSide("BUY")
            .setPrice(5.0)
            .setQuantity(1)
            .build();
        Event event = new Event(trade, "EVENT_TRADE_INSERT", "TraderUser");
        EventReply reply = getMessageClient().request(event, EventReply.class).blockingGet();
        assertEquals(reply, new EventReply.EventAck(List.of(Map.of("TRADE_ID", trade.getTradeId()))));

        Trade insertedUser = getRxDb().entityDb().get(Trade.byId("1")).blockingGet();
        assertNotNull(insertedUser);
    }
```

Following that, we have a test to verify that a trade cannot be entered if the user is _not_ a Trader:

```java
    @Test
    public void testTradeCannotBeInsertedIfNotTrader() {
        Trade trade = Trade.builder()
            .setTradeId("1")
            .setCounterpartyId("CP1")
            .setInstrumentId("I2")
            .setSide("BUY")
            .setPrice(5.0)
            .setQuantity(1)
            .build();
        Event event = new Event(trade, "EVENT_TRADE_INSERT_JAVA", "SupportUser");
        EventReply reply = getMessageClient().request(event, EventReply.class).blockingGet();

        GenesisError genesisError = new StandardError("NOT_AUTHORISED", "User SupportUser lacks sufficient permissions");
        assertEquals(reply, new EventReply.EventNack(List.of(), List.of(genesisError)));
    }
```
