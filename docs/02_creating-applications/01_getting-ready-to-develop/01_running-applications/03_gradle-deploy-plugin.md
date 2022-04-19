---
id: gradle-deploy
title: Using the gradle deploy plugin
sidebar_label: Using the gradle deploy plugin
sidebar_position: 3
---

# Deploying from the IDE using Gradle
The Genesis low-code platform provides a Gradle plugin that makes it easy to perform all the installation tasks that are necessary to deploy your own Genesis project on to your local workstation, from your IDE.

The plugin is designed to work on workstations running Linux, or on [WSL](/creating-applications/getting-ready-to-develop/running-applications/options/using-wsl-setup/).

## Adding the deployment plugin to your project
The Genesis Gradle Deploy Plugin uses the project classpath to resolve dependent resources. So, in order not to interfere with any of your other project modules, it is best to add a ${projectName}-deploy module to your project.

If you are using one of the Genesis application seeds, then this module will be provided for you as part of the project template. 

If you want to add this module to an existing project, then it is easy to do so. The contents need only be two files;

-  a Gradle properties file
-  a Gradle build script

### Properties
The properties file defines a few key properties in order for the plugin to function correctly.

- `genesis-home` is the location on the Linux or WSL file system where the platform and application distributions will be installed.
- `wsl-distro` is the name of the WSL distribution in which to install the platform (when using WSL).
- `wsl-user` is the user that owns the directory in which to install the platform (when using WSL).
```
genesis-home=/home/product/run #required
wsl-distro=CentOS #wsl only
wsl-user=product #wsl only
```

The WSL properties are required in order to pass to the Windows WSL wrapper command. Path conversion happens automatically. In the absence of any WSL distribution, the plugin assumes it is running directly on Linux.

### Build script
The build script simply defines dependencies on distributions both internal and external to the project so they can be resolved and deployed.
```kotlin
plugins {
    id("global.genesis.deploy") version "${genesisVersion}"
}

description = "${productName}-deploy"

deploy {
  productName = "${productName}"
}

dependencies {
    implementation(
      group = "global.genesis",
      name = "genesis-distribution",
      version = "${genesisVersion}",
      classifier = "bin",
      ext = "zip"
    )
	# add any other external genesis distributions here, AUTH, FIX etc.

    api(project(":${productName}-distribution", "distribution"))
    api(project(":${productName}-eventhandler"))
    api(project(":${productName}-messages"))
    api(project(":${productName}-site-specific", "distribution")) #if the project has a site-specific submodule
}
```
Note the special configuration option on the internal modules. If adding this configuration to a project, you will need to add the following code to the build script of the internal module you wish to make available for deployment:
```kotlin
val distribution by configurations.creating {
  isCanBeConsumed = true
  isCanBeResolved = false
}

artifacts {
    val distzip = tasks.distZip.get()
    add("distribution", distzip.archiveFile) {
        builtBy(distzip)
    }
}
```
This special piece of Gradle DSL makes the zip file of the distribution available on the class path so it can be resolved by the deploy plugin.

### Invoking tasks
Once all the distributions are available on the classpath of the deploy module, the Gradle import process will create tasks to deploy all the relevant files, as well as control the server.

Gradle tasks are split into three sections.

* genesissetup - contains tasks to deploy each external distribution, as well as site specific configuration
* genesisdeploy - enables the deployment of the full project: single jars for each project module or just configuration files
* genesisscripts - enables the invocation of any Genesis platform command via Gradle. See [the commands list](/managing-applications/operate/on-the-host/helpful-commands/) for more information

