---
title: 'Sample Application'
id: sample-application
---

# Sample Application

We've now got our seed project created and configured. We've started our UI and Server and now we're ready to add features to our application.


### Expected Result

For this part of the guide, we've picked out a few core features we can demonstrate while building a sample application. By the end of this step we will have:

- **Authentication** enabled wth our app
- Added a data **model** to describe the structure we'd like
- Configured a **grid** to display the application data
- Added a **form** to create data into our application

## Authentication

Currently, all our pages are public. We can protect pages with sensitive data by enabling the login service.

Let's reopen **src/main/kotlin/global/genesis/alpha/Application.kt** and add `service(Login)`:

```kotlin
 ui("Alpha Trading Dashboard") {
    service(Login)

    page("Home") {
        heading("Hello World")
    }
}
```

You should now see a login screen:

![](/img/gpl-seed-login.png)

:::note
You can confirm whether it's trying to connect to the correct URL in the browser console, as seen in the image below:
:::

![](/img/gpl-seed-host.png)

## Model

Now you are ready to define the fields and tables that make up your [data model](https://docs.genesis.global/secure/creating-applications/defining-your-application/data-model/data-model-overview/). This structures information in a simple way that can be viewed by users and processed by the application.

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

- Press the **Shift** key twice, then type the name of the file you are looking for.
- Press **Shift** + **Ctrl** + **N**, then type the name of the file you are looking for.

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

If the tasks above were successful, you will then see a grid on the UI.

![](/img/gpl-seed-grid.png)

## Form

Finally, let's allow users to submit new trades.

This is done by enabling `EntityOperations.ADD` operation.

We'll also customise the grid title to `Trades` instead.

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

```shell
./gradlew :alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

Now, if you click the **Add** button, you will see a form displayed in a modal:

![](/img/gpl-seed-form.png)

## Recap

Congratulations, with just a few lines of code and some commands, we now have:

- Authentication enabled on our application
- A new data model for Trades
- A grid display of all Trades
- The ability to add new Trades via a form