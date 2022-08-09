---
title: 'Examples'
sidebar_label: 'Examples'
id: examples
---

[Introduction](/server-modules/consolidator/introduction) | [Basics](/server-modules/consolidator/basics) |  [Advanced](/server-modules/consolidator/advanced) | [Examples](/server-modules/consolidator/examples) | [Configuring runtime](/server-modules/consolidator/configuring-runtime) | [Testing](/server-modules/consolidator/testing)

Here is an example Consolidator file that defines two Consolidators:

* CON_ORDER_FROM_TRADES. This Consolidator totals the order quantity across the ```TRADE``` table, grouping by field ```TRADE.ORDER_ID```
                          into a table called ```ORDER_CONSOLIDATED_VOLUME```.
               
* CON_BASKET_FROM_ORDERS.  This Consolidator counts the number of orders and the order quantity, grouped by the field ```BASKET_ORDER_DETAILS.BASKET_ID``` from the ```ORDERS``` table. Note that in the table ```BASKET_ORDER_DETAILS``` there is a ```backwardJoin``` that ensures that real-time data from the table and the table it joins are reflected in the calculation.  


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


The example below comes from the Consolidator exercise in our [tutorial](/getting-started/tutorials/add-calculated-data). It has a single consolidator, called `CONSOLIDATE_POSITIONS`. 

To give you some basic pointers to the content, the main code blocks in this Consolidator are:

- The `tables` block contains two tables: `TRADE` and `INSTRUMENT_PRICE`, which are given aliases.
- The `groupBy` block groups by `INSTRUMENT_ID` and `COUNTERPARTY_ID`.
- The `consolidateTable` block contains the `consolidationTarget` block and the `calculation` block. 

```xml
<consolidations>
