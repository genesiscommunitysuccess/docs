---
title: 'Data model'
sidebar_label: 'Data model'
sidebar_position: 1
id: 'fields-tables-views'
---

[Introduction](/database/fields-tables-views/fields/)  | [Basics](/database/fields-tables-views/fields/fields-basics/) |  [Advanced](/database/fields-tables-views/fields/fields-advanced/) | [Examples](/database/fields-tables-views/fields/fields-examples/) 

For any Genesis application, everything starts with the data model. 

Getting this right is critical not just to the success of the application, but to how intuitive it will be to develop.

Once you have this in place, you will find all the other steps are much easier and more logical to complete.

In Genesis, we structure our data in the following way:

* [Fields](/database/fields-tables-views/fields/)
* [Tables](/database/fields-tables-views/tables/)
* [Views](/database/fields-tables-views/views/) (a view can draw data from more than one table)

Each of these must be specified in a separate file on the file system:

* _application_**-fields-dictionary.kts**
* _application_**-tables-dictionary.kts**
* _application_**-view-dictionary.kts**

In this section, we look in more detail at how you define your fields, tables and views.

These pages assume you are creating a data model from scratch. You can also create a data model from an existing Excel spreadsheet or RDBMS database. You can see this in practice in our tutorial covering the [Excel](/getting-started/tutorials/generate-positions-app/) and [RDBMS](/getting-started/tutorials/generate-reference-module/) routes.
