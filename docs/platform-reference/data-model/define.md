---
title: Define your data model
sidebar_label: Define your data model
sidebar_position: 10
id: define

---
The data model is at the heart of your application. Getting this right is critical not just to the success of the application, but to how intuitive it will be to develop.

Get it right, and you will find all the other steps are much easier and more logical to complete.

In Genesis, we structure our data in the following way:

* Fields
* Tables
* Views (a view can draw data from more than one table)

Each of these must be specified in a separate file on the filesytem:

* _application_**-fields-dictionary.kts**
* _application_**-tables-dictionary.kts**
* _application_**-view-dictionary.kts**

## Fields

Field definitions are separate from table definitions because there are many fields that are common to more than one table.

By default, you have access to all the field definitions in the Genesis framework. You also have access to all the fields in the modules that you specified in the Dictionary Cache.

But you can also define your own fields.

The following field types are available:

* LONG
* INT
* SHORT
* DOUBLE
* BIGDECIMAL
* DATETIME
* DATE
* NANO_TIMESTAMP
* RAW
* STRING
* ENUM

Fields are easily defined with a unique Name and a type, and additionally a few other options such as default value, non-nullable and others (some are relevant only for certain types).

For example, here we define two `STRING` fields. (The second is nullable; the first is not nullable):

```kotlin
fields {
    field(name = "ORDER_ID", type = STRING)
    field(name = "DESCRIPTION", type = STRING, nullable = true)
    ...
}
```

Fields are defined in file under `<application-name>-config/src/main/resources/cfg` having the following name convention `<application-name>-fields-dictionary.kts`. For example for the `trade` application that file name would be `trade-fields-dictionary.kts`

When you define a new field, it is good practice to run **codegen:generateSysDef**. This will generate code based on the fields definition and you will be able to use intellisense to pick this new field within table definitions.

### Naming fields

As is always the case, it is worth being careful with the names you give fields. Clear names help.

If you create a field name that already exists, there are no consequences - as long as the field type is also the same. In effect, the second definition is simply ignored.

However, if you create a field name that matches an existing name and you give it a different field type, this generates a duplication error.

The error is shown when you generate the code using Maven.

If the code has already been generated - typically, if you are making changes to an existing server - the error is generated when you run `genesisInstall` after the change.

Technically, it is possible to duplicate field names. When you build, this generates a duplication warning if the fields are defined in the same way, or an error if they are defined differently. If the duplication is between your own field and one you have inherited from another module, make sure you change the name of your own field, not the one from the other module.

[Sample field definitions](/platform-reference/data-model/field-example/) generated from GPAL.

## Tables

To define a table, you need to specify a name, a unique ID, a list of unique fields, and a primary key.

You can also specify one or more indices onto the table. These can be defined as **unique** (where it will contain a unique constraint on the table) and **nonUnique,** where it is typically just defined to create an index for efficient ranged lookups.

When you define a table, it is good to give it a clear name that describes the key - so it is well worth planning these in advance. If you don’t define a name for the primary key, the default name will be:

```
    <TABLE>_BY_<PK_FIELD_1>_<PK_FIELD_2>
```

Primary key and index definitions are used in the various “lego brick” configurations, as well as any custom Db operations when you build and create the DAO Objects. This covers, for example, the ability to retrieve a single record based on the primary key values, and the ability to get a list of records part matching the first key field value (**getRange**).

Tables are defined in file under `<application-name>-config/src/main/resources/cfg` having the following name convention `<application-name>-tables-dictionary.kts`. For example for the `trade` application that file name would be `trade-tables-dictionary.kts`

### Derived fields

Derived fields are read-only fields calculated during runtime (i.e. not stored in database), but they can be retrieved when using generated table entities in a “getter” fashion. You can define these in your table definition. You have to specify the logic that creates the content, which must be based on the other fields in the table. For example, if your fields include **quantity** and **price** , you can create a derived field **quantity x price**, where the value is calculated on the fly.

See example below for USER table:

