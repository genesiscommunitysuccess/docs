# Docs update needed: MetricsJvmEnabled system definition property
Requested ACTION: ADD

**Could not auto-detect the doc target — please move this snippet to the right page.**

## `MetricsJvmEnabled`

The `MetricsJvmEnabled` property is a system definition configuration that enables you to control whether JVM-specific metrics (such as memory, garbage collection, and thread metrics) are collected and reported.

This property is only active when `MetricsEnabled` is set to `true` and at least one report type is configured in `MetricsReportType`.

###### Syntax
| Property | Type | Description | Default |
|---|---|---|---|
| `MetricsJvmEnabled` | `Boolean` | Enables or disables the collection of JVM-specific metrics (such as `jvm.memory.*`, `jvm.gc.*`, and `jvm.threads.*`). | `true` |

###### Examples

To disable JVM metrics while keeping other custom metrics enabled, set `MetricsJvmEnabled` to `false` in your `genesis-system-definition.kts` file:

```kotlin
systemDefinition {
    global {
        item("MetricsEnabled", "true")
        item("MetricsReportType", "SLF4J")
        item("MetricsJvmEnabled", "false")
    }
}
```
