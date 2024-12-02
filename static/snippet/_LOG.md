Genesis provides a class called `LOG` that can be used to insert custom log messages. This class provides you with 
5 methods to be used accordingly: `info`, `warn`, `error`,`trade`,`debug`. To use these methods, you need to provide, as an input,
a string that will be inserted into the Logs.

Here is an example where you can insert an info message into the log file:

``` kotlin
LOG.info("This is an info message")
```

The `LOG` instance is a Logger from [SLF4J](https://www.slf4j.org/).

:::note
In order to see these messages, you must set the logging level accordingly. You can do this using the [logLevel](/build-deploy-operate/operate/commands/#loglevel) command.
:::
