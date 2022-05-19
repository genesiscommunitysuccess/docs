---
title: 'Configure Deployment plugin'
sidebar_label: 'Configure Deployment plugin'
sidebar_position: 2
id: configure-deployment-plugin
---

# Introduction

The Genesis deploy plugin provides several tasks that help to set up the Genesis environment so that you can deploy a
project to it. It can be used on Linux machines (local and over SSH) or Windows machines with WSL support.

This guide will show you how to configure the Genesis deploy plugin so you can easily set up a Genesis environment and
deploy to it.

It covers three different possible configurations:

- WSL (Windows Subsystem for Linux)
- local Linux host
- Linux host over SSH (Secure Shell)

## Pre-requisites

If not already in place in your gradle project, add a sub-module called `<application_name>-deploy`
under `<application_name>/server/jvm/`

Ensure the build.gradle.kts in this sub-module has the following entry

```kotlin
plugins {
    id("global.genesis.deploy") version "6.0.0"
}
```

## Introduction

The Genesis Deploy plugin provides several tasks that help to set up the Genesis environment so that you can deploy a
project to it. It can be used on Linux machines (local and over SSH) or Windows machines with WSL support.

# Deploy target configurations

### WSL
If your development workstation is a Windows machine, then [use WSL](/creating-applications/getting-ready-to-develop/running-applications/wsl-setup/) to have Genesis set-up locally.

If your development workstation is a Windows machine, then you
can [use WSL](/creating-applications/getting-ready-to-develop/running-applications/wsl-setup/) to have Genesis set-up
locally.

To configure this, open `gradle.properties` from the server/jvm folder and add the following entries:

```properties
genesis-home=<path-to-genesis-distribution>
wsl-distro=<name-of-the-wsl-distro>
wsl-user=<wsl-username>
```

| Entry  |  Description | 
|---|---|
|`genesis-home`|  This is a mandatory property that is a path on the WSL distribution. Example: `/home/alpha/run` |
|`wsl-distro`|  This is a mandatory property that is the name of the WSL distribution. Example: `CentOS7` |
|`wsl-user`|  This is an optional property. If omitted, the default WSL user will be used. Example: `alpha` |

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

## Remote Linux host (via SSH)

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

# Deployment tasks

The Genesis deploy plugin comes with several tasks. They are grouped under `genesisdeploy` and `genesissetup`.

## Genesis set-up tasks

| Task  |  Description | 
|---|---|
|`install-genesis-distribution`|  This task copies and unzips the Genesis distribution specified as a dependency. |
|`setupEnvironment`|  This task executes `install-genesis-distribution` and then configures the installed distribution. |

Usage:

```shell
./gradlew setupEnvironment
```

## Genesis deploy tasks

| Task  |  Description | 
|---|---|
|`deploy-genesisproduct-<project-name>.zip`|  This task deploys the current project to the Genesis environment specified for `genesis-home`. Note that `<project-name>` must be replaced with the actual project name. For example, if the project you work on is called `alpha`, then this task will be `deploy-genesisproduct-alpha.zip` |

Usage:

```shell
./gradlew deploy-alpha-project.zip
```

Note, this will take the last built distribution and does not run a project build as part of the task... **so do that
first**.