---
title: "Components"
id: components
---

# Components

## Introduction

GPALX supports a number of UI components for building a variety of applications.

In this section we will look at:

- [**Dedicated helpers**](../../../gpalx/user-interface/components/#dedicated-helpers)
> All of the components supported by GPALX that have their own dedicated helper.
- [**General helper element**](../../../gpalx/user-interface/components/#helper-element): 
> A helper element that can be used for **_HTML tags_** and **_[Foundation Zero design system](https://pr-927.d3i6ahf2flvvg.amplifyapp.com/docs/next/web/web-components/overview/) components_** that don't have their own dedicated helper.
- [**Attributes helper**](../../../gpalx/user-interface/components/#attributes-helper):
> An `attributes` helper that assigns specific attributes to the elements. 

Here is a summary of the helpers we will be looking at. You can scroll through the documentation as it is layed out or jump to the preferred sections by clicking on the links on the left column.

| Helper       | Description |
| ------------ | :----------------------------: |
| [entityManager](../../../gpalx/user-interface/components/#entitymanager) | A helper component designed to quickly add support for CRUD operations (Create, Read, Update, Delete) by automatically generating grid and form.|
| [heading](../../../gpalx/user-interface/components/#heading) | With this element you can determine the size of the heading/text. If you don't specify, the default is `h1` |
| [h1 - h6](../../../gpalx/user-interface/components/#h1-h6) | Corresponds to HTML  `h1` to `h6` tags respectively. |
| [div](../../../gpalx/user-interface/components/#div--span) | Corresponds to HTML  `div` tag |
| [span](../../../gpalx/user-interface/components/#div--span) | Corresponds to HTML  `span` tag |
||
| [element](../../../gpalx/user-interface/components/#element)| A helper component that can be used for [Foundation Zero design system](https://pr-927.d3i6ahf2flvvg.amplifyapp.com/docs/next/web/web-components/overview/) components and HTML tags (`p`, `ul`, `form`, `input`, `a` etc).|
||
| [attributes](../../../gpalx/user-interface/components/#attributes)| A helper that can modify an existing element by adding attributes to it.|

## Dedicated helpers
 
### entityManager

Implementing this element results in a grid and form in the UI, providing the user the ability to create, read, update and delete records. This helper element takes a number of parameters. 

- **entity** refers to the [Table](../../../gpalx/quick-start/add-features/#model) of data we want to see. In the example below this is called `TRADE`. This is a mandatory parameter.
- **title** refers to the title of the grid. In the example below this is called `Trades`.
- **addRows** - The Add parameter will result in an `Add` button above the grid which enables us to insert new records.
- **updateRows** - The Update parameter results in an additional `Edit` button on each row.
- **deleteRows** - The Delete parameter results in an additional `Delete` button on each row.
- optional configuration block -  can be used to perform further customisation / configuration.

```kotlin
    entityManager(
            entity = TRADE,
            title = "Trades",
            addRows = true,
            updateRows = true,
            deleteRows = true
        )
```
![](/img/basic-em.PNG)

You'll notice that the `Edit` and `Delete` buttons are not availble in the image above, even though we have set them as true. The buttons are only accessible in each row. If we add a new record by clicking on the `Add` button at the top right, we will then see the buttons.

![](/img/form.PNG)

Uppon clicking `Submit`, a new record is added and we can see the `Delete` and `Edit` buttons.

![](/img/add.PNG)

So far we have looked at a pretty basic `entityManager` element but let's look a little further. The following syntax exposes the columns in the grid. 

The fields exposed inside the columns are all available in the [Table](../../../gpalx/quick-start/add-features/#model) in the Models.kt file.
We can use the following syntax to:
 - Apply a renderer in the already existing columns. In this case we have applied the `BuySell` renderer to the `side` column and the `TradeStatus` renderer to the `tradeStatus` column.
 - Modify the title in the already existing columns. In this case we have updated the title of `tradeStatus` to **Status** instead of its previous name **Trade Status**.
 - Add another column. In this case we have used `actionColumn` to add a `Cancel` button and determine its apperance. 

```kotlin
  entityManager(
            entity = TRADE,
            title = "Trades",
            addRows = true,
            updateRows = true,
            deleteRows = true
        )   {
            columns {
                side renderer BuySell
                tradeStatus renderer TradeStatus title "Status"
                tradeDateTime title "Date"

                actionColumn {
                    button("Cancel") {
                        onClick(Cancelled)
                        appearance = WARNING
                    }
                }
            }
        }
```
![](/img/columns.PNG)

There is one more thing we can do with `actionColumn`. We can disable buttons based on the permissions of the user. If the user does not have the permissions we check against, the button will be disabled. 

```kotlin
actionColumn {
    button("Cancel") {
        onClick(Cancelled)
        appearance = WARNING
        enabled {
            user.hasPermissions(Permissions.TRADE.Cancelled)
        }
    }
}
```
![](/img/enabled.PNG)

### heading

As the name suggests, this element can be used to control the size and apperance of the text. This element accepts a number of parameters. 
- ***text*** refers to the text we wish to display. This is a mandatory parameter.
- ***headingSize*** refers to the size for the text. This accepts a range of values from 1 to 6. They are equivalent to `h1` to `h6` HTML tags.
- ***id*** refers to a unique id for an element which sets the "id" attribute in an HTML tag.
- optional configuration block - can be used to perform further customisation / configuration. For instance we can add a `span` element inside this block.

    ```kotlin
    heading("This is a heading element") {
        span("This is a span element")
    }
    ```
    ![](/img/heading-span.PNG)

In this example we only give the `heading` element one parameter: `text`. The default value of the text size is 1, which is the equivalant of the `h1` HTML tag. 
```kotlin
heading("Default Heading Size")
```
![](/img/heading.PNG)

We can determine the text size by applying the following syntax.

:::note
The `heading` elements are all sorrounded by a `div` element. This is necessary because a `page` can only have one top-level element.
:::

```kotlin
div() {
    heading("Heading size is 1", headingSize=SIZE_1)
    heading("Heading size is 2", headingSize=SIZE_2)
    heading("Heading size is 3", headingSize=SIZE_3)
    heading("Heading size is 4", headingSize=SIZE_4)
    heading("Heading size is 5", headingSize=SIZE_5)
    heading("Heading size is 6", headingSize=SIZE_6)
}
```
![](/img/headingSize.PNG)

### h1-h6

Elements `h1`, `h2`, `h3`, `h4`, `h5` and `h6` correspond to HTML `h1`, `h2`, `h3`, `h4`, `h5` and `h6` tags respectively. Each element accepts the following parameters:

- ***text*** refers to the text we wish to display. This is a mandatory parameter.
- ***id*** refers to a unique id for an element which sets the "id" attribute in an HTML tag.
- optional configuration block - can be used to perform further customisation / configuration.

```kotlin
h1("h1")
```

![](/img/h1.PNG)

```kotlin
div() {
    h2("this is in an h2 element")
    h3("this is in an h3 element")
    h4("this is in an h4 element")
    h5("this is in an h5 element")
    h6("this is in an h6 element")
}
```
![](/img/h2-h6.PNG)


### div & span

The elements `div` and `span` correspond to the `div` and `span` HTML tags. 

`div` defines a section of the page. It accepts the following parameters:
- ***text*** refers to the text we wish to display.
- ***id*** specifies a unique id for an element.
- optional configuration block - can be used to perform further customisation / configuration.

```kotlin
div("div")
```
![](/img/div.PNG)

We've applied a border in the image below to demonstrate a `div` element. We've achieved this by implementing `attributes`. For more details see the [`attributes`](../../../gpalx/user-interface/components/#attributes) helper below. 

```kotlin
div("div") {
    attributes("style" to "border: solid 3px purple")
}
```
![](/img/div-attr.PNG)

`span` is a a generic inline element used for grouping and stylizing text. As a result it will only occupy as much space as the text.

- ***text*** refers to the text we wish to display.
- ***id*** specifies a unique id for an element.
- optional configuration block - can be used to perform further customisation / configuration.

```kotlin
span("span")
```
![](/img/span.PNG)

## Helper element
### element

`element` is a helper element or component that can be used for any **_HTML tags_** and **_components_** that don't have their own dedicated helper. In this case we can use `element` for all of the [Foundation Zero design system](https://pr-927.d3i6ahf2flvvg.amplifyapp.com/docs/next/web/web-components/overview/) components. It takes the following parameters:

- ***element*** refers to the name of the element we want to create. This is a mandatory parameter.
- ***text*** refers to the text we want to display within the element.
- ***id*** specifies a unique id for an element.
- optional configuration block - can be used to perform further customisation / configuration.

```kotlin
element("zero-card", text="This is a zero-card web component")
```
![](/img/element.PNG)

```kotlin
div() {
    element("button", text="html button")
    element("br")
    element("zero-button", text="zero button")
}
```
![](/img/buttons.PNG)

```kotlin
div() {
    element("a", text="The Html Anchor Element") { 
        attributes("href" to "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a", 
        "style" to "color: white") 
    }
    element("br")
    element("zero-anchor", text="The Zero-Anchor Element") {
        attributes("href" to "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a", 
        ) 
    }
}
```

![](/img/anchor.PNG)


As seen in the examples above, the `element` component can be used for any HTML tag. Notice the addition of the `attributes` helper to our syntax. We can use this helper to add any of the properties required to create our element. For more details see [`attributes`](../../../gpalx/user-interface/components/#attributes).

Now let's create a form using the `element` component. 
```kotlin
div() {
    element("h1", text="The form element")
    element("form") {
        element("label", text="First Name: ") {
            attributes(
                "for" to "fname"
            )
        }
        element("input", id="fname") {
            attributes(
                "type" to "text"
            )
        }
        element("br")
        element("br")

        element("label", text="Last Name: ") {
            attributes(
                "for" to "lname"
            )
        }
        element("input", id="lname") {
            attributes(
                "type" to "text"
            )
        }
        element("br")
        element("br")
        element("button", text="Submit") {
        }
    }

}
```

![](/img/form-h1.PNG)


## Attributes helper 

### attributes

`attributes` is a helper strictly focused on adding attributes to the HTML element. As you saw in the previous example, this helper is defined within the configuration block of the element we want to apply it to. 
It has the following syntax:

```kotlin
element("div", text="this div has attributes") {
    attributes(
    "style" to "border: solid 3px purple",
    "height" to "50%"
    )
}
```
![](/img/attr.PNG)

For style properties `width` and `height` we are able to assign them independently of the `style` property. We can also use `style` to apply them. 

We can use `attributes` to:

- add our own custom styles to the elements.

```kotlin
element("div") {
    attributes(
        "style" to "border: solid 3px purple"
    )
}
```

- add specific attributes used in HTML tags. See the form we created in [`element`](../../../gpalx/user-interface/components/#element).

```kotlin
element("input", id="lname") {
    attributes(
        "type" to "text"
    )
}
```

- add already exposed `width` and `height` styles, independent of the `style` property.
```kotlin
element("div") {
    attributes(
        "height" to "50%"
    )
}
```