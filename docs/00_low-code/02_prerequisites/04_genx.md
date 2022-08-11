---
title: 'GENX'
sidebar_label: 'GENX'
id: genx-new-project
---

The GenX CLI tool enables you to seed projects, in this case we just want to generate a blank full-stack application project.

For step-by-step instructions on how to install and use this tool, follow the guide on GenX.

Once configured, install genx using the following command:

```shell
npm install -g @genesislcap/foundation-cli
```

Once installed, from the terminal, run:

```shell
genx
```

In the `genx` script, there is a series of questions.

First, you are asked to provide your username and password - these are the credentials you use to access Genesis Artifactory.

Then you are asked to select from a short list of seed applications. Select `create application`:


```shell
? Genesis Username example.username
? Genesis Password **************
√ Logged into Genesis
? Please select an option: (Use arrow keys)
> create workspace - Generates a local workspace to use for your Genesis based apps.
  configure workspace - Configure a local workspace.
  create application - Generates a local application.
  configure application - Configure a local app.
```
Now you can proceed using the following responses:

```shell
? Create a app in current directory Yes
? App name alpha
```

In the next prompt, select `Quick Start Application` from the list.

```shell
? App seed Quick Start Application
? Overwrite existing files Yes

```

At this point, the seed application is created and the genx dependencies are installed.

Then there are more questions, which you can respond to as follows:

```shell
? Package scope (without the @) genesislcap
? Package name alpha
? Create design system Yes
? Design system name alpha
? Base design system package (@latest will be used) @genesislcap/foundation-ui
? Set API Host (Y/n) Yes
? API Host (with websocket prefix and suffix if any) (ws://localhost/gwf/)
? Genesis Server version 6.0.1
? Genesis Deploy plugin version 6.0.2
? Kotlin version 1.6.10
? Group Id global.genesis
? Application Version 1.0.0-SNAPSHOT
```
At this point, the application will be configured. Assuming it is successful, you will see the following text:

```shell
i Application created successfully! 🎉 Please open the application and follow the README to complete setup.
```
