---
title: 'Market data adaptors - Configuration'
sidebar_label: 'Configuring Adaptors'
id: configuring-adaptors
keywords: [server, integration, market data adaptors, configuration]
tags:
  - server
  - integration
  - market data adaptors
  - configuration
---


This page gives details of the configuration requirements common to adaptors for all vendors.

Adding the process to processes.xml[​](https://internal-web/secure/creating-applications/defining-your-application/integrations/market-data/adaptors/common-config/#adding-the-process-to-processesxml "Direct link to heading")
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

You configure the details of an adaptor in your _applicationName_**-processes.xml** file. Before we go into detail, go to your _applicationName_**-processes.xml** file and specify the file name in your config element process definition. Here is an example of such a definition for an Elektron adaptor. We have called the process file for this process elektron-adaptor.xml:

```xml
<process name="ELEKTRON_ADAPTOR">    
    <start>true</start>    
    <options>-Xmx2048m -DXSD_VALIDATE=false</options>    
    <module>elektron-adaptor</module>    
    <package>global.genesis.elektron.adapter,global.genesis.marketdata.core</package>    
    <config>elektron-adaptor.xml</config>    
    <joinPub>market-data-joiner.xml</joinPub>    
    <groupId>ELEKTRON</groupId>    
    <loggingLevel>INFO,DATADUMP_OFF</loggingLevel>
</process>
```

When specifying the process definition for a market data adaptor, you must include the `global.genesis.marketdata.core package` in the package element tag, alongside the adaptor-specific package.

This is because the bulk of the functionality is provided by the market data engine. When the service is initialised by dependency injection, the core of the service is initialised from the engine, and the adaptor provides vendor-specific components that enable the adaptor to function.

The config file[​](https://internal-web/secure/creating-applications/defining-your-application/integrations/market-data/adaptors/common-config/#the-config-file "Direct link to heading")
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The market data adaptors themselves are configured with an xml file. There are common elements to all the adaptor configurations.

The majority of customisable logic is specified within the xml file as groovy code snippets elements prefixed with a CDATA block, similar to the configuration for consolidators.

## Pre-expression[​](https://internal-web/secure/creating-applications/defining-your-application/integrations/market-data/adaptors/common-config/#pre-expression "Direct link to heading")

The pre-expression is a groovy code block executed before any other code block specified in the file. You can use this expression to define any utility functions you wish to use within your other code.

``` java
<preExpression>
<![CDATA[        
    import org.joda.time.format.DateTimeFormat        
    import org.joda.time.format.DateTimeFormatter        
    import org.joda.time.DateTime        
    import org.joda.time.LocalTime        
    import org.apache.commons.lang3.time.DateUtils        
    class DateTimeHelper {           
        private final static DateTimeFormatter fullDateFormatter = DateTimeFormat.forPattern("dd MMM yyyy HH:mm:ss")           
        private final static DateTimeFormatter timeFormatter = DateTimeFormat.forPattern("HH:mm:ss")           
        private final static DateTimeFormatter fullDateTimeFormatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSSZ")           
        public static DateTime fullDateTimeConverter(String date, String time){           
             return DateTime.parse("${date} ${time}", DateTimeHelper.fullDateFormatter)           
        }           
        public static DateTime timeToDateTimeConverter(String time){            
            return LocalTime.parse(time, DateTimeHelper.timeFormatter).toDateTimeToday()           
        }           
        public static DateTime dateTimeToDateTimeConverter(String time){            
            return DateTime.parse(time, DateTimeHelper.fullDateTimeFormatter)           
        }        
    } 
]]>
</preExpression>
```

## Subscriptions[​](https://internal-web/secure/creating-applications/defining-your-application/integrations/market-data/adaptors/common-config/#subscriptions "Direct link to heading")

After the pre-expression, an adaptor has a `subscriptions` element. This contains a number of `subscription` elements. This is where you specify the details of the adaptor.

Within a subscription element, you can specify:

-   one or more `table` objects within a `tables` element
-   a `where` element, where you can define a code block for custom logic
-   `record` elements defined within a `records` element

Each subscription has a number of `table` objects within a `tables` element. Each table is given an alias so it can be referred to in code, using the `alias` attribute. It also has a `seedKey` attribute, that defines the index used for lookups.

```xml
<tables>    
    <table name="INSTRUMENT_PRICE_SUBSCRIPTION" alias="ips" seedKey="INSTRUMENT_PRICE_SUBSCRIPTION_BY_INSTRUMENT_CODE">
</tables>
```

Each subscription has a `where` element, where you can define a code block for custom logic dictating whether or not a record should be subscribed for. It should return a boolean value.

```xml
<where><![CDATA[recordExists(ips)]]></where>
```

Each subscription has a number of `record` elements defined within a `records` element. These elements define the destination that market data will be published to (i.e. which tables).

A `record` has the following attributes.

-   `targetTable` refers to the name of the table where market data will be published. It must be defined in the tables dictionary for the projects.
-   `alias` is a variable name given to the record to be populated so it can be referred to in code.
-   `type` is an enumerated value which must be one of `INSERT_ONLY` or `MODIFY`. `INSERT_ONLY` records do not overwrite existing records for the same lookup key. This is useful for time-series data like time and sales. Modify indicates records should be overwritten for the same lookup key. This is useful for real-time prices.
-   `isHFT` refers to whether the target table is configured as a database table or a Genesis HFT memory-mapped table.
-   `lookupKey` is explained in detail below.

```xml
<record targetTable="INSTRUMENT_L1_PRICE" alias="ip" type="MODIFY" isHFT="true" lookupKey="someKey">
```

The `lookupKey` element defines a function in groovy. Its goal is to populate a database record with the information required to locate the exisiting record in the database (if one exists). As such, it is not applicable to records specified with a type of `INSERT_ONLY`. The inputs to this function are:

-   a variable called data, which is a `Map<String, Object>`. The map contains the field names and values received from the adaptor.
-   a variable with the same name as the alias defined for the target table specified in the record. This variable should be populated with the data required to perform the lookup.
-   variables for all the tables defined in the subscription, with names corresponding to their configured aliases.

Below is an example of a simple lookup key function. The `INSTRUMENT_L1_PRICE` table has an index on `INSTRUMENT_CODE`, so this is the only data point we need to locate the existing record. We obtain the code from the subscription table defined with alias 'ips'.

If your price tables are more complex than the stock tables provided by the market data system, then you will need to make sure that the record in this function is populated with sufficient information in order to locate the existing record by an index.

```xml
<record targetTable="INSTRUMENT_L1_PRICE" alias="ip" type="MODIFY" isHFT="true">    
    <lookupKey><![CDATA[ip.setString(ips.getString('INSTRUMENT_CODE'))]]></lookupKey>
</record>
```

The record has two more elements:

`Fields` enables you to specify a transformation function that maps your data map to a record in the target table.

```xml
<fields>
<![CDATA[ip.setDouble('EMS_BID_PRICE', (Double)((Double) data['BID'])/100) ip.setDouble('EMS_ASK_PRICE', (Double)((Double) data['ASK'])/100)]]>
</fields>
```

`hftFields` enables you to do the same if the target table is specified as an HFT memory-mapped table. Null checks must be performed before entering values.

```xml
<hftFields>
Double emsBidPrice = data["BID"]  
if (emsBidPrice != null) {       
    hft_ip.setEmsBidPrice(emsBidPrice)    
}    
Double emsAskPrice = data["ASK"]    
if (emsAskPrice != null) {
    hft_ip.setEmsAskPrice(emsAskPrice)    
}
</hftFields>
```

Here is a full example configuration for an adaptor. This has two subscriptions. The first is called `LEVEL_ONE` and the second is called `FX_SUBSCRIPTION`:

```xml
<elektronAdaptor>    
    <connection>        
        <connectionType>RSSL</connectionType>        
        <port>14002</port>        
        <host>localhost</host>        
        <userName>genesis</userName>        
        <service>ELEKTRON_DD</service>        
        <logEnabled>0</logEnabled>    
    </connection>    
    <preExpression>      
        <![CDATA[            
            import org.joda.time.format.DateTimeFormat            
            import org.joda.time.format.DateTimeFormatter            
            import org.joda.time.DateTime            
            import org.joda.time.LocalTime            
            import org.apache.commons.lang3.time.DateUtils            
            class DateTimeHelper {               
                private final static DateTimeFormatter fullDateFormatter = DateTimeFormat.forPattern("dd MMM yyyy HH:mm:ss")               
                private final static DateTimeFormatter timeFormatter = DateTimeFormat.forPattern("HH:mm:ss")               private final static DateTimeFormatter fullDateTimeFormatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSSZ")               
                public static DateTime fullDateTimeConverter(String date, String time){                
                    return DateTime.parse("${date} ${time}", DateTimeHelper.fullDateFormatter)               
                }               
                public static DateTime timeToDateTimeConverter(String time){                
                    return LocalTime.parse(time, DateTimeHelper.timeFormatter).toDateTimeToday()               
                }               
                public static DateTime dateTimeToDateTimeConverter(String time){                
                    return DateTime.parse(time, DateTimeHelper.fullDateTimeFormatter)               
                }            
            }        
        ]]>    
    </preExpression>    
    <subscriptions>        
        <subscription name="LEVEL_ONE">            
            <tables>                
                <table name="INSTRUMENT_PRICE_SUBSCRIPTION" alias="ips" seedKey="INSTRUMENT_PRICE_SUBSCRIPTION_BY_INSTRUMENT_CODE" />            
            </tables>            
            <ricFormat>                
                <![CDATA[ "/" + ips.getString('INSTRUMENT_CODE') + ".L" ]]>            
            </ricFormat>            
            <where>                
                <![CDATA[recordExists(ips)]]>            
            </where>            
            <records>                
                <record targetTable="INSTRUMENT_L1_PRICE" alias="ip" type="MODIFY" isHFT="true">                    <lookupKey>                        
                    <![CDATA[ips.getString('INSTRUMENT_CODE')]]>                    
                </lookupKey>                    
                <fields>                        
                    <![CDATA[
                        ip.setDouble('LOW_PRICE', 
                        (Double)((Double)data['LOW_1'])/100) ip.setDouble('HIGH_PRICE', 
                        (Double)((Double) data['HIGH_1'])/100) ip.setDouble('EMS_BID_PRICE', 
                        (Double)((Double) data['BID'])/100) ip.setDouble('EMS_ASK_PRICE', (Double)((Double) data['ASK'])/100) ip.setDouble('BID_SIZE', 
                        (Double) data['BIDSIZE']) ip.setDouble('ASK_SIZE', (Double) data['ASKSIZE']) ip.setDouble('PCT_CHANGE', (Double) data['PCTCHNG']) ip.setDouble('NET_CHANGE', (Double) data['NETCHNG_1']) ip.setDouble('VWAP', (Double)((Double) data['VWAP'])/100) ip.setDouble('OPEN_PRICE', 
                        (Double)((Double) data['OPEN_PRC'])/100) ip.setDouble('LAST_TRADE', (Double)((Double) data['TRDPRC_1'])/100) ip.setString('DSPLY_NAME', (String) data['DSPLY_NAME'])]]>
                </fields>                    
                <hftFields>                        
                    <![CDATA[
                        Double lowPrice = data["LOW_1"]                        
                        if (lowPrice != null) {                            
                            hft_ip.setLowPrice(lowPrice)                        
                        }                        
                        Double highPrice = data["HIGH_1"]                        
                        if (highPrice != null) {                            
                            hft_ip.setHighPrice(highPrice)                        
                        }                        
                        Double emsBidPrice = data["BID"]                        
                        if (emsBidPrice != null) {                            
                            hft_ip.setEmsBidPrice(emsBidPrice)                        
                        }                        
                        Double emsAskPrice = data["ASK"]                        
                        if (emsAskPrice != null) {                            
                            hft_ip.setEmsAskPrice(emsAskPrice)                        
                        }                        
                        Double bidSize = data["BIDSIZE"]                        
                        if (bidSize != null) {                            
                            hft_ip.setBidSize(bidSize)                        
                        }                       
                        Double askSize = data["ASKSIZE"]                        
                        if (askSize != null) {                            
                            hft_ip.setAskSize(askSize)                        
                        }                        
                        Double pctChange = data["PCTCHNG"]                        
                        if (pctChange != null) {                            
                            hft_ip.setPctChange(pctChange)                        
                        }                        
                        Double netChange = data["NETCHNG_1"]                        
                        if (netChange != null) {                            
                            hft_ip.setNetChange(netChange)                        
                        }                        
                        Double vwap = data["VWAP"]                        
                        if (vwap != null) {                            
                            hft_ip.setVwap(vwap)                        
                        }                        
                        Double openPrice = data["OPEN_PRC"]                       
                        if (openPrice != null) {                           
                            hft_ip.setOpenPrice(openPrice)                        
                        }                        
                        Double lastTrade = data["TRDPRC_1"]                        
                        if (lastTrade != null) {                            
                            hft_ip.setLastTrade(lastTrade)                        
                        }                        
                        String dsplyName = data["DSPLY_NAME"]                        
                        if (dsplyName != null) {                            
                            hft_ip.setDsplyName(dsplyName)                        
                        }                        
                    ]]>                    
                </hftFields>                
            </record>            
        </records>        
        </subscription>        
        <subscription name="FX_SUBSCRIPTION">            
            <tables>                
                <table name="FX_SUBSCRIPTION" alias="fs" seedKey="FX_SUBSCRIPTION_BY_INSTRUMENT_CODE" />            
            </tables>            
            <ricFormat>                
                <![CDATA[fs.getString('INSTRUMENT_CODE')]]>            
            </ricFormat>            
            <where>                
                <![CDATA[recordExists(fs)]]>            
            </where>            
            <records>                
                <record targetTable="FX_RATE" alias="fr" type="MODIFY" isHFT="true">                    
                    <lookupKey> 
                        <![CDATA[fs.getString('INSTRUMENT_CODE') ]]>
                    </lookupKey>                    
                    <fields>                        
                        <![CDATA[fr.setDouble('BID_RATE', (Double) data['BID']) fr.setDouble('ASK_RATE', (Double) data['ASK'])fr.setString('DESCRIPTION', (String) data['GEN_TEXT16']) fr.setDouble('PCT_CHANGE', (Double) data['PCTCHNG'])]]>                    
                    </fields>                    
                    <hftFields>                        
                        <![CDATA[Double bidRate = data["BID"]                        
                            if (bidRate != null) {                            
                                hft_fr.setBidRate(bidRate)                        
                            }                        
                            Double askRate = data["ASK"]                        
                            if (askRate != null) {                            
                                hft_fr.setAskRate(askRate)                        
                            }                        
                            String description = data["GEN_TEXT16"]                        
                            if (description != null) {                            
                                hft_fr.setDescription(description)                        
                            }                        
                            Double pctChange = data["PCTCHNG"]                        
                            if (pctChange != null) {                            
                                hft_fr.setPctChange(pctChange)                        
                            }
                        ]]>                    
                    </hftFields>                
                </record>            
            </records>        
        </subscription>    
    </subscriptions>
</elektronAdaptor>
```
