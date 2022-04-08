---
title: More examples
sidebar_label: More examples
id: cons-more-examples
sidebar_position: 5

---


[Introduction](/creating-applications/defining-your-application/business-logic/consolidators/consolidators/)  | [Where to define](/creating-applications/defining-your-application/business-logic/consolidators/cons-where-to-define/) | [Basics](/creating-applications/defining-your-application/business-logic/consolidators/cons-technical-details/) |  [Advanced](/creating-applications/defining-your-application/business-logic/consolidators/cons-advanced-technical-details/) | [More examples](/creating-applications/defining-your-application/business-logic/consolidators/cons-more-examples/) | [Configuring runtime](/creating-applications/defining-your-application/business-logic/consolidators/cons-configuring-runtime/) | [Testing](/creating-applications/defining-your-application/business-logic/consolidators/cons-testing/)

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


The example below comes from the Consolidator exercise in our [tutorial](/tutorials/building-an-application/add-calculated-data/). It has a single consolidator, called `CONSOLIDATE_POSITIONS`. 

To give you some basic pointers to the content, the main code blocks in this Consolidator are:

- The `tables` block contains two tables: `TRADE` and `INSTRUMENT_PRICE`, which are given aliases.
- The `groupBy` block groups by `INSTRUMENT_ID` and `COUNTERPARTY_ID`.
- The `consolidateTable` block contains the `consolidationTarget` block and the `calculation` block. 

```xml
<consolidations>

    <consolidation name="CONSOLIDATE_POSITIONS" start="true">
        <tables>
            <table name="TRADE" alias="t" seedKey="TRADE_BY_ID" consolidationFields="QUANTITY PRICE"/>

            <table name="INSTRUMENT_PRICE" alias="ip" >
                <join key="INSTRUMENT_PRICE_BY_INSTRUMENT_ID">
                    <![CDATA[
                    ip.setString("INSTRUMENT_ID", t.getString("INSTRUMENT_ID"))
                    ]]>
                </join>
            </table>
        </tables>

        <groupBy>
            <![CDATA[
                group(t.getString("INSTRUMENT_ID"), t.getString("COUNTERPARTY_ID"))
            ]]>
        </groupBy>

        <consolidateTable name="POSITION" alias="p" consolidationFields="QUANTITY NOTIONAL"
                          transient="true">
            <consolidationTarget key="POSITION_BY_INSTRUMENT_ID_COUNTERPARTY_ID">
                <![CDATA[
                p.setString("COUNTERPARTY_ID", t?.getString("COUNTERPARTY_ID"))
                p.setString("INSTRUMENT_ID", t?.getString("INSTRUMENT_ID"))
                ]]>
            </consolidationTarget>
            <calculation>
                <![CDATA[
                    long quantity = t.getLong("QUANTITY")
                    long previousQuantity = previous_t.getLong("QUANTITY")
                    long quantityDelta = quantity - previousQuantity
                    String tradeStatus = t.getString("TRADE_STATUS")
                    long newQuantity = p.getLong("QUANTITY")
                    switch(tradeStatus) {
                      case "NEW":
                      case "ALLOCATED":
                        String side = t.getString("TRADE_STATUS")
                        switch(side) {
                          case "BUY":
                            newQuantity += quantityDelta
                            break
                          case "SELL":
                            newQuantity -=quantityDelta
                            break
                          }
                        break
                      case "CANCELLED":
                        String previousSide = previous_t.getString("TRADE_STATUS")
                        switch(previousSide) {
                          case "BUY":
                            newQuantity -= quantityDelta
                            break
                          case "SELL":
                            newQuantity +=quantityDelta
                            break
                          }
                        break
                    }
                    p.setLong("QUANTITY", newQuantity)
                    Double lastPrice = ip?.getDouble("LAST_PRICE")
                    if (lastPrice != null) {
                        p.setDouble("NOTIONAL", newQuantity * lastPrice )
                    }
                ]]>
            </calculation>
        </consolidateTable>
    </consolidation>
</consolidations>
```