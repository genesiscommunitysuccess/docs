---
title: 'Operations - Genx CLI'
sidebar_label: 'Genx CLI'
id: genx-CLI
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

This will use the latest available version of the CLI and create a new application called **myApp** usind the default seed **blank-app-seed**.

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

<h3>--seed</h3>

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

Or you can use a custom remote seed for your app

```terminal
npx -y @genesislcap/genx@latest init myApp -s githubuser/repo
```

<h3>--ref</h3>

Use the `--ref` parameter to specify the **branch**, **tag** or **commit** from a remote location, in case you do not want to use the main one.

Here is an example of creating a new project named **myApp** based on positions-app-seed on the **develop** branch:

```terminal
npx -y @genesislcap/genx@latest init myApp -s positions-app-seed --ref develop
```

<h3> --skip-optional-prompts </h3>

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
Creating a project using `-x` will create only using the default configurations.
:::

<h3> --insecure </h3>

Use the `--insecure` parameter to skip all the SSL certification validation when creating a new project.

Here is an example of creating a new project named **myApp** skipping the SSL certification validation.

```terminal
npx -y @genesislcap/genx@latest init myApp --insecure
```

<h3> --remote </h3>

Use the `--remote` parameter to use a remote-only seed. It will ignore any local seed.

Here is an example of creating a new project named **myApp** with a seed called blank-app-seed (It will ignore any blank-app-seed locally).

```terminal
npx -y @genesislcap/genx@latest init myApp -s blank-app-seed --remote
```

<h3> --log-level </h3>

Use the `log-level` to choose between **info** (default) or **verbose** log level.

Here is an example of creating a new project named **myApp** changing the log level to verbose:

```terminal
npx -y @genesislcap/genx@latest init myApp --log-level verbose
```

## Analyze

The `analyze` command helps to optimise size of production bundle - it identifies the modules contributing to the overall filesize the most.

This command can be used with the following parameters:

|Parameter | Argument  | Description | Local signature |
|----------|-----------|-------------|-----------|
|`-b` or `--builder`|`<builder>` | Override default builder| `genx analyze --builder <builder>`|
| `-n` or `--no-open`| |Don't launch browser window (default: true) | `genx analyze --no-open`|
| `-e` or `--env` | `<VAR1, VAR2>` | Set environment variables | `genx build --env VAR1=VAL1,VAR2=VAL2`|
|`-h` or `--help` | | display information about the command| `genx serve --help` |

## Clean

The `clean` command clears out the dist folder as well as temporary TypeScript compilation files. You can customise the exact files and folders to delete.

This command is more useful to be used locally in your project. To do that, simply add this scripts to the list of scripts in your **package.json**

```javascript title="package.json"
"clean": "genx clean <Path>",
```

Below is an example of creating a `clean` script to clear the dist folder (containing previously built artifact) and the node_modules folder. 

```javascript title="Client/package.json"
"clean": "genx clean dist node_modules"
```

Now you can run `npm run clear` in the **client** folder. 

## Build

The `build` command produces production bundle for deployment.

This command can be used with the following parameters:

|Parameter | Argument  | Description | Local signature |
|----------|-----------|-------------|-----------|
|`-b` or `--builder`|`<builder>` | Override default builder| `genx build --builder <builder>`|
| `-e` or `--env` | `<VAR1, VAR2>` | Set environment variables | `genx build --env VAR1=VAL1,VAR2=VAL2`|
|`-h` or `--help` | | display information about the command| `genx serve --help` |


## Dev

The `dev` command starts an incremental development build server. It will watch for source file changes on disk and refresh the application.

This command can be used with the following parameters:

|Parameter | Argument  | Description | Local signature |
|----------|-----------|-------------|-----------|
|`-b` or `--builder`|`<builder>` | Override default builder| `genx dev --builder <builder>`|
| `--https` | | Use HTTPS| `genx dev --https` |
| `-n` or `--no-open`| | Don't launch browser window (default: true) | `genx dev --no-open` |
| `-e` or `--env` | `<VAR1, VAR2>` | Set environment variables | `genx dev --env VAR1=VAL1,VAR2=VAL2`|
|`-h` or `--help` | | display information about the command| `genx serve --help` |

## Run

The `run` command provides a shortcut for executing NPM tasks in a monorepos managed by [Nx](https://nx.dev/) / [Lerna](https://lerna.js.org/)

``` terminal
npx -y @genesislcap/genx@latest run <task>
```

or locally:

``` javascript
genx run <task>
```

for example: 
```javascript
"scripts": {
  "dev:app1": "genx run dev app1-name"
}
```


## Serve

The `serve` command allows to preview production bundle locally. It starts a static HTTP server in `dist` folder.

This command can be used with the following parameters:

|Parameter | Argument  | Description | Local signature |
|----------|-----------|-------------|-----------|
|`-p` or `--port`| `<port>` |sets a port number (override the **package.json** definition) | `genx serve --port 6060` |
|`-h` or `--help` | | display information about the command| `genx serve --help` |

If there is no `-p` defined, then it will be used the port defined in the **package.json**.

## Test

The `test` command executes unit and end-to-end tests. Node.js and browsers (Chrome, Firefox etc.) are supported as execution targets. Test coverage reports can be produced in a number of formats such as LCOV.

This command can be used with the following parameters:

|Parameter | Argument  | Description | Local Signature|
|----------|-----------|-------------|-----------|
|`-c` or `--coverage`| | Produce coverage report | `genx test --coverage` |
| `-w` or `--watch` | |Watch files for changes | `genx test --watch` |
| `-d` or `--debug`| |Debug test execution | `genx test --debug`|
| `--e2e` | |Run e2e tests. Defaults to unit test | `genx test --e2e`|
| `-i` or `--interactive` | |Run e2e tests in interactive UI mode| `genx test --interactive`|
| `-b` or `--browser` | |Execute unit test in a browser. Defaults to Node.js | `genx test --browser`|
| `-e` or `--env` | `<VAR1, VAR2>` | Set environment variables | `genx test --env VAR1=VAL1,VAR2=VAL2`|
| `-h` or `--help` | | | `genx test --help` |

## Lint

The `lint` command verifies compliance with ESLint/Prettier/Stylelint rules and formatting conventions. Default configurations are provided, which can be tailored for a specific project.

This command can be used with the following parameters:

|Parameter | Argument  | Description | Local Signature|
|----------|-----------|-------------|-----------|
|`-l` or `--linter`| `<linter>` | eslint / stylelint / all (default) | `genx lint -l <linter>`|
| `-f` or `--fix` | | Fix issues | `genx lint --fix`|
| `-p` or `--profile`| | Output profiling information | `genx lint --profile` |
|`-b` or `--builder`|`<builder>` | Override default builder| `genx lint --builder <builder>`|
| `-h` or `--help` | | | `genx lint -h`|

## Upgrade

The `upgrade` command updates Foundation UI NPM module dependency versions regardless the range defined in your **package.json**. It can be plugged in into CI jobs for automated upgrade workflows.

This command can be used with the following parameters:

|Parameter | Argument  | Description | Local ignature |
|----------|-----------|-------------|-----------|
|`-r` or `--respect-version-ranges`| | Update within package.json version ranges (defaults to latest otherwise) | `genx upgrade --respect-version-ranges` |
| `-x` or `--exclude` | `<list>` | Comma-separated list of packages to exclude | `genx upgrade --exclude tslib` |
|`-h` or `--help` | | display information about the command| `genx upgrade --help` |
