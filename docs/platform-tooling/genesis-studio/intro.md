---
id: intro
sidebar_label: 'Introduction'
sidebar_position: 10
title: 'Introduction'
---

# Genesis Studio

Genesis Studio is a browser based Low Code / No Code [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG) 
application builder for the Genesis platform.

![masthead-slice](/img/genesis-studio-banner.png "Gensis Studio")

Take a tour of [Genesis Studio](#) in a sand-boxed environment. [^1]

## Functionality

- [Routes](routes.md)
- [Pages](pages.md)
- [Layouts](layouts.md)
- [Components](components.md)
- [Data Binding](data-binding.md)
- [Events](events.md)
- [Authentication](authentication.md)
- [App Settings](settings/app.md)
- [Source Control Settings](settings/source-control.md)
- [Deployment Settings](settings/deployment.md)

[^1]: Live Genesis Studio Sandbox is coming soon. [Register to get notified](https://genesis.global/contact-us/) 

## Introducing Genesis Studio
The Genesis Studio enables you to create key parts of your application at speed with simple visual tools.

* For your front end, you can define pages and their relationships. Then you can build the content of each page to include headings, grids, buttons, etc.

* For your back end (server), you can define the fields, tables and views in your data model, and configure your states and the transitions between them. You can also configure custom modules and deploy the server to your chosen environment.

## Getting oriented
Log in to the Genesis Studio using the username and password supplied.

The **Home** page lists any projects you are working on. Each application you want to develop is a separate project. 

Simply click **Edit** for the project you want to work on. This displays the work area for your application.

![](/img/Studio1Landing.png)

### Top menu
The menu at the top shows the following options:

![](/img/studio-menu-1.png)

To the right at the top is a collection of useful icons and controls:

![](/img/studio-controls.png)


* **Last deployment** indicates whether the last deployment was successful (tick) or unsuccessful (cross).

* **Alerts** indicates whether any alerts have been generated (for example, if you have saved a table without a primaryKey. If there any alerts, this icon displays the number of unread notifications.

* **Settings** enables you to export the complete project to an external directory and to make key settings for the project.

* **Username** enables you to log out.

### Settings
Clicking on the **Settings** button enables you to export your files and to make key settings.

**Export** copies the whole project to the external directory that you specify.

**Settings** gives you two options:

* **Connection** enables you to specify the URL and port of the server API.
* **Project** enables you to set the Home page and to define key aspects of the appearance of the user interface.

**Connection** requires a URL and port number:
![](\img\settings-connection.png)

**Project** provide s settings for themes, location of your logo, location of navigation, etc.
![](\img\settings-project.png)


### Routes
This is where you define the pages of your user interface.

![](/routes1.png)

To add a new page, click on **Add Page**.

This displays a set of page properties that you need to specify

![](/routes2.png)


* **Title in navigation**. Enter a title that describes the page, for example, _Trade Blotter_.

* **URL path**. Specify a path that begins at the home page.

* **Navigation icon**. Click to choose an icon from the drop-down list.

* **Location in nav**. Click to set this to **Top**, **Secondary** or **Component Only**.

* **Route permissions**. You can set the **is public** radio button to on or off.

* **Default route** (this is not set here – use the **Settings** link.

Your changes remain in memory only until you click on **Save Changes**.

### Pages

In this area, you can configure the pages that you created in the Routes area. 


![](/img/s.png)

On the right are the page properties that were set in the [Routes](/platform-tooling/genesis-studio/intro/#routes) area when the page was created.

### Adding components
All you need to do is select the component from the list on the left and then configure it as required.
Below, we have added a heading (**Trade Blotter**) and we have just selected to add a grid. The tables that the supply data to the grid are listed on the left:


![](/img/Studio5.png)

Here we have chosen the table ALL_TRADES_VIEWS:

![](/img/Studio6.png)


Here we are adding a Select box. Entering a field and value on the the right and clicking on the **+** button enbables you to add the logic.

![](/img/Studio7.png)

Here we have added a button (which we have labelled **Export**).


![](/img/Studio8.png)

And finally, we have added a text field (which has the text **dd/mm/yy**).

If you want to keep the changes you have made, make sure you click on **Save**.

### Schema
This area enables you to configure fields, tables and views.

First, take a look at the control buttons at the top, beneath the menu bar.

![](\img\schema-menu.png)

### So what do  you see?
Existing schema details (if any) are displayed in the main area of the screen. This example shows the fields and tables in a large schema:

![](/img/Studioschema1.png)

At the bottom right corner is a high-level view of the whole schema. In many cases, your schema will be too big to view in one place. This view enables you to see what you are viewing in the main area. You can click inside the high-level view to move to a different part, or you can click and drag the main view to move smaller distances.

There are two different ways of looking at the schema, which can be chosen from the first of the control buttons above the main area:

* **Fields and tables** As seen in the previous example.

* **Views** As seen in the example below. 


![](/img/Studioschema1.png)

The different modules in the application are listed on the left. You can click on a module to list the relevant views for that module, which you can then select to display.
In this case, we are looking at the POSITIONS module, which has two views; we have selected to display the view called TRADES_VIEW. 

To add a field to a table:

1. Click on **Tables** above the left menu and select the table you want to modify.
2. Click on **Fields** above the menu on the left to display the fields.
3. Scroll down to the field you want to add, then click and drag it into the table.


![](/img/studio-schema-add-field.png)

In the tables display, each field has three dots on the left side. You can click on the dots for a field to select:

* make the field the primaryKey
* view the field properties
* delete the field

![](/img/schema-field-options.png)


### State

Clicking on **State** in the top menu enables you to configure states and the permitted transformations between states. 


![](\img\studio-states1.png)

