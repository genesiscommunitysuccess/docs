---
title: 'Web Basics - Front-end'
sidebar_label: 'Front-end basics'
id: front-end-basics
keywords: [web, basics]
tags:
    - web
    - basics
---

To view or use your Genesis application, you need to create one or more web pages. On each of these pages, you need to have components that display information or enable the user to interact with the application. For example:
-	A grid is the most common way of displaying information in financial information. The platform provides several different types. Typically, a display component needs to be connected to a specific resource in the application (these are the queries you have defined within a Request Server, Data Server or Event Handler).
-	A text field, a button, a radio button or a slider are all ways that the user can interact with and control the application.



## Starting materials
When you ran the `genx` process to create your project, it automatically created three very important files (among others) for your front end:
-	**home.template.ts**
-	**home.ts**
-	**home.styles.ts**


You can amend these files to create your first front end for the application. Changing these files enables you to change the Home page of your application to suit your requirements.

By way of a reminder, when you run `genx`, you go through a simple sequence where you supply the npm token and set up:
-	your choice of seed application
-	parent directory
-	name and scope of the package
-	the host (server) address (unless you are running locally)

The best way of seeing how you change your **.ts** files to create a front end is to read our Quick Start Guide. This has examples of the amendments and additional code you need to set up a simple page with a grid and a form.

Realistically, your application will require more than one page.