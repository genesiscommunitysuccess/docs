#### `derivedField`

You can also define derived fields to supplement the fields supplied by the table or view. All fields are available under the `data` parameter.

In the example below, we add a trade description made up of many fields from the row:

```kotlin
    derivedField("TRADE_DESCRIPTION", STRING) {
      data.direction + " " + data.quantity + " " + data.instrumentName + " " + data.tradePrice + " " + data.ctptyName
    }
```

:::note
Derived fields cannot be used within a `filter` block.
:::

#### `derivedFieldWithUserName`

This is the same as `derivedField` but also has a context property `userName` with the username who requested the data.

In the example below, the TRADE_DESCRIPTION will be prefixed with "My Trade " if it was traded by the user querying the data.

```kotlin
    derivedFieldWithUserName("TRADE_DESCRIPTION", STRING) {
      val myTrade = if(userName == data.tradedBy) { "My Trade " } else { "" }
      myTrade + data.direction + " " + data.quantity + " " + data.instrumentName + " " + data.tradePrice + " " + data.ctptyName
    }
```

:::note
Derived fields cannot be used within a `filter` block.
:::

#### `filter`

Where specified data is filtered by the query and this supersedes any client criteria specified.

`filter` requires boolean logic and has access to all fields defined in the query. It has a `data` property which has access to all fields on the entity

```kotlin
    filter {
      data.date > DateTime.now().minusDays(30)
    }
```

Note in this example DateTime.now() will be evaluated for every row, which comes with a small overhead. To stop this, you can define it outside per the example below:

```kotlin
  ...
  val today = DateTime.now()
  ...
    ...
    filter {
      data.date > today.minusDays(30)
    }
    ...
```

#### `filterWithUserName`

This is the same as `filter` but also has a context property `userName` with the username who requested the data.

In the example below, the entity has a field `ASSIGNED_TO` which is populated with the user the data is assigned to, in this scenario rows which do not have `ASSIGNED_TO` set to the user querying the data will be filtered out.

```kotlin
    filter {
      data.assignedTo == userName
    }
```