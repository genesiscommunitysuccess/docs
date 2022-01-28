---
id: front-end
title: Build the front end
sidebar_label: Build the front end
sidebar_position: 12

---
# Generating a workspace
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

With the workspace built we'll now configure the project to use the `@genesislcap/foundation-ui` package.

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
<br>

# <a name="#partTwo"></a>Generating an application
