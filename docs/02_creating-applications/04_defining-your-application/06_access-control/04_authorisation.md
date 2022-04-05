---
title: Authorisation
sidebar_label: Authorisation
sidebar_position: 4
id: authorisation
---

Authorisation is achieved by permissioning dynamically. This means you can control access to information in increasingly precise ways, for example:

* The whole entity
* Specific rows
* Specific columns

Effectively, you have two levels of control:

**High-level**

You could hide an entire grid from the UI, for example. So, one group of users could view reference data, but other groups would not see this. Or, you could hide an entire data server. To achieve this, you use RIGHT_CODE. This is like a switch – you can either see it or not, depending on whether the code is TRUE or FALSE.

**Entity-level**

This is row- or column-level access to information. Different users can all view the same grid, but each one sees different data. This is best explained with these simple examples:

* You can have user A, user B and user C all having the RIGHT_CODE to view a specific grid, but each one sees different trades in that grid. This enables you to separate different trading desks, for example.
* Each user might only have access to trades for specific customers.

By including these permissions in an event handler, user A can only enter a trade on behalf of a specific set of clients and user B can only enter trades on behalf of a different set of clients.

Similarly, you can have different users seeing different columns in the same grid. This could be used for a support function, for example. You can prevent the support team from seeing specific columns of sensitive data, such as who the client for a trade is. This can be specified by using GPAL.

### Users, profiles and right codes

Genesis has the concept of users, profiles and right codes. For each one, there is a table to store the related entity data:

* USER
* PROFILE
* RIGHT

Users gain rights via profiles. So we have tables to determine which users and rights belong to each given profile. Note that you cannot allocate right codes directly to a specific user. However, a user can have multiple profiles.

A profile can have zero or more rights and zero or more users.

These relationships are held in the following tables:

* PROFILE_RIGHT
* PROFILE_USER

Related to these tables, we have the RIGHT_SUMMARY table, which contains the superset of rights any given user has. These are based on the profiles assigned to them. This is the key table used when checking rights, and it exists to allow the efficient checking of a user's rights.

![](/img/user-profile-rights-setup.png)

The RIGHT_SUMMARY table entries are automatically maintained by the system in real time. In this way, the rights are easily accessible at speed. The GENESIS_AUTH_MANAGER process manages this table's entries automatically. So if you add a new user or you update a profile with new rights, the RIGHT_SUMMARY table is updated immediately and all the users in that profile receive the new right automatically.

:::warning
This table is only automatically maintained when profile user/right entries are maintained via GENESIS_AUTH_MANAGER business events. If you update the data in the tables PROFILE_USER or PROFILE_RIGHT via other means (e.g. **DbMon** or **SendIt**) then the RIGHT_SUMMARY table will not be maintained automatically.
In such situations (e.g. setting up a brand new environemnt and bulk loading data into the tables) then the `~/run/auth/scripts/ConsolidateRights.sh` script must be run. This scans all entries in PROFILE_USER and PROFILE_RIGHT and populates RIGHT_SUMMARY withe the correct data.
:::
#### Sample explanation

See the following simple system set-up. We have a set of entities (our user, rights and profiles), a set of profile mappings (to users and rights) and, finally, the resultant set of right entries we would see in RIGHT_SUMMARY

![](/img/user-profile-rights-example-simple.png)

So here we have:
* 3 profiles, each with particular rights assigned
* 4 users
    * 3 of which simply have one profile assigned each
    * 1 of which, Jenny.Super - is assigned to have all rights

Looking at the resulting right entries, we see the 3 users with a single profile simply have the same rights as their given profile.
However, Jenny has multiple profiles, and the resulting right entries she has is the superset of all of the rights in all those profiles .

Another way of achieving this same set-up would be to have a fourth profile, say SUPER, as per below, and to have all rights assigned to it, and Jenny.Super assigned just to the one profile:

![](/img/user-profile-rights-example-super.png)

Note how we now have an extra profile, and edits to the PROFILE_USER and PROFILE_RIGHT entries, but still see the same resulting rights.

As you can tell, this enables you to build powerful combinations, and since Users, Profiles, Profile_Users and Profile_Rights are all editable by system administrators, they can build their own set-up that makes sense for their organisation's set-up.

#### Good design practice

Having profiles as an intemediary between users and rights enabkes admin users of the system to create complex permission models with no code change. Rights codes generally need to be added to the code.  Although this is simple to do, it requires a code change. Our advice is to design applications with enough granularity in the rights to ensure that code changes aren't required.

