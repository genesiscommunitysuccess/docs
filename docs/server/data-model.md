---
sidebar_label: 'Define your data model'
---

# Define your data model

:::danger WIP
(talk about the files here: dictionary, etc.)
:::

The data model is at the heart of your application. Getting this right is critical not just to the success of the application, but to how intuitive it will be to develop.

Get it right, and you will find all the other steps are much easier and more logical to complete.

In Genesis, we structure our data in the following way:

- Fields
- Tables
- Views (a view can draw data from more than one table)

Each of these must be specified in a separate block in the dictionary file.

## Fields

Field definitions are separate from table definitions because there are many fields that are common to more than one table.

By default, you have access to all the field definitions in the Genesis framework. You also have access to all the fields in the modules that you specified in the Dictionary Cache.

But you can also define your own fields.

The following field types are available:

- LONG
- INT
- SHORT
- DOUBLE
- BIGDECIMAL
- DATETIME
- DATE
- NANO_TIMESTAMP
- RAW
- STRING
- ENUM

Fields are easily defined with a unique Name and a type, and additionally a few other options such as default value, non-nullable and others (some are relevant only for certain types).

For example, here we define two STRING fields. The second is nullable; the first is not nullable):

```java
fields {
field(name = "ORDER_ID", type = STRING)
field(name = "DESCRIPTION", type = STRING, nullable = true)
...
}
```

When you define a new field, it is good practice to run **codegen:generateSysDef**. You will be able to use intellisense to pick this new field within table definitions.

### Naming fields 
As is always the case, it is worth being careful with the names you give fields. Clear names help.

If you create a field name that already exists, there are no consequences - as long as the field type is also the same. In effect, the second definition is simply ognored.

However, if you create a field name that matches an existing name and you give it a different field type, this generates a dulication error.

The error is generated when you generate the code using Maven. 

I the code has already been generated - typically, if you are making changes to an existing server - the error is generated when you run **genesisInstall** after the change.

:::danger WIP
Checking with Peter
:::

Technically, it is possible to duplicate field names. When you build, this generates a duplication warning if the fields are defined in the same way, or an error if they are defined differently. If the duplication is between your own field and one you have inherited from another module, make sure you change the name of your own field, not the one from the other module.

[Sample field definitions](/server/field-definition-example/) generated from GPAL.

## Tables

To define a table, you need to specify a name, a unique ID, a list if unique fields, and a primary key.

You can also specify one or more indices onto the table. These can be defined as **Unique** (where it will contain a unique constraint on the table) and **nonUnique,** where it is typically just defined to create an index for efficient ranged lookups.

When you define a table, it is good to give it a clear name that describes the key - so it is well worth planning these in advance. If you don’t define a name for the primary key, the default name will be:

```
<TABLE>_BY_<PK_FIELD_1>(_<PK_FIELD_2>
```

Primary key and index definitions are used in the various “lego brick” configurations, as well as any custom Db operations when you build and create the DAO Objects. This covers, for example, the ability to retrieve a single record based on the primary key values, and the ability to get a list of records part matching the first key field value (**getRange**).

### Derived fields

Derived fields are read-only fields calculated during runtime (i.e. not stored in database), but they can be retrieved when using generated table entities in a “getter” fashion. You can define these in your table definition. You have to specify the logic that creates the content, which must be based on the other fields in the table. For example, if your fields include **quantity** and **price** , you can create a derived field **quantity x price**, where the value is calculated on the fly.

See example below for USER table:

```java
    table(name = "USER", id = 1000, audit = details(1050, "UA")) {
        Fields.USER_NAME
        Fields.FIRST_NAME
        Fields.LAST_NAME
        Fields.EMAIL_ADDRESS
        Fields.PASSWORD
        Fields.REFRESH_TOKEN
        Fields.LAST_LOGIN
        Fields.STATUS
        Fields.ONLINE
        Fields.COMPANY_NAME
        Fields.COMPANY_ID
        derivedFields {
            derivedField("FULL_NAME", Fields.FIRST_NAME, Fields.LAST_NAME) { first, last ->
                // If no "output" type is defined, the output type will be equal to first field type (i.e. FIRST_NAME type)
                "$first $last"
            }
            derivedField("USER_NAME_CHARS", Fields.USER_NAME, INT) { userName ->
                // The output type will be equal to INT in this case, and GPAL will verify an INT is returned.
                userName?.length ?: 0
            }
        }
        primaryKey {
            Fields.USER_NAME
        }
    }
```

