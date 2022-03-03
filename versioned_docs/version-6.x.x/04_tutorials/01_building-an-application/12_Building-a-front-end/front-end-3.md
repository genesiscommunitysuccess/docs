---
id: front-end-3
title: Running the application locally
sidebar_label: Running the application locally
sidebar_position: 3

---


Now you are ready to run the application you have created for the front end.

From the workspace root, run:
```
$ npm run bootstrap
```

Next, change to the **positions** directory and spin up the dev server:

```
$ cd ./packages/apps/positions/client/web
$ npm run dev
```

The application will open at `http://localhost:6060/login`.
![](/img/btfe--positions-example--login.png)

Providing your `API_HOST` has been configured correctly, you'll be able to log in and view the following screen:

![](/img/btfe--positions-example--home.png)

### The Positions Grid
The template for the home page is located in the application's **routes** directory `positions/client/web/src/routes/home/home.template.ts`.


![](/img/btfe--positions-example--home-route.png)

In the template, we define the `positionColumnDefs`for the Genesis AG Grid. This is where we can apply column-specific configurations, such as sorting and cell-change flashing. You can find more information on column definitions in the [Genesis AG Column](/creating-applications/defining-your-application/user-interface/web-ui-reference/components/grids/ag-grid/ag-genesis-column/) documentation.

![](/img/btfe--positions-example--column-defs-b.png)

These column definitions are used in the `HomeTemplate`, where we configure the [ag-genesis-datasource](/creating-applications/defining-your-application/user-interface/web-ui-reference/components/grids/ag-grid/ag-genesis-datasource/) template directive.

![](/img/btfe--positions-example--grid-template-b.png)

<!-- TODO: we may want to move this to the WEB UI reference section? -->
### Application structure

For information, just take a quick look at the structure of the application. It is broken down into the following directories:

- components - application-specific components focused on building functionality, with minimal styling applied
- design-system - used to align components to your brand or product; you can create multiple design systems that each uses a different set of components
- main
- routes
- services
- utils