### Entity-level (row-level)

The GENESIS_AUTH_PERMS process runs automatically on start-up and creates a memory-mapped file that acts as a big key-value pair.
For example, User J has access to Counterparty 1, User K has access to Counterparty 2, User L has access to Counterparty 1, User M has access to Counterparty 4, etc. If there is no appropriate entry in the file, the user won’t have access.

You must keep the GENESIS_AUTH_PERMS process running, as it maintains itself automatically whenever any permissions change. When a permission is changed, then it is automatically reflected on screen. If I have a grid on screen with 4 trades from Counterparty 1 and my permission to view that counterparty is withdrawn, those 4 trades disappear from my screen immediately.

In many cases, you want different people to have access to different functions and different information, based on their roles.  In Genesis, users are not permissioned individually for these purposes. Instead, permissioning is based on roles. You define what information and functions are available to a role, and then you allocate users to these roles. We refer to this as dynamic authorisation. There is nothing to stop you creating a role that has only one user, of course.

## General approach

On startup, the GENESIS_AUTH_PERMS process performs an initial scan of all entities. For each entity found, it performs authorisation against every user in the system. This builds a full map of permissioned users.

By default, any updates to the entity and the USER table will be automatically processed to permission new entities as they are entered into the database.

Entries are stored in a memory-mapped file located in **$GENESIS_HOME/runtime/authCache**.

If you need to clear out the entries by hand, simply delete everything in that directory and restart GENESIS_AUTH_PERMS.

More than one permission map per table can be created.

## Generic Permissions

The generic permissions model available in auth automatically builds “auth-perms” maps and also ensures all the admin transactions, dataservers and request reply resources are authorised correctly on a multi-tenant basis. This generic approach might not work for every use case, but it should be good enough for many development scenarios and therefore should cover all the basics out of the box.

### Configuration
There is a field called ACCESS_TYPE in the USER_ATTRIBUTES table. This determines the authorisation method to be applied for a particular user.
```kotlin
field(name = "ACCESS_TYPE", type = ENUM("ALL", "ENTITY", "MULTI_ENTITY", default = "ALL")) 
```

*Note*: Only ALL and ENTITY are in working condition at the moment.

Users with ACCESS_TYPE set to ENTITY (e.g. the entity could be represented by COUNTERPARTY_ID) will be permissioned only to see data relating to the value stored in the x field in the USER_ATTRIBUTES table. The name of x field is set in the ADMIN_PERMISSION_ENTITY_FIELD in the system definition file, as you can see in the example below. 



```kotlin
systemDefinition {
    global {
        item(name = "ADMIN_PERMISSION_ENTITY_TABLE", value = "COUNTERPARTY")
        item(name = "ADMIN_PERMISSION_ENTITY_FIELD", value = "COUNTERPARTY_ID")
    }
}
```

These two items change the structure of **auth-tables-dictionary.kts** and **auth-permissions.templt.xml** to accomodate the defined table and field, and ensure that the table/permission data structure is built correctly.

Here is the USER_ATTRIBUTES table definition in **auth-tables-dictionary.kts**:

```kotlin
val permissionsField = SysDef.systemDefinition["ADMIN_PERMISSION_ENTITY_FIELD"].orElse(null)

table(name = "USER_ATTRIBUTES", id = 1007, audit = details(1052, "AA")) {
    USER_NAME
    USER_TYPE
    ACCESS_TYPE
    if (permissionsField != null) {
        Fields[permissionsField]
    }
    ADDRESS_LINE1
    ADDRESS_LINE2
    ADDRESS_LINE3
    ADDRESS_LINE4
    CITY
    REGION
    POSTAL_CODE
    COUNTRY
    TITLE
    WEBSITE
    MOBILE_NUMBER
    TELEPHONE_NUMBER_DIRECT
    TELEPHONE_NUMBER_OFFICE
    primaryKey {
        USER_NAME
    }
}
```
The permissions field will be added dynamically to USER_ATTRIBUTES, so it can be used in auth transactions to control entitlements.

The following table will be created as well (ignore MULTI_ENTITY setup for now; this is in development). It is used by the Genesis low-code platform to manage AUTH_PERMS results.

