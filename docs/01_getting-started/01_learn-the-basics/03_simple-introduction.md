---
title: 'A very simple introduction'
sidebar_label: 'Simple introduction'
id: simple-introduction
---

## What is the Genesis low-code platform?

The Genesis low-code platform enables you to design, build and run applications for the financial markets. 

The simplest way of thinking about a Genesis application is:

- a database surrounded by a number of modules
- a front end that provides a user interface

The front end is able to access data through two key modules: Data Server (real-time data) and Request Server (static data).

A third key module - the Event Handler - is able to handle interaction from the front end and other parts of the application in order to make changes to the database.
These elements on their own can create a complex and effective application, depending on the complexity of the data model for your database, how rich you make the user interface at the front end, and how thoroughly you define the contents of the three key modules.

Our simple application looks like this:

![](/img/simple-1.png)

### A little more

Let's add some more detail.

**A Router**

There is a configurable Router module for both the front and back ends. This ensures that all traffic between the two reaches its destination securely. 

**Access control**

Importantly, you need to make the application secure. This is done by the Auth module. Configure the Auth module to control access to your application (authentication) and permission to see specific items of data or functions (authorisation); to make authorisation precise, it is coded into each key module (if authorisation = *x* execute *ABC*).

With those things in place, our diagram now looks like this:

![](/img/simple-2.png)

### A lot more

In most cases, you will consider adding further modules to address the scope of your application.
For example, you can:

- use the Consolidator to aggregate data or perform other calculations
- integrate with market data or other systems to handle orders, trades, risk and other financial requirements
- use Notify to integrate with email or professional chatrooms

These are typical examples, but there are more. If there is a special niche that is not covered, you can create your own module from scratch.

We have added these three examples, and our simple diagram is beginning to look a bit  more complex now:

![](/img/simple-3.png)

### What you have learnt so far

So far, this is what we have learnt about Genesis applications:

- A database is at the heart, surrounded by three key modules that serve the front end: Data Server (real-time data), Request Server (static data) and Event Handler (database changes).
- The Router module ensures messages are routed correctly to and from the front end.
- The Auth module controls access to the system (authentication) and to specific data and functions (authorisation). Note that the authorisation is defined in the key modules.
- You can add other modules to cover (for example) aggregated (calculated) data and integrations with internal and external systems.
- You can also create your own modules to cover specific requirements.
