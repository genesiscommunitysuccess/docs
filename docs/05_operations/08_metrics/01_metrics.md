---
title: 'Metrics'
sidebar_label: 'Metrics'
id: metrics
keywords: [operations, metrics]
tags:
    - operations
    - metrics
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Genesis Metrics module enables you to capture metrics for specific components of your application. You achieve this by inserting programmatic calls into appropriate places in your code.

Any metrics system will have an effect on the performance of the application it is monitoring. The extra code (log statements, metrics, etc) will have an impact in some way. 

Genesis uses the well-known [metrics](https://micrometer.io/) library, which is commonly used in Java apps. In all known Genesis applications, the impact is negligible; the benefits far outweigh the very tiny impact on performance. 

To make use of the metric calls, you must set `MetricsEnabled` to `true` in the [system definition file](../../../server/configuring-runtime/system-definitions/). In addition, you should define the `MetricsReportType` to include a comma-separated list of `MetricsReportType` outputs, which should include at least one of the following:

* DATADOG - will send metrics to [Datadog](https://www.datadoghq.com/)
* SLF4J - will append metrics to an [SLF4J](http://www.slf4j.org/) Logger
* GRAPHITE - will send metrics to a [Graphite](https://graphiteapp.org/) service, which needs to be up and running
    * This requires some additional settings for `MetricsGraphiteURL` and `MetricsGraphitePort` which identify the Graphite server.

## Set-up (example using SLF4J and GRAPHITE)

In this example, we use a SLF4J log, a Graphite server to capture metrics and a Datadog reporter. Detailed set-up of a Graphite server is beyond the scope of this document, but it can be run in a docker container as described [here](https://registry.hub.docker.com/r/hopsoft/graphite-statsd#!)

```kotlin
item(name = "MetricsEnabled", value = "true")
item(name = "MetricsReportType", value = "GRAPHITE,SLF4J,DATADOG")
item(name = "MetricsStructureType", value = "hierarchical") // The choices are 'hierarchical' or 'dimensional' for Graphite, it's dimensional only for Datadog

item(name = "MetricsGraphiteURL", value = "localhost")
item(name = "MetricsGraphitePort", value = "2003")
item(name = "MetricsDatadogApiKey", value = "YOUR_API_KEY")
item(name = "MetricsDatadogApplicationKey", value = "YOUR_APP_KEY") 
item(name = "MetricsDatadogUri", value = "https://api.datadoghq.com") // Just an example

item(name = "MetricsReportIntervalSecs", value = "60") // Optional, defaults to 10 seconds if not specified
item(name = "Slf4jReporterLoggingLevel", value = "DEBUG") // Optional, defaults to DEBUG, options include {DEBUG, INFO, TRACE, WARN, ERROR}
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

For a consistent approach and to make things easier for operations and support staff, the Genesis framework enforces a standard convention for the naming of hierarchical metrics.

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

If you are using Datadog or the system definition property `item(name = "MetricsStructureType", value = "dimensional")` 
with Graphite, then the metrics will be sent in a dimensional format: `$metricName{tag1=value1,tag2=value2,...}`.

Path sanitisation is performed in order to ensure path consistency. Any character in the following set:
```
*@/\’”;:|[]{}()&^%$,
```
will be replaced with an underscore.

To create metrics, use the [counter], [timer], [summary], [gauge] and [gaugeCounter] functions.

The metric functions [counter], [timer], [summary], [gauge] and [gaugeCounter] are also lookup functions into the metric registry.
As such, path sanitisation only occurs if the non-sanitised path does not already have a mapping. This is to avoid string
scans and regex evaluation on every lookup to retrieve a metric object. In order to maximise performance (for example
when counting messages in a high volume stream) do not use any upper-case or forbidden characters in your classifiers
or names, or store the metric object in a local variable and do not perform a lookup each time it needs to be used.

### Counters

Counters are simple metrics that only go up (monotonically increasing). They are typically used to count requests, tasks, errors, etc.

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
class UserAuthentication @Inject constructor(
	val metricService: MetricService
) {

        fun login(user: User) {

            val userLoginCounter = metricService.counter("user_login.count", "username" to user.userName)
            userLoginCounter.increment()

            // functional code would go here
        }

        fun logout(user: User) {

            val userLogoutCounter = metricService.counter("user_logout.count", "username" to user.userName)
            userLogoutCounter.increment()

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

        Counter userLoginCounter = metricService.counter("user_login.count", "username", user.getUserName());
        userLoginCounter.increment();

        // functional code would go here
    }

    void logout(User user) {

        Counter userLogoutCounter = metricService.counter("user_logout.count", "username", user.getUserName());
        userLogoutCounter.increment();

        // functional code would go here
    }
}
```
</TabItem>
</Tabs>

### Gauges and Gauge Counters

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
class UserAuthentication @Inject constructor(
  val metricService: MetricService
) {

  private val users = mutableSetOf<User>()
  val userLoginGaugeCounter = metricService.gaugeCounter("user_count", mapOf())

  metricService.gauge("user.count",mapOf(),users)
  {
      it.size.toDouble() // this is the value that will be reported
  }

  fun login(user: User) {
    // functional code would go here
    userLoginGaugeCounter.increment()
  }

  fun logout(user: User) {
    // functional code would go here
    userLoginGaugeCounter.decrement()

  }
}

```

</TabItem>
<TabItem value="java">

```java
public class UserAuthentication {

  private final MetricService metricService;
  private final HashSet<User> users = new HashSet<>();
  private final GaugeCounter userLoginGaugeCounter;

  @Inject
  public UserAuthentication(MetricService metricService) {
    this.metricService = metricService;
    this.userLoginGaugeCounter = metricService.gaugeCounter("user_count");

    metricService.gauge("user.count", new HashMap<>(), users, HashSet::size);
  }

  public void login(User user) {
    // functional code would go here
    userLoginGaugeCounter.increment();
  }

  public void logout(User user) {
    // functional code would go here
    userLoginGaugeCounter.decrement();
  }
}
```
</TabItem>
</Tabs>

### Timers

Timers measure how long a piece of code takes to execute. There are several ways we can record the time taken.

Note: Timers and Distribution Summaries support data collection for observing percentile distributions and
always publish a count of events in addition to other measurements


<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
class UserAuthentication @Inject constructor(
	val metricService: MetricService
) {
    fun login(user: User) {

        val userLoginTime = metricService.timer(
            "user.processing_latency",
            "username" to user.userName
        )
        timer {
            // functional code would go here
        }
    }
}

----------------------------------------------
        
class UserAuthentication @Inject constructor(
  val metricService: MetricService
) {
  fun login(user: User) {
    
    val userLoginTime = metricService.timer(
      "user.processing_latency",
      "username" to user.userName
    )
    val typeTimer = Timer.start()
    
    // functional code would go here
    
    typeTimer.stop(userLoginTime)
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
        
        LatencyContext userLoginTime = metricService.timer(
                "user.processing_latency",
                "username", user.getUserName());
        Timer.Sample timer = Timer.start();
        
        // functional code would go here
      
        timer.stop(userLoginTime);
    }
}
```
</TabItem>
</Tabs>

### Summaries

Histograms are built into Distribution Summaries, which track the distribution of events similar to timers but don't represent units of time.
For instance, Distribution Summaries can measure payload sizes of incoming requests.

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
class Queue @Inject constructor(val name: String, val metricService: MetricService) {

        fun queueRequest(request: MetricUtilsTest.Request) {
            val summary = metricService.summary("queues.summary", "name" to name)
            summary.record(request.size.toLong())

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

        var summary = metricService.summary("queues", "name", name);

        summary.record(request.getSize());

        // functional code would go  here
    }
}
```
</TabItem>
</Tabs>
