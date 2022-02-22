---
id: front-end
title: Build the front end
sidebar_label: Build the front end
sidebar_position: 12


---

:::note
If you already have a workspace configured, go straight to the section on [generating an application](#part-two). 
:::

## Generating a workspace {#part-one}
This tutorial assumes that you have an access token for the `@genesislcap` package registry.

### GenesisX CLI
If you haven't already installed the Genesis CLI tool, do it now:

```
$ npm install -g @genesislcap/foundation-cli
```

To start the CLI tool, run:
```
$ genx
```
You should see the following in your terminal:

import CliBanner from './_includes/_cli_banner.md'

<CliBanner />

Now use the GenesisX CLI tool to generate a workspace that will host our Positions application. 

Select `❯ create workspace` and answer the questions as follows:

```
❯ create workspace - Generates a local workspace to use for your Genesis based apps.
? Create a workspace in current directory (Y/n): y
? Workspace name (should be unique to application group, ie. client name): example-workspace
? Workspace seed (Use arrow keys):
    ❯ Foundation Workspace Seed - Silver
? Overwrite existing files (y/N): N
```

With the workspace built, we'll now configure the scope and package name of the  `@genesislcap/foundation-ui` package.

```
? Package scope (without the @): genesislcap
? Package name: foundation-ui
```

For the purposes of this tutorial, we will opt out of producing a custom design system:

```
? Create design system (Y/n): n
```

Finally, set the API Host and NPM Token for the `@genesislcap` scope:
<!-- TODO: what will the user set the API Host to? -->
```
? Set API Host (Y/n): y
? API Host (with websocket prefix and suffix if any) (wss://some-host/gwf/) 
? NPM Token (for the @genesislcap scope): YOUR_TOKEN
```

Once you have done this, you should see the following message in your terminal:
```
ℹ Workspace created successfully! 🎉 Please open the workspace and follow the README to complete setup.
```
Your example-workspace directory should look like this:

![](/img/btfe--example-workspace--dir.png)

## Generating an application {#part-two}

This section follows on from the [generating a workspace](#part-one) tutorial and assumes that you are currently in the workspace root.

Navigate to the **apps** directory in your terminal and start the CLI tool:
```
$ cd ./packages/apps
$ genx
```

Use the GenesisX CLI to generate an application using a Genesis app seed. 

Select `❯ create application` and answering the questions that follow:

```
❯ create application - Generates a local application.
? Create a app in current directory (Y/n): y
? App name: positions
? App seed (Use arrow keys)
    ❯ Positions Application
? Overwrite existing files (y/N): N
```

Next, configure the package scope and package name:
<!-- TODO: this package name need to be foundation-ui? -->
```
? Package scope (without the @): genesislcap
? Package name: positions-example
```

We don't want to produce a design system at this time:
```
? Create design system (Y/n): n
```

Finally, set the API Host and NPM Token for the `@genesislcap` scope
<!-- TODO: what will the user set the API Host to? -->
```
? Set API Host (Y/n): y
? API Host (with websocket prefix and suffix if any) (wss://some-host/gwf/) 
? NPM Token (for the @genesislcap scope): YOUR_TOKEN
```

Once you have done this, you should see the following message in your terminal:
```
ℹ Application created successfully! 🎉 Please open the application and follow the README to complete setup.
```
You should now be able to see the positions-example application in the apps directory:

![](/img/btfe--positions-exampleb--dir.png)


### Running the application locally

From the workspace root, run:
```
$ npm run bootstrap
```

Next, change to the **positions** directory and spin up the dev server:

```
$ cd ./packages/apps/positions/client/web
$ npm run dev
```

The application will open at `http://localhost:6060/login`.
![](/img/btfe--positions-example--login.png)

Providing your `API_HOST` has been configured correctly, you'll be able to log in and view the following screen:

![](/img/btfe--positions-example--home.png)

### Positions Grid
The template for the home page is located in the application's **routes** directory `positions/client/web/src/routes/home/home.template.ts`.


![](/img/btfe--positions-example--home-route.png)

In the template, we define the `positionColumnDefs`for the Genesis AG Grid. This is where we can apply column-specific configurations, such as sorting and cell-change flashing. You can find more information on column definitions in the Genesis AG Column documentation.

![](/img/btfe--positions-example--column-defs-b.png)

These column definitions are used in the `HomeTemplate`,
 where we configure the ag-genesis-datasource template directive.

![](/img/btfe--positions-example--grid-template-b.png)

<!-- TODO: we may want to move this to the WEB UI reference section? -->
### Application structure

The Positions Web Client is broken down into the following directories:

- components - application-specific components focused on building functionality, with minimal styling applied
- design-system - used to align components to your brand or product; you can create multiple design systems that each uses a different set of components
- main
- routes
- services
- utils

