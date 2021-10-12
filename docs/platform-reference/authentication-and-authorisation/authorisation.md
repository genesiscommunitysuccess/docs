---
title: Authorisation
sidebar_label: Authorisation
sidebar_position: 2
id: authorisation
---

Authorisation is achieved by permissioning dynamically. This means you can control access to information in increasingly precise ways, for example:

* The whole entity
* Specific rows
* Specific columns

Effectively, you have three levels of control:

**High level**

You could hide an entire grid from the UI, for example. So one group could view reference data, but this would be hidden from the other groups. Or, you could hide an entire data server. For this, you use RIGHT_CODE. This is like a switch – you can either see it or not, depending on whether the code is TRUE or FALSE.

**Entity level**

This is row or column-level access to information. Different users all view the same grid, but each one sees different data. This is, best explained with these simple examples:

* You can have user A, user B and user C all having the RIGHT_CODE to view a specific grid, but each one sees different trades in that grid. This enables you to separate different trading desks, for example.
* Each user might only have access to trades for specific customers.
* By including these permissions in an event handler,  user A can only enter a trade on behalf of a specific set of clients and user B can only enter trades on behalf of a different set of clients.

Similarly, you can have different users seeing different columns in the same grid. This could be used for a support function, for example, where you don’t want the support team to see specific columns of sensitive data, such as who the client for a trade is. It can be specified by using GPAL.

## User roles and profiles

We have users, profiles and right codes.

A profile can have zero to many rights codes and zero to many users.

So, if you have, say three roles, Trader, Support, and Operations, you set up the rights codes for each of these three profiles and then allocate each user to the appropriate profile. A user can have more than one profile, so you could allocate a superuser to all three profiles; that superuser would have the rights of all three profiles.

You cannot allocate rights codes directly to a specific user. But there is nothing to stop you from creating a profile that has only one user.

This information is held on the following tables:

* PROFILE_RIGHT. For each profile, this lists the entities that the profile has the right to view.
* PROFILE_USER. For each profile, this lists the users who have been allocated (and therefore, who have the rights in the relevant PROFILE_RIGHT table).
* RIGHT_SUMMARY. This is created automatically by the system in real time. It maps all users to their rights.

In this way, the rights are easily accessible at speed. The AUTH_MANAGER process manages this automatically. So if you add a new user or you update a profile with new rights, the RIGHT_SUMMARY table is updated immediately and all the users in that profile receive the new right automatically.

If the profile has write access to an entity, then it automatically includes read rights.

### Loading a list of users

If you need to load a list of users and profiles you can use **SendIt** to send the list to the database, but it does not update the RIGHT_SUMMARY table automatically. After loading the database, you need to run the script **consolidateRights** to update the RIGHT_SUMMARY table.

### Good practice, bad practice

With this route, you can allocate rights to profiles and users to rights – and  change them. There is no change to the code needed.  However, our advice is to be as granular as possible at the start, because it is more difficult to introduce that granularity at a later point.  If you create a new right, you have to change the code.

### Entity level (row level)

The GENESIS_AUTH_PERMS process runs automatically on start-up and creates a memory-mapped file that acts as a big key-value pair – for example, User J has access to Counterparty 1, User J has access to Counterparty 2, User K has access to Counterparty 1, User K has access to Counterparty 4, etc. If there is no appropriate entry in the file, the user won’t have access.

You must keep the process running, as it maintains itself automatically whenever any permissions change. If a permission is changed this way, then the change is automatically reflected on screen. If I have a grid on screen with 4 trades from Counterparty 1 and my permission to view that counterparty are withdrawn, those 4 trades disappear from my screen immediately.

In many cases, you want different people to have access to different functions and different information, based on their roles.  In Genesis, users are not permissioned individually for these purposes. Instead, permissioning is based on roles. You define what information and functions are available to a role, and then you allocate users to these roles. We refer to this as dynamic authorisation. There is nothing to stop you creating a role that has only one user, of course.

## General approach

On startup, the GENESIS_AUTH_PERMS process performs an initial scan of all entities. For each entity found, it performs authorisation against every user in the system. This builds a full map of permissioned users.

By default, any updates to the entity and the USER table will be automatically processed to permission new entities as they are entered into the database.

Entries are stored in a memory-mapped file located in **$GENESIS_HOME/runtime/authCache**.

If you need to clear out the entries by hand, simply delete everything in that directory and restart GENESIS_AUTH_PERMS.

More than one permission map per table may be created.

## Generic Permissions

The generic permissions model available in auth automatically builds “auth-perms” maps and also ensures all the admin transactions, dataservers and request reply resources are authorised correctly on a multi-tenant basis. This generic approach might not work for every use case, but it should be good enough for many development scenarios and therefore should cover all the basics out of the box.

