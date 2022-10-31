---
title: 'Genesis containerisation - introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [containerisation, container, docker]
tags:
    - containerisation
---

Yu can run a full Genesis application in a self-contained Docker container.

This page describes how to run the application in Docker, either with our helpful plugin, or creating the Dockerfile and image yourself.

## Prerequisites

- **GSF Version ≥ 6.3.0 -** You need to use at least the 6.3.0 version of the Genesis low-code platform.

- **Genesis Deploy plugin ≥ 6.3.0 -** The version of the deploy plugin is defined separately to the Genesis Framework version, and should also be at least version 6.3.0.

- **genesis-system-definition.kts values -** To deploy a Genesis App in a Docker container, you need to ensure the item `DEPLOYED_PRODUCT` is present in your **genesis-system-definition.kts**, with the value set to the name of your app.

## Limitations

Our current Docker solution is still in early development, and therefore there are a number of limitations that should be understood before deciding to use it.

**The key limitation is that Genesis currently only supports a single container deployment.**

This means that you will **not** be able to achieve the following:

- horizontal scaling
- zero-downtime High Availability
- multi-ontainer applications
