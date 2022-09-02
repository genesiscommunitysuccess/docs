---
title: 'Micro-frontends'
sidebar_label: 'Micro-frontends'
id: micro-frontends
---

You can quickly add micro-frontends to you application by just adding them as a new route in your router config. 

Add a new dependency to your project by running this command in terminal:

```shell title='/client/web/'
lerna add @genesislcap/foundation-entity-management
```

In the example below, you will add routing for users to your application:

```typescript title='routes/config.ts' 
  import { Users } from '@genesislcap/foundation-entity-management';
  
  public configure() {
    this.title = 'Positions';
    this.defaultLayout = defaultLayout;
    this.routes.map(
      {path: '', redirect: 'protected'},
      {path: 'login', element: Login, title: 'Login', name: 'login', settings: {public: true}, childRouters: true, layout: loginLayout},
      {path: 'users', element: Users, title: 'Users', name: 'users'},
    );
```

Now you can visit `/users` in your browser, and it should take you to the **users management** page within your application.
![](/img/user-management.png)

Read more about available micro-frontends and different types of including them in the application [here](/front-end/micro-front-ends/introduction/).