```kotlin
val permissionsTable = SysDef.systemDefinition["ADMIN_PERMISSION_ENTITY_TABLE"].orElse(null)

if (permissionsTable != null && permissionsField != null) {

    table(name = "USER_${permissionsTable}_MAP", id = 1012) {
        USER_NAME
        Fields[permissionsField]
        primaryKey {
            USER_NAME
        }
        indices {
            nonUnique(name = "USER_${permissionsTable}_MAP_BY_${permissionsField}") {
                Fields[permissionsField]
            }
        }
    }
}
```
There are two auth maps in **auth-permissions.templt.xml** to control how users have visibility of rows (in auth dataserver and auth request reply) and also the generic entities. See below:

```xml
<entity name="USER_VISIBILITY"
        tableName="USER"
        maxEntries="2000"
        idField="USER_NAME">
    <updateOn tableName="USER_ATTRIBUTES">
        <entities>
            <![CDATA[
                getUserRecord(rxDb, genericRecord.getString("USER_NAME")).toFlowable()
        ]]>
        </entities>
        <users>
            <![CDATA[
                getUserRecord(rxDb, genericRecord.getString("USER_NAME")).toList()
        ]]>
        </users>
    </updateOn>
    <![CDATA[
        final DbRecord targetUser = user
        return Flowable.fromIterable(users).map { permissionedUser ->
            final String userName = permissionedUser.getString("USER_NAME")
            if(user.getString("ACCESS_TYPE") == "ALL"){
                new AuthEntry(userName, entityId, true)
            } else {
                new AuthEntry(userName, entityId, targetUser.getString("{{ADMIN_PERMISSION_ENTITY_FIELD}}") == permissionedUser.getString("{{ADMIN_PERMISSION_ENTITY_FIELD}}"))
            }
        }
        ]]>
</entity>

<entity name="ENTITY_VISIBILITY"
        tableName="USER_{{ADMIN_PERMISSION_ENTITY_TABLE}}_MAP"
        maxEntries="20000"
        idField="{{ADMIN_PERMISSION_ENTITY_FIELD}}" >
    <![CDATA[
        final Set<String> validUsers = getUsernamesForEntity(rxDb, entityId, null)
        return Flowable.fromIterable(users).map { user ->
            final String userName = user.getString("USER_NAME")
            if(user.getString("ACCESS_TYPE") == "ALL"){
                new AuthEntry(userName, entityId, true)
            } else {
                new AuthEntry(userName, entityId, userName in validUsers)
            }
        }
    ]]>
</entity>
```
Here is an example of using ENTITY_VISIBILITY in a data server or request server:

```kotlin
query("ALL_BID_OFFER_SELLER_DEALER", BID_OFFER_SELLER_VIEW) {
    permissioning {
        auth(mapName = "ENTITY_VISIBILITY") {
            BID_OFFER_SELLER_VIEW.SELLER_DEALER_ID
        }
        config {
            backwardsJoins = true
        }
    }
}
```

### Adding authorisation to the data server and request server

The code for permissioning specific queries must be inserted into your data servers and request servers.

The dynamic authorisation definition in a GPAL data server or request server has 4 settings, which can be used in any combination:
- grouping (and/or)
- where clauses
- hideFields
- enrichedAuth

#### Grouping

Auth definitions can be grouped with “and” or “or” operators. 
- You could have two simple permission maps, for example: one by counterparty and another one for forbidden symbols. If the user wants to see a specific row, they need to have both permissions at once. 
- You could have two permission maps: one for buyer and one for seller. A user would be allowed to see a row if they have a seller or buyer profile, but users without one of the those profiles would be denied access.

This example shows an AND grouping:

```kotlin
permissioning {
    auth(mapName = "ENTITY_VISIBILITY") {
        TRADE.COUNTERPARTY_ID
    } and auth(mapName = "SYMBOL_RESTRICTED") {
        TRADE.SYMBOL
    }
}
```


This example shows OR grouping

```kotlin
permissioning {
    auth(mapName = "ENTITY_VISIBILITY") {
        BID_OFFER.BUYER_ID
    } or auth(mapName = "ENTITY_VISIBILITY") {
        BID_OFFER.SELLER_ID
    }
}
```

#### Where clauses

You can define a where clause if you only want to show a row in specific cases. These authorisation definitions first evaluate the where clause against the permission map. This functionality on its own is not that useful, because for a single auth permissions map, the content of the where clause could be moved to the query where clause instead. However, it shines when using auth grouping, because you can filter rows based on individual user permissions.

