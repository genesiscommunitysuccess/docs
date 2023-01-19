---
title: 'Services'
id: services
---

## Introduction

Services encompass a specific function with a well defined purpose. They are available to any component in the application and are used for jobs that don't involve application logic. Differentiating between services and components increases modularity but there are **_cross-cutting concerns_** we need to keep any eye out for. These can result in scattering (code duplication) or tangling (significant dependencies between systems).

## GPALX services

### Login service

Currently GPALX only offers one service but this will change in the future. The `service(Login)` prompts a screen through which the user is authenticated.

:::important
The login service is a cross-cutting concern because it is needed in almost every module of an application.
:::

The `service` helper accepts one parameter:

- **service** refers to the name of a service. In this case we use `Login`.

```kotlin
ui("Alpha Trading Dashboard") {
    service(Login)
}
```

![](/img/login-screen.PNG).

:::tip
Depending on whether you used Docker, you can apply the credentials you entered while creating the application.

![](/img/cred-screen.PNG)
:::

### Future services

In the future we will be able to write our own services as long as we comply with the service interface. This in turn could be integrated with your own internal systems. When this is a possiblity it's important to look out for services that may be cross-cutting concers.

:::tip
Some frequently occurring cross-cutting concerns are:
> **monitoring**, **logging**, **security**, **caching**, **data** **validation**, **event-handling**, **communications**, **notifications**, **localization**
:::

Here is a list of things you can do to separate your cross-cutting concerns:

- Identify the cross-cutting concerns.
- Apply the Single-responsibility Principle (SRP). 
- Applying the Don't repeat yourself Principle (DRY).

