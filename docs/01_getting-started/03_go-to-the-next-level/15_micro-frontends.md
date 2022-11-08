---
title: 'Go to the next level - Micro-frontends'
sidebar_label: 'Micro-frontends'
id: micro-frontends
keywords: [getting started, quick start, next level, micro-frontends]
tags:
    - getting started
    - quick start
    - next level
    - micro-frontends
---

## Section objectives
The goal of this section is to add a micro front-end.


## Adding a micro-frontend
You can quickly add micro-frontends to you application by just adding them as a new route in your router config. 

Add a new dependency to your project by running this command in terminal:

```shell title='/client/web/'
lerna add @genesislcap/foundation-entity-management
```

In the example below, you will add routing for users to your application:

```typescript title='routes/config.ts' 
  import { Users } from '@genesislcap/foundation-entity-management';
  
  
  public configure() {
    ...
    this.routes.map(
      ...  
      {path: 'users', element: Users, title: 'Users', name: 'users'},
    );
    ...
  }
```

You then need to add the route to users to the navigation bar:

```typescript title='routes/config.ts'
  public allRoutes = [
    { index: 1, path: 'home', title: 'Home', icon: 'home', variant: 'solid' },
    { index: 2, path: 'users', title: 'Users', icon: 'users', variant: 'solid' }
  ];
```

Now you can visit `/users` in your browser, and it should take you to the **users management** page within your application.
![](/img/user-management.png)

Read more about available micro-frontends and different types of including them in the application [here](web/micro-front-ends/introduction/).

You can use the [positions app tutorial repo](https://github.com/genesiscommunitysuccess/positions-app-tutorial/tree/Complete_positions_app/client/web/src/routes) as a reference point for this chapter.