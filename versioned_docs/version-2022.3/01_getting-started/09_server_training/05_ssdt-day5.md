---
title: Server Specialist Developer Training - Day five
sidebar_label: Day five
sidebar_position: 6
id: 05_ssdt-day5
keywords: [getting started, developer training, server training, day five]
tags:
    - getting started
    - developer training
    - server training
    - day five
---
This day covers:

- [Custom endpoints](#custom-endpoints)
- [Camel module​](#camel-module)
- [Data pipeline](#data-pipeline)

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Custom endpoints

The Genesis low-code platform provides a series of REST endpoints exposing all configured resources (like Event Handlers, Request Server, Data Servers, Authentication) as HTTP endpoints via the [GENESIS_ROUTER](/server/configuring-runtime/genesis-router/) service. 

You can extend the platform by creating custom endpoints, which make it easy to integrate with existing systems. Likely uses for these custom endpoints include: file upload and download, and integration into external authentication systems.

To create a custom endpoint using the Genesis Router, simply implement the `WebEndpoint` interface provided by Genesis Router. Call upon the `registerEndpoint` method of an injected `WebEndpointRegistry` object.

In the following examples, a `FileEndpointCommon` class has also been created to hold utility methods that may be needed across multiple endpoints:

### FileEndpointCommon

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

### FileProcessor

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

### Construction and initialisation
The constructor should contain an instance of the `WebEndpointRegistry` class in order to call upon it during initialisation. This is necessary for the Genesis Router to route appropriate traffic to this endpoint automatically.

In the examples above the initialisation step is annotated with `@PostConstruct`, and calls upon the `WebEndpointRegistry.registerEndpoint()` function with the subdirectory of the endpoint, and the endpoint itself. The registered endpoint would be reachable at a combination of this subdirectory, and the return value of the endpoint's `name()` function. In the example, this would be `file-handler/upload`.

### Endpoint name
The `name()` method must be overridden to give the endpoint a name.

### Allowed methods
The `allowedMethods()` function must be overridden and implemented to declare which of the HTTP request types are permitted for this endpoint. It must return a set of `RequestType` objects corresponding with the HTTP `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` functions.

### Processing requests
The `process()` function must be overridden and implemented in order to add business logic to the endpoint.

### Authentication
The `requiresAuth()` function can be overridden to determine if the endpoint requires a `SESSION_AUTH_TOKEN` with the request, such as those made from authenticated sessions. Without a definition, this returns a default value of `true`. In the example above, this Authorisation is not required when the system is running in `TEST_MODE`, which is useful for testing these endpoints with integration tests.

#### Exercise 5.1 Trade.getBulk to CSV Download Endpoint
<!--
acho q da pra usar esse de base:

https://docs.genesis.global/secure/creating-applications/defining-your-application/integrations/custom-endpoints/ce-advanced-technical-details/#attachmentdownloadendpoint

mas eu mudaria pra ele fazer tipo um getBulk numa tabela, gerar um CSV e fazer o download
-->
:::info ESTIMATED TIME
45 mins
:::

We are going to create a new endpoint where the result of Trade.getBulk should write a CSV file and then download it. 

Use the knowledge you have acquired so far to create a class implementing the interface `WebEndpoint`.

:::tip
There is a similar sample [here](/server/integration/custom-endpoints/advanced/#attachmentdownloadendpoint), which defines Attachments Download Endpoint.
:::


## Camel module

The Genesis platform supports the use of [Apache Camel](https://camel.apache.org/) in order to integrate with external systems, using its plethora of [components](https://camel.apache.org/components/3.16.x/index.html). Genesis makes this easy to configure and set up, allowing new processors to be defined and used within GPAL.

Likely uses for Apache Camel include:
- receiving data from the local filesystem
- receiving data from an external location
- sending data to an external location

:::info
Note that Camel's power and flexibility comes at the cost of some complexity and configuration overhead. If you simply want to ingest and transform data from the most common sources (e.g. CSV files and certain relational databases), you should first investigate the new [Genesis Data Pipeline](/server/integration/data-pipeline/introduction/), which offers a higher-level ingestion workflow than the Apache Camel DSL.
:::

Apache Camel integrations are defined within your application's **-camel.kts** file. This is located in the **src/main/resources/scripts** directory within your application's **-script-config** submodule.

The Genesis low-code platform only includes the `camel-core` dependency. You will want to declare additional dependencies to make best use of the different available Camel components.

### Configuration

- Add the configuration for the Camel module to the {applicationName}-processes.xml file:

```xml
  <process name="ALPHA_CAMEL">
    <groupId>ALPHA</groupId>
    <start>true</start>
    <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
    <module>genesis-pal-camel</module>
    <package>global.genesis.eventhandler.pal</package>
    <script>alpha-eventhandler.kts</script>
    <description>Handles events</description>
    <classpath>alpha-messages*,alpha-camel*,alpha-camel-libs*.jar</classpath>
    <language>pal</language>
  </process>
```

... where the position-camel-libs module may have similar dependencies to the following:

```kotlin
    api("org.apache.camel:camel-mail:3.14.2")
    api("javax.mail:javax.mail-api:1.6.2")
```

- Next, add the service definition to the {applicationName}-service-definitions.xml file:

```xml
<configuration>
    ...
    <service host="localhost" name="ALPHA_CAMEL" port="11006"/>
</configuration>
```

- Create a Kotlin script file named **{applicationName}-camel.kts** file. It defines a single route using a range of Camel configuration options, which we'll explore in a little more detail below:
```kotlin
camel {
    routeHandler {
        val pathStr = "${GenesisPaths.genesisHome()}/runtime/inbound/"
        from("file:${pathStr}/exampledir/?move=.camel/\${date:now:yyyyMMdd-HHmmssSSS}-\${headers.CamelFileName}&initialDelay=5000&readLock=changed&readLockCheckInterval=5000&readLockTimeout=60000")
            .process(fileEventProcessorProvider.createProcessor("EXAMPLE_EVENT_HANDLER", "EVENT_FILE_IMPORT_EXAMPLE", "FILE", "SOURCE_NAME"))
    }
}
```

The `routeHandler` defines the possible routes for information to flow into and out of our system.  The example above defines one route. First, it defines the `pathStr` using the `GenesisPaths` class to find the `GENESIS_HOME` system environment variable. Next, it defines the route itself. The route in the example comes from the filesystem determined by the `file:` specifier at the start of the string. This could be any [Apache Camel component](https://camel.apache.org/components/3.16.x/index.html) that can act as a [consumer](https://camel.apache.org/manual/camelcontext.html#_consumer). Further `routeHandler` parameters and explanation can be found [here](/server/integration/apache-camel/basics/#routehandler).


#### Exercise 5.2 Reading and writing using an SFTP server
<!--
this is pretty much here: http://localhost:8080/server/integration/apache-camel/examples/#reading-from-an-sftp-server
-->
:::info ESTIMATED TIME
45 mins
:::

It is your time! Use the Camel module build a Reading and Writing structure using an [SFTP](https://camel.apache.org/components/3.16.x/sftp-component.html) server. 

You can use any SFTP public server available to do that. [Here](https://www.sftp.net/public-online-sftp-servers) are some options.

:::tip
Use properties set in the _application_**-camel.kts**, allowing you to have site-specific variables for each instance. This is particularly useful when integrating with external services where connection details are likely to vary between environments.

You can see some samples [here](https://camel.apache.org/components/3.18.x/ftp-component.html#_samples). 
:::


## Data Pipeline

:::info
Feature included in the Genesis low-code platform version 6.1.1
:::

You can define data pipelines that map data from an external source (database, file) to [Tables](/database/fields-tables-views/tables/) in your application. By default, the resulting table objects are stored in the database. However, you can define [custom operations](/server/integration/data-pipeline/advanced/#custom-handler-for-the-mapped-entity) as well.

Each data pipeline defines a source for the data and how that data is mapped to each [Field](/database/fields-tables-views/fields/) in the Table. If a field mapping is not one-to-one - e.g. complex type conversions, data obfuscation, enriched values - you can define a `transform` function that has a return value that is mapped to the required field.

Once your Genesis application is running, data ingestion will take place.

Currently, the supported sources are: *PostgreSQL*, *MS SQL Server*, *Oracle Enterprise*, and *Files* that originate from the local filesystem or S3 (CSV, XML, JSON). The parameters and sample usage for each supported data source can be found [here](/server/integration/data-pipeline/basics/#data-source).

### Configuration

- Add the configuration for the Camel module to the {applicationName}-processes.xml file:

```xml
<processes>
    <process name="DATAPIPELINE_SANDBOX">
        <groupId>data-pipeline</groupId>
        <start>true</start>
        <options>-Xmx1024m</options>
        <module>genesis-pal-datapipeline</module>
        <script>alpha-datapipeline.kts</script>
        <description>Trades execution</description>
        <language>pal</language>
        <loggingLevel>TRACE,DATADUMP_ON</loggingLevel>
    </process>
</processes>
```

... where the position-camel-libs module has similar dependencies to the following:

```kotlin
    api("org.apache.camel:camel-mail:3.14.2")
    api("javax.mail:javax.mail-api:1.6.2")
```

- Next, add the service definition to the {applicationName}**-service-definitions.xml** file:

```xml
<configuration>
    ...
    <service host="localhost" name="DATAPIPELINE_SANDBOX" port="11007"/>
</configuration>
```

- Create a Kotlin script file named **{applicationName}-datapipeline.kts** file. Here is a sample configuration using *PostgreSQL*:
```kotlin
pipelines {

    postgresSource("cdc-test") {
        hostname = "localhost"
        port = 5432
        username = "postgres"
        password = "docker"
        databaseName = "postgres"

            "public.source_trades" to map("incoming_trades", TRADE) {
                val tradeId = stringValue("trd_id")
                val tradedAt = longValue("traded_at")

                TRADE {

                    TRADE_TYPE {
                        property = "side"
                    }

                    TRADE_DATE {
                        transform {
                            DateTime(input.get(tradedAt))
                        }
                    }

                    RECORD_ID {
                        transform {
                            input.get(tradeId).removePrefix("ITS_").toLong()
                        }
                    }
                }
            }
        }
    }
}
```

#### Exercise 5.3 Reading and writing using an SFTP server
<!--
this is pretty much here: https://docs.genesis.global/secure/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-examples/
-->
:::info ESTIMATED TIME
30 mins
:::

We are now creating  a Data Pipeline to ingest trades using CSV. To do that, consider the same layout we showed in the *PostgreSQL* configuration.

:::tip
Check the CSV options [here](/server/integration/data-pipeline/basics/#csv).
:::


