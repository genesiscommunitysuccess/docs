---
title: 'Custom endpoints - configuring runtime'
sidebar_label: 'Configuring runtime'
id: configuring-runtime
keywords: [server, integration, custom endpoints, configuring runtime]
tags:
  - server
  - integration
  - custom endpoints
  - configuring runtime
---

Gpal custom endpoints require no configuration beyond the `web-handler.kts` file. No modifications to the 
`processes.xml` file are required. Files will be picked up automatically by the Genesis Router from /script folders.

## Script modules

If your custom endpoint requires additional dependencies; then these can the `ScriptModules` annotation. 

For example to add a dependency on `my-module`, add this to the top of your file:

```kotlin
@file:ScriptModules("my-module")
```

Will try to find your `my-module` module and add it to the classpath of the script, including all it's dependencies. 
This will work the same as adding a `<module>` tag to the `processes.xml` file, but on a script level. 

### Configure Genesis Router

If you are going to use custom endpoints, it is essential that you configure the [Genesis Router](../../../../server/configuring-runtime/genesis-router/).

Here is an example configuration:

```kts
router {
    webPort = 9064
    socketPort = 9065

    // rest of file cut for brevity     
}
```



