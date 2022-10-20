---
title: 'Genesis Console - Introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [console]
tags:
    - console
---

[Introduction](/operations/console/introduction/)  | [Microservices](/operations/console/microservices/) |  [Data](/operations/console/data/) | [Resources](/operations/console/resources/) | [Packages](/operations/console/packages/) | [Messages](/operations/console/messages/)

# Genesis Console
Console enables you to monitor your application with precision, enabling you to see individual processes, resources and data. You can view logs for each process, insert data, control logging levels, monitor CPU and memory usage, and examine the code of specific processes.
## Logging in
Logging into your application (instance)
Console monitors a specific application. To use Console, you will be provided with:
* The URL for Console
* Hostname (this is the instance name of the application)
* A username and password

To log in to Console:
Go to the URL provided and enter the hostname. Click on **Connect to host**. 

![](/img/con-hostname.png)

Then enter your username and password and click on **Login**. If you don't get Login page and see blank page without any response then its probably because you don't have NGINX configured, click [here](/operations/server-setup/config-management/#nginx-configuration-using-docker-imagerecommended) to configure it.

## Dashboard
By default, you see the Dashboard when you log in. This has separate graphics showing CPU usage and memory usage. (You can scroll down to view CPU usage, if necessary.) The CPU usage chart also shows how many processes are running and how many are stopped.

![](/img/con-dashboard.png)

At the top of the screen is a menu that enables you to move between different displays.
* **[Dashboard](/operations/console/introduction/#dashboard)** (This is the display you see when you log in.)
* **[Microservices](/operations/console/microservices)**
* **[Data](/operations/console/data/)**
* **[Resources](/operations/console/resources/)**
* **[Packages](/operations/console/packages/)**
* **[Messages](/operations/console/messages/)**
