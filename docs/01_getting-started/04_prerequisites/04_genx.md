---
title: 'Prerequisites - Genx'
sidebar_label: 'Genx'
id: genx
keywords: [getting started, quick start, prerequisites, genx]
tags:
    - getting started
    - quick start
    - prerequisites
    - genx
---



The GenesisX CLI GenX is a command-line interface tool that you can use to scaffold Genesis applications and workspaces directly from a terminal. 

With GenX, you can pull seed projects that adhere to best practices for development on the Genesis low-code platform. The seed projects available range from skeleton projects to example applications.

## Prerequisites

- Recommended Operating system : Windows 10 Pro
- [Node.js](https://nodejs.org/en/download/) version 16
- Before installing GenX, you need to [configure the Genesis npm repository](/getting-started/quick-start/hardware-and-software/#npmrc-set-up)

## Installing GenX

Once the repository is configured, open a terminal on your Windows machine and install the CLI tool using this:

```shell title="Windows Terminal"
npm install -g @genesislcap/foundation-cli
```

Now you're ready to use the tool, simply type `genx` to start:

```shell title="Windows Terminal"
genx
```

This command presents you with a sequence of choices for creating and configuring applications.

## Using GenX

First, you'll be prompted to supply your Genesis artifactory credentials [used when setting up your .npmrc](/getting-started/quick-start/hardware-and-software/#npmrc-set-up)

Next, follow the instructions according to the task you're wishing to carry out.

The following is the most typical example, creating a new application:

```shell title="Windows Terminal"
? Please select an option: create application - Generates a local application.
```

Enter the local directory you want to create the app in (where relevant, the default for these options is the letter displayed in upper case; this will be applied if nothing is entered):

```shell title="Windows Terminal"
? Create a app in current directory (Y/n)
```

... and then give it an appropriate name (e.g. **alpha**):
```shell title="Windows Terminal"
? App name alpha
```

Next, select Seed application you wish to base your project on:
```shell title="Windows Terminal"
? App seed

> Genesis Quick Start Application
```

Choose whether to overwrite existing files. The default is **No**.
```shell title="Windows Terminal"
? Overwrite existing files (y/N)
```

This will start the download of dependencies.

### Front-end prompts
Once that is done, you will be prompted for configuring the front-end part of the project.

The first prompt is the package [scope](https://docs.npmjs.com/cli/v8/using-npm/scope). The default is **genesislcap**.
```shell title="Windows Terminal"
? Package scope (without the @) genesislcap
```

The next question is about the package name. You can use **alpha**.
```shell title="Windows Terminal"
? Package name alpha
```

The next is whether you want to create a design system. The default is **Yes**.
```shell title="Windows Terminal"
? Create design system (Yes/no)
```

Finally, whether you want to set an API host. The default is **Yes**.
```shell title="Windows Terminal"
? Set API Host (Yes/no)
```

### Back-end prompts
The next prompts concern the back-end part of the application.

The first prompt is for which Genesis Server version is to be used:
```shell title="Windows Terminal"
? Genesis Server version 6.1.2
```

... followed by the Gradle deploy plugin version.
:::note

At the time of writing, the same version as the Genesis Server must be used.

:::

```shell title="Windows Terminal"
? Genesis Deploy plugin version 6.1.2
```

Then specify the Kotlin version. The latest tested version is 1.6.10:
```shell title="Windows Terminal"
? Kotlin version 1.6.10
```

... followed by the [group id](https://maven.apache.org/guides/mini/guide-naming-conventions.html)
```shell title="Windows Terminal"
? Group Id global.genesis
```

... and the application version:
```shell title="Windows Terminal"
? Application Version 1.0.0-SNAPSHOT
```

Press **Enter** and you should be greeted by a message saying that the application was created successfully.

Open the project in IntelliJ to start building. But note - it takes a few minutes to set up the folder structure, so be patient.

Here's a quick overview of the generated application's folder structure:

![](/img/create-application-folder-overview.png)

Above, we have expanded the `client` folder. This contains all the UI-related projects.

The `server` folder follows the same structure. This contains all the server-side projects.

:::note
The **Quick Start Application** seed will generate:

- the **web** project structure
- the **jvm** project structure
:::

## Workspaces
Workspaces are top-level client monorepos that contains various packages, such as components, micro front-ends, design systems, and at least one application. All these packages can be versioned and released independently. This set-up provides an enhanced developer experience.

The workspace generator automates the following steps for you:

- creates a local workspace from a local or remote seed and configures it.
- persists the information captured during your CLI session within the workspace filesystem for future use.

### Workspaces and application filesystem
Your apps are local to workspaces; they don't exist in isolation.

After you have created a workspace, your workspace filesystem should look something like this (depending on the seed).

```
./packages/
├── apps
│   ├── demo
├── components
├── design-systems
│   └── alpha
├── micro-frontends
├── services
└── utils
```

This is a monorepo containing multiple packages. Each package can be released independently.

## CLI command-language syntax

The command syntax is:

`genx` _commandNameOrAlias requiredArg [optionalArg]_ [options]


## Boolean options
Boolean options have two forms:

* `--this-option` sets the flag to `true`

* `--no-this-option` sets it to `false`

If neither option is supplied, the flag remains in its default state.