The example below shows permissioning where authorisation is successful if the user satisifies one of two code blocks:
- The first block has a where clause that prevents the user (a permissioned buying countparty) from viewing cancelled trades.
- The second block makes the information visible to any permissioned selling counterparty - so they can view cancelled trades.

```kotlin
permissioning {
    auth(mapName = "ENTITY_VISIBILITY") {
        TRADE.BUYING_COUNTERPARTY
        where { trade ->
            TradeState.CANCELLED != trade.tradeState
        }
        //Only visible to users with entity access to SELLING_COUNTERPARTY ID on the trade WHERE trade state is not CANCELLED (so buyer can't see cancelled trades effectively)
    } or
    auth(mapName = "ENTITY_VISIBILITY") {
        TRADE.SELLING_COUNTERPARTY
        //No where clause, so always visible to users with entity access to SELLING_COUNTERPARTY ID on the trade
    }
}
```

#### hideFields

You can also have different column visibility levels based on user authorisation and row content.

The example below hides the LAST_TRADED_PRICE column value for a particular instrument code.

```kotlin
permissioning {
    auth(mapName = "EXCHANGE") {
        INSTRUMENT_DETAILS.EXCHANGE_ID
        hideField { userName, rowData ->
            if(rowData.instrumentCode == "ALLL3") LAST_TRADED_PRICE
            else null
        }
    }
}
```

#### enrichedAuth

Our permission model could require access to client-enriched data, so data servers have an additional level of auth functionality which takes this data into account.

Here is an example:

```kotlin
query("ALL_TRADES_WITH_ENRICHED_AUTH", TRADE_VIEW) {
    permissioning {
        enrichedAuth(mapName = "TRADE_VISIBILITY", enrichedEntity = FAVOURITE_TRADES) {
            TRADE_VIEW.TRADE_ID
            FAVOURITE_TRADES.USER_NAME
        }
    }
    enrich(FAVOURITE_TRADES){
        join { userName, row ->
            FavouriteTrades.ByTradeIdAndUserName(
                userName = userName,
                tradeId = row.tradeId
            )
        }
        fields {
            derivedField("FAVOURITE", BOOLEAN) { row, userData ->
                userData != null
            }
        }
    }
    config {
        compression = true
    }
}
```

## Dynamic permissioning

Here’s the scenario; we want to permission by checking the ACCOUNT table.
```kotlin
table(name = "ACCOUNT", id = 1000) {
    ID
    DISTRIBUTOR_ID
    OFFICER_ID
    ASSET_MANAGER_ID
    INVESTOR_ID
    NAME
    primaryKey(name = "ACCOUNT_BY_ID", id = 1) {
        ID
    }
}
```

We want to allow a user to view an account if one of the following is true:

* The user is a sales officer, and is the sales officer for the given account
* The user is an asset manager, and is the asset manager for the given account

The first thing we want to do is find out what type of user we're currently dealing with. We do this by checking the TAG table, and getting the PERSON_TYPE record for the given user. We can wrap this logic into a simple function and place it into the preExpression block:
```groovy
<preExpression>
        <![CDATA[

            import java.util.Collections
            import io.reactivex.rxjava3.core.SingleEmitter
            import io.reactivex.rxjava3.core.Flowable
            import io.reactivex.rxjava3.core.Single
            import io.reactivex.rxjava3.core.Maybe
            import static global.genesis.auth.perms.processor.PermsProcessorUtils.*
            
            static Flowable<DbRecord> getUserRecord(RxDb rxDb, String userName){
                final DbRecord userRecord = new DbRecord("USER")
                userRecord.setString("USER_NAME", userName)
                return Flowable.fromIterable(rxDb.get(userRecord, "USER_BY_NAME"))
            }
            
            /*
             * Get user type based on tag value
             */
            static Flowable<Boolean> getUserType(String userName) {
                def tagRec = new DbRecord('TAG')
                tagRec.setString('CODE', 'PERSON_TYPE')
                tagRec.setString('ENTITY_ID', userName)
                return Flowable.fromIterable(rxDb.get(tagRec, 'TAG_BY_CODE'))
            }
        ]]>
</preExpression>
    
</preExpression>
```

