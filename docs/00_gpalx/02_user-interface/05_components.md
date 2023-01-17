---
title: "Components"
id: components
---

# Components

<!-- in pages
-- pages, layouts, charts, linking

in jira
-- pages, services, components, linking, layouts, charts -->

## Introduction

Let's talk about components. There are a number of helper components/elements supported in kotlin that we can use to create the application we want.

In this section we will look at:

- [**Dedicated helpers**](../../../gpalx/user-interface/components/#dedicated-helpers)
> All of the components supported in kotlin that have their own dedicated helper.
- [**General helper element**](../../../gpalx/user-interface/components/#helper-element): 
> A helper element that can be used for **_html tags_** and **_components_** that don't have their own dedicated helper.
- [**Attributes helper**](../../../gpalx/user-interface/components/#attributes-helper):
> An `attributes` helper that assigns specific attributes to the elements. 

Here is a summary of the elements we will be looking at. You can scroll through the documentation as it is layed out or jump to the preferred sections by clicking on the links on the left column.

| Element       | Description |
| ------------ | :----------------------------: |
| [entityManager](../../../gpalx/user-interface/components/#entitymanager) | A helper component designed to help set up a table/grid on the UI.|
| [heading](../../../gpalx/user-interface/components/#heading) | With this element you can determine the size of the heading/text. If you don't specify, the default is `h1` |
| [h1 - h6](../../../gpalx/user-interface/components/#h1-h6) | Corresponds to html `h1` to `h6` tags respectively. |
| [div](../../../gpalx/user-interface/components/#div--span) | Corresponds to html `div` tag |
| [span](../../../gpalx/user-interface/components/#div--span) | Corresponds to html `span` tag |
||
| [element](../../../gpalx/user-interface/components/#element)| Can be used for zero-components and HTML tags|
||
| [attributes](../../../gpalx/user-interface/components/#attributes)| A helper that can add attributes as pairs to the elements. |

## Dedicated helpers
 
### entityManager

Implementing this element results in a grid in the UI providing the user the ability to add, update and delete records. This helper element takes a number of parameters. 

* **entity** refers to the [Table](../../../gpalx/quick-start/add-features/#model) of data we want to see. In the example below this is called `TRADE`. This is a mandatory parameter.
* **title** refers to the title of the grid. In the example below this is called `Trades`.
* **addRows** - Includes Add rows button on the grid. The Add operation will result in a button near the grid to insert new records.
* **updateRows** - Includes Update rows button on the grid. This operation results in an additional **Edit** button being added to each row.
* **deleteRows** - Includes Delete rows button on the grid. This operation results in an additional **Delete** button being added to each row.
* ***definition*** refers to the space where we define the entity manager.

```kotlin
    entityManager(
            entity = TRADE,
            title = "Trades",
            addRows = true,
            updateRows = true,
            deleteRows = true
        ) {}
```
![](/img/basic-em.PNG)

You'll notice that the `Edit` and `Delete` buttons are not availble in the image above, even though we have set them as true. The buttons are only accessible in each row. If we add a new record by clicking on the `Add` button at the top right, we will then see the buttons.

![](/img/form.PNG)

Uppon clicking ***submit***, a new record is added and we can see the `Delete` and `Edit` buttons.

![](/img/add.PNG)

So far we have looked at a pretty basic `entityManager` element but let's look a little further. The following syntax exposes the columns in the grid. 

The options exposed inside the columns are all available in the [Table](../../../gpalx/quick-start/add-features/#model) in the Models.kt file.
We can use the following syntax to:
 - apply a renderer in the already existing columns. In this case we have applied the `BuySell` renderer to the `side` column and the `TradeStatus` renderer to the `tradeStatus` column.
 - modify the title in the already existing columns. In this case we have updated the title of `tradeStatus` to **Status** instead of its previous name **Trade Status**.
 - add another column. In this case we have used `actionColumn` to add a `Cancel` button and determined its apperance. 

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

As the name suggests, this element is focused on the size and apperance of the text. This element accepts a number of parameters. 
- ***text*** refers to the text we wish to display. This is the only mandatory parameter.
- ***headingSize*** refers to the size for the text. This accepts a range of values from 1 to 6. They are equivalent to `h1` to `h6` html tags.
- ***id*** refers to a unique id for an element which sets the "id" attribute in an html tag.
- ***handler*** refers to the space where we define the element and insert any child elements.

In this example we only give the heading element one parameter: `text`. The default value of the text size is 1, which is the equivalant of `h1` html tag. 
```kotlin
heading("Default Heading Size")
```
![](/img/heading.PNG)

We can determine the text size by applying the following syntax.

:::note
The heading elements are all sorrounded by a `div` element. This is necessary because a `page` can only have on top-level element.
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

Elements `h1`, `h2`, `h3`, `h4`, `h5` and `h6` correspond to html `h1`, `h2`, `h3`, `h4`, `h5` and `h6` tags respectively. Each element accepts the following parameters:

- ***text*** refers to the text we wish to display. This is the only mandatory parameter.
- ***id*** refers to a unique id for an element which sets the "id" attribute in an html tag.
- ***handler*** refers to the space where we define the element and insert any child elements.

```kotlin
h1("h1")
```

![](/img/h1.PNG)

<!-- h1("this is in an h1 element") -->

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

The elements `div` and `span` correspond to the `div` and `span` html tags. 

`div` defines a devision or a section of the page. It accepts the following parameters:
- ***text*** display text
- ***id*** specifies a unique id for an element
- ***handler*** refers to the space where we define the element and insert any child elements.

```kotlin
div("div", "div")
```
![](/img/div.PNG)

We've applied a border in the image below to demonstrate a div element. We've achieved this by implementing `attributes`. For more details see the [attributes](../../../gpalx/user-interface/components/#attributes) element below. 

```kotlin
div("div") {
    attributes("style" to "border: solid 3px purple")
}
```
![](/img/div-attr.PNG)

`span` is a generic inline container for phrasing content.

- ***text*** display text
- ***id*** specifies a unique id for an element
- ***handler*** refers to the space where we define the element and insert any child elements.

```kotlin
span("span")
```
![](/img/span.PNG)

## Helper element
### element

`element` is a helper element or component that can be used for any **_html tags_** and **_components_** that don't have their own dedicated helper. In this case we can use `element` for all of the ***zero-components***. It takes the following parameters:

- ***element*** refers to the name of the element we want to create 
- ***text*** refers to the text we want to display within the element
- ***id*** specifies a unique id for an element
- ***handler*** refers to the space where we define the element and insert any child elements.

```kotlin
element("zero-card", "This is a zero-card web component")
```
![](/img/element.PNG)

```kotlin
div() {
    element("button", "html button")
    element("br")
    element("zero-button", "zero button")
}
```
![](/img/buttons.PNG)

```kotlin
div() {
    element("a", "The Html Anchor Element") { 
        attributes("href" to "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a", 
        "style" to "color: white") 
    }
    element("br")
    element("zero-anchor", "The Zero-Anchor Element") {
        attributes("href" to "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a", 
        ) 
    }
}
```

![](/img/anchor.PNG)


As seen in the examples above, the `element` component can be used for any html tag. Notice the addition of the `attributes` helper to our syntax. We can use this helper to add any of the properties required to create our element. For more details see [***attributes***](../../../gpalx/user-interface/components/#attributes).

Now let's create a form using the `element` component. 
```kotlin
div() {
    element("h1", "The form element")
    element("form") {
        element("label", "First Name: ") {
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

        element("label", "Last Name: ") {
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
        element("button", "Submit") {
        }
    }

}
```

![](/img/form-h1.PNG)


## Attributes helper 

### attributes

The `attributes` helper is a component strictly focused on adding attributes as pairs to the HTML element. As you saw in the previous example, this helper is defined within the handler of the element we want to apply it to. 
It has the following syntax:

```kotlin
element("div", "this div has attributes") {
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

- add specific attributes used in html tags. See the form we created in [`elements`](../../../gpalx/user-interface/components/#element).

```kotlin
element("input", id="lname") {
    attributes(
        "type" to "text"
    )
}
```

- add already exposed `width` and `height` style independent of the `style` property.
```kotlin
element("div") {
    attributes(
        "height" to "50%"
    )
}
```