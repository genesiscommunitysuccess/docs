---
title: Event handlers
sidebar_label: Event handlers
sidebar_position: 1
id: configure

---
The Genesis Platform has a real-time event-driven architecture.

Applications built on the system must respond immediately to different types of input:  inputs from users, messages from other systems, market-data updates and internally calculated analytic signals.  These inputs are events.

All the business logic for applications built on the platform is structured around these events. When an event occurs, the business logic immediately fires into action.

The vast majority of applications include business workflow.

That could be a simple linear workflow, such as a deal being enriched and approved, or a margin call payment – or it could be a more complex set of steps

Most applications built on the platform include the typical financial product **business entities**, such as orders, trades, bids, allocations and positions. These business entities have a lifecycle where they go through various **states**. The transition from one state to another is an event that needs to be handled. The paths through those states are workflows, and to assist the workflows, we use state machines.

## A simple example of an event handler

Here is a simple example of an event handler file. It defines an event handler called Hello and then has a contextEventHandler that checks for a name and sends an acknowledgement.
```kotlin
eventHandler {

    eventHandler<Hello> {

        permissions {
            auth("NAMES") {
                field { name }
            }
        }

        onCommit {
            ack()
        }
    }

    contextEventHandler<Hello, String>("CONTEXT_HELLO") {
        permissions {
            auth("NAMES") {
                field { name }
            }
        }

        onValidate {
            validationAck(validationContext = it.details.name)
        }
    }
}
```

### Configuration in processes.xml

The event handler has a service configuration in your application's **processes.xml** file. Here is an example:
 For more information about the tags in this example, see [system processes](/platform-reference/essential-information/processes-xml).

```xml
<process name="TRADING_APP_EVENT_HANDLER">
    <groupId>TRADING_APP</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true</options>
    <module>genesis-pal-eventhandler</module>
    <package>global.genesis.eventhandler.pal</package>
    <script>trading_app-eventhandler.kts</script>
    <description>Handles events</description>
    <classpath>trading_app-messages*,trading_app-eventhandler*</classpath>
    <language>pal</language>
</process>
```

## A more complex event handler

A more complex example will follow shortly.

## Defining state machines

State machines, which define the conditions for moving from one state to another, are defined within your event handler files. See more details about these in the section on [Defining your state machines](/platform-reference/configure-key-modules/state-machines/define/),