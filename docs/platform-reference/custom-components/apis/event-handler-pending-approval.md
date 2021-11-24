---
id: event-handler-pending-approval
title: Pending approvals
sidebar_label: Pending approvals
sidebar_position: 5
---

# Pending approvals

The Genesis LCNC Platform has an in-built pending approval mechanism for optional use with event handlers. This is useful where particular events require a second user to approve them in order to take effect. Genesis Pending Approvals works with the concepts of “delayed” events and "4-eyes check". 

## Set an event to require approval

Any event can be marked to "require approval" as long as the `REQUIRES_APPROVAL` flag is set to `true` in the incoming message. However, an event can be configured for a mandatory `REQUIRES_APPROVAL` flag check by overriding the `requiresPendingApproval` method to `true` in the custom event handler definitions and setting the `requiresPendingAproval` property to `true` in a GPAL event handler. 

Here is an example of a custom event handler definition:

 
```kotlin
import global.genesis.commons.annotation.Module
import global.genesis.eventhandler.typed.async.AsyncValidatingEventHandler
import global.genesis.message.core.event.Event
import global.genesis.message.core.event.EventReply

@Module
class TestCompanyHandlerAsync : AsyncValidatingEventHandler<Company, EventReply> {
    // Override requiresPendingApproval here to make the "pending approval" flow mandatory.
    override fun requiresPendingApproval(): Boolean = true
    
    override suspend fun onValidate(message: Event<Company>): EventReply {
        val company = message.details
        // custom code block..
        return ack()
    }

    override suspend fun onCommit(message: Event<Company>): EventReply {
        val company = message.details
        // custom code block..
        return ack()
    }
}
```

or in a GPAL definition:

```kotlin

eventHandler {
    eventHandler<Company> {
        requiresPendingApproval = true
        onCommit { event ->
            val company = event.details
            // custom code block..
            ack()
        }
    }
}
```

Events submitted with a "REQUIRES_APPROVAL" flag set to true are validated as usual (i.e. the onValidate method is run) and, if the validation is successful, the “delayed” event is stored in the APPROVAL table in a json format. 


Assuming the event is inserting, updating or deleting a target database record, it is possible to have have multiple APPROVAL records associated to a single database entity. Use the event `onValidate` method to check for pre-existing approvals against the entities related to the event if you need to ensure there is only one pending approval per record. The validate method can also be used to determine if the incoming event needs approval e.g. checking if a particular field has been amended, or checking the tier on an incoming EVENT_ADD_CLIENT. If it does, then you can add the REQUIRES_APPROVAL flag to the event message.

The APPROVAL record is keyed on an auto-generated APPROVAL_ID and does not have a direct link to the original record. You have to create a link by adding “approval entity” details to the payload returned on an event ack in the "onValidate" method. These details include the ENTITY_TABLE and ENTITY_KEY. This allows the developer to decide how to identify the original record (e.g. creating a compound key in the case of multi-field keys). When the approval entity details are provided, the platform creates a record in the APPROVAL_ENTITY table and populates it with the provided details, and the APPROVAL_ID of the APPROVAL record. There is also an APPROVAL_ENTITY_COUNTER which is populated by the AUTH_CONSOLIDATOR process by default and can be handy in order to easily know how many approvals are pending for a given entity.


```kotlin
    override suspend fun onValidate(message: Event<Company>): EventReply {
        val company = message.details
        // custom code block..
        return ack(listOf(mapOf("ENTITY_TABLE" to "COMPANY", "ENTITY_ID" to company.companyId)))
    }
```


In order to display pending approvals against the original record in the GUI, you can use the APPROVAL_ENTITY table to join to the APPROVAL records in a view and then display the information using a dataserver or a request reply. The details of the pending event are stored in json format.


**Example APPROVAL DB record**


```DbM
TIMESTAMP          2018-09-19 09:29:51.111951844            NANO_TIMESTAMP
APPROVAL_ID        000000000000002APLO1                     STRING
APPROVAL_KEY       8a178f41-24c6-4cb3-b4e0-1996ae59bcddA... STRING
APPROVAL_MESSAGE   Please approve this amendment            STRING
APPROVAL_STATUS    PENDING                                  ENUM[PENDING APPROVED CANCELLED REJECTED_BY_USER REJECTED_BY_SERVICE]
DESTINATION        EEP_INTENT_SERVICE                       STRING
MESSAGE_TYPE       EVENT_OPS_INTENT                           STRING
EVENT_DETAILS        TRADE_ID = LCH20180917.18500000098 DE... STRING
EVENT_MESSAGE        {"MESSAGE_TYPE":"EVENT_OPS_INTENT","VAL... STRING
USER_NAME          CdsTest                                  STRING
```

## Configuring allowed approvers

Once in the APPROVAL table, the pending event can be cancelled, rejected or accepted by sending the following event messages to GENESIS_CLUSTER: 

- EVENT_PENDING_APPROVAL_ACCEPT
- EVENT_PENDING_APPROVAL_CANCEL
- EVENT_PENDING_APPROVAL_REJECT

All messages accept a REASON_CODE in their metadata.

The platform ensures that users cannot approve their own events. Additional levels of control (e.g. based on user groups) can be added to the front end, to the event validate method, or can be specified in server-side configuration.

To configure the allowed approvers in a server-side configuration, you need to create a new xml file with the following content and add the filename to the GENESIS_CLUSTER `<config></config>` element in a site-specific version of the genesis-processes.xml:

```xml
<genesisCluster>
    <preExpression>
        <![CDATA[

        ]]>
    </preExpression>

    <pendingApproval>
        <insertPendingApproval>
            <![CDATA[
               true
            ]]>
        </insertPendingApproval>
        <acceptPendingApproval>
            <![CDATA[
               true
            ]]>
        </acceptPendingApproval>
        <rejectPendingApproval>
            <![CDATA[
               true
            ]]>
        </rejectPendingApproval>
        <cancelPendingApproval>
            <![CDATA[
               true
            ]]>
        </cancelPendingApproval>
    </pendingApproval>
</genesisCluster>
```

You can replace the "true" return value with Groovy code in each "pendingApproval" block. The platform makes the following objects accessible to your code:

- `userName` - a string property containing the user name who trigger the event (insert, accept, reject or cancel)
- `db` - an RxDb property so you can access the database layer and do appropriate checks.
- `pendingApproval` - the pending approval record stored in database (only available in accept, reject or cancel events)

Using this xml configuration, you can look up the user's rights in the database and return `true` only if the necessary rights are in place. For example, if your system has the concept of internal and external users and you only want to allow internal users to accept pending events, then you could check your custom user "ACCESS_TYPE" field as follows:

```xml
        ...
        <acceptPendingApproval>
            <![CDATA[
               def searchRecord = new DbRecord("USER_ATTRIBUTES")
               def userAttributes = db.get(searchRecord, "USER_ATTRIBUTES_BY_USER_NAME")
               userAttributes?.getString("ACCESS_TYPE") == "INTERNAL"
            ]]>
        </acceptPendingApproval>
        ...
```

