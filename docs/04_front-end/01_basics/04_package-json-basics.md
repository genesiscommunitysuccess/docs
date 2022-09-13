---
title: 'Package.json basics'
sidebar_label: 'Package.json basics'
id: package-json-basics
---

The `package.json` file is auto-generated for you by the CLI, based on your answers to the prompts.

At the top you'll find the `name` and `description` of your application.

Following this, there are three key sections you need to be aware of:

- config
- scripts
- dependencies

## Config

When running the app on your local machine, you can adjust a few settings under the `config` section, including which host to connect to and what port to run the dev server on.
```
"config": {
    "API_HOST": "wss://dev-position2/gwf/",
    "DEFAULT_USER": "JaneDee",
    "DEFAULT_PASSWORD": "beONneON*74",
    "PORT": 6060
  },
```

## Scripts

The next section is `scripts`.
Some have been auto-generated for you; feel free to add your own as needed.

These are the commands that you invoke with `$ npm run` - when you execute that command from your command line, `node` will look at the scripts listed here to know what to run.
For example `$ npm run clean:dist` will run `node ../.build/clean.js dist`.

```javascript
  "scripts": {
    "build": "npm run build:webpack",
    "build:with-host": "cross-env API_HOST=$npm_package_config_API_HOST npm run build:webpack",
    "build:webpack": "cross-env NODE_ENV=production AUTO_CONNECT=true webpack",
    "clean": "npm run clean:dist",
    "clean:dist": "node ../.build/clean.js dist",
    "copy-files": "copyfiles -u 1 src/**/*.{css,scss,ttf} ./dist/esm",
    "dev": "npm run dev:webpack",
    "dev:webpack": "cross-env API_HOST=$npm_package_config_API_HOST AUTO_CONNECT=true DEFAULT_USER=$npm_package_config_DEFAULT_USER DEFAULT_PASSWORD=$npm_package_config_DEFAULT_PASSWORD NODE_ENV=development webpack serve --open",
    "serve": "serve dist -p $npm_package_config_PORT",
    "test": "echo \"Error: no test specified\""
  },
```

