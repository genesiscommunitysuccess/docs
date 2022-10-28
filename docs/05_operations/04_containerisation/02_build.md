---
title: 'Genesis Containerisation - building a container'
sidebar_label: 'Building a Container'
id: build
keywords: [containerisation, container, docker]
tags:
    - containerisation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

There are two different options that the Genesis low-code platform provides for you to build a Docker image.

The first option, which is covered in this section, is using the Gradle plugin. This is the easiest and quickest way to get up and running with a docker image, but it comes with the cost of reduced flexibility. This option is highly recommended for new developers to try Genesis out.

The second option is to [create your own Dockerfile](https://docs.genesis.global/secure/operations/containerisation/dockefile/) and build your own image. This provides the most amount of flexibility, but also means you need to manage the Genesis dependencies yourself.

## Gradle Plugin Overview

The Gradle plugin provides the easiest and quickest way to get Genesis running in a Docker container. We provide a Gradle task that generates a Dockerfile for you with all the necessary dependencies and builds it.

**There are 3 Gradle tasks that are provided to help you build your Docker image:**

- `createDockerfile` - Generates the Dockerfile dynamically based on user defined settings and dependencies. It also copies all of the files needed for the context into the same folder.
- `buildImage` - Runs **createDockerfile** as a sub-task, and then runs `docker build` on generated Dockerfile
- `pushImage` - Pushes the generated image to a repository defined in **gradle.properties** (See [Genesis Containerisation - pushing the image to a registry](https://docs.genesis.global/secure/operations/containerisation/pushing/))

## Using the Plugin

Create or use an existing Genesis project. See [here](https://docs.genesis.global/secure/getting-started/quick-start/create-a-new-project/) for a guide to creating a new project.

Make sure the necessary changes to the **genesis-system-defintions.kts** are made for your dependencies such as the location of the database. (see [here](https://docs.genesis.global/secure/getting-started/quick-start/prepare-the-server-and-build/) for more info).

Add your dependencies to the Deploy Plugin **build.gradle.kts** (default location for the Blank App Seed is **server/jvm/***appname***-deploy/build.gradle.kts**)

```kotlin
    genesisServer(
        group = "global.genesis",
        name = "genesis-distribution",
        version = properties["genesisVersion"].toString(),
        classifier = "bin",
        ext = "zip"
    )
    genesisServer(
        group = "global.genesis",
        name = "auth-distribution",
        version = properties["authVersion"].toString(),
        classifier = "bin",
        ext = "zip"
    )
```

Run the `buildImage` Gradle task from the root of the **server/jvm/** project. (you can also run this task from your IDE if you prefer):

<Tabs defaultValue="linux" values={[{ label: 'Linux/Unix', value: 'linux', }, { label: 'Windows', value: 'windows', }]}>
<TabItem value="linux">

```bash
./gradlew buildImage
```

</TabItem>
<TabItem value="windows">

```powershell
./gradlew.bat buildImage
```

</TabItem>
</Tabs>

Once the image is built, the output should display the name of the image:

```bash
Successfully built eaa290495637
Successfully tagged genesis/appname:1.0.0-SNAPSHOT
Created image with ID 'eaa290495637'.
```
