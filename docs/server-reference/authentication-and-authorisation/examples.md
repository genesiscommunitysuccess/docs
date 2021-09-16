---
title: Examples
sidebar_label: Examples
sidebar_position: 2
id: examples

---
## Examples of dynamic permissioning

Here’s the scenario. We want to permission by checking the ACCOUNT table. This is specified as follows:

```xml
<table name="ACCOUNT">
    <fields>
        <field name="ID" />
        <field name="DISTRIBUTOR_ID" />
        <field name="OFFICER_ID" />
        <field name="ASSET_MANAGER_ID" />
        <field name="INVESTOR_ID" />
        <field name="NAME" />
    </fields>
    <keys>
        <key name="ACCOUNT_BY_ID" id="1" primary="true">
            <field name="ID" />
        </key>
    </keys>
</table>
```

We want to allow a user to view an account if one of the following is true:

* The user is a sales officer, and is the sales officer for the given account
* The user is an asset manager, and is the asset manager for the given account

The first thing we want to do is find out what type of user we're currently dealing with. We do this by checking the TAG table, and getting the PERSON_TYPE record for the given user. We can wrap this logic into a simple function and place it into the preExpression block:

```xml
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

```xml
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

```xml
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

### Query implementation snippet using "authRequired"

```xml
<dataServer>
    <query name="FUND">
        <!-- 'entity' attribute is optional and refers to the entity in name in -permissions file. By default it will have the same value as the root table for that query. -->
        <!-- Also, key is based on a metadata field and its value, not on the entity field name. It can be a combination of fields separated by '|' -->
        <authRequired key="FUND_ID" entity="FUND"/>

        <metadata>
            <fields>
                <field name="FUND_ID" type="STRING" />
                <field name="INSTRUMENT_ID" type="STRING" />
                <field name="QUANTITY" type="INT" />
                ...
                ...
                ...
```

### Request Server Snippet using "authRequired"

```xml
<dataServer>
    <query name="FUND">
        <!-- 'entity' attribute is optional and refers to the entity in name in -permissions file. By default it will have the same value as the root table for that query. -->
        <!-- Also, key is based on a metadata field and its value, not on the entity field name. It can be a combination of fields separated by '|' -->
        <authRequired key="FUND_ID" entity="FUND"/>

        <metadata>
            <fields>
                <field name="FUND_ID" type="STRING" />
                <field name="INSTRUMENT_ID" type="STRING" />
                <field name="QUANTITY" type="INT" />
                ...
                ...
                ...
```