Here, we're simply creating a TAG record and attempting to find the PERSON_TYPE record. Once this call has returned, we can perform our logic, which looks like this:
```groovy
<entity name="ACCOUNT" maxEntries="10000" idField="ID">
        <updateOn table="TAG">
        <!-- Entities is expected to return a Flowable<DbRecord> or 'null' to force a full refresh of entity table -->
        <entities>
            <![CDATA[
                // If the TAG record does not contain a PERSON_TYPE change, then we don't need to process it
                if(genericRecord.getString('CODE') != 'PERSON_TYPE'){
                    return Flowable.empty()
                } else {
                    // If the TAG record contained a PERSON_TYPE change, we need to re-evaluate all ACCOUNT records against this user,
                    // therefore return "null" to force a full table refresh.
                return null
            }
            ]]>
        </entities>
        <!-- Users block is expected to return an FLowable<List<DbRecord>> or 'null' to force a full refresh of user table -->
        <users>
            <![CDATA[
                def userObs = getUserRecord(db, genericRecord.getString('ENTITY_ID'))
                return userObs.filter{it != null}.toList()
            ]]>
        </users>
        </updateOn>

    <![CDATA[
        // "users" is a Groovy expression binding which contains all the users that need to be updated against an entity
        def entityCode = account.getString('ID')
        return Flowable.fromIterable(users).flatMap{ user ->
            def userName = user.getString('USER_NAME')
    
            return getUserType(userName).flatMap{ tagRec ->
                def allowed = false
                def entityType = tagRec?.getString('TAG_VALUE')
        
                if(entityType == 'SALES_OFFICER') {
                    if(account.getString('OFFICER_ID') == userName) {
                        allowed = true
                    }
                }
        
                if(entityType == 'ASSET_MANAGER') {
                    if(account.getString('ASSET_MANAGER_ID') == userName) {
                        allowed = true
                    }
                }
                return Flowable.just(new AuthEntry(userName, entityCode, allowed))
            }
        }
    ]]>
</entity>
```
As you can see, we first get the **entityType** (note the inline null check to handle the fact the tag record may not exist). We can then check if the current user is stored against the account as either the sales officer, or the asset manager.

We always emit an **AuthEntry** object within our returned Flowable, which specifies whether the user is permissioned or not.

Also note the fact we're using Flowable. We wrap the users list to be a Flowable, then we **flatMap** the **getUserType** call and return a Flowable in the form of an **AuthEntry**.

We also define several items on the entity element:

* **name** - The entity (and table name) we're dealing with
* **maxEntries** - Max number of entries to read on initial scan
* **idField** - The account ID
* **updateOn** xml block - We want to re-evaluate the auth entries (entities and users) when the TAG table is updated, just in case we make a user sales officer/asset manager.

As mentioned above, we will also refresh when either the entity, user or user_attributes tables are updated. (Please note that the `user` handle readily available will contain all fields and their values from the `USER` and `USER_ATTRIBUTES` tables, meaning if you add a custom string field `FOO` to `USER_ATTRIBUTES`, `user.getString("FOO")` can be used to access it.). You will need to define `updateOnUserFields` (see further down) to ensure user data updates are triggered.

