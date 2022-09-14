---
title: 'Pre-requisites'
id: 'prerequisites'
---

# Pre-requisites

Fuse has the same requirements as our other Genesis platform options. 
Those include:
 - Hardware and Software
 - WSL
 - Gradle deploy plugin

Therefore, before progressing with our guides please refer to the [Introduction](/getting-started/prerequisites/introduction/) page to ensure we have the initial set up.

## GenX CLI
####
GenX is a CLI tool that enables the use of seed projects that adhere to best practices for development on the Genesis low-code platform.


### Installation
To install GenX, use the following command in the terminal:
:::important
Our Fuse seed is currently only available on a particular version, therefore we need to uninstall any previous version and specify the one we need.
:::

```shell
npm uninstall -g @genesislcap/foundation-cli
npm install -g @genesislcap/foundation-cli@3.0.1-alpha-f18b742.0+f18b742
```
For more information please refer to [Genx](/getting-started/prerequisites/genx/) documentation.