### Configuration
There is a field called ACCESS_TYPE in the USER_ATTRIBUTES table which will determine what authorisation method should be applied for a particular user.
```kotlin
field(name = "ACCESS_TYPE", type = ENUM("ALL", "ENTITY", "MULTI_ENTITY", default = "ALL")) 
```

*Note*: Only ALL and ENTITY are in working condition at the moment.

Users with ACCESS_TYPE set to ENTITY (e.g. the entity could be represented by COUNTERPARTY_ID) will be restricted in both visibility and entitlements to their own entity.

The inner working of this new feature is also controlled by two system definition items:

```kotlin
systemDefinition {
    global {
        item(name = "ADMIN_PERMISSION_ENTITY_TABLE", value = "COUNTERPARTY")
        item(name = "ADMIN_PERMISSION_ENTITY_FIELD", value = "COUNTERPARTY_ID")
    }
}
```

These two items will change the structure of auth-tables-dictionary.kts and auth-permissions.templt.xml to accomodate the defined table and field and ensure table/permission data structure is built correctly.

USER_ATTRIBUTES table definition in auth-tables-dictionary.kts below:
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
The permissions field will be added dynamically to USER_ATTRIBUTES so it can be used in our auth transactions to control entitlements.

The following table will be created as well (ignore MULTI_ENTITY setup for now, still in development) which will be used internally to manage AUTH_PERMS results.:

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
Two auth maps exist in auth-permissions.templt.xml to control row visibility of users (in auth dataserver and auth request reply) and also the generic entities. See below:
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
An example of using ENTITY_VISIBILITY in a dataserver/request-reply can be something like this:

```kotlin
query("ALL_BID_OFFER_SELLER_DEALER", BID_OFFER_SELLER_VIEW) {
    permissioning {
        auth(mapName = "ENTITY_VISIBILITY") {
            BID_OFFER_SELLER_VIEW.SELLER_DEALER_ID
        }
        config {
            backJoins = true
        }
    }
}
```

### Adding authorisation to the data server and request server

The code for permissioning specific queries must be inserted into your data servers and request servers.

The dynamic authorisation definition in GPAL dataserver/requestserver has 4 settings which can be used in any combination.

#### Grouping

Auth definitions can now be grouped with “and” or “or” operators. This means you could have two simple permission maps, for example, one by counterparty and another one for forbidden symbols. This would require a user to have those two permissions at once in order to see the row. Alternatively, you could have two permission maps (one for buyer and one for seller). A user would be allowed to see a row if they have a seller or buyer profile, but users without one of the those profiles would be denied access.

##### AND grouping

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

##### OR grouping

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

You can define a where clause if you only want to show a row in specific cases. Authorisation definitions using a where clause first evaluate the where clause against the permission map. This functionality on its own is not that useful, as for a single auth permissions map the content of the where clause could be moved to the query where clause instead. However, it shines when using auth grouping, because you can filter rows based on individual user permissions.

This example shows different where clauses based on user role.

```kotlin
permissioning {
    auth(mapName = "ENTITY_VISIBILITY") {
        BID_OFFER_BIDDER_VIEW.CLIENT_ID
        where { view ->
            !(BidState.DRAFT == view.bidState && !(BidBookState.OPEN == view.bidBookState ||(BidBookState.UPCOMING == view.bidBookState)) )
        }
    } or
    auth(mapName = "ENTITY_VISIBILITY") {
        BID_OFFER_BIDDER_VIEW.BUYER_DEALER_ID
        where { view ->
            !((BidBookState.UPCOMING == view.bidBookState || BidBookState.OPEN == view.bidBookState) && DealerRole.PRINCIPAL == view.dealerRole)
        }
    }
}
```

#### HideFields

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

#### EnrichedAuth

Our permission model could require access to client enriched data, so dataservers have an additional level of auth functionality which takes this data into account.

Example below:

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

## Dynamic Permissioning

