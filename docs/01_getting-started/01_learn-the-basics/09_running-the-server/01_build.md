---
title: 'Build'
sidebar_label: 'Build'
id: build
---

With a database and two modules (Data Server and Event Handler) in place to supply data to the front end, we can now build our server.

The details of the two modules need to be added to your application's:

- **processes.xml** file: effectively, this registers the module as part of your application and sets things like logging level
- **service definitions** file: this sets port numbers for internal messaging

That's it. Once these files have been correctly updated, you can run a simple command to build, which is available from the gradle menu on the right of your intellij:

**replace image below with the correct image
![](/img/simple-1.png)