```kotlin
table(name = "USER", id = 1000, audit = details(1050, "UA")) {
    USER_NAME
    FIRST_NAME
    LAST_NAME
    EMAIL_ADDRESS
    PASSWORD
    REFRESH_TOKEN
    LAST_LOGIN
    STATUS
    ONLINE
    COMPANY_NAME
    COMPANY_ID
    derivedFields {
        derivedField("FULL_NAME", FIRST_NAME, LAST_NAME) { first, last ->
            // If no "output" type is defined, the output type will be equal to first field type (i.e. FIRST_NAME type)
            "$first $last"
        }
        derivedField("USER_NAME_CHARS", USER_NAME, INT) { userName ->
            // The output type will be equal to INT in this case, and GPAL will verify an INT is returned.
            userName?.length ?: 0
        }
    }
    primaryKey {
        USER_NAME
    }
}
```

The functionality provided in the previous examples should satisfy most use cases. It also has the advantage of providing a type safe calculation which will guarantee no type errors between different field types, including nullability checks for nullable fields.

However, we still offer full flexibility (at the expense of less type safety and easy of use) by using the following approach:

```kotlin
    derivedField("TIMES_TWO_COUNTER_PLUS_VERSION"){
        ((APPROVED_COUNTER not null) * 2) + (VERSION not null)
    }
```

In this case it is not clear what the output type will be (we haven’t specified it) as full flexibility is provided, so the user needs to explicitly define the output type (in this case it will be an INT type as both APPROVED_COUNTER and VERSION are INT types).

### Auditable tables

To make a table auditable, you need to add **audit = details** to the definition. You have to specify a unique ID, sequence ID (more later) and, optionally, a flag to generate a unique index based on the record timestamp (**tsKey**).

For example, this may look like:

```kotlin
tables {
    table (name = "TRADE", id = 11000, audit = details(id = 11003, sequence = "TR")) {
        TRADE_ID            
        INSTRUMENT_ID not null       
        COUNTERPARTY_ID not null     
        COUNTERPARTY        
        INSTRUMENT_SYMBOL   
        QUANTITY            
        SIDE                
        PRICE               
        TRADE_DATE          
        TRADE_DATETIME      
        ENTERED_BY          

        primaryKey {
            TRADE_ID
        }

    }
}
```

This automatically creates another table with all the fields of the table that is being audited. It has the same name as the table it audits, plus the suffix **_AUDIT**. In the previous example, this would be the **TRADE_AUDIT** table.

When using GPAL event handlers, the auditing is performed automatically, so each update on a record in the table immediately creates a new record in the audit table.

### Overriding nullable fields

You can override the **null = true** setting within a specific table if you need to do so,

```kotlin
table(name = "PROFILE", id = 1002) {
    NAME
    DESCRIPTION not null
    STATUS
    primaryKey {
        NAME
    }
}
```

### States

One of the most important decisions you need to make is about states. These control the state of financial entities throughout the trade lifecycle. For example, an order could be new, amended, open or complete.

You control the transitions from state to state by defining state machines. But in order to do this, you need to define the list of possible states.

First, you need a field to define the possible states (which are entirely your choice).

For example:

```kotlin
    field(name = "TRADE_STATUS", type = ENUM("DRAFT", "CANCELLED", "OPEN", "CLOSED", default = "DRAFT"))
```

Essentially, every state machine needs to be based on a specific table. The table should include all the fields required to , as well as the field you created to control the state of the trade. In our example above, this is TRADE_STATUS. Below is an example of a table that can be used by a state machine. It includes the set of fields that are relevant to a trade (QUANTITY, PRICE, etc.)

```kotlin
table("TRADE", 102) {
    sequence(TRADE_ID, "TR")
    QUANTITY
    PRICE
    CURRENCY_ID
    ENTERED_BY
    ENTERED_TIME
    MODIFIED_BY
    MODIFIED_TIME
    QUANTITY
    PRICE
    TRADE_STATUS

    primaryKey(name = "TRADE_BY_ID", id = 1) {
        TRADE_ID
    }
}
```

[Sample table definitions](/platform-reference/data-model/table-example/) generated from GPAL.

## Views

