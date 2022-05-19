---
id: gradle-deploy
title: Using the gradle deploy plugin
sidebar_label: Using the gradle deploy plugin
sidebar_position: 3
---

# Deploying from the IDE using Gradle

The Genesis low-code platform provides a Gradle plugin that makes it easy to perform all the installation tasks that are
necessary to deploy your own Genesis project on to your local workstation, from your IDE.

The plugin is designed to work on workstations running Linux, or
on [WSL](/creating-applications/getting-ready-to-develop/running-applications/options/using-wsl-setup/).

## Adding the deployment plugin to your project

The Genesis Gradle Deploy Plugin uses the project classpath to resolve dependent resources. So, in order not to
interfere with any of your other project modules, it is best to add a ${projectName}-deploy module to your project.

If you are using one of the Genesis application seeds, then this module will be provided for you as part of the project
template.

If you want to add this module to an existing project, then it is easy to do so. The contents need only be two files;

- a Gradle properties file
- a Gradle build script

### Build script

The build script simply defines dependencies on distributions both internal and external to the project so they can be
resolved and deployed.

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

Note the special configuration option on the internal modules. If adding this configuration to a project, you will need
to add the following code to the build script of the internal module you wish to make available for deployment:

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

This special piece of Gradle DSL makes the zip file of the distribution available on the class path so it can be
resolved by the deploy plugin.

## Deploy Target Configurations

### WSL

If your development workstation is a Windows machine, then you
can [use WSL](/creating-applications/getting-ready-to-develop/running-applications/options/using-wsl-setup/) to have Genesis set-up
locally.

To configure this, open `gradle.properties` from the server/jvm folder and add the following entries:

```properties
genesis-home=<path-to-genesis-distribution>
wsl-distro=<name-of-the-wsl-distro>
wsl-user=<wsl-username>
```

| Entry          | Description                                                                                     | 
|----------------|-------------------------------------------------------------------------------------------------|
| `genesis-home` | This is a mandatory property that is a path on the WSL distribution. Example: `/home/alpha/run` |
| `wsl-distro`   | This is a mandatory property that is the name of the WSL distribution. Example: `CentOS7`       |
| `wsl-user`     | This is an optional property. If omitted, the default WSL user will be used. Example: `alpha`   |

Sample configuration:

```properties
genesis-home=/home/alpha/run
wsl-distro=CentOS7
wsl-user=alpha
```

## Local Linux host

This is the easiest set-up, and applies if your development workstation is on a Linux machine.

To configure this, open `gradle.properties` from the server/jvm folder and add the following entry:

```properties
genesis-home=<path-to-genesis-distribution>
```

The set-up task will create the folder (if it doesn't exist) and set up the Genesis platform there.

## Remote Linux Host (via SSH)

This configuration is usable when using a remote host for the Genesis environment. Currently, only Linux hosts are
supported.

To configure this, open `gradle.properties` from the server/jvm folder and add the following entries:

```properties
genesis-home=<path-to-genesis-distribution>
ssh-username=<remote-host-username>
ssh-password=<remote-host-password>
ssh-host=<remote-host>
ssh-port=<remote-host-ssh-port>
```

All the properties above are mandatory.

Sample configuration:

```properties
genesis-home=/home/user1/genesis560
ssh-username=user1
ssh-password=<password-for-user1>
ssh-host=user1-remotehost
ssh-port=22
```

# Plugin Tasks

The Genesis deploy plugin comes with several tasks. They are grouped under `genesisdeploy` and `genesissetup`.

## Genesis set-up tasks

contains tasks to deploy each external distribution, as well as site specific configuration

| Task                                                                           | Description                                                                                                                                         | 
|--------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| `createGenesisHome`                                                            | This task creates the genesis home.                                                                                                                 |
| `install-genesis-distribution.zip`                                             | This task copies and unzips the Genesis distribution specified as a dependency.                                                                     |
| `install-auth-distribution.zip`                                                | This task copies and unzips the auth distribution specified as a dependency.                                                                        |
| `install-<project-name>-site-specific-1.0.0-SNAPSHOT-bin.zip-distribution.zip` | This task copies and unzips the `<project-name>-site-specific>` distribution specified as a dependency.                                             |
| `loadInitialData`                                                              | This task executes `install-<project-name>-site-specific-1.0.0-SNAPSHOT-bin.zip-distribution.zip` and then calls all the `SendIt-<file>.csv` tasks. |
| `setupEnvironment`                                                             | This task executes `createGenesisHome` then `install-genesis-distribution` and then configures the installed distribution.                          |
| `SendIt-<file>.csv`                                                            | This task executes the script command `SendIt` with the parameters -t `<file-name (in Uppercase)>` and -f `<file-location>`.                        |

## Genesis deploy tasks

Enables the deployment of the full project: single jars for each project module or just configuration files.

This task deploys the event handler to the Genesis environment specified for genesis-home. Note that `<project-name>` must
be replaced with the actual project name. For example, if the project you work on is called alpha, you could call
`deploy-genesisproduct-alpha.zip`

| Task                                       | Description                                                                                      | 
|--------------------------------------------|--------------------------------------------------------------------------------------------------|
| `deploy-genesisproduct-<project-name>.zip` | This task deploys the current project to the Genesis environment specified for `genesis-home`.`  |
| `deploy-<project-name>-eventhandler.jar`   | This task deploys the event handler jar to the Genesis environment specified for `genesis-home`. |
| `deploy-<project-name>-messages.jar`       | This task deploys the messages jar to the Genesis environment specified for `genesis-home`.      |
| `deployConfig`                             | This task deploys the config to the Genesis environment specified for `genesis-home`.            |
| `deployDictionary`                         | This task deploys the dictionary to the Genesis environment specified for `genesis-home`.        |
| `deployScripts`                            | This task deploys the scripts to the Genesis environment specified for `genesis-home`.           |

Note, this will take the last built distribution and does not run a project build as part of the task... so do that
first

## Genesis Script tasks

Enables the invocation of any Genesis platform command via Gradle.
See [the commands list](/managing-applications/operate/on-the-host/helpful-commands/) for more information

| Task                       | 
|----------------------------|
| `DbMon`                    |  
| `genesisInstall`           |  
| `GenesisShell`             |  
| `killGroup`                |  
| `killServer`               |  
| `mon`                      |  
| `remap`                    |  
| `SendIt`                   |  
| `startGroup`               |  
| `startServer`              |  

