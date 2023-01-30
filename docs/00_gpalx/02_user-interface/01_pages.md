---
title: "Pages"
id: pages
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Pages

## Introduction

Pages form a key part of an application interface. In this section we'll be exploring the parameters available in a page and how we can use them to get the structure we want.

The example below is a reflection of a basic UI structure generated from an application called **_alpha_**.

```kotlin
ui("alpha") {
    service(Login)

    page("Home") {
        div {}
    }
}
```

![](/img/home.PNG)

- Pages can only have a single top-level element. However, we can have as many items inside the top-level element as we like.
- A page accepts a number of parameters.
- We can specify the landing page.

## Page structure

In the example below we show only **_one_** top-level element: `div`. As you can see we can have many elements inside the `div` element, like `heading`, `h2` and `element("zero-card")`. The top-level element is not limited to a `div`. It can be any of the elements available.

```kotlin
ui("alpha") {
    service(Login)

    page("Home") {
        div("div") {
            heading("heading")
            h2("h2")
            element("zero-card") {
                heading("Card")
            }
        }

    }
}
```

![](/img/nested-2.PNG)

The following syntax, where we have more than one top-level element, would not be valid. This would result in a build error.

```kotlin
ui("alpha") {
    service(Login)

    page("Home") {
        heading("heading")
        h2("h2")
        element("zero-card") {
            heading("Card")
        }
    }

}
```

## Page parameters

:::tip
When an application is first generated, a `page` is automatically created.
:::

A `page` accepts the following options:

- **_title_** is the only mandatory parameter. When the application is first created, **_title_** will have a default value: **_Home_**, which can be changed to any title we chose.

```kotlin
page("Home") {
    div {}
}
```

![](/img/home.PNG)

- **_icon_** is always the name of the [Font Awesome icon](https://fontawesome.com/icons). In this case we are using `home`.

:::tip
It can be difficult to remember the order of the parameters, therefore you can always use the following syntax to specify which parameter you'd like to apply.
:::

```kotlin
page("Home", icon="home") {
    div {}
}
```

![](/img/home-icon.PNG)

- **_iconVariant_** refers to the type of variant for the icon. The default value is `solid`.

:::important
`iconVariant` parameter currently only supports `solid`. This will be expanded in the future.
:::

```kotlin
page("Home", icon="home", iconVariant="solid") {
    div {}
}
```

![](/img/home-icon.PNG)

- **_public_** refers to accessibility of the pages. You can set this parameter to `true` or `false`. If a page is public (`public=true`) the user does not have to be authorised to access it. If however the `public` parameter is set to false, the user must be logged in to be able to see the page.

:::note
Ensure you have used the Login service in order to be able to assert the public property of a page. If `service(Login)` is not used, all pages will be public.
:::

> In this case the **_Home_** page will not be seen by those that are not logged in. Authorised users will see both the `Home` and the `About` page.

```kotlin
page("Home", icon="home", iconVariant="solid", public=false) {
    div {}
}
page("About") {
    div {}
}
```

- A `page` has an additional parameter and that is `default`. Setting this parameter to `true` ensures this is our landing page. Setting the `default` value of `page` to `false` is not necessary because that is already the default value.

> In the example below, **_About_** will be the landing page.

```kotlin
page("Home") {
    div {}
}
page("About", default=true) {
    div {}
}
```

## Landing page

There are a number of ways we can set our landing page. As seen above, one way would be by using the `default` parameter.

However, there are a few more details to know about setting the landing or default page. Some instances to account for are seen in the examples below.

> In this example, **_Home_** will be the landing page because it is the only page.

```kotlin
page("Home") {
    heading("Home Page")
}
```

![](/img/home-alone.PNG)

> In this example **_Home_** would still be the landing page because the default page is always the first one of a list.

```kotlin
page("Home") {
    heading("Home Page")
}

page("About") {
    heading("About Page")
}

page("Contact") {
    heading("Contact Page")
}
```

![](/img/home-list.PNG)

> In this example the landing page will be **_Contact_** because we have used `defaultPage` to determine that.

:::note
Best use case for `defaultPage` is when we want to maintain the order of the pages in the navigation but want the user to land on a specific page.
:::

```kotlin
page("Home") {
    div {}
}

page("About") {
    div {}
}

defaultPage("Contact") {
    div {}
}
```

![](/img/contact-default.PNG)
