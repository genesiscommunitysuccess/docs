---
title: 'Testing'
sidebar_label: 'Testing'
id: testing
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[Introduction](/server/integration/custom-endpoints/introduction/) | [Basics](/server/integration/custom-endpoints/basics/) |  [Advanced](/server/integration/custom-endpoints/advanced/) | [Examples](/server/integration/custom-endpoints/examples/) | [Configuring runtime](/server/integration/custom-endpoints/configuring-runtime/) | [Testing](/server/integration/custom-endpoints/testing/)

To create integration tests for your custom endpoints, you need to create service tests by extending the `AbstractGenesisTestSupport` class and specifying the `genesis-router.kts` as the Script File Name. Examples of how you would initialise a test extending this class are provided below.

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
class TestEndpoint : AbstractGenesisTestSupport<GenesisSet>(
    GenesisTestConfig {
        packageNames = mutableListOf("global.genesis.router", "org.file.processor")
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