Here’s the scenario, we want to permission by checking the ACCOUNT table.
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
        import com.google.common.util.concurrent.Futures
        import com.google.common.util.concurrent.ListenableFuture
        import com.google.common.util.concurrent.FutureCallback
        import rx.Emitter
        import global.genesis.dta.dta_db.engine.aerospike.ops.RecordSearchDetails
        
        /*
            * Get user record based on userName
            */
        static Observable<DbRecord> getUserRecord(DtaDb db, String userName){
            final DbRecord userRecord = new DbRecord("USER")
            userRecord.setString("USER_NAME", userName)
            return Observable.from(db.get(userRecord, "USER_BY_NAME"))
        }

        /*
            * Get user type based on tag value
            */
        static Observable<DbRecord> getUserType(userName) {
            def tagRec = new DbRecord('TAG')
            tagRec.setString('CODE', 'PERSON_TYPE')
            tagRec.setString('ENTITY_ID', userName)
            return Observable.from(db.get(tagRec, 'TAG_BY_CODE'))
        }
        
        // Other useful functions to create more performant Observables    
        static Observable<DbRecord> toObservable(ListenableFuture<DbRecord> getOperation){
            return Observable.create({ Emitter<DbRecord> emitter ->
                Futures.addCallback(getOperation, new FutureCallback<DbRecord>() {
                        @Override
                        public void onSuccess(DbRecord record){
                            emitter.onNext(record)
                            emitter.onCompleted()
                        }
        
                        public void onFailure(Throwable t){
                            emitter.onError(t)
                        }
                });
            }, Emitter.BackpressureMode.NONE)
        }
            
        static Observable<List<DbRecord>> toObservableList(ListenableFuture<List<DbRecord>> getOperation){
            return Observable.create({ Emitter<List<DbRecord>> emitter ->
                Futures.addCallback(getOperation, new FutureCallback<List<DbRecord>>() {
                        @Override
                        public void onSuccess(List<DbRecord> record){
                            emitter.onNext(record)
                            emitter.onCompleted()
                        }
        
                        public void onFailure(Throwable t){
                            emitter.onError(t)
                        }
                });
            }, Emitter.BackpressureMode.NONE)
        }
        
    ]]>
    
</preExpression>
```

Here, we're simply creating a TAG record and attempting to find the PERSON_TYPE record. Once this call has returned, we can perform our logic, which looks like this:
```groovy
<entity name="ACCOUNT" maxEntries="10000" idField="ID">
    <updateOn table="TAG">
        <!-- Entities is expected to return an Observable<DbRecord> or 'null' to force a full refresh of entity table -->
        <entities>
        <![CDATA[
            // If the TAG record does not contain a PERSON_TYPE change, then we don't need to process it
            if(genericRecord.getString('CODE') != 'PERSON_TYPE'){
                return Observable.empty()
            } else {
                // If the TAG record contained a PERSON_TYPE change, we need to re-evaluate all ACCOUNT records against this user,
                // therefore return "null" to force a full table refresh.
                return null
            }
        ]]>
        </entities>
        <!-- Users block is expected to return an Observable<List<DbRecord>> or 'null' to force a full refresh of user table -->
        <users>
        <![CDATA[
            // Return an Observable<List<DbRecord>> (we perform a conversion toList()) for a single user
            def userObs = getUserRecord(db, genericRecord.getString('ENTITY_ID'))
            return userObs.filter{it != null}.toList()
        ]]>
        </users>
    </updateOn>

    <![CDATA[
        // "users" is a Groovy expression binding which contains all the users that need to be updated against an entity
        def entityCode = account.getString('ID')
        return Observable.from(users).flatMap{ user ->
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
                return Observable.just(new AuthEntry(userName, entityCode, allowed))
            }
        }
    ]]>
