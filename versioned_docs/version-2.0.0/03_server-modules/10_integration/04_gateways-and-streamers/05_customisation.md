---
title: 'Customisation'
sidebar_label: 'Customisation'
id: customisation
---

While the standard architecture of the FIX gateway is more than sufficient for most use cases, it is not ideal for more demanding architectures.

Systems requiring high throughput or low latency may not want to persist messages and session states to an out-of-process database.

The FIX gateway is highly customisable,  allowing the addition of custom logon authenticators, inbound and outbound message handlers, and session state persistence stores.

The gateway also provides a number of out-of-the-box implementations that can be configured without providing custom code.

## Customisation through injection
Custom components are injected through the standard dependency-injection mechanism for the platform.

The process bootstrap will scan packages specified in the package block of the process definition in the _applicationName_-**processes.xml** file.

If no implementations of certain interfaces are found, it will provide default implementations.

To inject a custom interface, all you need to do is:
1. Create a class that implements the appropriate interface
2. Make sure the package is scanned by specifying it in the package block of the process definition
3. Annotate your class with the @Module annotation that the framework provides.

## Authentication
The interface for authentication of logon messages is `AuthenticationStrategy`:

```kotlin
interface AuthenticationStrategy {
    fun fromAdmin(message: Message, sessionID: SessionID)
}
```

The interface is called on receipt of an admin FIX message from a session (which includes logon messages).
- If the method call returns, the logon is accepted
- If the method throws a RejectLogon exception, the logon is rejected.

The default implementation authenticates the username and password provided in standard FIX tags 553 and 554 of the Logon message.

It will validate these and the CompId fields against an entry in the `FIX_SESSION_AUTH` table, which is provided as part of the FIX product distribution.

The default implementation is disabled by default. In order to enable it, add the following to the FIX Gateway process configuration file:

```xml
<authenticateLogonCredentials>true</authenticateLogonCredentials> 
```



## Message listeners
The interface for custom message receivers is `QuickFixMessageListener`:

```kotlin
interface QuickFixMessageListener {
    fun onInit()
    fun onCreate(sessionID: SessionID) {}
    fun fromApp(sessionID: SessionID, message: Message)
    fun toApp(sessionID: SessionID, message: Message) {}
    fun fromAdmin(sessionID: SessionID, message: Message) {}
    fun toAdmin(sessionID: SessionID, message: Message) {}
    fun onLogon(sessionID: SessionID)
    fun onLogoff(sessionID: SessionID)
}
```

The `onInit()` method is called after process bootstrapping is complete.

At this stage, you can be confident that all the configured FIX sessions have been registered and any socket connectors have been started.

Additional callbacks are invoked when events are received from the FIX engine.

It is important that any code in your implementation of this interface does not block the calling thread.

## Message publishers
The interface for custom message receivers is `QuickFixMessagePublisher`:

```kotlin
interface QuickFixMessagePublisher {
    fun onInit()
    fun onCreate(sessionID: SessionID)
    fun fromApp(sessionID: SessionID, message: Message)
    fun fromAdmin(sessionID: SessionID, message: Message)
    fun onLogon(sessionID: SessionID)
    fun onLogoff(sessionID: SessionID)
}
```

The `onInit()` method is called after process bootstrapping is complete.

At this stage, you can be confident that all the configured FIX sessions have been registered and any socket connectors have been started.

Additional callbacks are invoked when events are received from the FIX engine.

In order to send FIX messages from within this implementation, separate classes called `FixSessionRegistry` and `FixMessageSender` can be used to look up active sessions and send FIX messages respectively:

```java
@Module
public class SampleMessagePublisher implements QuickFixMessagePublisher {
    private final FixSessionRegistry registry;
    private final FixMessageSender sender;
    @Inject
    public SampleMessagePublisher(FixSessionRegistry registry, FixMessageSender sender) {
        this.registry = registry;
        this.sender = sender;
    }
	
    @Override
    public void onLogon(@NotNull SessionID sessionID) {
        new Thread(this::startReadLoop()).start();
    }
	
    private void startReadLoop() {
        while (true) {
            // Read message from external system
            Message message = ExternalSystem.readMessage();
            // Resolve session ID and lookup session in registry
            // Session is not logged on if not present in registry, if so, return message to queue
            QuickfixSession quickfixSession = registry.lookupActiveSession(someSessionId);
            sender.sendMessage(message, someSessionId);
        }
    }
    @Override
    public void onLogoff(@NotNull SessionID sessionID) {
        // Stop loop
    }
    
    @Override
    public void onInit() {}
    @Override
    public void onCreate(@NotNull SessionID sessionID) {}
    @Override
    public void fromAdmin(@NotNull SessionID sessionID, @NotNull Message message) {}
    @Override
    public void fromApp(@NotNull SessionID sessionID, @NotNull Message message) {}
}
```

It is important that any code in your implementation of this interface does not block the calling thread.

## Message stores
In order to provide custom code for FIX session state persistence and message recovery, the interface required is `MessageStoreFactory`.

```java
public interface MessageStoreFactory {
    MessageStore create(SessionID sessionID);
}
```

Which is closely linked to the `MessageStore`:
```java
public interface MessageStore {
    boolean set(int sequence, String message) throws IOException;
    void get(int startSequence, int endSequence, Collection<String> messages) throws IOException;
    int getNextSenderMsgSeqNum() throws IOException;
    int getNextTargetMsgSeqNum() throws IOException;
    void setNextSenderMsgSeqNum(int next) throws IOException;
    void setNextTargetMsgSeqNum(int next) throws IOException;
    void incrNextSenderMsgSeqNum() throws IOException;
    void incrNextTargetMsgSeqNum() throws IOException;
    Date getCreationTime() throws IOException;
    void reset() throws IOException;
    void refresh() throws IOException;
}
```

See the QuickFIXJ [official documentation](https://javadoc.io/static/org.quickfixj/quickfixj-core/2.3.0/quickfix/MessageStore.html) for more information.
