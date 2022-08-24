---
title: 'Metrics'
sidebar_label: 'Metrics'
id: metrics
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Genesis Metrics module enables you to capture metrics for specific components of your application. You achieve this by inserting programmatic calls into appropriate places in your code.

By default, when running the Genesis system, the metric calls will have no impact on the performance or behaviour of the system.

To make use of the metric calls, you must set `MetricsEnabled` to `true` in the [system definition file](/server-modules/configuring-runtime/system-definitions/). In addition, you should define the `MetricsReportType` to include a comma-separated list of `MetricsReportType` outputs, which should include at least one of the following:

* Console - sends metrics straight to the console
* SLF4J - will append metrics to an [SLF4J](http://www.slf4j.org/) Logger
* GRAPHITE - will send metrics to a [Graphite](https://graphiteapp.org/) service, which needs to be up and running
    * This requires some additional settings for `MetricsGraphiteURL` and `MetricsGraphitePort` which identify the Graphite server.

## Set-up (example using SLF4J and GRAPHITE)

In this example, we use a SLF4J log and Graphite server to capture metrics. Detailed set-up of a Graphite server is beyond the scope of this document, but it can be run in a [docker container](http://docker.com) as described [here](https://registry.hub.docker.com/r/hopsoft/graphite-statsd#!)

```kotlin
item(name = "MetricsEnabled", value = "true")
item(name = "MetricsReportType", value = "GRAPHITE,SLF4J")

item(name = "MetricsGraphiteURL", value = "localhost")
item(name = "MetricsGraphitePort", value = "2003")
item(name = "MetricsReportIntervalSecs", value = "60") // Optional, defaults to 10 seconds if not specified
```

## Metrics API

The API provides interfaces for capturing:

* Counters
* Meters
* Latency
* Histograms

To use the API, include the following in your project dependencies:

<Tabs defaultValue="maven" values={[{ label: 'Gradle', value: 'gradle', }, { label: 'Maven', value: 'maven', }]}>
<TabItem value="gradle">

```kotlin
implementation("global.genesis:genesis-metrics")

```

</TabItem>
<TabItem value="maven">

```xml
<dependency>
	<groupId>global.genesis</groupId>
	<artifactId>genesis-metrics</artifactId>
</dependency>
```
</TabItem>
</Tabs>

The object `MetricService` is available via the dependency injection mechanism. Simply mark a constructor with the `@Inject` annotation and the parameters will be resolved automatically.

Once the `MetricService` object is in scope, you can invoke methods on it to retrieve the appropriate metric objects. Below are some examples.

Metric names are defined at two levels. When a metric is updated, another metric with the qualifier name is also updated.
For instance, if we have two metrics of type `counter`:
* `metric1 (name = "name1", qualifier="events")`
* `metric2 (name = "name2", qualifier="events")`

If we update `metric1` twice and `metric2` once, the result will be:
* `process_name.counter.events.count = 3`
* `process_name.counter.events.name1 = 2`
* `process_name.counter.events.name2 = 1`


### Counters

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
 class UserAuthentication {

        private val metricUtils = MetricUtils.getInstance()

        fun login(user: User) {

            val userLoginCounter = metricUtils.counter("UserLogin", user.groupName)
            userLoginCounter.increment()

            // functional code would go here
        }

        fun logout(user: User) {

            val userLoginCounter = metricUtils.counter("UserLogin", user.groupName)
            userLoginCounter.decrement()

            // functional code would go here
        }
    }

```

</TabItem>
<TabItem value="java">

```java
class UserAuthentication {

    private final MetricUtils metricUtils = MetricUtils.getInstance();

    void login(User user) {

        var userLoginCounter = metricUtils.counter("UserLogin", user.getUserName());
        userLoginCounter.increment();

        // functional code would go here
    }

    void logout(User user) {

        var userLoginCounter = metricUtils.counter("UserLogin", user.getUserName());
        userLoginCounter.decrement();

        // functional code would go here
    }
}
```
</TabItem>
</Tabs>

### Meters

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
class UserAuthentication {

    private val metricUtils = MetricUtils.getInstance()

    fun login(user: User) {

        val throughput = metricUtils.throughput("UserLoginRate", user.groupName)
        throughput.mark()

        // functional code would go here
    }
}
```

</TabItem>
<TabItem value="java">

```java
class UserAuthentication {

    private final MetricUtils metricUtils = MetricUtils.getInstance();

    void login(User user) {

        var throughput = metricUtils.throughput("UserLoginRate", user.groupName);
        throughput.mark();

        // functional code would go here
    }
}
```
</TabItem>
</Tabs>

### Latency

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
class UserAuthentication {
    private val metricUtils = MetricUtils.getInstance()

    fun login(user: User) {

        val userLoginTime = metricUtils.latency("UserLoginTime", user.groupName).time()

        // functional code would go here

        userLoginTime.stop()
    }
}
```

</TabItem>
<TabItem value="java">

```java
class UserAuthentication {
    private final MetricUtils metricUtils = MetricUtils.getInstance();

    void login(User user) {

        LatencyContext userLoginTime = metricUtils.latency("UserLoginTime", user.getGroupName()).time();

        // functional code would go here

        userLoginTime.stop();

    }
}
```
</TabItem>
</Tabs>

### Histograms

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
class Queue(val name: String) {

        private val metricUtils = MetricUtils.getInstance()

        fun queueRequest(request: MetricUtilsTest.Request) {
            val histogram = metricUtils.histogram("queueSize", name)
            histogram.update(request.size.toLong())

            // functional code would go  here
        }
    }
```

</TabItem>
<TabItem value="java">

```java
class Queue {
    private String name;

    private final MetricUtils metricUtils = MetricUtils.getInstance();

    void queueRequest(Request request) {

        var histogram= metricUtils.histogram("queueSize", name);

        histogram.update(request.size);

        // functional code would go  here
    }
}
```
</TabItem>
</Tabs>

## Metrics for Genesis components

| Component         | Type               | Name                                        | Qualifier                      |
|-------------------|--------------------|---------------------------------------------|--------------------------------|
| consolidator2     | histogram          | "record_flusher"                            | "consolidator2"                |
| consolidator2     | latency            | "calculation"                               | "consolidator2"                |
| consolidator2     | latency            | "$consolidationName.consolidationUpdates"   | "consolidator_resolved_records"|
| pal-requestserver | latency            | $MESSAGE_TYPE                               | "REQREP"                       |
| pal-dataserver    | throughput         | $USER_NAME                                  | "user_throughput"              |
| pal-dataserver    | latency            | $MESSAGE_TYPE                               | "TXN"                          |
| event-handler     | latency            | $MESSAGE_TYPE                               | "EVENT"                        |


## JVM metrics
| Name                                 | Description                     |
|--------------------------------------|---------------------------------|
| "processesStats.jvm.memory"          | JVM Memory metrics              |
| "processesStats.jvm.gc"              | JVM Garbage Collection metrics  |
| "processesStats.jvm.thread-states"   | JVM Thread States metrics       |
