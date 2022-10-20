---
title: 'Data Server: testing'
sidebar_label: 'Testing'
id: testing
---



## Integration testing

The Genesis low-code platform provides the `AbstractGenesisTestSupport` abstract class, which enables end-to-end testing of specific areas of your application. 

In this case, we want to ensure that we have a database seeded with information. And we want to check that our Data Server configuration is used to create our Data Server. We also need to add the required packages and genesis home.

```kotlin
class DataServerTests : AbstractGenesisTestSupport<Reply<*>>(
    GenesisTestConfig {
        addPackageName("global.genesis.dataserver.pal")
        genesisHome = "/GenesisHome/"
        scriptFileName = "positions-app-tutorial-dataserver.kts"
        initialDataFile = "seed-data.csv"
    }
) {

    private var ackReceived = false
    private var initialData: GenesisSet = GenesisSet()
    private var updateData: GenesisSet = GenesisSet()

    @Before
    fun before() {
        ackReceived = false
        initialData = GenesisSet()
        updateData = GenesisSet()

        messageClient.handler.addListener { set, _ ->
            println(set)
            if ("LOGON_ACK" == set.getString(MessageType.MESSAGE_TYPE)) {
                ackReceived = true
            }
            if ("QUERY_UPDATE" == set.getString(MessageType.MESSAGE_TYPE)) {
                if (initialData.isEmpty) {
                    initialData = set
                } else {
                    updateData = set
                }
            }
        }
    }
```

There is more information about `AbstractGenesisTestSupport` in the section on [Integration testing](/operations/testing/integration-testing/#abstractgenesistestsupport).

Let's load some test data into the `seed-data.csv` in the root of the resources folder for your tests.

```text
#POSITION
POSITION_ID,INSTRUMENT_ID,QUANTITY,NOTIONAL,VALUE,PNL
000000000000001PSLO1,INSTRUMENT_TEST1,1,1111.11,1111.11,1111.11
000000000000001PSLO2,INSTRUMENT_TEST2,1,2222.22,2222.22,2222.22
000000000000001PSLO3,INSTRUMENT_TEST3,1,3333.33,3333.33,3333.33
```


We are now ready to begin writing tests for our Data Server.

Firstly, we send a DATA_LOGON message to our Data Sever; our Data Sever should then respond with the current snapshot of data. Any changes will then be automatically sent to us as a consumer.

We then need to trigger a change on the database. Our Data Server will see this change and send the update to us.

```kotlin
@Test
fun `data server passes update`(): Unit = runBlocking {
        messageClient.sendMessage(
            GenesisSet.genesisSet {
                MessageType.MESSAGE_TYPE with "DATA_LOGON"
                MessageType.DETAILS with GenesisSet.genesisSet {
                    MessageType.DATASOURCE_NAME with "ALL_POSITIONS"
                }
            }
        )
        Awaitility.waitAtMost(30, TimeUnit.SECONDS).until(ackAndDataReceived())

        // We pull out the initial data
        val rows = initialData.getArray<GenesisSet>("ROW")!!.sortedBy { it?.getString("POSITION_ID") }
        val firstRow = rows.first() ?: fail("Missing first row in initial data")
        val firstRowRef = firstRow.getGenesisSet("DETAILS")!!.getString("ROW_REF")!!
        assertEquals(3, rows.size)
        assertEquals("000000000000001PSLO1", firstRow.getString("POSITION_ID")!!)
        assertEquals(1111.11, firstRow.getDouble("VALUE")!!)

        // We update the database to trigger our Data Server into action
        entityDb.updateBy(Position.byId("000000000000001PSLO1")) {
            value = 1234.56
        }
        Awaitility.await().until(ackDataAndUpdateReceived())

        // We consume the update
        val updateRows = updateData.getArray<GenesisSet>("ROW")!!
        val updateRow = updateRows.first()!!

        assertEquals(1, updateRows.size)
        val updateRowRef = firstRow.getGenesisSet("DETAILS")?.getString("ROW_REF")!!
        assertEquals(firstRowRef, updateRowRef)
        assertEquals(1234.56, updateRow.getDouble("VALUE")!!)
    }

/**
 * Check ack and initial data received.
 *
 * @return true if ack and initial data received
 */
private fun ackAndDataReceived(): Callable<Boolean>? {
    return Callable { ackReceived && !initialData.isEmpty }
}
private fun ackDataAndUpdateReceived(): Callable<Boolean> {
    return Callable { ackReceived && !initialData.isEmpty && !updateData.isEmpty }
}


```

## Manual testing

### Testing with Console
If you use Genesis Console, this gives you a simple way of testing components.

1. In your browser, go to http://genesislcap.com/console/console-next2/.
2. Enter the IP address of your server. If you get a blank page without any response then this is probably because you don't have [NGINX configured](/operations/server-setup/config-management/#nginx-configuration-using-docker-imagerecommended).
3. Log in with your user name and password. This starts Genesis Console, and you will see a list of tabs along the top of the screen.
4. Click on the **RESOURCES** tab.
5. Filter the **Resource type** to show only data servers.

For example:

![](/img/test-console-ds-filter.png)

As well as the data servers that you have defined yourself, you will also see other data servers that have been generated automatically by the platform, anything that is a **GENESIS_AUTH** service, for example.

6. In the list, click on the data server you want to test. This displays the fields for that data server. 

7. Click on the arrow beside the data server that you want to test. This displays the current contents of the table or view that provides the data for that data server. If you can see that content, you have connected successfully to the resource.

![](/img/test-console-ds-success.png)


### Testing with an API client

An API client is useful way of testing components. As a client, it is effectively a front end seeking information from the server.

The API client enables you to create calls to the resources in your server - data servers, request servers and event handlers. Then you can just click to run a call and see what response you get.

Before you can make any calls on these resources, you will have to permission yourself by obtaining a SESSION_AUTH_TOKEN. The details of how to do this are on our separate [Testing](/operations/testing/component-testing/#using-an-api-client) page.

Once you have the SESSION_AUTH_TOKEN, keep a copy that you can paste into each request as you make your test call.

In the example below, we are using Insomnia as the client API.

#### url and Body
In front of the url, set the call to **POST**.

The url consists of:

- the address or hostname of the server
- if necessary, some extra routing; in this case **sm** uses a proxy to access the server
- the name of the data server


Set the body to **JSON**. In the body, simply insert opening and closing curly brackets **{}** - nothing else. 

![](/img/test-ds-url-body.png)

#### Header
In the header, you need to supply:

- a SOURCE_REF (always), which identifies you; you can use any string value that suits you
- the SESSION_AUTH_TOKEN that permissions you to access the server

![](/img/test-ds-header.png)

When you have all these elements in place, click on **Send** to make the call. You can see that the fields for the instruments have been returned on the right of the screen.

![](/img/test-ds-instrument-success.png)
