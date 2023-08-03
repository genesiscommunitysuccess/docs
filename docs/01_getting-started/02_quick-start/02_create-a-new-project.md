---
title: 'Quick start - create a new project'
sidebar_label: 'Create a new project'
id: create-a-new-project
keywords: [getting started, quick start, new project]
tags:
    - getting started
    - quick start
    - new project
---

:::info
Before you start, make sure you have checked out the [hardware and software requirements](../../../getting-started/quick-start/hardware-and-software/). 

Download and install all the relevant requirements.
:::

## Starting

We start our quick journey using the CLI provided by Genesis. From the terminal, run:

```shell title="Terminal"
npx -y @genesislcap/genx@latest init alpha -x
```
<!-- NO EDIT (NEXT 4 LINES) -->
import InsecureFlag from '../../_includes/_cli-insecure-flag.md'

<InsecureFlag />

At this point, the seed application is created and the `genx` dependencies are installed.

Then there are more questions, which you can respond to as follows (we have provided some notes below):

```shell title="Terminal"
? Package scope (without the @) genesislcap
? Package name alpha
? Create design system Yes
? Design system name alpha
? Base design system package (@latest will be used) @genesislcap/foundation-ui
? Set API Host (Y/n) Yes
? API Host (with websocket prefix and suffix if any) (ws://localhost/gwf/)
? Group Id global.genesis
? Application Version 1.0.0-SNAPSHOT
```
:::note
Here's a quick note about those questions:
- package scope is the namespace identifier for your app
- package name is the identifier for the app itself
- a design system and a base design system package are necessary for the front end 
- the API host is the address that the front end will connect to
- Group ID is another identifier (sorry about all these)
:::

At this point, the application will be configured. On completion, you will see the following text:

```shell title="Terminal"
✔ Project successfully created. Next steps:                                                   
 › Install dependencies with npm run bootstrap
 › Start development server with npm run dev
```
## Opening IntelliJ
Now open your application in Intellij. Start by opening [IntelliJ IDEA](https://www.jetbrains.com/idea/). In the alpha project, you will see the **readme** file for the project. After importing and indexing, your gradle tab (normally on the right of your window) should contain 3 folders: **alpha**, **client**, **genesisproduct-alpha**.

## Gradle.properties (server/jvm)
There is a **gradle.properties** file in the **server/jvm** folder. Check that it has the following highlighted properties, and update it if necessary:

```kotlin {2,3} title="server/jvm/gradle.properties"
                ...
genesisArtifactoryPath=https://genesisglobal.jfrog.io/genesisglobal/libs-release-client
enableGenesisIntellijHelperTasks=true
```

:::note
If you had to modify this file, make sure you `reload all gradle projects`.
:::
