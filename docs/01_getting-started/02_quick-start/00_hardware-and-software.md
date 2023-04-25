---
title: 'Quick start - hardware and software'
sidebar_label: 'Hardware and software'
id: hardware-and-software
sidebar_position: 2
keywords: [getting started, quick start, software, hardware, repository, npmrc, gradle, foundation ui]
tags:
    - getting started
    - quick start
    - software
    - hardware
    - repository
    - npmrc
    - gradle
    - foundation ui
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page gives you the hardware and software requirements needed in order to run a development workstation for the Genesis low-code platform. It also provides instructions for configuring the Genesis packages.

## Recommended hardware and operating system

* Operating system : Windows 10 Pro
* RAM : 32GB minimum
* CPU : 8 Core
* SSD : 250GB

## Recommended software packages

[//]: # (If you change this table, make sure you change all pages that contain minimum requirements)  

| Package	                                                                                                        |  Minimum Version   | 
|-----------------------------------------------------------------------------------------------------------------|:------------------:|
| [IntelliJ](https://www.jetbrains.com/idea/download/?fromIDE=#section=windows)	                                  | 2022.3 or above|
| [Java SDK or JDK](https://www.oracle.com/java/technologies/downloads/) (Choose the **x64 installer** download.) |         11         |
| [NodeJS](https://nodejs.org/download/release/latest-gallium/)                                                   |       16 LTS       |
| [Genesis Intellij Plugin](../../../server/tooling/intellij-plugin/)       |         0.1.2        |
| [Postman](https://www.postman.com/downloads/) (optional)	                                                       |         8          |
| [Gradle](https://gradle.org/install/) | 7.5 |


You can use a range of IDEs (for example, Eclipse) with the Genesis platform, but only IntelliJIDEA enables you to use Genesis Intellij plugin and make full use of the GPAL prompts and error checks in Intellisense - a major accelerator of development speed and accuracy. Since you are going to use this plugin, Genesis strongly recommends using IntelliJIDEA.

## Installing GenX

<details>
  <summary>Pre-requisite check</summary>
    <li>JDK11 - <code>java --version </code> </li>
    <li>Node - <code>node --version </code> </li>
    <li>npm - <code>npm --version </code> </li>
    <br></br>
    <p>Check if these versions are compatible with the requirements.</p>
</details>

Since version 11.3.0 of the foundation-UI, we have set our libraries public. Hence, you only need to run this simple command to start using genesis.

```powershell
npm install -g @genesislcap/foundation-cli
```

## gradle.properties file
You should have a **gradle.properties** file inside a **.gradle** folder on your user directory; this file must contain your Genesis Artifactory password in a [base64 encrypted text](https://www.base64encode.org/), for example:

```shell
genesisArtifactoryUser=<JaneDee>
genesisArtifactoryPassword=<asodjkdnaisd9893-==12>
```

## Genesis Intellij plugin
For this quick start guide we are using the Genesis Intellij plugin, please follow the [instructions](../../../server/tooling/intellij-plugin/) to have it properly installed.