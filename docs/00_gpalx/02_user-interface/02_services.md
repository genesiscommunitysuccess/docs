---
title: 'Services'
id: services
---

## Introduction

Services are **cross-cutting concerns** that provide functionality that is not specific to one page but multiple pages. Some common examples of cross-cutting concerns are:
> **monitoring**, **logging**, **security**, **caching**, **data** **validation**, **event-handling**, **communications**, **notifications**, **localization**

## GPALX services
Services are made available by the implementation of the `service` helper. It only accepts one parameter at this time: 
- **service** refers to the name of a service, like **Login** or **Analytics**

In the following example we have implemented two services:

```kotlin
ui("Alpha Trading Dashboard") {
    service(Login)
    service(Analytics) // not currently available
}
```

### Login service

Currently GPALX only offers one service, `Login`. This will be extended to other services in the future. The `Login` service integrates with the [authentication module](../../../../server/access-control/introduction/) in the backend which in turn:
- Prompts a screen through which the user is authenticated.
- Dictates the default page based on the configuration in the route parameter.
- Collaborates with the `public` parameter in [pages](../../../gpalx/user-interface/pages/#page-structure) to determine accessibility for the user. If the `public` parameter is set to false, the `Login` service, ensures that the page will only be viewed by authenticated users. 

The login service is a cross-cutting concern because it is needed in almost every module of an application. As mentioned above, the `service` helper currently accepts only one parameter:
- **_service_** - the name of the service. In this case `Login`.

<zero-card style={{background: "#292d3e"}}>

```kotlin
ui("Alpha Trading Dashboard") {
    service(Login)
}
```
![](/img/login-screen.PNG)

</zero-card>
<br/>

Enter credentials to log in. 
:::tip
>If you're using [Docker](../../../gpalx/quick-start/create-application/#configuration), you can override the default credentials with your choice of username and password.

```shell
# ? Use Docker Yes
# ? Group Id global.genesis
? User Name (JaneDee) MyUsername
? Password (beONneON*74) MyPassword
# ✔ Configuring Seed
# ✔ Writing environment variables
# ℹ Application created successfully! 🎉 Please open the application and follow the README to complete setup.
```
If you're using WSL enter the following credentials: (**_JaneDee_** | **_beONneON*74_**). 
:::

<br/>

The following is an additional parameter of the `service` helper that will be made available in the future:
- **_configure_** refers to an optional configure callback which allows for any custom logic a service may need.

The example below shows an `Analytics` service. Note the optional `configure` parameter.
```kotlin
ui("Alpha Trading Dashboard") {
    service(Analytics, {
        param: true,
        param1: "abc"
    })
}
```

### Future services

In the future you will be able to write your own services as long as you comply with the service interface. This in turn, could be integrated with your own internal systems.

The following parameters can be utilized to create your own custom services:

- **_id_** is a mandatory parameter which refers to the name of the service.
- **_route_** is an optional parameter which allows you to define a route if your service needs it.
- **_configure_** is an optional configure callback which allows for any custom logic a service may need to apply.

Follow this syntax to create a custom service. 

```shell
{
  id: ServiceType.Login,
  route: {...},
  configure: (options) => {...},
}
```
## Summary

GPALX currently only offers one service: [`service(Login)`](../../../gpalx/user-interface/services/#login-service) which is a **_cross-cutting concern_**. 
There are three additional items that will be available in the future:

- Access to an optional parameter called `configure` which will allow to you to configure an existing service offered by GPALX. 
- Additional services provided by GPALX. 
- Ability to create your own custom services in the future reliant upon the service interface.