To create a view, you must specify a name for the view and the identity of the primary table. Following that, you can specify the fields in the view, including derived fields.

Views are defined in file under `<application-name>-config/src/main/resources/cfg` having the following name convention `<application-name>-view-dictionary.kts`. For example for the `trade` application that file name would be `trade-view-dictionary.kts`

### Joins

Typically, a view needs to contain fields from different tables.

Use the view statement to define a view. This must include:
- the name of the view
- the root table on which the view is based

#### Simple joins
An example of a simple join is where you add reference data to price data.
To define a join, add a join statement to your view definition; for this, you need to specify:
- the second table (the one yu are joining to)
- the fields that are being viewed in each table

In the example below, we define the view ENHANCED_TRADE_VIEW, which has the root table TRADE.
In the view, we join the TRADE table to the COUNTERPARTY table. The join is made between the TRADE.COUNTERPARTY_ID (the COUNTERPARTY_ID field from TRADE) and the COUNTERPARTY.COUNTERPARTY_ID (the COUNTERPARTY_ID field from COUNTERPARTY). 
The view returns all fields from both tables.

```kotlin
view ("ENHANCED_TRADE_VIEW", TRADE) {
    joins {
      joining(COUNTERPARTY) {
        on(TRADE.COUNTERPARTY_ID to COUNTERPARTY { COUNTERPARTY_ID })
      }
    }
    fields {
      TRADE.allFields()
      COUNTERPARTY.allFields()
    }
  }
```

#### Double joins

Sometimes, you need to join to the same table in two places - for example, if you want to fetch the nam of both the buying counterparty and the selling counterparty.
In the example below, the root table is again TRADE. We want to join it to the 
on the second example we are joining to the same table twice, 
To achieve this, we first define two aliases for the COUNTERPARTY table: "buyerCpty" and "sellerCpty". 
Then we make two joins, one to each aliased table. The first join is between the BUYER_COUNTERPARTY_ID field on the TRADE table and the COUNTERPARTY_ID field on the alias buyerCpty.
The second join is between the SELLER_COUNTERPARTY_ID field on the TRADE table and the COUNTERPARTY_ID field on the alias sellerCpty.
Finally, note that all fields are treurned from the TRADE table and only the buyer and seller names (aloased) are taken from the second table.

```kotlin
view ("ENHANCED_TRADE_VIEW", TRADE) {
    val buyerCpty = COUNTERPARTY withAlias "buyerCpty"
    val sellerCpty = COUNTERPARTY withAlias "sellerCpty"
    joins {
      joining(buyerCpty) {
        on(TRADE.BUYER_COUNTERPARTY_ID to buyerCpty { COUNTERPARTY_ID })
      }
      joining(sellerCpty) {
        on(TRADE.SELLER_COUNTERPARTY_ID to sellerCpty { COUNTERPARTY_ID })
      }
    }
    fields {
      TRADE.allFields()
      buyerCpty {
        COUNTERPARTY_LEI withAlias "BUYER_COUNTERPARTY_LEI"
      }
      sellerCpty {
        COUNTERPARTY_LEI withAlias "SELLER_COUNTERPARTY_LEI"
      }
    }
  }
```

#### Backwards joins
By default, the fields in the second table are not monitored in real time when you make a join. This is because, in most cases, the second table is providing some form of static data.
If you need to join to a table where there is real-time data, then you need to specify a backwards join. 
This requires the statement **backwardsJoin = true** when you are specifying the join.

When you refer to a table that has a backwards join in any of your [data servers](/platform-reference/configure-key-modules/data-servers/configure), 
you must include a similar statement in order to enable the feature: **backJoins = true**. Don’t forget to add this!

Note that`backJoins` can be expensive in terms of computation and cost, so they should be used surgically rather than by default.


```kotlin
query("ALL_RFQ_BROKER_QUOTES_VIEW", RFQ_BROKER_QUOTES_VIEW) {
    config {
        backJoins = true
    }
}
```
#### Complex joins
There is a range of [more complex joins](/platform-reference/data-model/view-complex-joins/) that give you extended flexibility.


