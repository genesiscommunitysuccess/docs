---
title: 'Learn the basics - building the server'
sidebar_label: 'Build'
id: build
keywords: [getting started, basics, server, build]
tags:
    - getting started
    - basics
    - server
    - build
---

With a database and two modules (a Data Server and an Event Handler) in place to supply data to the front end, we can now build our server.

You need to add the details of the two modules to two key configuration files in your application:

- **processes.xml** file - registers the module as a part of your application and sets things like logging level
- **service definitions** file - sets the port numbers for the internal messaging

Once these files have been correctly updated, you can run a simple command to build, which is available from the gradle menu on the right of your intellij.

In your project directory, select **Tasks**/**Build/Assemble**.

![](/img/assemble-server.png)

