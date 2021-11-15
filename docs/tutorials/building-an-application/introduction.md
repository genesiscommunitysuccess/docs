---
id: intro
title: Introduction
sidebar_label: Introduction
sidebar_position: 0

---
# Building an application – start to finish

The easiest way to learn how the LCNC Platform works is to follow the creation of an application from start to finish. That’s what we shall do here.

Along the way, you’ll see the tools and the shortcuts, and you can take a look at the code that is produced.

Sound good?

Before you follow this exercise, you need to have the LCNC Platform and your development environment fully installed, and you need to be familiar with the key information in Getting Started.

In short, you need to understand:

* The overall architecture of a Genesis app
* How to create a new project

## The scenario

The start point for scenario is that you want a real-time trading application that maintains positions.

You have:

* an SQL database of reference data. We can convert this into Genesis format with a single command.
* a spreadsheet of trades

We are going to build the rest at speed.

here is a high-level view of what we are going to build:

![](/img/xtg2.png)

In itself, this is not a very useful application , but it is a valuable learning tool. As you work through each part,  it will introduce you to many of the features you’ll be working with when you create your own applications:

You will see things such as:

* tools to create a Genesis database from your existing resources
* the ability to re-use schema data across more than one application- you can see we have effectively creating two applications: one for reference data and one for trading data
* the process to create simple functioning microservices that you can then adjust and enrich
* user permissioning
* timed and triggered events