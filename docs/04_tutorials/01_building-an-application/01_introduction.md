---
id: intro
title: Introduction
sidebar_label: Introduction
sidebar_position: 1

---
# Building an application – start to finish

The easiest way to learn how the Genesis low-code platform works is to follow the creation of an application from start to finish. That’s what we shall do here.

Along the way, you’ll see the tools that accelerate development, and you can take a look at the code that is produced.

Sound good?

Before you follow this exercise, you need to have the Genesis low-code platform and your development environment fully installed, and you need to be familiar with the key information in Getting Started.

In short, you need to understand:

* The [overall architecture of a Genesis application](/getting-started/what-is-the-genesis-low-code-platform/)
* How to [create a new project](/creating-applications/creating-a-new-project/alternative_options_supported/server-project-setup/)

Before you start, make sure you have the platform and all the relevant tools [installed](/creating-applications/getting-ready-to-develop/running-applications/options/install-in-three-steps/). The Genesis low-code platform must be installed on a server, local vm, wsl or cloud instance (genesis and auth).


## The scenario

We want to build a real-time positions application, where trades can be entered, and will be aggregated to maintain positions.

You have:

* an SQL database of reference data. 
* a spreadsheet of trades

We are going to build the rest at speed.

Here is a high-level view of what we are going to build:


![](/img/positions-app-arch-overview.png)


Note straightaway that our Positions application contains two separate modules (which are potential applications in their own right). One module provides reference data, such as counterparty IDs, while the other provides details of trades done. Both these applications share a single data model.

- First, the *Market Data* module <!--TODO add link to documentation page here --> <!-- TODO link to it's artifactory here and 'is available here ' --> is a pre-built module created and maintained by Genesis. It provides abstract interface to the many market-data-provider APIs we have available. For the positions app we will depend on its data simulator to show live PNL. Genesis provides a range of pre-built modules for inclusion in apps, all suited for capital markets use cases and beyond.

- The second module is for *Reference Data*, and contains a data model and core components to interface with it. This will be the first thing we build, and it can be achieved with two simple commands. As a sole module in an application, it isn't going to contain much right now, but it demonstrates the modularity of the platform. For example, it is common to want to build applications that want to share data, data models and logical components; these are often in the same (or similar) ecosystem within a company.


Working through the tutorial will show you:

* tools that quickly generate a Genesis data model from existing resources
* the ability to depend upon modules 
* tools that create common CRUD components based on a data model, which we will then enrich
* setting up authorisation