---
title: 'Quick start - preparation'
sidebar_label: 'Preparation'
sidebar_position: 1
id: landing
keywords: [getting started, quick start, landing page]
tags:
    - getting started
    - quick start
    - landing page
---

Welcome to the quick start tutorial page. Here we are going to create a very simple application using some basic features of the Genesis Platform.

## Preparation

Before you start, make sure you have the relevant [hardware and software](../../getting-started/quick-start/hardware-and-software/).

For this tutorial please use Windows as development environment and WSL/CentOS/Docker/Genesis Intellij plugin as runtime environment

We understand that the real world has different runtime environments. Because of that, we offer different ways to do this quick start.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs defaultValue="Intellij Plugin" values={[{ label: 'Intellij Plugin', value: 'Intellij Plugin', }, { label: 'Docker', value: 'Docker', }, { label: 'WSL', value: 'WSL'}]}>
<TabItem value="Intellij Plugin">

Genesis Intellij plugin - This is the very last version of our development. The genesis intellij plugin will do all the work for you regarding the evironment setup. Using the plugin, you will not need any other software to run your application. You can download the intellij plugin directly from the Intellij marketplace or you can download [here](https://plugins.jetbrains.com/plugin/21131-genesis-platform-support).

</TabItem>
<TabItem value="Docker">

Docker containers - there are instructions for installing Rancher for Desktop (container management software) in the [Rancher documentation](https://rancherdesktop.io/). For a download, [click here](https://docs.rancherdesktop.io/). 


</TabItem>
<TabItem value="WSL">

WSL/CentOS - there are instructions for the installtion on the [installation page](../../getting-started/prerequisites/installing-wsl/).

</TabItem>
</Tabs>

Before you start, make sure you have the relevant [hardware and software](./hardware-and-software/).
For this tutorial, please use Windows as your development environment.

Once everything is installed, you can proceed to the first step of the Quick start - [Create a new project](../../quick-start/create-a-new-project/)