### Full example file
```groovy
<dynamicPermissions>

    <preExpression>
        <![CDATA[

            import java.util.Collections
            import io.reactivex.rxjava3.core.SingleEmitter
            import io.reactivex.rxjava3.core.Flowable
            import io.reactivex.rxjava3.core.Single
            import io.reactivex.rxjava3.core.Maybe
            import static global.genesis.auth.perms.processor.PermsProcessorUtils.*

            static Flowable<DbRecord> getUserRecord(RxDb rxDb, String userName){
                final DbRecord userRecord = new DbRecord("USER")
                userRecord.setString("USER_NAME", userName)
                return Flowable.fromIterable(rxDb.get(userRecord, "USER_BY_NAME"))
            }
            
            /*
             * Get user type based on tag value
             */
            static Flowable<Boolean> getUserType(String userName) {
                def tagRec = new DbRecord('TAG')
                tagRec.setString('CODE', 'PERSON_TYPE')
                tagRec.setString('ENTITY_ID', userName)
                return Flowable.fromIterable(rxDb.get(tagRec, 'TAG_BY_CODE'))
            }

        ]]>
    </preExpression>

    <!-- USER updates are assumed -->
    <entity name="ACCOUNT" maxEntries="10000" idField="ID">
        <updateOn table="TAG">
            <!-- Entities is expected to return an Flowable<DbRecord> or 'null' to force a full refresh of entity table -->
            <entities>
            <![CDATA[
                // If the TAG record does not contain a PERSON_TYPE change, then we don't need to process it
                if(genericRecord.getString('CODE') != 'PERSON_TYPE'){
                    return Flowable.empty()
                } else {
                    // If the TAG record contained a PERSON_TYPE change, we need to re-evaluate all ACCOUNT records against this user,
                    // therefore return "null" to force a full table refresh.
                    return null
                }
            ]]>
            </entities>
            <!-- Users block is expected to return an Flowable<List<DbRecord>> or 'null' to force a full refresh of user table -->
            <users>
            <![CDATA[
                def userObs = getUserRecord(db, genericRecord.getString('ENTITY_ID'))
                return userObs.filter{it != null}.toList()
            ]]>
            </users>
        </updateOn>

        <![CDATA[
            // "users" is a Groovy expression binding which contains all the users that need to be updated against an entity
            def entityCode = account.getString('ID')
            return Flowable.fromIterable(users).flatMap{ user ->
                def userName = user.getString('USER_NAME')
                
                return getUserType(userName).flatMap{ tagRec ->
                    def allowed = false
                    def entityType = tagRec?.getString('TAG_VALUE')
    
                    if(entityType == 'SALES_OFFICER') {
                        if(account.getString('OFFICER_ID') == userName) {
                            allowed = true
                        }
                    }
    
                    if(entityType == 'ASSET_MANAGER') {
                        if(account.getString('ASSET_MANAGER_ID') == userName) {
                            allowed = true
                        }
                    }
                    return Flowable.just(new AuthEntry(userName, entityCode, allowed))
                }
            }
        ]]>
    </entity>

</dynamicPermissions>
```


## Defining a permission rule

All permission rules are held in the file **auth-permissions.xml**.  In this file, you define rules against a specific entity, and each entity is defined against a database table.

We have a preExpression block inside our file, which is applied to all entities. This makes the definition `isUserEnabled` available to all entities.


    <preExpression>
        <![CDATA[

		    /*
		     * Check user status
		     */
		     def static isUserEnabled(user) {
		        return user.getString('STATUS') == 'ENABLED'
		     }
        ]]>
    </preExpression>

We can now call `isUserEnabled` from any entity block.

You must define an entity block for every entity you want to authorise.  Each block can have the following attributes:

| Name                 | Description                                                                                                                                                                                                   | Mandatory                              |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| name                 | The name of the entity you want to authorise.                                                                                                                                                                 | Yes                                    |
| maxEntries           | The maximum number of entries that the authorisation map will contain.                                                                                                                                        | No. Default  =5,000.                   |
| tableName            | The root table to you are giving access to.                                                                                                                                                                   | No. Default = the same value as name.  |
| idField              | Field(s) to use for keying internal collection (should be unique). Multiple fields must be separated with the \| symbol.                                                                                      | Yes                                    |
| updateOnUserFields   | Specify the list of USER and USER_ATTRIBUTE fields to which an update to the field should trigger a re-check of this entities permissions | No. Left undefined permissions checks will only be re-triggered on updates to USER.STATUS field, and no others. As such STATUS does not need to be included in this field list, it is assumed. |
| averageUserNameChars | Average number of characters in each username. This setting helps to fine-tune the backing data structure for the authorisation map.                                                                          | No. Default = 20                       |
| averageEntityChars   | Average number of characters of each entity. This setting helps to fine-tune the backing data structure for the authorisation map.                                                                            | No. Default = 7                        |
| averageUsers         | Average number of users on the system. This setting helps to fine-tune the backing data structure for the authorisation map.                                                                                  | No. Default = 1,000                    |
| updateOn             | Custom logic to trigger authorisation updates in specific scenarios. When tables defined in this section are modified, the authorisation map is refreshed following the configuration logic. See the example. | No                                     |

### Data server snippet
```kotlin
dataServer {

  query(FUND) {
    permissioning {
      auth(mapName = "ENTITY_VISIBILITY") {
        FUND.FUND_ID
      }
    }
  }
}
```

### Request server snippet
```kotlin
requestReplies {

  requestReply(FUND) {
    permissioning {
      auth(mapName = "ENTITY_VISIBILITY") {
        FUND.FUND_ID
      }
    }
  }
}
```

You can see an example of permissioning in practice in our [tutorial](/tutorials/building-an-application/permissions/).