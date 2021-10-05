---
id: cli
sidebar_label: CLI
sidebar_position: 50
title: CLI Overview and Command Reference
tags:
  - cli
  - genx
  - frontend
  - ui
  - getting started
---

import CliBanner from './_includes/_cli_banner.md'

<CliBanner />

The GenesisX CLI `genx` is a command-line interface tool that you can use to scaffold the front end of Genesis
applications directly from a terminal based on best practices. It provides:

- [Workspace](#workspaces) scaffolding.
- [App](#apps) scaffolding. [^1]

To complement the CLI, we are developing a graphical user interface to suit users who prefer to scaffold the above using a No Code workflow.

## Pre-flight steps

import NpmrcSetup from './_includes/_npmrc_setup.md'

<NpmrcSetup />

## Installing the CLI

Once the `@genesislcap` scope has been properly configured, you can install our CLI using the `npm` package manager:

```shell
npm install -g @genesislcap/foundation-cli
```

On installing the CLI, you should see a welcome message similar to:

```text
Hey there Genesis LCAP user! 👋

Thanks for giving the GenesisX CLI a try. 🎉

The first thing you will want to do is generate a workspace for your Genesis based apps.

Run 'genx' to get started.

For further information see the docs: (https://docs.genesis.global/secure/web-ui-reference/cli/)
```

## Available generators

### Workspaces

Workspaces are top-level client monorepos that contains various packages, such as components, micro frontends,
design systems, and at least one application. All these packages can be versioned and released independently.
This setup provides an enhanced developer experience.

The workspace generator automates the following steps for you:
- Creates a local workspace from a local or remote seed and configures it.
- Persists the information captured during your CLI session within the workspace filesystem for future use.

### Apps

Apps are local to workspaces, they don't exist in isolation. TODO...

## Basic workflow

After you have installed the CLI, simply run `genx` to get started. By default, it will start the
[Workspace Generator](#workspaces).

```shell
genx
```

TODO:

## Workspaces and Application filesystem

After you have created a workspace, your workspace filesystem should look something like this (depending on the seed).

```shell
./packages/
├── apps
│   ├── demo
├── components
├── design-systems
│   └── alpha
├── micro-frontends
├── services
└── utils
```

This is a monorepo containing multiple packages. Each package can be released independently.

## CLI command-language syntax and default values {#cli-commands}

Command syntax is:

`genx` *commandNameOrAlias* *requiredArg* [*optionalArg*] `[options]`

You can access help by... TODO

### Boolean options

Boolean options have two forms: 

* `--this-option` sets the flag to `true` 

* `--no-this-option` sets it to `false`

If neither option is supplied, the flag remains in its default state, as listed [above](#cli-commands).

[^1]: Application scaffolding is coming soon. [Register to get notified](https://genesis.global/contact-us/)