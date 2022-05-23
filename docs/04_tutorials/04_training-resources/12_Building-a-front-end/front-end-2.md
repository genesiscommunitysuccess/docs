---
id: front-end-2
title: Generating an application
sidebar_label: Generating an application
sidebar_position: 2

---



You have previously generated a workspace. Before you start this section, make sure that you are in the workspace root.

## Start the CLI tool
Navigate to the **apps** directory in your terminal and start the CLI tool:
```
$ cd ./packages/apps
$ genx
```

## Generate the application
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

## Configure package name and scope
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

## Set the API host and token
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

Well done. Now you can run the application and take a look at what you've got.

