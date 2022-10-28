---
title: 'Genesis Containerisation - configutation'
sidebar_label: 'Configuration Options'
id: configuration
keywords: [containerisation, container, docker]
tags:
    - containerisation
---

# Configuration Options

## Docker Plugin Extension

To customise how the Docker plugin behaves, the Genesis low-code platform provides a Gradle Plugin Extension.

The table below describes the values that can be changed:

| Name | Description | Default |
| --- | --- | --- |
| `compactProcesses` | When set to true this will reduce the number of services running within the container, by combining compatible services into a single process | false |
| `debugEnvVars` | Allows you to provide a map of Environment Variables that will be passed to the containers created by the extra tasks enabled with debugMode<br/>This has no affect unless debugMode is set to true | null |
| `debugMode` | When set to true this changes the Dockerfile to create an image that has extra tools in it to help debugging.<br/>Extra yum packages include: vim, net-tools<br/>This flag also enables 2 new Gradle tasks that run the docker locally with helpful defaults for development purposes. | false |
| `networkName` | When using the extra debug tasks, this setting allows you to specify a custom Docker network for the containers to use.<br/>This has no affect unless debugMode is set to true | null |
| `useGenesisContainerLogConfig` | Defines whether the container should use a specific log4j configuration file that is designed for our containers.<br/>When set to true, logs will effectively be output by the container PID1, allowing most container orchestration systems to capture all of the logs with default settings. | true |
| `preCompileScripts` | When set to true the build process with include a step that compiles all the .kts scripts and caches the results.<br/>This results in a slower build process, but dramatically decreases the start-up time of the container. | true |

These settings should be set in the **server/jvm/***appname***-deploy/build.gradle.kts** file:

```kotlin
dockerImage {
  compactProcesses.set(true)
  debugMode.set(true)
  debugEnvVars.putAll(
    mapOf(
      "DB_HOST" to "172.17.0.2"
    )
  )
}
```

## Local Plugin Configuration

The Genesis low-code platform also supports overrides of the Docker Extension configuration, allowing for different values for different environments. This also means that developers can set their own values without changing any files that are tracked in SCM.

This is done by adding **server/jvm/***appname***-deploy/gradle.properties** and ensuring that the file is ignored by SCM.

| Extension Config | Gradle Properties Equivalent | Notes |
| --- | --- | --- |
| `compactProcesses` | `dockerCompactProcesses` | N/A |
| `debugEnvVars` | `dockerDebugEnvVars` | This should be a comma separated list.<br/>e.g DB_HOST=genesis_db,DB_PORT=5432 |
| `debugMode` | `dockerDebugMode` | N/A |
| `networkName` | `dockerNetworkName` | N/A |
| `useGenesisContainerLogConfig` | `dockerUseGenesisContainerLogConfig` | N/A |
| `preCompileScripts` | `dockerPreCompileScripts` | N/A |

## Environment Variables

Below is a list of environment variables that can be passed to the Docker container at runtime.

| Variable | Description | Default |
| --- | --- | --- |
| `GENESIS_DB_DRY_RUN` | Allows you to see the output of a remap without committing it.<br/>This option only has an effect if it’s used with `GENESIS_DB_INSTALL` or `GENESIS_DB_UPGRADE`  | false |
| `GENESIS_DB_INSTALL` | Runs a remap and then a genesisInstallHooks --init to mark the migration hooks to not run again.<br/>This should only be used during the initial DB setup as it will ignore the migration hooks.<br/>GENESIS_DB_UPGRADE should be used for any further DB schema changes.<br/>The container will exit on completion and will not run any Genesis processes. | false |
| `GENESIS_DB_UPGRADE` | Runs genesisInstallHooks to run any migration hooks, then runs a remap<br/>The container will exit on completion and will not run any Genesis processes | false |

You can also [Set System Definitions values from environment variables](https://docs.genesis.global/secure/server/configuring-runtime/system-definitions/#setting-system-definitions-values-from-environment-variables) which will allow you to change the location of external dependencies (such as the database) between your production and non-production environments.

### Local Container Creation Tasks

When `debugMode` is set to true; a couple of additional Gradle tasks will be created:

- `createLocalContainer` - creates a standard container using the image and sets the environment using the `debugEnvVars`
- `createRemapContainer` - creates a container using the image that will run in remap mode
- `createLocalNetwork` - creates the network specified in `networkName`