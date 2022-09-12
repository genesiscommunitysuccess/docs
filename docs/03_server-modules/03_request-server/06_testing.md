---
title: 'Testing'
sidebar_label: 'Testing'
id: testing
---

[Introduction](/server-modules/request-server/introduction)  | [Basics](/server-modules/request-server/basics) | [Advanced](/server-modules/request-server/advanced) | [Examples](/server-modules/request-server/examples) | [Configuring runtime](/server-modules/request-server/configuring-runtime) | [Testing](/server-modules/request-server/testing)

## Integration testing

It is good practice to test your Request Servers. This is the best way to prevent any unexpected side effects of changes to your application over time.

The Genesis platform provides the `AbstractGenesisTestSupport` abstract class that enables end-to-end testing of specific areas of your application. In this case, we want to ensure that we have a database, seeded with information, and that our Request Server configuration is used to create our Request Server. We also need to add the required packages and genesis home. 

```kotlin
class ReqRepTests : AbstractGenesisTestSupport<Reply<*>>(
    GenesisTestConfig {
        addPackageName("global.genesis.requestreply.pal")
        genesisHome = "/GenesisHome/"
        scriptFileName = "your-application-reqrep.kts"
        initialDataFile = "seed-data.csv"
    }
) {
    ...
}
```

For more information about `AbstractGenesisTestSupport`, see the [testing docs](/operations/testing/integration-testing).

Once you have set up your configuration, we can start writing tests against our Request Server. Your tests will look a little different, depending on if you are using the standard approach to Request Servers or using [custom Request Servers](/server-modules/request-server/advanced/#custom-request-servers).

### Standard Request Servers

Lets runs a very simple example.
Copy the following into a csv file and save as `seed-data.csv` in the test Resources folder.

```text
#COUNTERPARTY
COUNTERPARTY_ID,COUNTERPARTY_NAME
testID 1,TestName 1
testID 2,TestName 2
```
Lets send a message to our Genesis application, pointing at the correct Request Server (making sure to add the *REQ_* prefix) and wait for the response.
The Genesis platform uses Kotlin Coroutines which gives us a degree of non-blocking asynchronous computation. For this reason, we must wrap our tests in a `runBlocking` coroutine scope as seen below.


```kotlin
class ReqrepTest : AbstractGenesisTestSupport<GenesisSet>(
    GenesisTestConfig {
        addPackageName("global.genesis.requestreply.pal")
        genesisHome = "/GenesisHome/"
        scriptFileName = "positions-app-tutorial-reqrep.kts"
        initialDataFile = "seed-data.csv"
        parser = { it }
    }
) {

    @Test
    fun `can get all counterparty`() = runBlocking {
        val request = GenesisSet.genesisSet {
            MessageType.MESSAGE_TYPE with "REQ_COUNTERPARTY"
        }
        val counterparties = sendMessageAsync(request).getArray<GenesisSet>("REPLY")
        assertNotNull(counterparties)
        assertEquals(2, counterparties.size)
    }
}

```

In the above example, we are asserting that there are five rows within the response from our Request Server. This is based on the two rows of data that we have in `seed-data.csv` declared earlier.

### Custom Request Servers

For custom Request Servers, we must declare a workflow object that matches the custom Request Server that we have declared. This should match the same input and output types for the custom Request Server.

Given a custom Request Server that takes an input of type `Hello` and returns type `World`, we pass the same types into the requestReplyWorkflow. We can optionally pass the name of the Request Server to the builder.

```kotlin
object HelloWorldFlow : RequestReplyWorkflow<Hello, World> by requestReplyWorkflowBuilder("HELLO_WORLD")

@Test
fun `can get hello world`() = runBlocking {
    val reply = sendRequest(HelloWorldFlow, Hello("Peter")).first()

    assert(reply.message == "Hello Peter")
}
```

If you want to reuse a workflow with the same input and output types, you can use the unary plus overload to change the name of the Request Server being pointed to. In the  example below, we reuse `HelloWorldFlow` and change the Request Server to "HELLO_WORLD_CAPS", a variant of the same Request Server which returns a string in all caps.

```kotlin
@Test
fun `can get hello world`() = runBlocking {
    val reply = sendRequest(HelloWorldFlow + "HELLO_WORLD_CAPS", Hello("Peter")).first()

    assert(reply.message == "HELLO PETER")
}
```

## Manual testing

### Testing with Console

In Genesis Console, select your Request Sever in the resources tab.
Once you click into your Request Server, you will see the current response from the Request Server and any input fields that you have defined. You can change the inputs and verify that the correct behaviour is being seen. Make sure that your database has some data for you to search through.

![](/img/test-console-rs-success.png)

For more detailed information about using Genesis Console for manual testing, head over to the [testing docs](/server-modules/request-server/testing).

### Testing with an API client

An API client is useful way of testing components. As a client, it is effectively a front end seeking information from the server.

The API client enables you to create calls to the resources in your server - data servers, request servers and event handlers. Then you can just click to run a call and see what response you get.

Before you can make any calls on these resources, you will have to permission yourself by obtaining a SESSION_AUTH_TOKEN. The details of how to do this are on our separate [Testing](/operations/testing/component-testing/#using-an-api-client) page.

Once you have the SESSION_AUTH_TOKEN, keep a copy that you can paste into each request as you make your test call.

In the example below, we are using Insomnia as the client API.

![](/img/test-rs-instrument-success.png)

There is no need for any information in the body, as this is a **GET** request.

In the header, you need to supply:

- a SOURCE_REF (always), which identifies you; you can use any string value that suits you
- the SESSION_AUTH_TOKEN that permissions you to access the server

In front of the url, this has been set to a **GET** call.

The url consists of:

- the address or hostname of the server
- if necessary, some extra routing; in this case **sm** uses a proxy to access the server
- the name of the request server, preceded by **REQ_**

When you have this in place, click on **Send** to make the call. You can see that the fields for the instruments have been returned on the right of the screen.

