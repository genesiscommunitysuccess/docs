---
title: 'Testing'
sidebar_label: 'Testing'
id: testing
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[Introduction](/server/integration/custom-endpoints/introduction/) | [Basics](/server/integration/custom-endpoints/basics/) |  [Advanced](/server/integration/custom-endpoints/advanced/) | [Examples](/server/integration/custom-endpoints/examples/) | [Configuring runtime](/server/integration/custom-endpoints/configuring-runtime/) | [Testing](/server/integration/custom-endpoints/testing/)

## Integration testing

To create integration tests for your custom endpoints, you need to create service tests by extending the `AbstractGenesisTestSupport` class and specifying the `genesis-router.kts` as the Script File Name. Provide the package names of genesis-router and the endpoint. Examples of how you would initialise a test extending this class are provided below.

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
class TestEndpoint : AbstractGenesisTestSupport<GenesisSet>(
    GenesisTestConfig {
        packageNames = mutableListOf("global.genesis.router", "alpha.custom.endpoint")
        genesisHome = "/genesisHome"
        scriptFileName = "genesis-router.kts"
        parser = { it }
    }
) {
    override fun createDictionary(): GenesisDictionary = testDictionary()}

    @Test
    fun testRouterEndPoint() {
        val client = HttpClient.newHttpClient()
        val request = HttpRequest
            .newBuilder(URI("http://localhost:9064/file-handler/upload")) //the second package name should refer to the package of your custom endpoints
            .version(HttpClient.Version.HTTP_1_1)
            .POST(HttpRequest.BodyPublishers.ofString("TEXT"))
            .build()
        val response = client.send(request, HttpResponse.BodyHandlers.ofString())
        Assert.assertEquals("{ \"Result\": \"Successful upload\"}", response.body())
    }
```

</TabItem>
<TabItem value="java">

```java
public class TestEndpoint extends AbstractGenesisTestSupport<GenesisSet> {
    public TestEndpoint () {
        super(GenesisTestConfig.builder()
            .setPackageNames(List.of("global.genesis.router", "org.file.processor")) //the second package name should refer to the package of your custom endpoints
            .setGenesisHome("/genesisHome")
            .setScriptFileName("genesis-router.kts")
            .setParser(e -> e)
            .build());
    }

    @Test
    public void testRouterEndpoint() throws URISyntaxException, IOException, InterruptedException {
        var client = HttpClient.newHttpClient();
        var request = HttpRequest
                .newBuilder(new URI("http://localhost:9064/file-handler/upload")) //This localhost, using the webPort specified in genesis-router.kts, and then the registered endpoint name
                .version(HttpClient.Version.HTTP_1_1)
                .POST(HttpRequest.BodyPublishers.ofString("TEXT"))
                .build();

        var response = client.send(request, HttpResponse.BodyHandlers.ofString());
        assertEquals("{ \"Result\": \"Successful upload\"}", response.body());
    }
}
```

</TabItem>
</Tabs>

## Manual testing

### Testing with an API client

An API client is a useful way of testing components. As a client, it is effectively a front end seeking information from the server.
You can test these endpoints on [Postman App](https://www.postman.com/downloads/)/[Insomnia App](https://insomnia.rest/download).

Before you can make any calls custom endpoints, you have to permission yourself by obtaining a SESSION_AUTH_TOKEN. The details of how to do this are on our separate [Testing](/operations/testing/component-testing/#using-an-api-client) page.

Once you have the SESSION_AUTH_TOKEN, keep a copy that you can paste into each request as you make your test call.

In the example below, we use Insomnia as the API client.

![](/img/custom-endpoint-test.png)

In the header, you need to supply:

- a SOURCE_REF (always), which identifies you; you can use any string value that suits you
- the SESSION_AUTH_TOKEN that permissions you to access the server

The url consists of: 
- the address or hostname of the server
- custom-endpoint name
