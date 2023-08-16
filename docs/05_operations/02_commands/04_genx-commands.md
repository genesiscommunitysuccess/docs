---
title: 'Operations - Genx commands'
sidebar_label: 'Genx commands'
id: genx-commands
keywords: [operations, genx, commands]
tags:
    - genx
    - cli
    - commands
    - terminal
---

Genesis provides a `genx` terminal CLI interface for any one who is interested in creating a new project. This interface allows you to create a new project based on some existing seeds, so you do not need to worry about creating a new project from strach.

The `genx` has several options available to create, configure or modify the project. these are the available parameters:

|Command | Argument      | Description|
|--------|---------------|-------------|
| init   |`<app>`          |   Create a new project|
| analyze |[folder]       |Analyze production bundle|
| clean   |[...paths]     | Delete specified paths (defaults to dist folder)|
| build  |[folder]       | Build production bundle|
| dev    |[folder]       |   Start development server|
| run    |`<task>` [module]|  Run monorepo task|
| serve  |[folder]       |Start static file server (defaults to dist folder)|
| test   |[folder]       | Run tests|
| lint   |[folder]       | Lint TypesSript and style files|
| upgrade| [folder]      |Upgrade Foundation UI dependencies|

## How to use it
To use the `genx` commands, you need to write the follow command in the terminal:

```terminal
npx -y @genesislcap/genx@latest <command> [args]
```

or

```terminal
genx <command> [args]
```

Although the first option will be used more frequently, you need to use the secong way when... <!--When do we use the genx?? @cistov-->

:::note
If you are going to use a specific version, please do change the `latest` with the specific version
:::


## Init
The `init` command creates a new project in the selected directory. This command has the following parameters:

|Parameter | Argument  | Description |
|----------|-----------|-------------|
|`-s` or `--seed`|`<location>` |You provide a seed where your project will be created upon |
| `--ref`| [ref] |You provide a Branch, Tag or commit to create your project upon |
|`-x` or `--skip-optional-prompts` | |Skip prompts with default values|
|`--insecure` | |Skip SSL certificate verification|
|`--remote` | | Remote seed only | <!--Need clarification-->
|`-l` or `--log-level` |[level] |info (default) or verbose |
|`-h` or `--help` | | provide help information |

### --seed

To use the `-s` or `--seed` parameter, you need to specify the local seed directory or provide one of the pre-defined seeds provided by genesis. 

The pre-defined seeds available are:

- 

### --ref

### --skip-optional-prompts


## Analyze
The analyze command ...

## Clean

## Build

## Dev

## Run

## Serve

## Test

## Lint

## upgrade