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

## The genx script
`genx` is a CLI tool that enables you to seed projects. In this case, you shall generate a full-stack application project; the key files will be empty so that you can define the details of the application.

If you still don't have genx installed, please see the session [Installing GenX](../../../getting-started/quick-start/hardware-and-software/#installing-genx).

## Starting

Once configured and installed, from the Windows terminal, run:

```shell title="Windows Terminal"
genx
```

:::tip

If this does not work, use the command `npx genx`.

:::

<!-- NO EDIT (NEXT 4 LINES) -->
import InsecureFlag from '../../_includes/_cli-insecure-flag.md'

<InsecureFlag />

In the `genx` script, there is a series of questions.

First, you are asked to select from a short list of seed applications. Select `create application`:

```shell {4} title="Windows Terminal"
? Please select an option: (Use arrow keys)
  create workspace - Generates a local workspace to use for your Genesis based apps.
  configure workspace - Configure a local workspace.
> create application - Generates a local application.
  configure application - Configure a local app.
```
Now you can proceed using the following responses:

```shell title="Windows Terminal"
? Create a app in current directory Yes
? App name alpha
```

Then you are asked to select the App Seed. Select `Quick Start Application` from the list. If you are asked to overwrite existing files, select **Y**.

  ```shell {2} title="Windows Terminal"
App seed (Use arrow keys)
> Quick Start Application
  Positions Application
  Hello World Application
  Foundation-Store Based Application
  Foundation App Seed
  Local Application Seed
  Overwrite existing files (y/N)
  ```

At this point, the seed application is created and the `genx` dependencies are installed.

Then there are more questions, which you can respond to as follows (we have provided some notes below):

```shell title="Windows Terminal"
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

```shell title="Windows Terminal"
i Application created successfully! 🎉 Please open the application and follow the README to complete setup.
```
Now let's open your application in Intellij. Start by opening [IntelliJ IDEA](https://www.jetbrains.com/idea/). In the alpha project, you will see the **readme** file for the project. After importing and indexing, your gradle tab (normally on the right of your window) should contain 3 folders (**alpha**, **client**, **genesisproduct-alpha**).

### Gradle.properties
Before you finish the creation of your new project, make sure your **gradle.properties** file in **server/jvm** has the  following highlighted properties:

```kotlin {2,3} title="server/jvm/gradle.properties"
                ...
genesisArtifactoryPath=https://genesisglobal.jfrog.io/genesisglobal/libs-release-client
enableGenesisIntellijHelperTasks=true
```

:::note
If you had to modify this file, make sure you `reload all gradle projects`.
:::
