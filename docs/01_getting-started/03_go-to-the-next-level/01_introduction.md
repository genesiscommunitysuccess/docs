---
title: 'Go to the next level - introduction'
sidebar_label: 'introduction'
id: introduction
keywords: [getting started, quick start, next level, introduction]
tags:
    - getting started
    - quick start
    - next level
    - introduction
---

Now that you have completed the [Quick Start](../../../getting-started/quick-start/) and are comfortable with the basics, we'll build an advanced application that will demonstrate more of the Genesis platform features.

Before you get going, you will need a [full developer set-up](/getting-started/prerequisites/introduction/) for this exercise. Make sure you check the requirements and set up what is necessary.

## What you will build

We want to build a real-time [positions](https://www.investopedia.com/terms/p/position.asp) application, where trades can be entered, and will be aggregated to maintain positions.

In this tutorial we will build a positions trading application. This is a typical application for the capital markets and highlights some of the typical use cases and features of the Genesis low-code platform.
In the tutorial, you will create a more sophisticated form and grid for adding information than those given in the [Learn the basics](../../../getting-started/learn-the-basics/what-can-i-build/build-intro/) section.

The application will make use of the following platform features:
- [Data Model](../../../getting-started/go-to-the-next-level/data-model/)
- [Data Server](../../../getting-started/go-to-the-next-level/events/#data-server) and [Event Handlers](../../../getting-started/go-to-the-next-level/events/#event-handler)
- [Data Grid](../../../getting-started/go-to-the-next-level/data-grid/)
- [Computed values](../../../getting-started/go-to-the-next-level/calculated-data/)
- [Consolidators](../../../getting-started/go-to-the-next-level/consolidators/)
- [Auditable tables](../../../getting-started/go-to-the-next-level/audit/)
- [State management](../../../getting-started/go-to-the-next-level/state-management/)
- [Auditable tables](../../../getting-started/go-to-the-next-level/audit/)
- [Genesis Evaluator rules](../../../getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/) 
- [Data pipelines](../../../getting-started/go-to-the-next-level/data-pipeline/)


We are going to call this example application **positions-app-tutorial**. You will see this reflected in the file names throughout.

## Create a new project
Using the GenX CLI tool, we want to generate a blank full-stack application project. Go to a folder where you want your project to reside, and run:

```
npx genx
```

Follow through the series of questions. For `App name` enter `positions-app-tutorial` and for `App seed` enter `Quick Start Application`.

If this is the first time you are using the GenX CLI tool, check the [Quick Start](../../../getting-started/quick-start/create-a-new-project/) guide first.

:::info
This project is not a direct copy of the positions app but will contain most of its functionality.

The [positions app tutorial repository](https://github.com/genesiscommunitysuccess/positions-app-tutorial) can be used as a reference point for this tutorial. 
:::
