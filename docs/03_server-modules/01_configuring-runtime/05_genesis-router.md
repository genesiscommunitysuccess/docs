---
title: 'Genesis Router'
sidebar_label: 'Genesis Router'
id: genesis-router
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


![](/img/router_diagram.png)
Genesis Router is responsible for all communication between front end and back end. 
On the Genesis low-code platform, the front end connects to the back end through HTTPS or secure Websockets via a reverse proxy.
This must run on the same instance as the back end. The GENESIS_ROUTER service on the server acts as the endpoint for all API calls and listens (by default) to port 9064.
This is configured in the file **genesis-router.kts**.

Here is an example:

```kts
router {
    webPort = 9064
    socketPort = 9065

    httpServerCodec {
        maxInitialLineLength = 4096
        maxHeaderSize = 8192
        maxChunkSize = 8192
        validateHeaders = true
        initialBufferSize = 128
    }
    httpObjectAggregator {
        maxContentLength = 262144
        closeOnExpectationFailed = false
    }

    routes {
        route(messageType = "ALL_ORDERS", process = "OEMS_DATASERVER")
        route(messageType = "ALL_TRADES", process = "OEMS_DATASERVER")
        route(messageType = "ALL_ORDER_AUDITS", process = "OEMS_DATASERVER")
    }

    allowList {
        entry("ALL_ORDERS")
        entry("ALL_TRADES")
        entry("ALL_ORDER_AUDITS")
    }
}
```

## Configuring Runtime

There are two important files in your application that contain configuration information:
-  _application-name_**-processes.xml**
- _application-name_**-service-definitions.xml**

### Configuring in processes.xml

Here is an example of a Genesis-router configuration in an application's **processes.xml** file:

```xml
  <process name="GENESIS_ROUTER">
    <start>true</start>
    <scheduleRestart>true</scheduleRestart>
    <groupId>GENESIS</groupId>
    <options>-Xmx512m -DXSD_VALIDATE=false</options>
    <module>router</module>
    <package>global.genesis.router,global.genesis.console</package>
    <config>router-process-config.kts</config>
    <script>genesis-router.kts</script>
    <language>pal</language>
    <classpath>genesis-console-*.jar</classpath>
    <description>Socket, Websocket and HTTP proxy which routes incoming messages to GENESIS microservices</description>
</process>
```

For more information on the tags that can be set within the configuration for your application, go to our page on [processes.xml](/server-modules/configuring-runtime/processes/).

### Configuring in service-definitions.xml

Here is an example of the Genesis-router's service configuration:

```xml
  <service host="localhost" name="GENESIS_ROUTER" port="9017"/>
```

For more information on the attributes that can be set here, go to our page on [service definitions](/server-modules/configuring-runtime/service-definitions/).

## Router configuration
Let's have a look at the different options for configuring this file. You have seen some, but not all of these in the example above.

`webPort`: This port is used for tcp/ip socket. You must declare a port, and it cannot be below 1024.

`socketPort`: This port is used for http/websockets. You must declare a port, and it cannot be below 1024.

`dataserverPollingTimeout`: This setting contains the timeout for polling the data-server resources in the system in seconds. Default value is 60 seconds.

`authDisabled`: If set to true, this setting disables all authentication, and is used for development mode. Default value is false.

`nettyLoggingEnabled`: This setting if set to true, enables internal netty logging. Default value false.

**Netty configuration**:

