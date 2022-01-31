---
id: front-end
title: Build the front end
sidebar_label: Build the front end
sidebar_position: 12

---
# <a name="#partOne"></a> Generating a workspace
_Note_: If you have a workspace configured please proceed to the [generating an applicaton](#partTwo) section. 

This tutorial assumes that you have an access token for the `@genesislcap` package registry ([see here](https://docs.genesis.global/secure/web-ui-reference/cli/#pre-flight-steps)).

GenesisX CLI
---

If you haven't alread, you'll want to install the Genesis CLI tool:
```
$ npm install -g @genesislcap/foundation-cli
```

To start the CLI tool run:
```
$ genx
```
You should see the following in your terminal:

import CliBanner from './_includes/_cli_banner.md'
<CliBanner />

We'll now use the GenesisX CLI tool to generate a workspace that will host our positions application by selecting `❯ create workspace` and answering the ensuing questions as follows:

```
❯ create workspace - Generates a local workspace to use for your Genesis based apps.

? Create a workspace in current directory (Y/n): y
? Workspace name (should be unique to application group, ie. client name): example-workspace
? Workspace seed (Use arrow keys):
    ❯ Foundation Workspace Seed - Silver

? Overwrite existing files (y/N): N
```

With the workspace built we'll now configure the scope and package name `@genesislcap/foundation-ui` package.

```
? Package scope (without the @): genesislcap
? Package name: foundation-ui
```

For the purpose of this tutorial we will opt out of producing a custom design system
```
? Create design system (Y/n): n
```

Finally, we'll set the API Host and NPM Token for the `@genesislcap`
<!-- TODO: what will the user set the API Host to? -->
```
? Set API Host (Y/n): y
? API Host (with websocket prefix and suffix if any) (wss://some-host/gwf/) 
? NPM Token (for the @genesislcap scope): YOUR_TOKEN
```

Once you have done this you should see the following message in your terminal:
```
ℹ Workspace created successfully! 🎉 Please open the workspace and follow the README to complete setup.
```
Your example-workspace directory should looks something like this:
![](/img/example-workspace.png)

<br>

# <a name="#partTwo"></a> Generating an application

This tutorial follows on from the [generating a workspace](#partOne) tutorial and assumes that you are currently in the workspace root.

Navigate to the apps directory in your terminal and start the CLI tool:
```
$ cd ./packages/apps
$ genx
```

We'll now use the GenesisX CLI to generate an application using a Genesis app seed by selecting `❯ create application` and answering the ensuing questions as follows:

```
❯ create application - Generates a local application.

? Create a app in current directory (Y/n): y
? App name: positions
? App seed (Use arrow keys)
    ❯ Positions Application

? Overwrite existing files (y/N): N
```

Next, we configure the package scope and package name:
<!-- TODO: this package name need to be foundation-ui? -->
```
? Package scope (without the @): genesislcap
? Package name: positions-example
```

We don't want to produce a design system at this time:
```
? Create design system (Y/n): n
```

Finally, we'll set the API Host and NPM Token for the `@genesislcap`
<!-- TODO: what will the user set the API Host to? -->
```
? Set API Host (Y/n): y
? API Host (with websocket prefix and suffix if any) (wss://some-host/gwf/) 
? NPM Token (for the @genesislcap scope): YOUR_TOKEN
```

Once you have done this you should see the following message in your terminal:
```
ℹ Application created successfully! 🎉 Please open the application and follow the README to complete setup.
```
You should now be able to see the positons-example application in the apps diectory:
![](/img/positions-example.png)

<br>

# <a name="#partThree"></a> Running the application locally

From the workspace root you'll need to run:
```
$ npm run bootstrap
```

Next, change into the positions app directory and spin up the dev server
```
$ cd ./packages/apps/positions/client/web
$ npm run dev
```

The application will open at `http://localhost:6060/login`.
![](/img/positions-example--login.png)

Providing your API_HOST has been configured correctly you can login to the application
![](/img/positions-example--home.png)

