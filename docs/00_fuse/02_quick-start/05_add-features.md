---
title: 'Add features'
id: add-features
---

# Add features

We've now got our seed project created and configured. We've started our UI and Server, now we're ready to add features to our application.

### Expected result

For this part of the guide, we've picked out a few core features we can demonstrate while building a sample application. By the end of this step we will have:

- added a data **model** to describe the structure we'd like
- configured a **grid** to display the application data
- added a **form** to create data into our application

## Model

Now we're ready to define the fields and tables that make up the [data model](https://docs.genesis.global/secure/creating-applications/defining-your-application/data-model/data-model-overview/). This structures information in a simple way that can be viewed by users and processed by the application.

Let's create a new package **model** in **src/main/kotlin/global/genesis/alpha** and add a file called **Trade.kt** with the following contents:

```kotlin
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

:::tip

Once the project is open, there are two easy ways to find this file quickly in Intellij:

- Press the **Shift** key twice, then type the name of the file we are looking for.
- Press **Shift** + **Ctrl** + **N**, then type the name of the file we are looking for.

:::

## Grid

Grids are our primary way of displaying information. For our application, let's add a grid to display our new **TRADE** model:

```kotlin
 ui("Alpha Trading Dashboard") {
    service(Login)

    page("Home") {
        entityManager(TRADE)
    }
}
```

## Update

Adding an `entityManager` results in having additional server resources generated to supply the grid with data.

Therefore, we need to update the server with the following tasks:

### Regenerate

```shell
./gradlew :generateAll #On the IntelliJ terminal
```

### Build

```shell
./gradlew :distribution:distZip #On the IntelliJ terminal
```

### Deploy

```shell
./gradlew :alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

If the tasks above were successful, we will then see a grid on the UI.

![](/img/gpl-seed-grid.png)

## Form

Finally, let's allow users to submit new trades.

This is done by enabling the `EntityOperations.ADD` operation.

We'll also customise the grid title to `Trades`.

To do this, we need to modify the `entityManager` parameters:

```kotlin
 ui("Alpha Trading Dashboard") {
    service(Login)

    page("Home") {
        entityManager(
            entity = TRADE, 
            title = "Trades", 
            operations = listOf(EntityOperations.ADD),
        )
    }
}
```

## Update

Because we've modified the `entityManager`, we need to regenerate in order to update our server.

### Regenerate

```shell
./gradlew :generateAll #On the IntelliJ terminal
```

### Build

```shell
./gradlew :distribution:distZip #On the IntelliJ terminal
```

### Deploy

```shell
./gradlew :alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

Now, if we click the **Add** button, we will see a form displayed in a modal:

![](/img/gpl-seed-form.png)

## Recap

Congratulations, with just a few lines of code and some commands, you now have:

- authentication enabled on our application
- a new data model for trades
- a grid display of all trades
- the ability to add new trades via a form
