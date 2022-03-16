---
title: GPAL consolidators
sidebar_label: GPAL consolidators
id: cons-advanced-technical-details
sidebar_position: 1

---


[Introduction](/creating-applications/defining-your-application/business-logic/consolidators/consolidators/)  | [Where to define](/creating-applications/defining-your-application/business-logic/consolidators/cons-where-to-define/) | [Basics](/creating-applications/defining-your-application/business-logic/consolidators/cons-technical-details/) |  [Advanced](/creating-applications/defining-your-application/business-logic/consolidators/advanced/cons-advanced-technical-details/) | [More examples](/creating-applications/defining-your-application/business-logic/consolidators/cons-more-examples/) | [Configuring runtime](/creating-applications/defining-your-application/business-logic/consolidators/cons-configuring-runtime/) | [Testing](/creating-applications/defining-your-application/business-logic/consolidators/cons-testing/)

## GPAL consolidators
You can now define your consolidator in GPAL, so you can use kotlin. 

Consolidators enable you to aggregate data from a table or a view into another table. They have a syntax that is
similar to an sql **group by** query; for example, you can:

- select fields and apply aggregation functions to these, for example, SUM, COUNT or MIN
- Group by specific fields
- apply conditions with a where statement

The output from the consolidator is saved in your application's database.

Find out more about [how GPAL consolidators are defined and how they behave](/creating-applications/defining-your-application/business-logic/consolidators/advanced/cons-gpal1/).

Look at the [GPAL functions](/creating-applications/defining-your-application/business-logic/consolidators/advanced/cons-gpal2/) in detail.



