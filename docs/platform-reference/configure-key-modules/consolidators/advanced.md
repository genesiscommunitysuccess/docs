---
title: Consolidator reference
sidebar_label: Consolidator reference
id: advanced
sidebar_position: 20

---

A consolidator listens to a table in the database, performs a calculation using that data, then writes the result to another table in the database.

Using consolidators, you can group, summarize and aggregate sets of records in real time. For example, a consolidator can be used to calculate the residual quantity of all the orders within an order basket.


## Configuration
You define consolidators in an xml file with the name **_application_-consolidator.xml**. 
If your application is called *Tiresias*, your configuration file is **tiresias-consolidator.xml**.
Within your file, you can define as many consolidators as you like. 
Each consolidator definition is a code block with the following elements:


* **name** to identify the consolidation block.

* **start** which can be set to true or false and will enable or disable the consolidation on startup.

* **group** is optional and causes consolidations to be thread-safe between each other. This is useful to make sure numbers are correct if you need records to be consolidated based on different root tables. For example, TRADE -> ORDER and ORDER -> ORDER consolidations should be in the the same group.

* **tables** which are the table joins used to get the data, in a similar way to the dataserver. A table has a name, and an alias used to bind the results of queries to variables and, optionally, the list of field names that will be used for numeric calculations in the node (`consolidationFields` attribute). 
* If you don't define a `consolidationFields` attribute, the consolidation manager will attempt to set all numeric values to **0** for each consolidation to avoid any potential null pointer exceptions (not efficient with large tables). Backward joins are also supported (only one per consolidation).

* **groupBy** represents the unique `group` key to define where each event belongs. This is a Groovy expression that needs to return a string, and all the aliases from `<tables>` are available as bindings. For convenience, there is a helper method called "group", that accepts multiple input values and concatenates them using the "|" symbol.

IMPORTANT: Do not supply null values  to the group method. If you are using a nullable field,  use the elvis operator: 

```kotlin
group(trade.getString("DEAL_ID") ?: "NULL")
```
 
* **consolidateTable** which represents the table in which the consolidation rows are fetched and modified. They have a name and an alias which will be used to reference this record in the `<calculation>` and `<consolidationTarget>` nodes. They can also be set as transient or non-transient (the default). consolidationFields attribute is also (optionally) present in this table.

* **consolidateTarget** which contains the join expression used to fetch the "consolidated" row relative to this specific consolidation event using the key defined in the "key" attribute. If the consolidation record is not found, it will be created with all numeric fields zeroed representing an initial row. Additionally, the computed string in the `groupBy` Groovy expression is available as a binding called `groupId`.

* **calculation** is groovy code where the actual computation of the consolidation is performed.

### Example
Here is an example file that defines two consolidators:

* CON_ORDER_FROM_TRADES - This consolidator totals up 'order quantity' across the ```TRADE``` table, grouping by field ```TRADE.ORDER_ID```
                          into a table ```ORDER_CONSOLIDATED_VOLUME```
               
* CON_BASKET_FROM_ORDERS - This consolidator counts up 'number of orders' and the 'order quantity' grouped by field ```BASKET_ORDER_DETAILS.BASKET_ID``` from the ```ORDERS``` table
                           with basket being determined from a join on the ```BASKET_ORDER_DETAILS``` table, into a table ```BASKET```. 
* 
                           The Backward joining definition ensures that any real time changes made to the ```BASKET_ORDER_DETAILS``` are reflected back into the calculation.  


```xml
<consolidations>
    <consolidation name="CON_ORDER_FROM_TRADES" start="false" group="ORDER">
        <tables>
            <table name="TRADE" alias="tr" seedKey="TRADE_BY_ID" consolidationFields="QUANTITY"/>
        </tables>

        <groupBy>
            <![CDATA[
            tr.getString("ORDER_ID")
            ]]>
        </groupBy>

        <consolidateTable name="ORDER_CONSOLIDATED_VOLUME" alias="ov" consolidationFields="CONSOLIDATED_VOLUME" transient="false">
            <consolidationTarget key="ORDER_BY_ID">
                <![CDATA[
                ov.setString("ORDER_ID", groupId)
                ]]>
            </consolidationTarget>

            <calculation>
                <![CDATA[
                    int deltaVolume = tr.getInteger("QUANTITY") - previous_tr.getInteger("QUANTITY")
                    int oldConsolidatedVolume = ov.getInteger("CONSOLIDATED_VOLUME")
                    int newConsolidatedVolume = oldConsolidatedVolume + deltaVolume
                    ov.setInteger("CONSOLIDATED_VOLUME", newConsolidatedVolume)
                ]]>
            </calculation>

        </consolidateTable>
    </consolidation>

    <consolidation name="CON_BASKET_FROM_ORDERS" start="true">
        <tables>
            <table name="ORDER" alias="o" seedKey="ORDER_BY_ID" consolidationFields="VOLUME"/>

            <table name="BASKET_ORDER_DETAILS" alias="bo" >
                <join key="BASKET_ORDER_DETAILS_BY_ORDER_ID">
                    <![CDATA[
                    bo.setString("ORDER_ID", o.getString("ORDER_ID"))
                    ]]>
                </join>
                <backwardJoin>
                    <![CDATA[
                    parent.setString('ORDER_ID', child.getString('ORDER_ID'))
                    ]]>
                </backwardJoin>
            </table>
        </tables>
        
            
        <where>
            <![CDATA[
                bo != null
            ]]>
        </where>


        <groupBy>
            <![CDATA[
            group(bo?.getString("BASKET_ID"))
            ]]>
        </groupBy>


        <consolidateTable name="BASKET" alias="consbasket" consolidationFields="NUM_ORDERS VOLUME">
            <consolidationTarget key="BASKET_BY_ID">
                <![CDATA[
                consbasket.setString("BASKET_ID", bo?.getString("BASKET_ID"))
                ]]>
            </consolidationTarget>
            <calculation>
                <![CDATA[
                // Consolidating NUM_ORDERS

                int numOrders = consbasket.getInteger("NUM_ORDERS") // before
                if(eventType==EventType.JOIN) {
                    consbasket.setInteger("NUM_ORDERS", numOrders + 1)
                    msg += "NEW basket NUM_ORDERS: "+consbasket.getInteger("NUM_ORDERS")+"\n"

                } else if(eventType==EventType.LEAVE) {
                    consbasket.setInteger("NUM_ORDERS", numOrders - 1)
                    msg += "NEW basket NUM_ORDERS: "+consbasket.getInteger("NUM_ORDERS")+"\n"

                }

                // Consolidating VOLUME

                int deltaVolume = o.getInteger("VOLUME") - previous_o.getInteger("VOLUME")
                int oldConsolidatedVolume = consbasket.getInteger("VOLUME")
                int newConsolidatedVolume = oldConsolidatedVolume + deltaVolume

                consbasket.setInteger("VOLUME", newConsolidatedVolume)
                msg += "NEW basket VOLUME: "+consbasket.getInteger("VOLUME")+"\n"

                println msg
                ]]>
            </calculation>
        </consolidateTable>
    </consolidation>
</consolidations>
```