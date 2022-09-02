---
title: 'Add a new page'
sidebar_label: 'Add a new page'
id: add-a-new-page
---



## Creating a new component

Each page is a component. So you need to create a new component to create a new page.

Before you start:

1. Choose a name for the component. 

2. Create a new appropriately named directory.

In the new directory,  create three new files:

- for the component itself: for example, **/new-page/new-page.ts**
- for the  layout: for example, **/new-page/new-page.template.ts**
- for the styles/css: for example, **/new-page/new-page.styles.ts**

New components will typically extend [FastElement](https://www.fast.design/docs/fast-element/defining-elements).

You'll see this in action if you go on to our Quick Start. There you will get to put code in the files and build the new page, plus some routing information.

Our Quick Start also enables you to add a grid to the new page, control the sizing and connect it to the relevant resource in the server.

![](/img/all-trades-grid-03.png)

### Configuring package.json
A `package.json` file is auto-generated for you if you created your project using `genx`.

At the top, you'll find the `name` and `description` of your application.

Following this, there are three key sections that you should check and configure as you see fit:

- config
- scripts
- dependencies


