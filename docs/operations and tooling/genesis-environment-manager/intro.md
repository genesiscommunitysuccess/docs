---
id: intro
sidebar_label: 'Introduction'
sidebar_position: 10
title: 'Introduction'
---

# Genesis Environment Manager
GEM is the Genesis Environment Manager. You can use it to start, stop, schedule and monitor instances on the AWS servers. By instances, we mean server hosts running our applications, UAT, Dev and (if you are an admin user) infrastructure.

## Starting GEM
To log on to GEM:

From your Azure desktop, click on the **Open VPN** icon, and supply your password and authentication digits from the RAS Authenticator. This opens a VPN connection from your Azure desktop to the AWS servers.

Open a private or incognito browser window. Then go to:
https://gem
You can log in with your Genesis user name and password.


:::warning
Never try to VPN to GEM directly from a private machine. Always make sure you start from your Azure Desktop.
:::

## The main dashboard
The main screen is the dashboard, where the main panel shows every single EC2 box (instance) that we operate on AWS. 

You can scroll through the list using the scroll bar at the extreme right.

You can scroll across the columns of information (left to right and back) using the scroll bar at the bottom of the main panel. At the right side of the panel is a set of start and stop buttons. These are always visible, even when you scroll across the columns.

![](/img/GEM1.png)

## Seeing the instances you want

At the top of the panel, you can use the Search box at the top left to filter the list. For example, if we search for FICC, the list is reduced to a few instances:

![](/img/GEM2.png)

You can also use the filter buttons next to the Search box.

* **Environment** defaults to **All**, but you can filter this to show only UAT, QA, Production, Infrastructure, Development, Build or Demo.

* **In Use** defaults to **All**, but you can filter it to show either those that are in Use (which have at least one user) or those which are not in use.

* **State** defaults to **All**, but you can filter it show only those whose state is up or those which are down.

## Columns

Most columns in the main panel are self-explanatory:

* **Running**. The green tick indicates an instance that is running and a red cross indicates one that is not running.

* **Users**. This shows the number of users who have requested to use the instance. If you click on this instance in the main panel, the user IDs of the users are listed in the Instance Users panel at the lower left of the screen.

* **Product**. This is the name of the product or infrastructure component.

* **Client**. If this is our own box, this will say Genesis. If it is a client’s product, this shows the client’s name.

* **Env**. Indicates the type of box (infrastructure, UAT, Production, etc)

* **Node ID**. Some of our production sites are clustered, or have different regional nodes. Where this is the case, each node is displayed on a separate line.

* **Location**. This is derived from the region, which is defined by AWS.

* **Availability Zone**. This is where the relevant Amazon data centre is located within the region.

* **Instance name**. The is the hostname in AWS.

* **Type**. This indicates the size of the box – CPU, RAM, etc. – this is an AWS specification.

* **Internal IP**. The internal IP address of the box within AWS (assigned by AWS).

* **Secondary IP**. The IP address that we assign to the hostname.

* **PuTTy**. Where there is an entry in this column, you can click on it to start a PuTTy session on the instances.

* **Console**. If there is an icon in this column for an instance, you can click to start Console to examine the instance in detail.

* **Public IP**. If the box can be accessed over the internet, this is its public IP address.

## Start and stop buttons

:::warning
Check your permissions. Only admin users can stop and start a production instance. Do not try to stop a production instance unless you are expressly dealing with a known issue. Even if you are admin user, don’t assume you can stop an instance without good reason.
:::

To the right of the columns in the main panel is a set of buttons that enable you to start and stop instances and to control monitoring. Hover over a button to see what it does.

From left to right, these are:

* **Request box**

* **Release box**

* **Start instance**

* **Stop instance**

* **Start monitoring**

* **Stop monitoring**

The first two buttons are for Dev instances where more than one user could be working on the box. **Request box** starts the instance automatically if it is not already running. If the box is already running, clicking on **Request box** registers you as another user on the instance.

Following this, if you click on **Release box**, GEM checks to see of there are any other registered users. If there are other users, the instance stays running. If there are no other users, GEM stops the instance.

**Start instance** and **Stop Instanc**e do exactly what the button says. Use these with extreme care. Always think twice.

**Start Monitoring** and **Stop Monitoring** also do exactly what they say, but you need to look more closely (below) at the wonderful world of monitoring.

## Monitoring
Monitoring ensures that Genesis is alerted if the instance goes down, if any Genesis processes go into a bad state, or certain other issues occur. We use Prometheus as a monitoring system.

For any production or UAT instance that starts via a scheduled run, monitoring starts automatically.

Use the **Start Monitoring** and **Stop Monitoring** buttons to start or stop monitoring manually. Why would you want to stop monitoring an instance? If you were working  to upgrade or address an issue, then stopping monitoring stops you being pestered by alerts every time you start or kill a service.

Note that monitoring never starts immediately. It allows a couple of minutes to give the instance time to be fully active.
