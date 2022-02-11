---
title: 'A short journey'
sidebar_label: 'A short journey'
sidebar_position: 3
id: a-short-journey
---

There is no single approach to defining an application in Genesis. You could start by visualising the data, for example, so that you can work out what grids of information and interactions you need. That will give you a way of working out the fields and tables you need.

But the simple route below is a useful way to start thinking about defining an application. 

![](/img/short-journey.png)

You define your [data model](/creating-applications/defining-your-application/data-model/data-model-overview/) in terms of fields, tables of fields and views (which join together fields from different tables).

[Business logic](/creating-applications/defining-your-application/business-logic/business-logic/) typically involves defining the events that trigger activity in the database. An incming message could trigger a price change, for example. It also enables you to control the transformation between states of on object (an order movimg from part-filled to completed, for example).

[Integrations](/creating-applications/defining-your-application/integrations/integraion-overview/) enable you to integrate information from external systems with your application (such as incoming and outgoing FIX messages).

Creating the [user interface](/creating-applications/defining-your-application/user-interface/ui-overview/) involves configuring the data distribution components so that information from specific tables and views is made available to the front end. And you need to configure pages to display that information in the most usaboe and visibly effectove way for your users.

You need to [control access](/creating-applications/defining-your-application/access-control/access-overview/) to the application and permission for users to access specific functions and pieces of data. Do this by configuring our Auth and Perms components.

