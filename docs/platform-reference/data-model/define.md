---
title: Define your data model
sidebar_label: Define your data model
sidebar_position: 1
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

## View keywords:

### `debugMode`
Enables debug mode for this view

### `withAlias`
Provides an alias for a table, for when joining on the same table multiple times

```kotlin
views {
    view("ALL_MESSAGES_VIEW", rootTable = MESSAGE) {
        val sender = USER withAlias "sender"
        val receiver = USER withAlias "receiver"

        joins {
            joining(sender) {
                on(MESSAGE {SENDER_NAME} to sender {USER_NAME})
            }
            joining(receiver) {
                    on(MESSAGE {RECEIVER_NAME} to receiver {USER_NAME})
                }
        }

        fields {

            MESSAGE.allFields()

            sender {
                EMAIL_ADDRESS withAlias "SENDER_EMAIL_ID"
            }
            receiver {
                EMAIL_ADDRESS withAlias "RECEIVER_EMAIL_ID"
            }
        }
    }
}
```

### `joins`:
Defines the joins within a view (optional). Often, a view needs to contain fields from different tables.
Joins are a way of combining data from different tables into a single view. To make a table accessible in fields it must either be the rootTable or joined to in the `joins` tag
You can define maximum of 20 join per view level

#### Different types of joins

*Outer join/join:*
For a simple join, where you add reference data to price data, for example, include a **joins** statement when you define the table. For this, you can insert a join in your view. You need to specify the root table, the second table, and the fields that are being viewed in each one.
By default views use outer joins, this means that if a join returns no record that the view record is returned as normal with fields from the missing table will default to null

```kotlin
    view("USER_SESSION_DETAILS", USER_DETAILS) {
        joins {
            joining(USER_SESSION) {
                on(USER_DETAILS.USER_NAME to USER_SESSION.USER_NAME)
            }
        }
        fields {
            USER_DETAILS.allFields()
            USER_SESSION.LAST_ACCESS_TIME
        }
    }
```

*Inner join*: Inner joins require that all joins match exactly, if one join fails to match this row will be discarded
```kotlin
    view("USER_SESSION_DETAILS", USER_DETAILS) {
        joins {
            joining(USER_SESSION, joinType = JoinType.INNER) {
                on(USER_DETAILS.USER_NAME to USER_SESSION.USER_NAME)
            }
        }
        fields {
            USER_DETAILS.allFields()
            USER_SESSION.LAST_ACCESS_TIME
        }
    }
```

*Backword Join*:
By default, the fields in the second table are not monitored in real time (because, in most cases, the second table is providing some form of static data). If you need to join to a table where there is real-time data, then you need to specify a backwards join. This requires the statement backwardsJoin = true when you are specifying the join.

```kotlin
joins {
    joining(USER_ATTRIBUTES, backwardsJoin = true) {
        on(USER.USER_NAME to USER_ATTRIBUTES.USER_NAME)
    }
}
```

It is worth noting that when you define your [data servers](/platform-reference/data-servers/configure/), any of these that include views with backwards joins **must include a similar statement in order to enable the feature**: **backJoins = true**. Don’t forget to add this!

Lastly, `backJoins` can be expensive in terms of computation and cost, so they should be used surgically rather than by default.

```kotlin
query("ALL_RFQ_BROKER_QUOTES_VIEW", RFQ_BROKER_QUOTES_VIEW) {
    config {
        backJoins = true
    }
}
```

*One to one and one many joins*
View definition supports one to one and one to many relationship. One to many joins are only usable in request reply definitions.
When joining from table A to table B, how many records can we expect. This comes down to index matching. When we define a join we need to specify the fields to join on, if there is primary key or unique index where all the
fields in the index are in the join we can guarantee a one-to-one join. If not we default to a one-to-many join.

There are a number of advantages for one-to-one joins:
1. More efficient, we can create a more efficient query plan for one to one joins
2. Views using only one to one joins can be used in data servers

*Parameterized join*
Some join operations could require external parameters that are not available in the context of the table join definition, but will be available when the view repository is accessible (e.g. client enriched definitions), so we have included the option to create parametrised joins
When you want to utilize the view you need to provide certain parameters. This join will be mostly used where you have one to many relationship between tables
Explained below with an example:

```kotlin {5}
view("INSTRUMENT_PARAMETERS", INSTRUMENT) {
    joins {
        joining(ALT_INSTRUMENT_ID, JoinType.INNER) {
            on(INSTRUMENT.ID to ALT_INSTRUMENT_ID.INSTRUMENT_ID)
                .and(ALT_INSTRUMENT_ID.ALTERNATE_TYPE.asParameter())
        }
    }
    fields {
        ALT_INSTRUMENT_ID {
            ALTERNATE_CODE withAlias "INSTRUMENT_CODE"
        }
        INSTRUMENT {
            NAME withPrefix INSTRUMENT
        }
    }
}
```

