---
id: intro
title: Introduction
sidebar_label: Introduction
sidebar_position: 0

---
# Building an application – start to finish

The easiest way to learn how the LCNC Platform works is to follow the creation of an application from start to finish. That’s what we shall do here.

Along the way, we'll use the common tools developers using the Platform to accelerate development, and show the look at the code that is produced.

Sound good?

Before you follow this exercise, you need to have the LCNC Platform and your development environment fully installed, and you need to be familiar with the key information in Getting Started.

<!-- TODO Update this -->
In short, you need to understand:

* The [overall architecture of a Genesis application](/getting-started/application/)
* How to [create a new project](/platform-reference/essential-information/starting-new-project/starting-from-scratch/)

If you want to access the project as you follow, or make changes, you'll also need:

* Access to the genesisclient repo <!--TODO Link to page explaining credentials from your administration team>
* Access to the genesis 5.6.1 binaries <!--TODO Link to page explaining in house artifactory else direct, details from your infra team>

<!-- TODO - add installation bits here [installed](/getting-started/get-ready-to-develop/install/)-->
Before you start. Make sure you have the platform and all the relevant tools [installed](/getting-started/get-ready-to-develop/install/). The Genesis LCNC must be installed on a server, local vm, wsl or cloud instance (genesis and auth).

## The scenario

We want to build a real-time positions application, where trades can be entered, and will be aggregated to maintain positions.

You have:

* an SQL database of reference data.
* a spreadsheet of trades

We are going to levarage these existing sources to create the base of an application, and build upon them.

Here is a high-level view of what we are going to build:


![](/img/Positions_App_HLA.png)


Note straightaway that our overall application - the Positions Application will depend upon and utilise two separate modules, each with its own data model and components:

Firstly, the *Market Data* module <!--TODO add link to documentation page here --> <!-- TODO link to it's aritfiactory here and 'is avaialble here ' --> is a pre-built module built and maintained by Genesis. It provides abstract interface to the many market data provider APIs we show to be available in our documentation. For the positions app we will depend on it's data simulator to show live PNL. Genesis provide lots of pre-built modules available for inclusion in apps, all suited for capital markets use cases and beyond.

The second module is for *Reference Data*, and contains a data model and core components to interface with it. It isn't actually built yet! We'll build it first with two simple commands...

Run as a sole module in an application, it isn't going to contain much right now, but it demonstrates the modularity of the platform which is important to understand. For example, it is common to want to build many applications that want to share data, data models and logical components, as they are in the same (or similar) ecosystem within a company.

So let's start building... As you work through each part, it will introduce you to many of the features you’ll be working with when you create your own applications:

We will show:

* tools to very quickly generate a Genesis data model from existing resources
* the ability to depend upon modules 
* tools to create common CRUD components based on a data model, which we will then enrich
* setting up authorisation