---
title: 'Genesis containerisation - pushing the image to a registry'
sidebar_label: 'Pushing your image'
id: pushing
keywords: [containerisation, container, docker]
tags:
    - containerisation
---

If you choose to use the Gradle plugin to build the image, the Genesis low-code platform also offers a Gradle task that pushes your built image to your chosen repository.

To configure this task, provide the following settings to your **gradle.properties**

| Name | Description |
| --- | --- |
| `dockerUrl` | The URL to the repository you wish to push to |
| `dockerUsername` | Username |
| `dockerPassword` | Password |
| `dockerEmail` | Email address |
