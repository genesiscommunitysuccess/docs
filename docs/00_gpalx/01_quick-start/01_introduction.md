---
title: 'Introduction'
id: Introduction
---

# Introduction

This introductory guide enables you to use GPALX to build a full stack Genesis application quickly and easily.

It's split into the following steps:

1. [Create Application](../../../gpalx/quick-start/create-application/)
2. [Start Application](../../../gpalx/quick-start/start-application)
3. [Add Features](../../../gpalx/quick-start/add-features)
4. [Summary](../../../gpalx/quick-start/summary)

## What will we build?

By the end of this guide, we will have created a full stack Genesis application which will show:
- a customisable grid surfacing application data
- a form allowing us to insert new data

![](/img/gpl-seed-form.png)

## Prerequisites

Before you start, make sure you have the relevant [hardware and software](../../../getting-started/quick-start/hardware-and-software/). GPALX has the same requirements as our other Genesis platform options. 

### Development environment

You have a few options for running applications locally:

* The recommended approach is to use Docker. Refer to the [Docker documentation](https://docs.docker.com/get-docker/) for installation instructions.
* On Windows you can also use Windows Subsystem for Linux (WSL). Refer to the [WSL installation instructions](../../../getting-started/prerequisites/installing-wsl/).

### GenX CLI

GenX is a CLI tool that enables you to quickly create projects that adhere to Genesis best practices.


#### Installation

```shell
npm uninstall -g @genesislcap/foundation-cli
npm install -g @genesislcap/foundation-cli@dsl
```

:::important
Updating GenX CLI gives you access to the latest Genesis functionality.
:::

There is more information in our [GenX](../../../getting-started/prerequisites/genx/) documentation.

## What will we learn?

Upon completion, you should have knowledge of how to build an application using GPALX with a keen focus on:
- setting up an environment for this and future *low-code* applications
- creating a starting project structure using the [GPALX](../../../gpalx) application seed
- modelling data with clear definitions
- building grid views to visualise data
- setting up forms to manipulate the data set
- integrating with existing Genesis components such as the authentication component 
