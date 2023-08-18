---
title: 'Operations - Genx CLI'
sidebar_label: 'Genx CLI'
id: genx-commands
keywords: [operations, genx, commands]
tags:
    - genx
    - cli
    - commands
    - terminal
---
<!-- Genx  -->

Genx CLI is a tool that simplifies and speeds up local development. Among other useful functions, it enables you to:

- Scaffold Genesis applications from scratch based on existing seeds;
- Start local development server;
- Build artifacts for production;
- Execute unit and end-to-end tests and collect coverage data;
- Perform code linting.

The `genx` command has several options available to create, configure or modify a project. these are the available parameters:

|Command | Argument      | Description|
|--------|---------------|-------------|
| [init](#init)   |`<app_Name>`          |   create a new project |
| [analyze](#analyze) |[folder]       |analyse the production bundle |
| [clean](#clean)   |[...paths]     | delete specified paths (defaults to dist folder) |
| [build](#build)  |[folder]       | build a production bundle |
| [dev](#dev)    |[folder]       |   start a development server |
| [run](#run)    |`<task>` [module]|  run monorepo task|
| [serve](#serve)  |[folder]       | start a static file server (defaults to dist folder)|
| [test](#test)   |[folder]       | run tests|
| [lint](#lint)   |[folder]       | Lint TypesSript and style files |
| [upgrade](#upgrade) | [folder]      | upgrade Foundation UI dependencies |

## How to use it

There are two main ways to run the Genx CLI:

- Standalone - outside of an existing project such as when scaffolding a new project
- Local - within an existing project such as when executing builds within a project

### Standalone

```terminal
npx -y @genesislcap/genx@latest <command> [args]
```

For example, to scaffold a new project:

```terminal
npx -y @genesislcap/genx@latest init myApp
```

This will use the latest available version of the CLI and crete a new application called **myApp** usind the default seed **blank-app-seed**.

### Local

Once you have a project, you can add Genx CLI as a local dependency to your **package.json**:

``` javascript
"devDependencies": {
    ...
    "@genesislcap/genx": "...",
    ...
},
```

You can find out the latest available version by running `npm info @genesislcap/genx` at any point.

Once you have bootstrapped NPM dependencies, you will be able to call Genx CLI in **package.json** scripts section like so:

``` javascript
"scripts":{
    ...
    "build": "genx <command> [args]"
    ...
}
```

For example:

``` javascript
"scripts":{
    ...
    "build": "genx build -e ENABLE_SSO",
    "dev": "genx dev -e API_HOST,ENABLE_SSO"
    "serve": "genx serve",
    "test": "genx test"
    ...
}
```

now if you execute `npm run build` or `npm run dev`, it will launch Genx CLI installed in your project locally.

:::note
If you are going to use a specific version, please do change the `latest` with the specific version
:::

## Init

The `init` command creates a new project in the selected directory. The basic structure of this command is:

```terminal
npx -y @genesislcap/genx@latest init <app_Name>
```

The `init` command creates a new project called `<app_Name>`. When the command runs, the user will be prompted to answer a set of questions to cover the basic configuration of the project.

This command can be used with the following parameters:

|Parameter | Argument  | Description |
|----------|-----------|-------------|
|`-s` or `--seed`|`<location>` | provide a seed where the project will be created |
| `--ref`| [ref] | provide a branch, tag or commit for creating the project |
|`-x` or `--skip-optional-prompts` | | omits the prompts and applies default values |
|`--insecure` | omits SSL certificate verification |
|`--remote` | | remote seed only; any local seed is ignored |
|`-l` or `--log-level` |**info** or **verbose** | info (default) or verbose |
|`-h` or `--help` | | display help information |

### --seed

To use the `-s` or `--seed` parameter to specify the local seed directory, a remote seed or one of the pre-defined seeds provided by genesis.

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

Use the `--ref` parameter to specify the **branch**, **tag** or **commit** from a remote location, in case you do not want to use the main one.

Here is an example of creating a new project named **myApp** based on positions-app-seed on the **develop** branch:

```terminal
npx -y @genesislcap/genx@latest init myApp -s positions-app-seed --ref develop
```

### --skip-optional-prompts

Use the `-x` or `--skip-optional-prompts` parameter to skip all the optional questions when creating a new project. 

Here is an example of creating a new project named **myApp** skipping all questions.

```terminal
npx -y @genesislcap/genx@latest init myApp -x
```

or

```terminal
npx -y @genesislcap/genx@latest init myApp --skip-optional-prompts
```

:::caution
Creating a project using `-x` will create only sing the default configurations.
:::

### --insecure

Use the `--insecure` parameter to skip all the SSL certification validation when creating a new project.

Here is an example of creating a new project named **myApp** skipping the SSL certification validation.

```terminal
npx -y @genesislcap/genx@latest init myApp --insecure
```

### --remote

Use the `--remote` parameter to use a remote-only seed. It will ignore any local seed.

Here is an example of creating a new project named **myApp** with a seed called blank-app-seed (It will ignore any blank-app-seed locally).

```terminal
npx -y @genesislcap/genx@latest init myApp -s blank-app-seed --remote
```

### --log-level

Use the `log-level` to choose between **info** (default) or **verbose** log level.

Here is an example of creating a new project named **myApp** changing the log level to verbose:

```terminal
npx -y @genesislcap/genx@latest init myApp --log-level verbose
```

## Analyze

The `analyze` command ...

This command can be used with the following parameters:

|Parameter | Argument  | Description |
|----------|-----------|-------------|
|`-b` or `--builder`|`<builder>` | Override default builder |
| `-n` or `--no-open`| Don't launch browser window (default: true) |
|`-e` or `--env` | `<ENV_VAR1=VAL1,ENV_VAR2=VAL2,ENV3>` | Set environment variables|
|`-h` or `--help` | | |

### --builder

Use the `-b` or `--builder` when you want to override the default builder.

Here is an example of... <!--Needs to provide some example-->

### --no-open

Use the `-n` or `--no-open` when you don't want to launch a browser window.

Here is an example of... <!--Needs to provide some example-->

### --env

Use `e` or `--env` if you need to set environment variables.

Here is an example of... <!--Needs to provide some example-->

## Clean

The `clean` command will delete the provided path. The given path is relative to the directory the command is ran.

Here is an example to clean the project called **myApp**:

```terminal
npx -y @genesislcap/genx@latest clean myApp
```

The only additional option accepted by this command is the `-h` which provides some details about the `clean` command.

## Build

The `build` command ...

This command can be used with the following parameters:

|Parameter | Argument  | Description |
|----------|-----------|-------------|
|`-b` or `--builder`|`<builder>` | Override default builder |
|`-e` or `--env` | `<ENV_VAR1=VAL1,ENV_VAR2=VAL2,ENV3>` | Set environment variables |
|`-h` or `--help` | | |

### --builder

Use the `-b` or `--builder` when you want to override the default builder.

Here is an example of... <!--Needs to provide some example-->

### --env

Use `e` or `--env` if you need to set environment variables.

Here is an example of... <!--Needs to provide some example-->

## Dev

The `dev` command ...

This command can be used with the following parameters:

|Parameter | Argument  | Description |
|----------|-----------|-------------|
|`-b` or `--builder`|`<builder>` | Override default builder|
| `--https` | | Use HTTPS|
| `-n` or `--no-open`| | Don't launch browser window (default: true) |
|`-e` or `--env` | | Set environment variables |
|`-h` or `--help` | | |

### --builder

Use the `-b` or `--builder` when you want to override the default builder.

Here is an example of... <!--Needs to provide some example-->

### --no-open

Use the `-n` or `--no-open` when you don't want to launch a browser window.

Here is an example of... <!--Needs to provide some example-->

### --env

Use `e` or `--env` if you need to set environment variables.

Here is an example of... <!--Needs to provide some example-->

## Run

The `run` command executes a specific task. This is used for.... <!--Explain why is this used for-->

Here is an example of... <!--Needs to provide some example-->

## Serve

The `serve` command ...

This command can be used with the following parameters:

|Parameter | Argument  | Description | Structure |
|----------|-----------|-------------|-----------|
|`-p` or `--port`| `<port>` | | sets a port number <!--what is this port number for?--> |
|`-h` or `--help` | | |

### --port

Use `--port` or `-p` to....

Here is an example of... <!--Needs to provide some example--> 

## Test

The `test` command ...

This command can be used with the following parameters:

|Parameter | Argument  | Description |
|----------|-----------|-------------|
|`-c` or `--coverage`| | |
| `-w` or `--watch` | | |
| `-d` or `--debug`| | |
| `--e2e` | | |
| `-i` or `--interactive` | | |
| `-b` or `--browser` | | |
| `-e` or `--env` | | |
| `-h` or `--help` | | |

### --coverage

Use `-c` or `--coverage` to ...

Here is an example of... <!--Needs to provide some example--> 

### --watch

Use `--w` or `--watch` to....

Here is an example of... <!--Needs to provide some example--> 

### --debug

Use `-d` or `--debug` to....

Here is an example of... <!--Needs to provide some example--> 

### --interactive

Use `-i` or `--interactive` to....

Here is an example of... <!--Needs to provide some example--> 

### --browser

Use `-b` or `--browser` to....

Here is an example of... <!--Needs to provide some example--> 

### --env

Use `-e` or `--env` if you need to set environment variables.

Here is an example of... <!--Needs to provide some example-->

## Lint

The `lint` command ...

This command can be used with the following parameters:

|Parameter | Argument  | Description | Structure |
|----------|-----------|-------------|-----------|
|`-l` or `--linter`| `<linter>` | | |
| `-f` or `--fix` | | | |
| `-p` or `--profile`| | |
| `-b` or `--builder` | `<builder` | |
| `-h` or `--help` | | |

### --linter

Use `-l` or `--linter` if you need to set environment variables.

Here is an example of... <!--Needs to provide some example-->

### --fix

Use `-f` or `--fix` if you need to set environment variables.

Here is an example of... <!--Needs to provide some example-->

### --profile

Use `-p` or `--profile` if you need to set environment variables.

Here is an example of... <!--Needs to provide some example-->

### --builder

Use the `-b` or `--builder` when you want to override the default builder.

Here is an example of... <!--Needs to provide some example-->

## Upgrade

The `upgrade` command to upgrade the dependencies versions of your app to the latest version available for each dependency, regardless the range defined in the **package.json**

This command can be used with the following parameters:

|Parameter | Argument  | Description | Structure |
|----------|-----------|-------------|-----------|
|`-r` or `--respect-version-ranges`| | Update within package.json version ranges (defaults to latest otherwise) | |
| `-x` or `--exclude` | `<list>` | Comma-separated list of packages to exclude | |
| `-h` or `--help` | | |

### --respect-version-ranges

Use `-r` or `--respect-version-ranges` to update your application's dependencies with the ranges defined in your **package.json**

Here is an example of... <!--Needs to provide some example-->

### --exclude

Use `-x` or `--exclude` to exclude a dependency from the update process. You can provide a list of packages that will not be upgraded. 

Here is an example of... <!--Needs to provide some example-->
