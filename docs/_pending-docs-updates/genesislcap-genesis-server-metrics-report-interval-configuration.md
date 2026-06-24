# Docs update needed: Metrics report interval configuration
Requested ACTION: ADD

**Could not auto-detect the doc target — please move this snippet to the right page.**

## Metrics report interval

You can configure the interval at which the Genesis Platform reports metrics to your configured reporters, such as SLF4J or Graphite. 

The `MetricsReportIntervalSecs` property defines this interval in seconds. This property is shared across reporters:
- For the SLF4J reporter, it determines how often metrics are logged.
- For the Graphite reporter, it drives the Graphite step interval.

The default value is `10` seconds.

###### Examples

The following example shows how to configure `MetricsReportIntervalSecs` in your `genesis-system-definition.xml` file:

```xml
<systemDefinition>
    <global>
        <item name="MetricsReportIntervalSecs" value="30" />
    </global>
</systemDefinition>
```
