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
| [init](#init)   |`<app_Name>`          |   Create a new project|
| [analyze](#analyze) |[folder]       |Analyze production bundle|
| [clean](#clean)   |[...paths]     | Delete specified paths (defaults to dist folder)|
| [build](#build)  |[folder]       | Build production bundle|
| [dev](#dev)    |[folder]       |   Start development server|
| [run](#run)    |`<task>` [module]|  Run monorepo task|
| [serve](#serve)  |[folder]       |Start static file server (defaults to dist folder)|
| [test](#test)   |[folder]       | Run tests|
| [lint](#lint)   |[folder]       | Lint TypesSript and style files|
| [upgrade](#upgrade) | [folder]      |Upgrade Foundation UI dependencies|

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
The `init` command creates a new project in the selected directory. The basic structure of this command is:

```terminal
npx -y @genesislcap/genx@latest init <app_Name>
```

By doing this, it will create a new project called `<app_Name>`, and the user will be prompt several questions regarding the configuration of this new project.

This command can be used with the following parameters:

|Parameter | Argument  | Description | Structure |
|----------|-----------|-------------|-----------|
|`-s` or `--seed`|`<location>` |You provide a seed where your project will be created upon | npx -y @genesislcap/genx@latest init `<app_Name>` -s `<seed_name>`|
| `--ref`| [ref] |You provide a branch, tag or commit to create your project upon | npx -y @genesislcap/genx@latest init `<app_Name>` -s `<seed_name>` --ref `<branch_name>`|
|`-x` or `--skip-optional-prompts` | |Skip prompts with default values|npx -y @genesislcap/genx@latest init `<app_Name>` -x|
|`--insecure` | |Skip SSL certificate verification|npx -y @genesislcap/genx@latest init `<app_Name>` --insecure|
|`--remote` | | Remote seed only, it will ignore any local seed |npx -y @genesislcap/genx@latest init `<app_Name>` -s `<seed_name>` --remote|
|`-l` or `--log-level` |**info** or **verbose** |info (default) or verbose |npx -y @genesislcap/genx@latest init `<app_Name>` --log-level `<info | verbose>`|
|`-h` or `--help` | | provide help information |npx -y @genesislcap/genx@latest init -h|

### --seed

To use the `-s` or `--seed` parameter, you need to specify the local seed directory, a remote seed or one of the pre-defined seeds provided by genesis.

The pre-defined seeds available are:

- blank-app-seed: a seed with a basic structure of a genesis project.
- positions-app-seed: a seed with a positions app created.
- devtraining-seed: a seed with the starting dev training project.
- servertraining-seed: a seed with the starting server training project.
- webtraining-seed: a seed with the starting web training project.

Here is an example of creating a new project named **myApp** based on the pre-defined positions-app-seed:

```terminal
npx -y @genesislcap/genx@latest init myApp -s positions-app-seed
```

You can use a local seed, to do that follow the example below:

```terminal
npx -y @genesislcap/genx@latest init myApp -s ./path/to/local-seed
```

Or you can use a custom remote sed for your app

```terminal
npx -y @genesislcap/genx@latest init myApp -s ./path/to/local-seed
```

### --ref

To use the `--ref` parameter, you need to specify the branch, tag or commit from a remote location, in case you do not want to use the main one. 

Here is an example of creating a new project named **myApp** based on positions-app-seed on the **develop** branch:

```terminal
npx -y @genesislcap/genx@latest init myApp -s positions-app-seed --ref develop
```

### --skip-optional-prompts

In case you want to skip all the optional questions when creating a new project, you just need to use the `-x` or `--skip-optional-prompts` parameter. Note that the project will be created with the default configuration.

Here is an example of creating a new project named **myApp** skipping all questions.

```terminal
npx -y @genesislcap/genx@latest init myApp -x
```

or

```terminal
npx -y @genesislcap/genx@latest init myApp --skip-optional-prompts
```

### --insecure

In case you want to skip all the SSL certification validation when creating a new project, you just need to use the `--insecure` parameter.

Here is an example of creating a new project named **myApp** skipping the SSL certification validation.

```terminal
npx -y @genesislcap/genx@latest init myApp --insecure
```

### --remote

In case you want to use a remote-only seed, you need to provide the `--remote` parameter. It will ignore any local seed.

Here is an example of creating a new project named **myApp** with a seed called blank-app-seed (It will ignore any blank-app-seed locally).

```terminal
npx -y @genesislcap/genx@latest init myApp -s blank-app-seed --remote
```

### --log-level

If you want to change the default log-level, you can choose from **info** (default) or **verbose**.

Here is an example of creating a new project named **myApp** changing the log level to verbose:

```terminal
npx -y @genesislcap/genx@latest init myApp --log-level verbose
```

### -help

In case you want some additional information about this command, simply run:

```terminal
npx -y @genesislcap/genx@latest init -h
```

or

```terminal
npx -y @genesislcap/genx@latest init myApp --help
```

and the more details will be displayed.

## Analyze

The analyze command ...

## Clean

The `clean` command will delete the provided path. The given path is relative to the directory the command is ran. 

Here is an example to clean the project called **myApp**:

```terminal
npx -y @genesislcap/genx@latest clean myApp
```

The only additional option accepted by this command is the `-h` which provides some details about the `clean` command.

## Build

## Dev

## Run

## Serve

## Test

## Lint

## Upgrade