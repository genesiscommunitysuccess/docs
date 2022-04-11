---
id: intro
sidebar_label: 'Introduction'
sidebar_position: 1
title: 'Introduction'
---

This area enables you to look in detail at the features that enable you to build an application on the Genesis low-code platform. 

This reference section starts with the data model - the heart of any application - and then covers the components that can be enabled and configured to add business logic and sophisticated processing to your application. Then we look at building a front end to view and interact with the application.

We'll offer explanations of what each component can achieve, and we'll show you syntax and example code wherever it's relevant.

If you are not sure where something fits in, it's probably worth looking at the [architecture](/getting-started/what-is-the-genesis-low-code-platform/) section of our Getting Started section.

Once you have a working server, you can check out the information on the [Web User Interface](/creating-applications/defining-your-application/user-interface/front-end-basics/front-end-basics).

There is practical guidance on how to build a server in our [Tutorials](/tutorials/building-an-application/intro/) section.

## A short journey
There is no single approach to defining an application in Genesis. You could start by visualising the data, for example, so that you can work out what grids of information and interactions you need. That will give you a way of working out the fields and tables you need.

But the simple route below is a useful way to start thinking about defining an application. 

![](/img/short-journey.png)

You define your [data model](/creating-applications/defining-your-application/data-model/data-model-overview/) in terms of fields, tables of fields and views (which join together fields from different tables).

[Business logic](/creating-applications/defining-your-application/business-logic/business-logic/) typically involves defining the events that trigger activity in the database. An incoming message could trigger a price change, for example. It also enables you to control the transformation between states of on object (an order moving from part-filled to completed, for example).

[Integrations](/creating-applications/defining-your-application/integrations/integraion-overview/) enable you to integrate information from external systems with your application (such as incoming and outgoing FIX messages).

Creating the [user interface](/creating-applications/defining-your-application/user-interface/ui-overview/) involves configuring the data distribution components so that information from specific tables and views is available to the front end. And you need to configure pages to display that information in the most usable and visibly effective way for your users.

You need to [control access](/creating-applications/defining-your-application/access-control/access-overview/) to the application and permission for users to access specific functions and pieces of data. Do this by configuring our Auth and Perms components.

