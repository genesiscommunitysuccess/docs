---
title: 'Metrics'
sidebar_label: 'Metrics'
id: metrics
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Genesis Metrics module enables you to capture metrics for specific components of your application. You achieve this by inserting programmatic calls into appropriate places in your code.

By default, when running the Genesis system, the metric calls will have no impact on the performance or behaviour of the system.

To make use of the metric calls, you must set `MetricsEnabled` to `true` in the [system definition file](/server/configuring-runtime/system-definitions/). In addition, you should define the `MetricsReportType` to include a comma-separated list of `MetricsReportType` outputs, which should include at least one of the following:

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

Once the `MetricService` object is in scope, you can invoke methods on it to retrieve the appropriate metric objects.

The `MetricService` distinguishes between two different kind of metrics; process and resource.
Process metrics are values that will exist once and only once per process, current memory utilisation, GC stats etc.

Resource metrics represent data about a named resource that may be one or more resources hosted within a process. 
Dataservers, event handlers, reqreps and consolidators are all examples of named resources.

For a consistent approach and to make things easier for operations and support staff, the Genesis framework enforces a standard convention for the naming of metrics.

For process level metrics:
```
genesis.$groupName.$processName.$hostname.process.$metricClassifier.$metricName
```
For resource level metrics:
```
genesis.$groupName.$processName.$hostname.$resourceClassifier.$resourceName.$metricClassifier.$metricName
```

Where:
`$groupName` is the value in the groupId field of the process definition (or unknown if missing)
`$processName` is the name defined in the processes definition
`$hostname` is the machine hostname
`$resourceClassifier` is the type of resource being monitored in the plural form, e.g. dataservers
`$resourceName` is the name given to the resource in its XML or GPAL definition
`$metricClassifier` is a qualifying name for the metric value, used to organise the resulting dir structure
`$metricName` is the thing actually being measured, such as 'latency', 'rate', 'count'

The path separator is a period '.'

Any of the above parameters can contain any number of periods to further sub-divide the classifiers as required.

Path sanitisation is performed in order to ensure path consistency. Any character in the following set:
```
*@/\’”;:|[]{}()&^%$,
```
will be replaced with an underscore.

To create metrics, use the [meter], [timer], [histogram] and [counter] functions.

You can also register custom gauge implementations using the [registerCustomGauge] function.

The metric functions [meter], [timer], [histogram] and [counter] are also lookup functions into the metric registry.
As such, path sanitisation only occurs if the non-sanitised path does not already have a mapping. This is to avoid string
scans and regex evaluation on every lookup to retrieve a metric object. In order to maximise performance (for example
when counting messages in a high volume stream) do not use any upper-case or forbidden characters in your classifiers
or names, or store the metric object in a local variable and do not perform a lookup each time it needs to be used.

### Counters

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
class UserAuthentication @Inject constructor(
	val metricService: MetricService
) {

        fun login(user: User) {

            val userLoginCounter = metricService.counter("users", user.userName, "active-sessions", "count")
            userLoginCounter.increment()

            // functional code would go here
        }

        fun logout(user: User) {

            val userLoginCounter = metricService.counter("users", user.userName, "active-sessions", "count")
            userLoginCounter.decrement()

            // functional code would go here
        }
    }

```

</TabItem>
<TabItem value="java">

```java
class UserAuthentication {

	private final MetricService metricService;

	@Inject
	public UserAuthentication(MetricService metricService) {
		this.metricService= metricService;
	}

    void login(User user) {

        var userLoginCounter = metricService.counter("users", user.userName, "active-sessions", "count")
        userLoginCounter.increment();

        // functional code would go here
    }

    void logout(User user) {

        var userLoginCounter = metricService.counter("users", user.userName, "active-sessions", "count")
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
class UserAuthentication @Inject constructor(
	val metricService: MetricService
) {

    fun login(user: User) {

        val throughput = metricService.meter("groups", user.groupName, "login", "rate")
        throughput.mark()

        // functional code would go here
    }
}
```

</TabItem>
<TabItem value="java">

```java
class UserAuthentication {

    private final MetricService metricService;

	@Inject
	public UserAuthentication(MetricService metricService) {
		this.metricService= metricService;
	}

    void login(User user) {

        var throughput = = metricService.meter("users", user.userName, "login", "rate")
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
class UserAuthentication @Inject constructor(
	val metricService: MetricService
) {
    fun login(user: User) {

        val userLoginTime = metricService.latency("users", user.userName, "login", "latency").time()

        // functional code would go here

        userLoginTime.stop()
    }
}
```

</TabItem>
<TabItem value="java">

```java
class UserAuthentication {
    private final MetricService metricService;

	@Inject
	public UserAuthentication(MetricService metricService) {
		this.metricService= metricService;
	}

    void login(User user) {

        LatencyContext userLoginTime = metricService.latency("users", user.userName, "login", "latency").time()

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
class Queue @Inject constructor(val name: String, val metricService: MetricService) {

        fun queueRequest(request: MetricUtilsTest.Request) {
            val histogram = metricService.histogram("queues", name, "size", "histogram")
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
	private final MetricService metricService;
	
	@Inject
	public Queue(String name, MetricService metricService)
	
    void queueRequest(Request request) {

        var histogram = metricService.histogram("queues", name, "size", "histogram");

        histogram.update(request.size);

        // functional code would go  here
    }
}
```
</TabItem>
</Tabs>