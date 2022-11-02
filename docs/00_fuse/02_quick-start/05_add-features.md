---
title: 'Add features'
id: add-features
---

# Add features

We've now got our project created and configured. We've started our servers, now we're ready to add features to our application.

### Expected result

For this part of the guide, we've picked out a few core features we can demonstrate while building a sample application. By the end of this step we will have:

- the ability to make changes to the user interface and reflect those changes in the browser
- added a data **model** to describe the structure we'd like
- configured a **grid** to display the application data
- added a **form** to insert new records into our database


### Simple UI changes

Our page title has been auto-generated based on our application name. Let's modify it and add simple text heading to our page. We'll start by opening `app-ui.kts`:

* In IntelliJ press the `Shift` key twice and start typing the filename
* In VS Code press `Ctrl + P` (`Cmd + P` on a Mac) and start typing the filename

:::info
If you are seeing multiple matches, make sure you open the file in `src/main/resources` folder
:::

Let's amend its contents as follows:

```kotlin
// highlight-next-line
ui("Alpha Trading Dashboard") {
    service(Login)

    page("Home") {
        // highlight-next-line
        heading("Hello World")
    }
}
```

We should now see the updated page title and heading text:

![](/img/gpl-seed-start-first-changes.png)

## Model

Now we're ready to define the fields and tables that make up the [data model](/getting-started/quick-start/define-the-data-model/).

Right-click on `src/main/kotlin/global/genesis/alpha/model` folder in your IDE and add a new file called `Trade.kt`:

```kotlin
package global.genesis.alpha.model

import global.genesis.gpl.api.schema.Persist
import global.genesis.gpl.api.schema.Table

@Persist
object TRADE : Table(11_000) {
    val tradeId by varchar().nonNullable().generated()
    val instrumentId by varchar().nonNullable()
    val side by enum(Side.BUY)
    val price by double().nonNullable()
    val quantity by integer().nonNullable()
    val tradeDateTime by now().immutable()
    val enteredBy by username().immutable()
    val modifyTime by now()
    val tradeStatus by enum(TradeStatus.NEW)

    override val primaryKey by primaryKey(tradeId)
}

enum class Side { BUY, SELL }
enum class TradeStatus { NEW, ALLOCATED, CANCELLED }
```

## Grid and form

Grids are our primary way of displaying information. Let's add a grid to display our new `TRADE` model and a form to allow users to submit new trades. We can achieve this by adding an `entityManager` component as shown below. Specifying the `ADD` operation will allow us to add new trade records.

```kotlin
 ui("Alpha Trading Dashboard") {
    service(Login)

    page("Home") {
        // highlight-start
        entityManager(
            entity = TRADE, 
            title = "Trades", 
            operations = listOf(ADD),
        )
        // highlight-end
    }
}
```

## Deploy

Adding an entity manager component will require new server resources to be generated. We can generate and deploy them with the following command:

```shell
genx app deploy
```

Deployment involves restarting a server, which typically takes several minutes. You can check progress with `genx app status`. You can ignore any `Unsupported key type (ssh-ed25519)` warnings if present.

Once deployment has been completed, we will see a grid. Yours will be empty at this stage - to populate it with trades, click the **Add** button.

![](/img/gpl-seed-grid.png)

This should open the add new trade form in a modal:

![](/img/gpl-seed-form.png)

## Recap

Congratulations, with just a few lines of code and some commands, you now have:

- a new data model for trades
- a grid display of all trades
- the ability to add new trades via a form
