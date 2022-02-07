---
title: Data model overview
sidebar_label: Data model overview
sidebar_position: 1
id: data-model-overview

---
The data model is at the heart of your application. Getting this right is critical not just to the success of the application, but to how intuitive it will be to develop.

Get it right, and you will find all the other steps are much easier and more logical to complete.

In Genesis, we structure our data in the following way:

* Fields
* Tables
* Views (a view can draw data from more than one table)

Each of these must be specified in a separate file on the filesytem:

* _application_**-fields-dictionary.kts**
* _application_**-tables-dictionary.kts**
* _application_**-view-dictionary.kts**
