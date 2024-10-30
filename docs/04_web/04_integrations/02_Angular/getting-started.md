---
title: 'Angular - Getting started'
sidebar_label: 'Getting started'
sidebar_position: 1
id: getting-started
keywords: [web, integrations, angular]
tags:
    - web
    - integrations
    - angular
---

This guide enables you to create an Angular app integrated with Genesis components, micro front-ends, and PBCs.

## Setting up the Angular project

Ensure that you have [Node.js](https://nodejs.org/) and [Genx](https://learn.genesis.global/docs/getting-started/prerequisites/genx) installed on your system.

Once you have Node.js and genx, you can create a new Angular project. The example below creates a project called **myApp** using Genx with `--framework Angular`:

```shell
npx -y @genesislcap/genx@latest init myApp -s blank-app-seed --framework Angular -x
```

Navigate to your new project's **client** directory:

```shell
cd ./client
```

## Install the dependencies

1. Run the following command from your project folder:

```shell
npm run bootstrap
```

2. Start the app in development mode:

```shell
npm run dev
```

The development server launches your project and makes it available on localhost:

![Angular blank-app-seed](/integrations/angular/angular-blank-app-seed.png)

:::note
The project is currently based on Angular 18.
:::

## Project folder structure and main elements

### src/main.ts
This is the main entry point for the application. It bootstraps the app by rendering the **app.module.ts** module into the DOM. The file also registers [PBCs](../../../../server/packaged-business-capabilities/pbc-intro/) using `registerPBCs`

---

### src/pbc
This folder contains components that are responsible for enabling the insertion of slots within the application. 

These slots act as placeholders where content, provided by the registered Project Building Components ([PBCs](../../../../server/packaged-business-capabilities/pbc-intro/)), is rendered dynamically. The [PBCs](../../../../server/packaged-business-capabilities/pbc-intro/) are registered in the application through **main.ts**, ensuring that specific components can be inserted into the designated slots at runtime.

---

### src/app/share
The **share** folder holds shared resources and components that are used across the entire application. 

Key files are: 

- **genesis-components.ts**. This registers Genesis framework components, including forms, layouts, and charts.
- **foundation-login.ts**. This configures the foundation-login micro front-end component that handles authorisation and integrates it with the routing system. 

---

### src/app/pages
This folder contains the main pages of the application. Each page represents a different route or view, such as the **auth-login.component.ts**, which handles authentication-related flows.

---

### src/app/components
This folder contains reusable UI components that are utilized throughout the app. Components in this folder are not tied to specific pages but are used as building blocks across multiple sections of the application.

## Routing

In Angular, routing is essential for creating single-page applications with navigation capabilities. 

The routing configuration in **app/service/route.service.ts** manages and provides routes throughout the application. This file defines a `RouteService` service that combines routes from the main application and additional routes from PBC (Pluggable Business Components).

The `pbcRoutes` are generated dynamically by mapping over the routes provided by the PBC, extracting essential properties, and wrapping them in a `PBCContainer` component. These routes are then combined with the main application's routes into a single `allRoutes` array. 

The `RoutesProvider` uses Angular's dependency injection to make these routes available to the rest of the application by providing them through the `RoutesService`.

Additionally, the `RoutesService` is provided to access the routes within Angular components. This ensures seamless integration and accessibility of both main application routes and PBC routes throughout the application.

## Styling the application

### Global styles:
You can add global styles by modifying the main stylesheet located at `src/styles/styles.css`. This file contains styles that apply to the entire application.

---

### Component or page specific styles:
For more granular control, you can add styles specific to a page or component. For example, you can create a stylesheet for a specific page like `src/app/pages/not-permitted/not-permitted.component.scss` and include styles that only apply to that page.

---

### Design tokens

You can change design tokens, which are declared in the `src/styles/design-tokens.json` file. Design tokens allow you to define and manage design-related values such as colors, fonts, and spacing in a centralized manner. Modifying these tokens will propagate changes throughout the application where these tokens are used.

:::note
You can read more about design system here: [Design systems - introduction](../../../design-systems/introduction/)
:::

By using these methods, you can effectively manage and apply styles to your application, ensuring a consistent and maintainable design system.

## Congratulations!

🎉 Congratulations! You're now set up to use Genesis Foundation and Angular! 🎉
