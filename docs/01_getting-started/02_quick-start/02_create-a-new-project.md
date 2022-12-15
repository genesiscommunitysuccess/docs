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
Before you start, make sure you have checked out the [hardware and software requirements(../../../getting-started/quick-start/hardware-and-software/). 

Download and install all the relevant requirements.
:::

## The genx script
`genx` is a CLI tool that enables you to seed projects. In this case, we shall generate a full-stack application project; the key files will be empty so that you can define the details of the application.

We also have step-by-step instructions on [how to install and use genx](../../../getting-started/prerequisites/genx/).

## Starting

Once configured and installed, from the Windows terminal, run:

```shell title="Windows Terminal"
genx
```

:::tip

If this does not work, use the command `npx genx`.

:::

In the `genx` script, there is a series of questions.

First, you are asked to select from a short list of seed applications. Select `create application`:

```shell title="Windows Terminal"
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

Then you are asked to select the App Seed. Select `Quick Start Application` from the list. 

Do **not** select the Positions Application.

You will be asked if you want to overwrite existing files. Select **Y**.

  ```shell title="Windows Terminal"
App seed (Use arrow keys)
> **Quick Start Application**
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
