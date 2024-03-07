Genesis provides a class called `LOG` that can be used to insert custom log messages. This class provides you with 
5 methods to be used accordingly: `info`, `warn`, `error`,`trade`,`debug`. To use these methods, you need to provide, as an input,
a string that will be inserted into the Logs.

Here is an example where you can insert an info message into the log file:

``` kotlin
LOG.info("This is an info message")
```

The `LOG` instance is a Logger from SLF4J. [Find out more about it here](https://www.slf4j.org/).

:::note
Remember that in order to see these messages, you need to set the logging level accordingly. To learn how to set the logging level, [follow this link](../../../operations/commands/server-commands/#loglevel).
:::