The functionality provided in the previous examples should satisfy most use cases. It also has the advantage of providing a type safe calculation which will guarantee no type errors between different field types, including nullability checks for nullable fields.

However, we still offer full flexibility (at the expense of less type safety and easy of use) by using the following approach:

```java
    derivedField("TIMES_TWO_COUNTER_PLUS_VERSION"){
        ((Fields.APPROVED_COUNTER not null) * 2) + (Fields.VERSION not null)
    }

```

In this case it is not clear what the output type will be (we haven’t specified it) as full flexibility is provided, so the user needs to explicitly define the output type (in this case it will be an INT type as both APPROVED_COUNTER and VERSION are INT types).

### Auditable tables

To make a table auditable, you need to add **audit = details** to the definition. You have to specify a unique ID, sequence ID (more later) and, optionally, a time stamp (**tsKey**).

This automatically creates another table with all the fields of the table that is being audited. It has the same name as the table it audits, plus the suffix **_AUDIT**.

When using GPAL event handlers, the auditing is performed automatically, so each update on a record in the table immediately creates a new record in the audit table.

### Overriding nullable fields

You can override the **null = true** setting within a specific table if you need to do so,

```java
 table(name = "PROFILE", id = 1002) {
        Fields.NAME
        Fields.DESCRIPTION not null
        Fields.STATUS
        primaryKey {
            Fields.NAME
        }
    }
```
States 
One of the most important decisions you need to make is about states. These control the state of financial entities throughout the trade lifecycle. For example, an order could be new, amended, open or complete.

You control the transitions from state to state by defining state machines. But in order to do this, you need to define the list of possible states. 

First, you need a field to define the possible states (which are entirely your choice).

For example:
```
field("TRADE_STATUS", ENUM("DRAFT", "CANCELLED", "OPEN", "CLOSED", default = "DRAFT"))
```
Essentially, every state machine needs to be based on a specific table. The table should include all the fields required to , as well as the field you created to control the state of the trade. In our example above, this is TRADE_STATUS. Below is an example of a table that can be used by a state machine. It includes the set of fields that are relevant to a trade (QUANTITY, PRICE, etc.)

```
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

    primaryKey("TRADE_BY_ID", 1) {
        TRADE_ID
    }
}
```
[Sample table definitions](/server/table-definition-example/) generated from GPAL.

## Views

To create a view, you must specify a name for the view and the identity of the primary table. Following that, you can specify the fields in the view, including derived fields.
 
### Joins
Often, a view needs to contain fields from different tables.

For a simple join, where you add reference data to price data, for example, include a **joins** statement when you define the table. For this, you can insert a join in your view. You need to specify the root table, the second table, and the fields that are being viewed in each one.

You might need to join to two different parts of the same table - for example, if you need to pick up the currency of a trade currency and also the settlement currency.
 
To achieve this, create aliases for the two fields you are retrieving from the second table, for example, **tradeCcy** and s**ettCcy.**

 By default, the fields in the second table are not monitored in real time (because, in most cases, the second table is providing some form of static data). If you need to join to a table where there is real-time data, then you need to specify a backwards join. This requires the statement backwardsJoin = true when you are specifying the join. 

It is worth noting that when you define your [data servers](/server/data-servers/), any of these that include views with backwards joins must include a similar statement: **backJoins = true**. Don’t forget to add this! 

```
query("ALL_RFQ_BROKER_QUOTES_VIEW", RFQ_BROKER_QUOTES_VIEW) {
    config {
        backJoins = true
    }
}
```
    
    
    


