---
title: 'Sample Application'
id: sample-application
---

# Sample Application

### Authentication

Currently, all our pages are public. We can protect pages with sensitive data by enabling the login service:

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

Note: If the login button is not clickable, Web client was not able to connect to the Genesis API Host. You can confirm whether it's trying to connect to correct URL in browser console:

![](/img/gpl-seed-host.png)

### Add model

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

### Grid

Next, let's add a grid to display the trades. We do this by passing **TRADE** model to `entityManager`:

```kotlin
 ui("Alpha Trading Dashboard") {
    service(Login)

    page("Home") {
        entityManager(TRADE)
    }
}
```

Adding an `entityManager` results in having additional server resources generated to supply the grid with data.

To update the server we run the following tasks:

### Generate server configuration

```shell
./gradlew :generateAll #On the IntelliJ terminal
```

### Build the alpha product

```shell
./gradlew :distribution:distZip #On the IntelliJ terminal
```

### Deploy the alpha product

```shell
./gradlew :alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

You will then see a grid on the UI.

![](/img/gpl-seed-grid.png)

### Form

Grid title matches model name by default - let's customise it and set to `Trades` instead.

Finally, let's allow users to submit new trades - this is done by enabling `EntityOperations.ADD` operation:

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

We again repeat the steps to update the server:

### Generate server configuration

```shell
./gradlew :generateAll #On the IntelliJ terminal
```

### Build the alpha product

```shell
./gradlew :distribution:distZip #On the IntelliJ terminal
```

### Deploy the alpha product

```shell
./gradlew :alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

If you click the **Add** button, you will see a form displayed in a modal:

![](/img/gpl-seed-form.png)
