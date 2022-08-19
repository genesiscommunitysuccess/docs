---
title: 'Authorisation API'
sidebar_label: 'Authorisation API'
id: authorisation-api
---

The authorisation API consists of two main classes that enable you to add permission checks to your custom component.

-   `RightSummaryCache` is a Kotlin class whose instance can be obtained by simply injecting it into your custom component. This functionality relates directly to the permission codes functionality covered in more detail in the [Authorisation Overview](/server-modules/access-control/authorisation-overview/). The method `userHasRight(userName: String, rightCode: String): Boolean` is used to determine if a particular user has the permission to a rights code.

-   `AuthCache` is a Kotlin class whose instance should be created by calling the static method `AuthCache.newReader(mapName: String, updateQueue: UpdateQueue): AuthCache`.
    An UpdateQueue instance can be obtained from an injected RxDb connection: `rxDb.updateQueue`. A permission check for the entity is done by calling `isAuthorised(entityId: String?, userName: String): Boolean`, How this works is also covered in more detail in [Authorisation Overview](/server-modules/access-control/authorisation-overview/).

### Permission code API

```kotlin
package global.genesis.session
// imports omitted for brevity

@Singletonclass RightSummaryCache 
@Inject constructor(db: RxDb) : AbstractBulkTableSubscriber<RightSummaryCache.RightSummary>(
    db,
    "RIGHT_SUMMARY"
) {        
    // other members omitted for brevity    
    fun userHasRight(userName: String, rightCode: String): Boolean {        
        // details omitted for brevity 
    }
}
```

### AuthCache API

```kotlin
package global.genesis.session
// imports omitted for brevity

class AuthCache private constructor(private val mapName: String, updateQueue: UpdateQueue) : MasterAuthCache {      
    companion object {        
        @JvmStatic        
        fun newReader(mapName: String, updateQueue: UpdateQueue): AuthCache {
            // details omitted for brevity       
        }    
    }    
    
    override fun isAuthorised(entityId: String?, userName: String): Boolean {        
        // details omitted for brevity   
    }
}
```

### In practice

The example below shows permission codes and `AuthCache` in use:

```kotlin
// import and package omitted for brevity 

@Moduleclass PriceFeedEventHandler @Inject constructor(    
    private val rxDb: RxDb,    
    private val rightSummaryCache: RightSummaryCache
) : SyncEventHandler<PriceFeedRequest, EventReply> {    
    private lateinit var authCache: Authority    
    @Inject    
    fun init() {        
        LOG.info("Starting Price Feed Handler")        
        authCache = AuthCache.newReader("PRICE_FEEDS", rxDb.updateQueue)    
    }    
    
    override fun process(event: Event<PriceFeedRequest>): EventReply {        
        val userName = event.userName        
        // Determines if User has access to any PRICE_FEED        
        if (rightSummaryCache.userHasRight(userName, "PRICE_FEEDS")) {            
            // Determines if User has granular access to a specific PRICE_FEED            
            val feedName = event.details.name            
            if (authCache.isAuthorised(feedName, userName)) {                
                val feelUrl = getFeedUrl(feedName)               
                return EventReply.EventAck(listOf(mapOf("FEED_URL" to feelUrl)))            
            }        
        }        
        return StandardError("NOT_AUTHORISED", "User $userName lacks sufficient permissions").toEventNackError()    
    }    
    
    private fun getFeedUrl(feedName: String): String {        
        // details omitted for brevity        
        return "TODO"    
    }    
    
    companion object {        
        private val LOG = LoggerFactory.getLogger(PriceFeedEventHandler::class.java)    
    }
}
```
