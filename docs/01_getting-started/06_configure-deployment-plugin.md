---
title: 'Configure Deployment Plugin'
sidebar_label: 'Configure Deployment Plugin'
sidebar_position: 6
id: configure-deployment-plugin
---

This guide will show you how to configure the Genesis deploy plugin so you can easily setup a Genesis environment and deploy to it

### Pre-requisites

The project needs to use the Genesis deploy plugin. 

Sample configuration:
```kotlin
plugins {
    id("global.genesis.deploy") version "6.0.0"
}
```

### Introduction
The Genesis deploy plugin provides several tasks that help to setup Genesis environment and later deploy a project to it. It can be used on Linux machines (local and over SSH) or Windows machines with WSL support

#### Configuration

##### Local Linux Host 
This is the easiest setup and applies if your development workstation is on Linux machine.

To configure open `gradle.properties` from the server root folder and add the following entry:
```properties
genesis-home=<path-to-genesis-distribution>
```

The setup task will create the folder if it doesn't exist and setup the Genesis platform there

##### WSL
If your development workstation is a Windows machine then you can use WSL to have Genesis setup locally.

To configure open `gradle.properties` from the server root folder and add the following entries:
```properties
genesis-home=<path-to-genesis-distribution>
wsl-distro=<name-of-the-wsl-distro>
wsl-user=<wsl-username>
```

`genesis-home` - This is mandatory property that is a path on the WSL distribution. Example: `/home/user1/genesis560`

`wsl-distro` - This is a mandatory property that is the name of the WSL distribution. Example: `CentOS7`

`wsl-user` - This is optional property. If omitted the default WSL user will be used. Example: `user1` 

Sample configuration:
```properties
genesis-home=/home/user1/genesis560
wsl-distro=CentOS7
wsl-user=user1
```

##### Linux Host over SSH
This configuration is usable when using remote host for Genesis environment. Currently only Linux hosts are supported.

To configure open `gradle.properties` from the server root folder and add the following entries:
```properties
genesis-home=<path-to-genesis-distribution>
ssh-username=<remote-host-username>
ssh-password=<remote-host-password>
ssh-host=<remote-host>
ssh-port=<remote-host-ssh-port>
```

All of the properties above are mandatory.

Sample configuration:
```properties
genesis-home=/home/user1/genesis560
ssh-username=user1
ssh-password=<password-for-user1>
ssh-host=user1-remotehost
ssh-port=22
```

#### Tasks

The Genesis deploy plugin comes with several tasks. They are grouped under `genesisdeploy` and `genesissetup`

##### Genesis Setup Tasks

`install-genesis-distribution` - this task copies and unzips the genesis distribution specified as a dependency
`setupEnvironment` - this task executes `install-genesis-distribution` and then configures the installed distribution

Usage:
```shell
./gradlew setupEnvironment
```

##### Genesis Deploy Tasks

`deploy-<project-name>-project.zip` - this task deploys the current project to the Genesis environment specified for `genesis-home`. Note that `<project-name>` is replaced with the actual project name. For example if the project you work on has a name `alpha` then this task will be `deploy-alpha-project.zip`

Usage:
```shell
./gradlew deploy-alpha-project.zip
```

