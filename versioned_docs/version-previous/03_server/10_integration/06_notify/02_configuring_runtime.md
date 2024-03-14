---
title: 'Notify - configuring runtime'
sidebar_label: 'Configuring runtime'
id: notify-configuring-runtime
keywords: [server, notify, configuring runtime]
tags:
  - server
  - notify
  - configuring runtime
---

You need to add some dependencies in two different files in order to your notify to work successfully:

1. Add the notifyVersion in the file **server/jvm/gradle.properties**:

```xml
notifyVersion=x.y.z
```

2. Add a reference to your **server/jvm/alpha-dictionary-cache/build.gradle.kts** file, such as this:

```kotlin
dependencies {
    ....
    implementation("global.genesis:genesis-notify-config:${properties["notifyVersion"]}")
}
```
This will create the necessary fields and tables so notify can run.

3. Add a reference to your **server/jvm/alpha-deploy/build.gradle.kts** file:

```xml
dependencies {
     ...
     genesisServer(
        group = "global.genesis",
        name = "genesis-notify-distribution",
        version = properties["notifyVersion"].toString(),
        classifier = "bin",
        ext = "zip"
    )   
    ...
}
```

4. Reload the gradle project so the dependencies can be downloaded.
5. Run the `genesisInstall` script so the notify folder will be created in your run time folder, containing all necessary configuration and scripts.
6. Run the `remap` script so the tables and fields are created in your database.
7. Start the server.

After following these seven steps, a new process will appear in your mon tab called: `GENESIS_NOTIFY`. This is the process that manages the notify module.
