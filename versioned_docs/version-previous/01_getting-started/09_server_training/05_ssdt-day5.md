---
title: Server Developer Training - Day five
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

The Genesis low-code platform provides a series of REST endpoints exposing all configured resources (like Event Handlers, Request Server, Data Servers, Authentication) as HTTP endpoints via the [GENESIS_ROUTER](../../../server/configuring-runtime/genesis-router/) service. 

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

### Configure processes.xml

You need to alter the GENESIS_ROUTER process configuration, which is defined in the **genesis-processes.xml** file located in the **~/run/genesis/cfg** folder.
- Add the name of the package, where the custom endpoint is defined in the [package](../../../server/configuring-runtime/processes/#package) tag. In the example below, this is `global.genesis.alpha.fileHandler`.
- Add the Jar file of the submodule containing the custom endpoint to the [classpath](../../../server/configuring-runtime/processes/#classpath) tag. In the example below, this is `alpha-file-handler*.jar`.


```xml {6,10}
<process name="GENESIS_ROUTER">
        <start>true</start>
        <groupId>GENESIS</groupId>
        <options>-Xmx512m -DXSD_VALIDATE=false</options>
        <module>router</module>
        <package>global.genesis.router,global.genesis.console,global.genesis.alpha.fileHandler</package>
        <config>router-process-config.kts</config>
        <script>genesis-router.kts</script>
        <language>pal</language>
        <classpath>genesis-console-*.jar,alpha-file-handler*.jar</classpath>
        <description>Socket, Websocket and HTTP proxy which routes incoming messages to GENESIS microservices</description>
</process>
```

There is more information on how we define processes, in our page on [process.xml](../../../server/configuring-runtime/processes).


### Exercise 5.1 Creating CSV Upload Endpoints

:::info ESTIMATED TIME
45 mins
:::

We are going to create CSV Upload Endpoints. Let's create the possibility to upload *Counterparty* and *Instrument* records through CSVs. The fields are pretty much what we defined [before](../../../getting-started/developer-training/training-content-day2/#exercise-22-extending-the-application). 

To do that, create a new server module `alpha-file-handler`, and add it to be build and deployed (*server/jvm/settings.gradle.kts*, *alpha-deploy/build.gradle.kts*, *alpha-distribution/build.gradle.kts*, **). In this new module, create the classes and add your logic to complete the task.

Create a new item to limit the size of the CSVs to 4 megabytes. You can add a new item in **genesis-system-definition.kts** as below.

```kotlin {6}
package genesis.cfg

systemDefinition {
    global {
        ...
        item(name = "SYS_DEF_FILE_MAX_SIZE_IN_BITS", value = "32000000")
    }
    ...
}
```

Use the knowledge you have acquired so far to create a class implementing the interface `WebEndpoint`.

:::tip
Don't forget the required configuration explained [here](#configure-processesxml).

Also, there is a similar sample [here](../../../server/integration/custom-endpoints/advanced/#attachmentuploadendpoint), which defines Attachments Upload Endpoint.

Lastly, you can use [this](https://www.postman.com/postman/workspace/postman-answers/documentation/13455110-00378d5c-5b08-4813-98da-bc47a2e6021d) reference to test it using Postman.
:::



## Camel module

The Genesis platform supports the use of [Apache Camel](https://camel.apache.org/) in order to integrate with external systems, using its plethora of [components](https://camel.apache.org/docs). Genesis makes this easy to configure and set up, allowing new processors to be defined and used within GPAL.

Likely uses for Apache Camel include:
- receiving data from the local filesystem
- receiving data from an external location
- sending data to an external location

:::info
Note that Camel's power and flexibility comes at the cost of some complexity and configuration overhead. If you simply want to ingest and transform data from the most common sources (e.g. CSV files and certain relational databases), you should first investigate the new [Genesis Data Pipeline](../../../server/integration/data-pipeline/introduction/), which offers a higher-level ingestion workflow than the Apache Camel DSL.
:::

Apache Camel integrations are defined within your application's **-camel.kts** file. This is located in the **src/main/resources/scripts** directory within your application's **-script-config** submodule.

The Genesis low-code platform only includes the `camel-core` dependency. You will want to declare additional dependencies to make best use of the different available Camel components.

### Configuration

- Add the `genesis-pal-camel` and `camel-core` dependencies in your *{applicationName}*-script-config\build.gradle.kts" file. In this training our file is **alpha-script-config\build.gradle.kts**:

```kotlin {3,4}
dependencies {
    ...
    api("global.genesis:genesis-pal-camel")
    api("org.apache.camel:camel-core")
    ...
}

description = "alpha-script-config"
```

- Create a Kotlin script file named *{applicationName}-camel.kts* file in your *{applicationName}*-script-config/src/main/resources/scripts folder. In this example our file **alpha-camel.kts** defines a single route using a range of Camel configuration options, which we'll explore in a little more detail below:
```kotlin
camel {
    routeHandler {
        val pathStr = "${GenesisPaths.genesisHome()}/runtime/inbound/"
        from("file:${pathStr}/exampledir/?move=.camel/\${date:now:yyyyMMdd-HHmmssSSS}-\${headers.CamelFileName}&initialDelay=5000&readLock=changed&readLockCheckInterval=5000&readLockTimeout=60000")
            .process(fileEventProcessorProvider.createProcessor("EXAMPLE_EVENT_HANDLER", "EVENT_FILE_IMPORT_EXAMPLE", "FILE", "SOURCE_NAME"))
    }
}
```

The `routeHandler` defines the possible routes for information to flow into and out of our system.  The example above defines one route. First, it defines the `pathStr` using the `GenesisPaths` class to find the `GENESIS_HOME` system environment variable. Next, it defines the route itself. The route in the example comes from the filesystem determined by the `file:` specifier at the start of the string. This could be any [Apache Camel component](https://camel.apache.org/components/3.16.x/index.html) that can act as a [consumer](https://camel.apache.org/manual/camelcontext.html#_consumer). Further `routeHandler` parameters and explanation can be found [here](../../../server/integration/apache-camel/basics/#routehandler).


- Add the configuration for the Camel module to the *{applicationName}-processes.xml* file. In this training our file is **alpha-processes.xml**:

```xml {3-13}
<processes>
    ...
    <process name="ALPHA_CAMEL">
        <groupId>ALPHA</groupId>
        <start>true</start>
        <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
        <module>genesis-pal-camel</module>
        <package>global.genesis.camel.pal</package>
        <script>alpha-camel.kts</script>
        <description>Alpha Camel integrations</description>
        <classpath>alpha-messages*,alpha-camel*,alpha-camel-libs*.jar</classpath>
        <language>pal</language>
    </process>
</processes>
```

- Add the service definition to the *{applicationName}-service-definitions.xml* file. In this training our file is **alpha-service-definitions.xml**:

```xml {3}
<configuration>
    ...
    <service host="localhost" name="ALPHA_CAMEL" port="11008"/>
</configuration>
```


### Exercise 5.2 Reading from an SFTP server
:::info ESTIMATED TIME
45 mins
:::

It is your time! Use the Camel module to build a Reading structure using an [SFTP](https://camel.apache.org/components/3.20.x/sftp-component.html) server. Read from an SFTP server using this path */folder-inside-sftp/from.txt* adding a Camel `routeHandler` to copy the file to */home/alpha/run/runtime/inbound/alpha*.

To do that, do the steps described above in the [configuration](#configuration), and see a similar example [here](../../../server/integration/apache-camel/examples/#reading-from-an-sftp-server).

:::note
To help you in this task, as The Genesis low-code platform only includes the camel-core dependency, the project you [cloned](https://github.com/genesiscommunitysuccess/servertraining-seed) created a new local module called `alpha-camel-libs` declaring the Camel dependencies needed as described [here](../../../server/integration/apache-camel/configuring-runtime/#dependencies).

Also, the project you [cloned](https://github.com/genesiscommunitysuccess/servertraining-seed) has a docker container with an [SFTP](https://hub.docker.com/r/atmoz/sftp) server to do this task, including the `hostname` **sftp**, `user ` **JohnDoe**, and `password` **Password11**.

In order to save your local resources and allow a good experience, we do recommend that you change your **alpha-processes.xml** and **alpha-system-definition.xml** leaving only ALPHA_CAMEL process as runnable. You can do that by commenting the other ones or setting them to start=false.
:::


## Data Pipeline

Genesis [Data Pipelines](../../../server/integration/data-pipeline/introduction/) is a feature that allows you to stream data in and/or out of your Genesis application.

You can define data pipelines that map data from an external source (database, file) to [Tables](../../../database/fields-tables-views/tables/) in your application. By default, the resulting table objects are stored in the database. However, you can define [custom operations](../../../server/integration/data-pipeline/advanced/#custom-handler-for-the-mapped-entity) as well.

Each data pipeline defines a source for the data and how that data is mapped to each [Field](../../../database/fields-tables-views/fields/) in the Table. If a field mapping is not one-to-one - e.g. complex type conversions, data obfuscation, enriched values - you can define a `transform` function that has a return value that is mapped to the required field.

Once your Genesis application is running, data ingestion will take place.

Currently, the supported sources are: *PostgreSQL*, *MS SQL Server*, *Oracle Enterprise*, and *Files* that originate from the local filesystem or S3 (CSV, XML, JSON).

### Configuration

- Add the dependency `genesis-pal-datapipeline` to your position-alpha-script-config module (**server/jvm/alpha-script-config/build.gradle.kts**). This ensures that you are able to use the data pipeline functionality within your scripts. 

```kotlin {3}
dependencies {
    ...
    api("global.genesis:genesis-pal-datapipeline")
    ...
}

description = "alpha-script-config"
```

- Configure data pipelines in a file (i.e. alpha-data-pipeline.kts). This file must be located in your application's configuration directory (**server/jvm/alpha-script-config/src/main/resources/scripts/alpha-data-pipeline.kts**). A pipeline configuration contains a collection of [sources](../../../server/integration/data-pipeline/basics/#how-to-define-a-source), [map functions](../../../server/integration/data-pipeline/basics/#map-functions), and [sink functions](../../../server/integration/data-pipeline/basics/#sink-functions), like the sample below.

```kotlin
val postgresConfig = postgresConfiguration(
    databaseName = "",
    hostname = "",
    port = 5432,
    username = "",
    password = ""
)

val postgresSink = sink(postgresConfig) {
    onInsert = insertInto("tableName")
    onModify = updateTable("tableName")
    onDelete = deleteFrom("tableName")
}

pipelines {
    xmlSource("xml-cdc-test") {
        location = ""

        map("mapper-name", TABLE) {

        }
    }

    json("json-cdc-test") {
        location = ""

        map("mapper-name", TABLE) {

        }
    }    

    genesisTableSource(TABLE_OBJECT) {
        key = TABLE_OBJECT.KEY_FIELD

        map(someMapper).sink(postgresSink)
    }
}
```

- Ensure that you add the following config to your alpha-processes.xml file:

```xml {3-13}
<processes>
    ...
    <process name="ALPHA_DATAPIPELINE">
        <groupId>ALPHA</groupId>
        <start>true</start>
        <options>-Xmx256m -DRedirectStreamsToLog=true -DXSD_VALIDATE=false</options>
        <module>genesis-pal-datapipeline</module>
        <package>global.genesis.datapipeline.pal</package>
        <script>alpha-data-pipeline.kts</script>
        <description>External data ingress pipeline</description>
        <language>pal</language>
        <loggingLevel>TRACE,DATADUMP_ON</loggingLevel>
    </process>
</processes>
```

As well as to your alpha-service-definitions.xml file:

```xml {3}
<configuration>
    ...
    <service host="localhost" name="ALPHA_DATAPIPELINE" port="11004"/>
</configuration>
```

- Lastly, run [build and deploy](../../../getting-started/developer-training/training-content-day1/#5-the-build-and-deploy-process).

### Exercise 5.3 Ingesting external data
:::info ESTIMATED TIME
30 mins
:::

We are now creating a Data Pipeline to ingest Counterparty files using [csvSource](../../../server/integration/data-pipeline/basics/#file). 

To do that, configure the location as a local filesystem source with an absolute path to the user account's `alpha` **run/runtime/fileIngress** directory. This directory should be created automatically the first time your application is started.

The remaining configuration defines a mapper from our CSV to the data model of the `COUNTERPARTY` table.

Follow the data pipeline definition as explained above. And as soon as you made the changes run [build and deploy](../../../getting-started/developer-training/training-content-day1/#5-the-build-and-deploy-process) again.

:::tip
Check the CSV options [here](../../../server/integration/data-pipeline/basics/#csv) and some [examples](../../../server/integration/data-pipeline/examples/) to do the exercise.

The input CSV file should look like this
```csv
COUNTERPARTY_LEI,COUNTERPARTY_NAME
435800A8HK6JBITVPA30,Test Co Ltd
755FG0324Q4LUVJJMS11,Testing BG
855FG0324Q4LUVJJMS11,Testing CG
```
:::
