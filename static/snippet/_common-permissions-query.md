
##### `hideFields`

For queries, the `auth` block also allows a `hideFields` which can be used to restrict attribute/field/column values being returned to users.

For example, you can hide a column (or set of columns) based on boolean logic, for example if a user does not have a specific Right Code in their profile.

In the example below, the code uses `auth` and `hideFields` to check if the user has the Right Code `TradeViewFull`. If this code is not set for the user, then the column `CUSTOMER_NAME` will not be returned to the user:

```kotlin
  permissioning {
    auth {
      hideFields { userName, rowData ->
        if (!userHasRight(userName, "TradeViewFull")) listOf(CUSTOMER_NAME)
        else emptyList()
      }
    }
  }
```