</entity>
```
As you can see, we first get the **entityType** (note the inline null check to handle the fact the tag record may not exist). We can then check if the current user is stored against the account as either the sales officer, or the asset manager.

We always emit an **AuthEntry** object within our returned Observable, which specifies whether the user is permissioned or not.

Also note the fact we're using Observables. We wrap the users list to be an Observable, then we **flatMap** the **getUserType** call and return an observable in the form of an **AuthEntry**.

We also define several items on the entity element:

* **name** - The entity (and table name) we're dealing with
* **maxEntries** - Max number of entries to read on initial scan
* **idField** - The Account ID
* **updateOn** xml block - We want to re-evaluate the auth entries (entities and users) when the TAG table is updated, just in case we make a user sales officer/asset manager.

As mentioned above, we will also refresh when either the entity or user table is updated.

### Full example file
```groovy
<dynamicPermissions>

    <preExpression>
        <![CDATA[

            import java.util.Collections
            import com.google.common.util.concurrent.Futures
            import com.google.common.util.concurrent.ListenableFuture
            import com.google.common.util.concurrent.FutureCallback
            import rx.Emitter
            import global.genesis.dta.dta_db.engine.aerospike.ops.RecordSearchDetails
            
            static Observable<DbRecord> getUserRecord(DtaDb db, String userName){
                final DbRecord userRecord = new DbRecord("USER")
                userRecord.setString("USER_NAME", userName)
                return Observable.from(db.get(userRecord, "USER_BY_NAME"))
            }

            /*
                * Get user type based on tag value
                */
            static Observable<DbRecord> getUserType(userName) {
                def tagRec = new DbRecord('TAG')
                tagRec.setString('CODE', 'PERSON_TYPE')
                tagRec.setString('ENTITY_ID', userName)
                return Observable.from(db.get(tagRec, 'TAG_BY_CODE'))
            }
            
            // Other useful functions to create more performant Observables    
            static Observable<DbRecord> toObservable(ListenableFuture<DbRecord> getOperation){
                return Observable.create({ Emitter<DbRecord> emitter ->
                    Futures.addCallback(getOperation, new FutureCallback<DbRecord>() {
                            @Override
                            public void onSuccess(DbRecord record){
                                emitter.onNext(record)
                                emitter.onCompleted()
                            }
            
                            public void onFailure(Throwable t){
                                emitter.onError(t)
                            }
                    });
                }, Emitter.BackpressureMode.NONE)
            }
                
            static Observable<List<DbRecord>> toObservableList(ListenableFuture<List<DbRecord>> getOperation){
                return Observable.create({ Emitter<List<DbRecord>> emitter ->
                    Futures.addCallback(getOperation, new FutureCallback<List<DbRecord>>() {
                            @Override
                            public void onSuccess(List<DbRecord> record){
                                emitter.onNext(record)
                                emitter.onCompleted()
                            }
            
                            public void onFailure(Throwable t){
                                emitter.onError(t)
                            }
                    });
                }, Emitter.BackpressureMode.NONE)
            }
        ]]>
    </preExpression>

    <!-- USER updates are assumed -->
    <entity name="ACCOUNT" maxEntries="10000" idField="ID">
        <updateOn table="TAG">
            <!-- Entities is expected to return an Observable<DbRecord> or 'null' to force a full refresh of entity table -->
            <entities>
            <![CDATA[
                // If the TAG record does not contain a PERSON_TYPE change, then we don't need to process it
                if(genericRecord.getString('CODE') != 'PERSON_TYPE'){
                    return Observable.empty()
                } else {
                    // If the TAG record contained a PERSON_TYPE change, we need to re-evaluate all ACCOUNT records against this user,
                    // therefore return "null" to force a full table refresh.
                    return null
                }
            ]]>
            </entities>
            <!-- Users block is expected to return an Observable<List<DbRecord>> or 'null' to force a full refresh of user table -->
            <users>
            <![CDATA[
                // Return an Observable<List<DbRecord>> (we perform a conversion toList()) for a single user
                def userObs = getUserRecord(db, genericRecord.getString('ENTITY_ID'))
                return userObs.filter{it != null}.toList()
            ]]>
            </users>
        </updateOn>

        <![CDATA[
            // "users" is a Groovy expression binding which contains all the users that need to be updated against an entity
            def entityCode = account.getString('ID')
            return Observable.from(users).flatMap{ user ->
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
                    return Observable.just(new AuthEntry(userName, entityCode, allowed))
                }
            }
        ]]>
    </entity>

</dynamicPermissions>
```
## Defining a permission rule

All permission rules are held in the file auth-permissions.xml.  In this file, you define rules against a specific entity, and each entity is defined against a database table.

We have a preExpression block inside our file, which is applied to all entities. This makes the definition isUserEnabled  available to all entities.

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
We can now call isUserEnabled from any entity block.

You must define an entity block for every entity you want to authorise.  Each block can have the following attributes:

| Name                 | Description                                                                                                                                                                                                   | Mandatory                              |   |   |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|---|---|
| name                 | The name of the entity you want to authorise.                                                                                                                                                                 | Yes                                    |   |   |
| maxEntries           | The maximum number of entries that the authorisation map will contain.                                                                                                                                        | No. Default  =5,000.                   |   |   |
| tableName            | The root table to you are giving access to.                                                                                                                                                                   | No. Default = the same value as name.  |   |   |
| idField              | Field(s) to use for keying internal collection (should be unique). Multiple fields must be separated with the \| symbol.                                                                                      | Yes                                    |   |   |
| updateOnUserFields   | If the USER table is extended with extra fields, add a \| separated list here to specify the fields that trigger an update.                                                                                   | No                                     |   |   |
| averageUserNameChars | Average number of characters in each username. This setting helps to fine-tune the backing data structure for the authorisation map.                                                                          | No. Default = 20                       |   |   |
| averageEntityChars   | Average number of characters of each entity. This setting helps to fine-tune the backing data structure for the authorisation map.                                                                            | No. Default = 7                        |   |   |
| averageUsers         | Average number of users on the system. This setting helps to fine-tune the backing data structure for the authorisation map.                                                                                  | No. Default = 1,000                    |   |   |
| updateOn             | Custom logic to trigger authorisation updates in specific scenarios. When tables defined in this section are modified, the authorisation map is refreshed following the configuration logic. See the example. | No                                     |   |   |

### Data Server snippet
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

### Request Server snippet
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