In the above example there is one to many relationship between INSTRUMENT and ALT_INSTRUMENT_ID table. When this view is used in any of the service like data-server/request-replies or event handlers, user needs to provide values for INSTRUMENT_ID and ALTERNATE_TYPE fields

*Dynamic joins*
Dynamic joins are helpful if you want to do complex join operations. This has a shared syntax with derived fields

```kotlin
joining(fix, backwardsJoin = true) {
   on {
      withEntity(TRADE_TO_SIDE) { tradeToSide ->
         TradeSide.BySideId("prefix" + tradeToSide.fixId)
      }
   }
}
```

```kotlin
joining(fixCal, JoinType.INNER, backwardsJoin = true) {
    on {
        withInput(fix { CALENDAR_ID }) { calendarId ->
            when (calendarId) {
                null -> null
                else -> TradeCalendar.ByCalendarId(calendarId)
            }
        }
    }
}
```

### `fields`:
Defines the fields in the view.

#### Ways of defining fields:
There are two ways of adding fields. Either using the `TABLE.FIELD` syntax or by using the `TABLE { FIELD }` syntax. Both methods can be use interchangeably as well as in the same
definition. When adding many fields from the table the `TABLE { FIELD }` syntax would lead to a more concise and readable definition.

Please note that for a table to be used within the `fields {...}` tag, it should either be the root table or be joined in the joins tag.

#### The `TABLE.FIELD` syntax
Sample:
```kotlin
fields {
    PROFILE_RIGHT.PROFILE_NAME
    PROFILE_RIGHT.RIGHT_CODE

    // more fields go here...
}
```

#### The `TABLE { FIELD }` syntax
Sample:
```kotlin
fields {
    USER {
        USER_NAME
        LAST_LOGIN
        EMAIL_ADDRESS
        COMPANY_ID
    }

    // more fields go here...
}
```

#### Ways for customizing fields

As well as adding fields, views provide ways of manipulating the added data.
This can be done in the following ways:
1. Changing an existing field:
    1. Setting a field alias using `withAlias`
    2. Setting a field prefix using `withPrefix`
    3. Setting a field format using `withFormat`
2. Adding a new field by declaring a derived field using `derivedField`

Please note that everything described below works when accessing fields using the `TABLE.FIELD`
syntax as well as the `TABLE { FIELD }` syntax. Also, formats can be used with prefixed and
aliased fields.

#### Field aliases
Sample:
```kotlin
fields {
    USER_ATTRIBUTES_AUDIT {
        ADDRESS_LINE1 withAlias "ADDRESS_LINE_1"
    }
    // or
    USER_ATTRIBUTES_AUDIT.ADDRESS_LINE1 withAlias "ADDRESS_LINE_1"
}
```
You might need to join to two different parts of the same table - for example, if you need to pick up the currency of a trade currency and also the settlement currency.
To achieve this, create aliases for the two fields you are retrieving from the second table, for example, **tradeCcy** and **settCcy.**

#### Field prefix
Sample:
```kotlin
fields {
    USER {
        NAME withPrefix USER
        NAME withPrefix "GENESIS_USER"
    }
    // or
    USER.NAME withPrefix USER
    USER.NAME withPrefix "GENESIS_USER"
}
```

#### Formatting fields
Sample:
```kotlin
fields {
    USER {
        LAST_LOGIN withFormat "dd/MM/yyyy"
        LAST_LOGIN withAlias "LAST_DATE" withFormat "dd/MM/yyyy"
    }
    // or
    USER.LAST_LOGIN withFormat "dd/MM/yyyy"
    USER.LAST_LOGIN withPrefix USER withFormat "dd/MM/yyyy"
}
```

#### [Derived fields](/server-reference/data-model/define/Derived fields)
Sample:
```kotlin
fields {
    // with entity input
    derivedField("SPREAD", DOUBLE) {
        withEntity(INSTRUMENT_PRICE) { price ->
            price.askPrice - price.bidPrice
        }
    }
    // or with field input
    derivedField("SPREAD", DOUBLE) {
        withInput(INSTRUMENT_PRICE.BID_PRICE, INSTRUMENT_PRICE.ASK_PRICE) { bid, ask ->
            if (ask == null || bid == null) null
            else ask - bid
        }
    }
    // or
    INSTRUMENT_PRICE {
        derivedField("SPREAD", DOUBLE) {
            withInput(BID_PRICE, ASK_PRICE) { bid, ask ->
                if (ask == null || bid == null) null
                else ask - bid
            }
        }
    }
}
```