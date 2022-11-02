---
title: 'Configure application'
id: configure-application
---

# Configure application

When you first created your app via the GenX CLI we applied some defaults to get you started quickly.
This section will show you where to configure some of the different parts of your application.

:::tip
After you change any config, make sure to do a clean build of your application to see the effects.
:::

## Application Version

The application version defaults to `1.0.0-SNAPSHOT` and can be found on line 15 of the `build.gradle.kts` file, as show in the below screenshot:

![](/img/app-version-gradle.png)

## Gradle Properties

The rest of the config can be found in the `gradle.properties` file of your application.

Here, you can configure your dependency versions, properties used in deployment, and some JVM runtime arguments.

An example `gradle.properties` can be seen here:

![](/img/fuse-gradle-properties.png)

:::caution
Changing JVM arguments is for advanced users only, update this config with care.
:::

### API Host

The web front end will attempt to connect to your local Genesis server by default. If you want to connect to a remote server instead, update the `apiHostUrl` property on line 9 in `gradle.properties`.