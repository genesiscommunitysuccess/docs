---
title: 'Linked UI components'
id: linked-ui-components
---

# Linked UI components

## Introduction

With GPALX it is possible to link UI components such as grids and form inputs. Linking allows us to update one component based on the status of another component.

Common use cases are:

- Updating one grid, based on selected row in another one
- Disabling one form field, based on selection in another one
- Restricting possible options in one form field, based on selection in another one

Linking is a two-step process:

1. Assign a name to a component.
2. Reference the name when configuring another component.

Let's build a simple example to see this in practice.

## Linked grids

We need a page with two grids for this example. We will extend the [home page](../../../gpalx/quick-start/add-features/#grid) from the quick start guide to contain one more grid.

First, let's add `Instrument.kt` file to `src/main/kotlin/global/genesis/alpha/model` folder.

```kotlin
package global.genesis.alpha.model

import global.genesis.gpl.api.schema.Persist
import global.genesis.gpl.api.schema.Table

@Persist
object INSTRUMENT : Table(11_001) {
    val instrumentId by varchar().nonNullable()
    val instrumentName by varchar().nonNullable()
    val marketId by varchar()
    val countryCode by varchar()
    val currencyId by varchar()
    val assetClass by varchar()

    override val primaryKey by primaryKey(instrumentId)
    val instrumentNameKey by uniqueIndex(instrumentName)
}
```

Now, let's update the home page layout to display both grids at the same time:

```kotlin
page("Home") {
    verticalLayout {
        entityManager(
            entity = INSTRUMENT,
            title = "Instruments",
            addRows = true,
        )

        entityManager(
            entity = TRADE,
            title = "Trades",
            addRows = true,
        )
    }
}
```

You should now have a page similar to below. At this point, the two grids are independent. Let's see how we can link them in the next section.

![](/img/gpl-seed-grids.png)

## Assigning a name

The first step in linking is to give an element a name. To name an element, simply assign it to a Kotlin variable.

:::caution
Note that we use `by` keyword instead of `=` here to capture more information about the property.
:::

```kotlin
// highlight-next-line
val instrumentGrid by entityManager(
    entity = INSTRUMENT,
    title = "Instruments",
    addRows = true,
)
```

## Referencing UI elements

Once we have a name, we can use it when configuring other elements. Let's configure filtering in the trade grid, based on row selection in the instrument grid:

```kotlin
entityManager(
    entity = TRADE,
    title = "Trades",
    addRows = true,
) {
    // highlight-start
    filter {
        instrumentId eq instrumentGrid.entity.instrumentId
    }
    // highlight-end
}
```

Both trades and instruments have the `instrumentId` field. Here, we restrict displayed trades to only those with the `instrumentId` matching that of the selected instrument.

## Filtering

Let's look at `filter` block in more detail. It allows us to configure precisely the data displayed in a grid:

```kotlin
filter {
    side eq Side.BUY
}
```

We can combine multiple conditions and use the same [conditional operators](../../../gpalx/features/aggregation/#simple-conditions) as when configuring aggregation (`eq`, `neq`, `gt` etc.):

```kotlin
filter {
    side eq Side.BUY
    quantity gte 50
}
```

Grids provide an `entity` property e.g. `instrumentGrid.entity`. It refers to the selected row in that grid (if any).

Entity property conforms to the same data model you have configured for your grid. In this case, `instrumentGrid` uses `INSTRUMENT` model, so you will be able to access all the instrument model fields such as `instrumentGrid.entity.name`, `instrumentGrid.entity.instrumentId` and so on.

## Wrap-up

You should now see a page with two linked grids. Whenever instrument selection changes, the trade grid will refresh to display only the relevant trades:

![](/img/gpl-seed-grids-linked.png)
