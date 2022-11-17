<<<<<<< Updated upstream
---
title: 'Configure application'
id: configure-application
---

# Configure application

When you first created your app via the GenX CLI we applied some defaults to get you started quickly.
This section will show you where to configure some of the different parts of your application.

:::tip
After you change any config, make sure to do a clean build of your application (`genx app reassemble`) to see the effects.
:::

## Application Version

The application version defaults to `1.0.0-SNAPSHOT` and can be found in the `build.gradle.kts` as highlighted in the below code snippet:

```kotlin showLineNumbers
import com.github.gradle.node.npm.task.NpmTask

plugins {
    kotlin("jvm")
    id("org.jlleitschuh.gradle.ktlint") version "11.0.0"
    `maven-publish`
    id("com.google.devtools.ksp")
    java
    id("global.genesis.gpl.build")
    id("global.genesis.build")
    id("com.github.node-gradle.node") version "3.1.1"
}

group = "global.genesis"
// highlight-next-line
version = "1.0.0-SNAPSHOT"
```

## Gradle Properties

The rest of the config can be found in the `gradle.properties` file of your application.

Here, you can configure your dependency versions, properties used in deployment, and some JVM runtime arguments.

An example `gradle.properties` can be seen here:

```groovy showLineNumbers
kotlin.code.style=official
org.gradle.jvmargs=-Xmx6g -Xss512k -XX:+HeapDumpOnOutOfMemoryError -XX:+UseG1GC -XX:+UseStringDeduplication -XX:ReservedCodeCacheSize=512m -Dkotlin.daemon.jvm.options=-Xmx2g -Dfile.encoding=UTF-8
org.gradle.caching=true

gpl-version=0.4.0
gsf-version=6.2.1
auth-version=6.2.0
kotlin-version=1.7.10
// highlight-next-line
apiHostUrl=ws://localhost:9064
genesis-home=/home/dslsampleapp/run

# Docker config
ssh-username=dslsampleapp
ssh-password=dslsampleapp
ssh-host=127.0.0.1
ssh-port=1337
```

:::caution
Changing JVM arguments is for advanced users only, update this config with care.
:::

### API Host

The web front end will attempt to connect to your local Genesis server by default. If you want to connect to a remote server instead, update the `apiHostUrl` property in `gradle.properties`.
=======
---
title: 'Configure application'
id: configure-application
---

# Configure application

When you first created your app via the GenX CLI we applied some defaults to get you started quickly.
This section will show you where to configure some of the different parts of your application.

:::tip
After you change any config, make sure to do a clean build of your application (`genx app reassemble`) to see the effects.
:::

## Application Version

The application version defaults to `1.0.0-SNAPSHOT` and can be found in the `build.gradle.kts` as highlighted in the below code snippet:

```kotlin showLineNumbers
import com.github.gradle.node.npm.task.NpmTask

plugins {
    kotlin("jvm")
    id("org.jlleitschuh.gradle.ktlint") version "11.0.0"
    `maven-publish`
    id("com.google.devtools.ksp")
    java
    id("global.genesis.gpl.build")
    id("global.genesis.build")
    id("com.github.node-gradle.node") version "3.1.1"
}

group = "global.genesis"
// highlight-next-line
version = "1.0.0-SNAPSHOT"
```

## Gradle Properties

The rest of the config can be found in the `gradle.properties` file of your application.

Here, you can configure your dependency versions, properties used in deployment, and some JVM runtime arguments.

An example `gradle.properties` can be seen here:

```groovy showLineNumbers
kotlin.code.style=official
org.gradle.jvmargs=-Xmx6g -Xss512k -XX:+HeapDumpOnOutOfMemoryError -XX:+UseG1GC -XX:+UseStringDeduplication -XX:ReservedCodeCacheSize=512m -Dkotlin.daemon.jvm.options=-Xmx2g -Dfile.encoding=UTF-8
org.gradle.caching=true

gpl-version=0.4.0
gsf-version=6.2.1
auth-version=6.2.0
kotlin-version=1.7.10
// highlight-next-line
apiHostUrl=ws://localhost:9064
genesis-home=/home/dslsampleapp/run

# Docker config
ssh-username=dslsampleapp
ssh-password=dslsampleapp
ssh-host=127.0.0.1
ssh-port=1337
```

:::caution
Changing JVM arguments is for advanced users only, update this config with care.
:::

### API Host

The web front end will attempt to connect to your local Genesis server by default. If you want to connect to a remote server instead, update the `apiHostUrl` property in `gradle.properties`.
>>>>>>> Stashed changes
