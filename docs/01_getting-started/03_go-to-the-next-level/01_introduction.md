---
title: 'Introduction'
sidebar_label: 'Introduction'
id: introduction
---

Now that you have completed the [Quick Start](/getting-started/quick-start/) and are comfortable with the basics, we'll build an advanced application that will demonstrate more of the Genesis platform features.

## What you will build

We want to build a real-time positions application, where trades can be entered, and will be aggregated to maintain positions.

The application will make use of the following platform features:
- [Data Model](/getting-started/go-to-the-next-level/data-model/)
- [Data Server](/getting-started/go-to-the-next-level/events/#data-server) and [Event Handlers](/getting-started/go-to-the-next-level/events/#event-handler)
- [Data Grid](/getting-started/go-to-the-next-level/data-grid/)
- [Computed values](/getting-started/go-to-the-next-level/calculated-data/)
- [Consolidators](/getting-started/go-to-the-next-level/consolidators/)
- [Auditable tables](/getting-started/go-to-the-next-level/audit/)
- [State management](/getting-started/go-to-the-next-level/state-management/)
- [Auditable tables](/getting-started/go-to-the-next-level/audit/)
- [Genesis Evaluator rules](/getting-started/go-to-the-next-level/setting-genesis-evaluator-rules/) 
- [Data pipelines](/getting-started/go-to-the-next-level/data-pipeline/)


We are going to call this example application **positions-app-tutorial**. You will see this reflected in the file names throughout.

## Create a new project
Using the GenX CLI tool, we want to generate a blank full-stack application project. Go to a folder where you want your project to reside, and run:

```
npx genx
```

Follow through the series of questions. For `App name` enter `positions-app-tutorial` and for `App seed` enter `Quick Start Application`.

If this is the first time you are using the GenX CLI tool, check the [Quick Start](/getting-started/quick-start/create-a-new-project/) guide first.

:::info
this project is not a direct copy of the positions app but will contain most of it's functionality.
:::