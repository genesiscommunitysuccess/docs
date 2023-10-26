---
title: 'Custom Endpoints - basics'
sidebar_label: 'Basics'
id: basics
keywords: [server, integration, custom endpoints, basics]
tags:
  - server
  - integration
  - custom endpoints
  - basics
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


To create custom endpoints, you need to create a custom module. 

Before you define the additional endpoints, you need to add a dependency on `genesis-router` within your module. Then you can define classes that implement the `WebEndpoint` interface provided by Genesis Router.

In their initialisation, the classes need to call on the `registerEndpoint` method of an injected `WebEndpointRegistry` object.

:::warning
Whenever you have a module that uses Genesis Router, it is **essential** that you [edit the Genesis Router definition](../../../../server/integration/custom-endpoints/configuring-runtime/) in your application's [processes.xml](../../../../server/configuring-runtime/processes/) file to include these modules.
:::

## FileProcessor class
<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
@Module
class FileProcessor @Inject constructor(
    private val registry: WebEndpointRegistry
) : WebEndpoint {
    @PostConstruct
    fun init() {
        registry.registerEndpoint("file-handler", this)
    }
}
```

</TabItem>
<TabItem value="java">

```java
@Module
public class FileProcessor implements WebEndpoint {

    private final WebEndpointRegistry registry;

    @Inject
    public FileProcessor(WebEndpointRegistry registry) {
        this.registry = registry;
    }

    @PostConstruct
    public void init() {
        this.registry.registerEndpoint("file-handler", this);
    }
}
```

</TabItem>
</Tabs>

## A simple example of a custom endpoint

Here is a simple example of a custom endpoint class. It defines an endpoint `file-handler/upload` that takes file uploads and responds to their success with an HTTP 200 OK message.

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
@Module
class FileProcessor @Inject constructor(
    private val registry: WebEndpointRegistry
) : WebEndpoint {
    @PostConstruct
    fun init() {
        registry.registerEndpoint("file-handler", this)
    }

    override fun name(): String {
        return "upload"
    }

    override fun allowedMethods(): Set<RequestType> {
        return ALLOWED_HTTP_METHODS
    }

    override fun process(s: String, fullHttpRequest: FullHttpRequest, channel: Channel): Any {
        LOG.debug("Hit {}/{} endpoint", "file-handler", name())
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
        this.registry.registerEndpoint("file-handler", this);
    }

    @NotNull
    @Override
    public String name() {
        return "upload";
    }

    @NotNull
    @Override
    public Set<RequestType> allowedMethods() {
        return ALLOWED_HTTP_METHODS;
    }

    @NotNull
    @Override
    public Object process(@NotNull String s, @NotNull FullHttpRequest fullHttpRequest, @NotNull Channel channel) {
        LOG.debug("Hit {}/{} endpoint", "file-handler", name());
        final byte[] responseJson = "{ \"Result\": \"Successful upload\"}".getBytes(StandardCharsets.UTF_8);
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

## Construction and initialisation
The constructor should contain an instance of the `WebEndpointRegistry` class in order to call upon it during initialisation. This is necessary so that Genesis Router can automatically route appropriate traffic to this endpoint.

In the examples above, the initialisation step is annotated with `@PostConstruct`. This step calls on the `WebEndpointRegistry.registerEndpoint()` function with the subdirectory of the endpoint, and the endpoint itself. The registered endpoint is then reachable at a combination of this subdirectory, and the return value of the endpoint's `name()` function. In the example above, this would be `file-handler/upload`.

## Endpoint name
The `name()` method must be overridden to provide the endpoint a name.

## Allowed methods
The `allowedMethods()` function must be overridden and implemented to declare which of the HTTP request types are permitted for this endpoint. It must return a set of `RequestType` objects corresponding with the HTTP `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` functions.

## Processing requests
The `process()` function must be overridden and implemented in order to add business logic to the endpoint.

## Authentication
The `requiresAuth()` function can be overridden to determine if the endpoint requires a `SESSION_AUTH_TOKEN` with the request, such as those made from authenticated sessions. Without a definition, this returns a default value of `true`. In the example above, this Authorisation is not required when the system is running in `TEST_MODE`, which is useful for testing these endpoints with integration tests.