`httpServerCodecDefinition`: A combination of HttpRequestDecoder and HttpResponseEncoder, which enables easier server-side HTTP implementation.
For more information, follow this [link](https://netty.io/4.1/api/io/netty/handler/codec/http/HttpServerCodec.html).

Different decoder options
  * `maxInitialLineLength`: default value: 4096
  * `maxHeaderSize`: default value: 8192
  * `maxChunkSize`: default value: 8192
  * `validateHeaders`: default value: true
  * `initialBufferSize`: default value: 128

`httpObjectAggregatorDefinition`: A ChannelHandler that aggregates an HttpMessage and its following HttpContents into a single FullHttpRequest or FullHttpResponse (depending on if it used to handle requests or responses) with no following HttpContents.
For more information, follow this [link](https://netty.io/4.1/api/io/netty/handler/codec/http/HttpObjectAggregator.html)

  * `maxContentLength`: the maximum length of the aggregated content in bytes. Default value: 262144
  * `closeOnExpectationFailed`: If a 100-continue response is detected but the content length is too large, then true means close the connection. Otherwise, the connection will remain open and data will be consumed and discarded until the next request is received. Default value: false

**Message routes**:

`routes`: You can redirect some microservice messages to particular processes by declaring new `route` blocks within this one.

`route`: Is the defined route taking both a `messageType` and a specific `process`.

**Allowed resources**:

`allowList`:  You can limit the resources exposed by the Genesis Router. Without at least one `entry` block, every resource will be available. It is important to note that the following message types will always be allowed by default, regardless of the allowList definition:
EVENT_LOGIN_AUTH, EVENT_LOGOUT, MORE_ROWS, MORE_COLUMNS, DATA_LOGOFF, DATA_GET

`entry:` Is the additional accepted `messageType`.

### Custom endpoints

To create a custom endpoint using the Genesis Router, simply implement the `WebEndpoint` interface provided by Genesis Router. Call upon the `registerEndpoint` method of an injected `WebEndpointRegistry` object.

In the following examples, a `FileEndpointCommon` class has also been created to hold utility methods that may be needed across multiple endpoints:

#### FileEndpointCommon

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
public class FileEndpointCommon {
    companion object {
        const val ENDPOINT_NAME = "file-handler"
   }
}
```

</TabItem>
<TabItem value="java">

```java
public class FileEndpointCommon {
    static final String ENDPOINT_NAME = "file-handler";
}
```

</TabItem>
</Tabs>

#### FileProcessor

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
@Module
class FileProcessorKotlin @Inject constructor(
    private val registry: WebEndpointRegistry
) : WebEndpoint {
    @PostConstruct
    fun init() {
        registry.registerEndpoint(FileEndpointCommon.ENDPOINT_NAME, this)
    }

    override fun allowedMethods(): Set<RequestType> {
        return ALLOWED_HTTP_METHODS
    }

    override fun name(): String {
        return "upload"
    }

    override fun process(s: String, fullHttpRequest: FullHttpRequest, channel: Channel): Any {
        LOG.debug("Hit {}/{} endpoint", FileEndpointCommon.ENDPOINT_NAME, name())
        //This is where you would make calls to other services and libraries with the newly uploaded file.
        val responseJson = "{ \"Result\": \"Successful upload\"}".toByteArray(StandardCharsets.UTF_8)
        val responseBuffer = Unpooled.wrappedBuffer(responseJson)
        val response = DefaultFullHttpResponse(
            HttpVersion.HTTP_1_1,
            HttpResponseStatus.OK,
            responseBuffer
        )
        response.headers().add(HttpHeaderNames.CONTENT_TYPE, HttpHeaderValues.APPLICATION_JSON)
        HttpUtil.setContentLength(response, responseJson.size.toLong())
        return response
    }

    override fun requiresAuth(): Boolean {
        return if (System.getProperty("TEST_MODE") != null) {
            false
        } else {
            super.requiresAuth()
        }
    }

    companion object {
        private val LOG = LoggerFactory.getLogger(FileProcessorKotlin::class.java)
        private val ALLOWED_HTTP_METHODS: Set<RequestType> = ImmutableSet.of(RequestType.POST)
    }
}
```

</TabItem>
<TabItem value="java">

```java
@Module
public class FileProcessor implements WebEndpoint {

    private static final Logger LOG = LoggerFactory.getLogger(FileProcessor.class);
    private static final Set<RequestType> ALLOWED_HTTP_METHODS = ImmutableSet.of(RequestType.POST);

    private final WebEndpointRegistry registry;

    @Inject
    public FileProcessor(WebEndpointRegistry registry) {
        this.registry = registry;
    }

    @PostConstruct
    public void init() {
        this.registry.registerEndpoint(FileEndpointCommon.ENDPOINT_NAME, this);
    }

    @NotNull
    @Override
    public Set<RequestType> allowedMethods() {
        return ALLOWED_HTTP_METHODS;
    }

    @NotNull
    @Override
    public String name() {
        return "upload";
    }

    @NotNull
    @Override
    public Object process(@NotNull String s, @NotNull FullHttpRequest fullHttpRequest, @NotNull Channel channel) {
        final byte[] responseJson = "{ \"Result\": \"Successful upload\"}".getBytes(StandardCharsets.UTF_8);
        //This is where you would make calls to other services and libraries with the newly uploaded file.
        final ByteBuf responseBuffer = Unpooled.wrappedBuffer(responseJson);
        final DefaultFullHttpResponse response = new DefaultFullHttpResponse(
                HttpVersion.HTTP_1_1,
                HttpResponseStatus.OK,
                responseBuffer
        );
        response.headers().add(HttpHeaderNames.CONTENT_TYPE, HttpHeaderValues.APPLICATION_JSON);
        HttpUtil.setContentLength(response, responseJson.length);
        return response;
    }

    @Override
    public boolean requiresAuth() {
        if(System.getProperty("TEST_MODE") != null){
            return false;
        } else {
            return WebEndpoint.super.requiresAuth();
        }
    }

}
```

</TabItem>
</Tabs>

### Testing the Genesis Router

To create unit tests for Genesis Router, you can extend the `AbstractGenesisTestSupport` class and specify the `genesis-router.kts` as the Script file name. Examples of how you would initialise a test extending this class are provided below.

There is more information on how testing works in our section on [Integration testing](/operations/testing/integration-testing/).

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
            .newBuilder(URI("http://localhost:9064/file-handler/upload"))
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
            .setPackageNames(List.of("global.genesis.router", "org.file.processor"))
            .setGenesisHome("/genesisHome")
            .setScriptFileName("genesis-router.kts")
            .setParser(e -> e)
            .build());
    }

    @Test
    public void testRouterEndpoint() throws URISyntaxException, IOException, InterruptedException {
        var client = HttpClient.newHttpClient();
        var request = HttpRequest
                .newBuilder(new URI("http://localhost:9064/file-handler/upload"))
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
