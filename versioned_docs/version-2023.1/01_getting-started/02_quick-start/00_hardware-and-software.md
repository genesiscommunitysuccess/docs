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

## Recommended hardware and software packages

import MinimunRequirement from '/snippet/_minimun_requirement.md'

<MinimunRequirement />

## Check your prerequisites

<details>
  <summary>Pre-requisite check</summary>
    <li>JDK11 - <code>java --version </code> </li>
    <li>Node - <code>node --version </code> </li>
    <li>npm - <code>npm --version </code> </li>
    <br></br>
    <p>Make sure that your current versions are compatible with the requirements.</p>
</details>

## Foundation UI libraries
From version **10.3.0**, Foundation UI libraries are published to the [public NPM registry](https://www.npmjs.com/~genesisnpm?activeTab=packages), so a custom **npmrc** file is no longer required.

## gradle.properties file
You must create or edit a **gradle.properties** file inside a **.gradle** folder on your user directory. This file must contain your Genesis Artifactory password in [encrypted base 64](https://www.base64decode.org/) text, for example:


```shell
genesisArtifactoryUser=<JaneDee>
genesisArtifactoryPassword=<asodjkdnaisd9893-==12>
```

## Genesis IntelliJ plugin
For this quick start guide we shall use the Genesis Intellij plugin. Follow the [instructions](../../../server/tooling/intellij-plugin/) to install this.