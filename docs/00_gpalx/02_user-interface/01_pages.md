---
title: "Pages"
id: pages
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Pages

## Introduction

Now that we've created an app using the quick start guide, we can continue building upon the [auto-generated](../../../gpalx/quick-start/add-features/#simple-ui-changes) basic ui-structure.

The example below is a reflection of a basic ui structure created from an application called **_alpha_**, with an added `defaultPage`. In this section we will be focusing on **Pages**.

:::note
- Pages can only have a single top-level element. As seen in the code block below, there is only one `div {}` element. However, we can have as many items inside the top level element as we like. 
- A page accepts a number of parameters. These parameters differ slightly between the types of pages there are available.
- There are two types of pages we can use: `page` & `defaultPage`.
:::
<!-- ```kotlin
ui("alpha") {
    service(Login)

    page("Home") {
        div {}
    }
}
``` -->
```kotlin
ui("alpha") {
    service(Login)

    page("Home") {
        div {}
    }

    defaultPage("About") {
        div{}
    }
}
```
<!-- ![](/img/home.PNG) -->

![](/img/home-about.PNG)

## Types of pages

<Tabs>
<TabItem value="Page" label="Page" default >

:::tip
When an application is first generated, a `page` is automatically created.
:::

A `page` accepts the following options: 
- ***title*** (this has been generated with the title: `Home` when the application was created but can be changed to any title we chose).
```kotlin
page("Home") {
    div {}
}
```
![](/img/home.PNG)

- ***icon*** is always the name of the [font awesome icon](https://fontawesome.com/icons). In this case we can use `home`
```kotlin
page("Home", "home") {
    div {}
}
```
![](/img/home-icon.PNG)

- ***iconVariant*** refers to the type of variant for the icon. The default value is `solid`. 
:::important
`iconVariant` parameter currently only supports `solid`. This will be expanded in the future.
:::
:::tip
It can be difficult to remember the order of the parameters, therefore you can always use the following syntax to specify which parameter you'd like to apply.
::: 
```kotlin
page("Home", "home", iconVariant="solid") {
    div {}
}
```
![](/img/home-icon.PNG)

- ***public*** refers to accessibility of the pages. You can set this to `true` or `false` depending whether or not you want others to be able to view the page you've just created.

:::note
- This option is ***not*** available in `defaultPage`. A `defaultPage` is the landing page of the application, therefore  users should always see it. 
:::
> In this case the ***Home*** page will not be seen by others.

```kotlin
page("Home", "home", iconVariant="solid", public=false) {
    div {}
}
page("About") {
    div {}
}
```
- A `page` has an additional parameter which we do not see, and that is `default`. On a `page`, `default` is always set to false. This means that it will not be the landing page of the application unless it is the only one, or the first one in a list of pages.

<!-- - ***build*** is another parameter that we do not need to worry about. This is a lambda function where the page structure is defined -->

> In the example below, ***Home*** will be the landing page. If it was the only page, it would also be the landing page. 

```kotlin
page("Home") {
    div {}
}

page("About") {
    div {}
}

page("Contact") {
    div {}
}
```

</TabItem>

<TabItem value="DefaltPage" label="DefaultPage" >

A `defaultPage` sets the landing/home page. 

:::important
Contrary to a `page`, its hiddden `default` property is set to true. 
:::

A `defaultPage` is very similar to a `page`, with only the following differences: 

- ***public*** is not available as an option, because a `defaultPage` is always public. 
- When there is a `defaultPage` present, it takes priority as a landing page. 

> In this case ***About***, is the landing page.

```kotlin
page("Home") {
    div {}
}

page("Contact") {
    div {}
}

defaultPage("About") {
    div {}
}
```
</TabItem>
</Tabs>

## Summary

A `page` and a `defaultPage` are very similar except for some slight differences. 

| page | defaultPage | 
| :---: | :---: |
| `title` | `title` |
| `icon` | `icon` |
| `iconVariant` | `iconVariant` |
| `default` (hidden value set to ***false***) | `default` (hidden value set to ***true***) |
| `public` |