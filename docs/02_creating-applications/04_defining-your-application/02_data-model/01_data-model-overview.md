---
title: Data model overview
sidebar_label: Data model overview
sidebar_position: 1
id: data-model-overview

---
The data model is at the heart of your application. Getting this right is critical not just to the success of the application, but to how intuitive it will be to develop.

Get it right, and you will find all the other steps are much easier and more logical to complete.

In Genesis, we structure our data in the following way:

* [Fields](/creating-applications/defining-your-application/data-model/fields/)
* [Tables](/creating-applications/defining-your-application/data-model/tables/)
* [Views](/creating-applications/defining-your-application/data-model/views/) (a view can draw data from more than one table)

Each of these must be specified in a separate file on the filesytem:

* _application_**-fields-dictionary.kts**
* _application_**-tables-dictionary.kts**
* _application_**-view-dictionary.kts**

In this section, we look in more detail at how you define your fields, tables and views.

These pages assume you are creating a data model from scratch. You can also create a data model from an existing Excel spreadsheet or RDBMS database. You can see this in practice in our tutorial covering the [Excel](/tutorials/building-an-application/positions-app/) and [RDBMS](/tutorials/building-an-application/reference-app/) routes.