:::info
Your settings from the `config` block will be passed to different scripts as environment variables, using [cross-env](https://www.npmjs.com/package/cross-env). For example, if you wanted to add a new config for a `DEFAULT_VIEW` you would add the config in the config block as `"DEFAULT_VIEW": "reporting"` and then in the npm script that requires the variable you would add `DEFAULT_VIEW=$npm_package_config_DEFAULT_VIEW`.
:::

## Dependencies

Last but not least, the `dependencies` section contains a list of your app's dependencies and their versions.

:::info
This includes **@genesislcap** dependencies. This is where you would change their versions to upgrade to a newer version of the platform.
:::

```javascript
  "dependencies": {
    "@genesislcap/foundation-comms": "1.0.0",
    "@genesislcap/foundation-entity-management": "1.0.0",
    "@genesislcap/foundation-login": "1.0.0",
    "@genesislcap/foundation-utils": "1.0.0",
    "@genesislcap/foundation-zero": "1.0.0",
    "@genesislcap/foundation-ui": "1.0.0",
    "@microsoft/fast-components": "^2.16.6",
    "@microsoft/fast-element": "^1.6.2",
    "@microsoft/fast-foundation": "^2.27.1",
    "@microsoft/fast-router": "^0.2.11",
    "@microsoft/fast-web-utilities": "^5.0.1",
    "rxjs": "^7.4.0",
    "tslib": "^2.3.1"
  }
```

:::tip
You can use the `lerna add` command (instead of `npm install`) if you need to add more dependencies, since the app is a [lerna managed](https://lerna.js.org/) monorepo.
:::

The `devDependencies` section is for dependencies which are only to used in development - think of tools such as linters. These additional dependencies will not be added to the final production bundle and hence will not increase the download size of the application to the user's browser.

```javascript
  "devDependencies": {
    "@babel/core": "^7.12.9",
    "@typescript-eslint/eslint-plugin": "^5.2.0",
    "camel-case": "^4.1.2",
    "typescript": "^4.5.5",
  }
```

### Adding Dependencies

`lerna` manages the dependencies across the different packages in the monorepo and will attempt to simplify the downloaded packages by only downloading a package version one time - downloading it to the `node_modules` of the project root and then symlinking it across to the other `node_modules` directories in your other lerna modules. It also allows you to link local modules without having to publish them to `npm` first.

You can add dependencies straight into the `package.json` of one of your modules and then run the `$ npm run bootstrap` command from the `package.json` in your web root and `lerna` will ensure the modules are downloaded and linked together.

:::tip
It is good practise to clean the `node_modules` out before running a bootstrap using `$ npm run clean:all` - you can run both commands in one using `$ npm run clean:all && npm run bootstrap`.
:::

## Which `package.json`?

When first starting to work with the `lerna` managed monorepo there can be some confusion about which `package.json` to make changes to when that are multiple ones spread across the project. There will be a `package.json` for each of your modules and also one at the root of the `lerna` project (the client root, in the `/client` directory in the apps created from the seed projects).

1. **Adding a dependency** - As stated in the [adding dependencies](#adding-dependencies) section you should navigate to the `package.json` that is in the directory of the module that you want to add the dependency to. For example, if you want to add the dependency `@genesislcap/foundation-login` to your web app, it is likely that you want to add the dependency into the `client/web/package.json` file. If instead you wanted to add the `@genesislcap/foundation-comms` dependency into a separate module you were building in the same repository, then you would add that in the `package.json` of that module.

2. **Adding a module command** - If you want to add a command that is specific for a module, such as a command set up the extract the API from tsdoc comments using [@microsoft/api-documenter](https://www.npmjs.com/package/@microsoft/api-documenter) you would edit the `package.json` specific to that package just as in the previous bullet point.

3. **Adding a CI/workflow command** - A command you want to run as part of CI or a workflow such as during a git command you'll want to have in your client root. For example if you want to set up linting checks you'll want to add the linting command in the `client/package.json` file.

:::tip
A good rule of thumb for knowing which `package.json` to update is to think of the `package.json` files and modules as a hierarchical tree, and you need to make the change in file which is or is an ancestor of the places where the change is needed.

In general you only need to add changes to the top level `package.json` if the change is required across all modules, else the change would be specific to the module(s) required.
:::

### Example Project

The following example shows a project which has two apps (a spot trading app and a derivatives trading app).
There are also two custom packages, one which is a theme which takes `@genesislcap/foundation-ui` and customises it, and one which is used for common calculations which are required across both of the apps.

```mermaid
classDiagram
    ClientRoot <|-- Apps
    ClientRoot <|-- Packages
    ClientRoot : client/package.json
    ClientRoot : +CI commands
    ClientRoot : +Workflow commands

    Apps <|-- SpotMarkets
    Apps <|-- Derivatives

    class SpotMarkets {
        client/apps/spot_markets/package.json
        +App commands
        +App dependencies
    }
    class Derivatives {
        client/apps/derivatives/package.json
        +App commands
        +App dependencies
    }

    Packages <|-- BlazerTheme
    Packages <|-- CalcsPackage

    class BlazerTheme {
        client/packages/blazer/package.json
        +Theme commands
        +Theme dependencies
    }
    class CalcsPackage {
        client/packages/calcs/package.json
        +Package commands
        +Package dependencies
    }
```

Some examples of changes you'd make:
* Linting would be set up in `client/package.json` as you will want to run linting checks across all parts of the code.
* The "Blazer" theme would require `@genesislcap/foundation-ui` as a dependency so it can import the web components and export them with customised css/themeing. This would require adding a `dependency` to `client/packages/blazer/package.json`.
* The "Blazer" theme would want to be used in both apps to keep a consistent look and feel, and the calculations package is required in both apps too. You would add these dependencies in the `package.json` of each of the modules, and then `lerna` would ensured they're linked together so you can see the local changes without having to publish the theme or calculation package to `npm`.

:::info
If you needed an external dependency to both apps such as [@microsoft/api-documenter](https://www.npmjs.com/package/@microsoft/api-documenter) then lerna would only download it once in the common `node_modules` and then symlink it to where it is required.
:::
