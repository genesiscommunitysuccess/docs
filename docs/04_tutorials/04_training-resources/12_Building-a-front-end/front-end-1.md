---
id: front-end-1
title: Generating a workspace
sidebar_label: Generating a workspace
sidebar_position: 1


---

So far, we have done plenty of work on the back end. Now we are going to create a web front-end to see what our application looks like to a user.

We are going to to do this in 3 main steps:

1. Generate a workspace. As part of this, you install the Genesis CLI tool. If you already have a workspace configured, go straight to the section on generating an application.
2. Generate an application.
3. Run the application locally.


## Pre-requisites
For this section of the tutorial, you must have an access token for the `@genesislcap` package registry.

## Install the GenesisX CLI
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

## Generate a workspace

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

## Configure scope and package name

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

OK - you can now move on and create the front end itself.