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

<details>
  <summary>Pre-requisite check</summary>
    <li>JDK11 - <code>java --version </code> </li>
    <li>Node - <code>node --version </code> </li>
    <li>npm - <code>npm --version </code> </li>
    <br></br>
    <p>Check if these versions are compatible with the requirements.</p>
</details>

## .npmrc

Starting from version **10.3.0** Foundation UI libraries are published to the [public NPM registry](https://www.npmjs.com/~genesisnpm?activeTab=packages), so a custom `.npmrc` file is no longer required.

## gradle.properties file
You should have a **gradle.properties** file inside a **.gradle** folder on your user directory; this file must contain your Genesis Artifactory password in a [base64 encrypted text](https://www.base64encode.org/), for example:

```shell
genesisArtifactoryUser=<JaneDee>
genesisArtifactoryPassword=<asodjkdnaisd9893-==12>
```

## Genesis Intellij plugin
For this quick start guide we are using the Genesis Intellij plugin, please follow the [instructions](../../../server/tooling/intellij-plugin/) to have it properly installed.