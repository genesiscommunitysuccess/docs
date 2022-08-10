---
title: 'Advanced'
sidebar_label: 'Advanced'
id: advanced
---

## Encrypting user and passwords

A script called `encryptUserPass` is provided with Genesis so you can encrypt the user and password before using it in `DbToGenesis`.

### Step by step

Here is an example step-by-step of how to get an Oracle database up and running with `DbToGenesis`. It shows how to create tables, stored procedures and triggers, and also shows the **dbtogenesis.xml** configuration for Genesis.

The example shows two different ways of using key values imported from Oracle.

* INSTRUMENT_ID represents the primary key in our Oracle table, but also the  primary key in our Genesis table. **GenesisPrimaryKeyId** is set to INSTRUMENT_BY_EXTERNAL_ID in order to keep a relationship between records in each database, and even though in this case EXTERNAL_ID (which does not need to be specified in metaData) contains the same values as INSTRUMENT_ID, it could potentially be different. As we are specifying INSTRUMENT_ID in our metaData, the Oracle INSTRUMENT_ID value will become our INSTRUMENT_ID in Genesis too.
* On the other hand, COUNTERPARTY_ID is also the primary key in both database systems, but we are not using its value in Genesis (COUNTERPARTY_ID is not specified in the metaData block). The Genesis COUNTERPARTY_ID value will be generated when you insert a new record in Genesis, as specified in the Genesis dictionary. The value of Oracle's COUNTERPARTY_ID will still be kept internally in the Genesis COUNTERPARTY table inside the EXTERNAL_ID field in order to correlate inserts, updates and deletions.

 1. Create the UpdateQueue table.  
    ![](/img/createupdatequeuetable.png)
 2. Create the ClearUpdateQueue procedure.  
    ![](/img/createclearupdatequeueprocedure.png)
 3. Create the QueryUpdateQueue procedure.  
    ![](/img/createqueryupdatequeueprocedure.png)
 4. Create the INSTRUMENT table.  
    ![](/img/createinstrumenttable.png)
 5. Create the INSTRUMENT trigger.  
    ![](/img/createinstrumenttrigger.png)
 6. Create the INSTRUMENT retrieve record procedure.  
    ![](/img/createretrieveinstrumentrecordprocedure.png)
 7. Create the INSTRUMENT retrieve table procedure.![](/img/createretrieveinstrumenttableprocedure.png)
 8. Create the COUNTERPARTY table.  
    ![](/img/createcounterpartytable.png)
 9. Create the COUNTERPARTY trigger.  
    ![](/img/createcounterpartytrigger.png)
10. Create the COUNTERPARTY retrieve record procedure.  
    ![](/img/createretrievecounterpartyrecordprocedure.png)
11. Create the COUNTERPARTY retrieve table procedure.  
    ![](/img/createretrievecounterpartyrecordprocedure.png)
12. Create the **dictionary.xml** tables.

```xml
<table name="INSTRUMENT">
    <fields>
        <field name="INSTRUMENT_ID" sequence="IN"/>
        <field name="NAME" />
        <field name="DESCRIPTION" />
        <field name="INSTRUMENT_TYPE" />
        <field name="TICK_SIZE" />
        <field name="BAND_STATUS" />
        <field name="CREATED_AT" />
        <field name="CREATED_BY" />
        <field name="EXTERNAL_ID" sequence="XG"/>
    </fields>
    <keys>
        <key name="INSTRUMENT_BY_ID" id="1" primary="true">
            <field name="INSTRUMENT_ID" />
        </key>
        <key name="INSTRUMENT_BY_NAME" id="2">
            <field name="NAME" />
        </key>
        <key name="INSTRUMENT_BY_EXTERNAL_ID" id="3">
            <field name="EXTERNAL_ID" />
        </key>
    </keys>
</table>

<table name="COUNTERPARTY">
    <fields>
        <field name="COUNTERPARTY_ID" sequence="CP"/>
        <field name="COUNTERPARTY_NAME" />
        <field name="DESCRIPTION" />
        <field name="COUNTERPARTY_TYPE" />
        <field name="BAND_STATUS" />
        <field name="CREATED_AT" />
        <field name="CREATED_BY" />
        <field name="EXTERNAL_ID" sequence="XH"/>
    </fields>
    <keys>
        <key name="COUNTERPARTY_BY_ID" id="1" primary="true">
            <field name="COUNTERPARTY_ID" />
        </key>
        <key name="COUNTERPARTY_BY_NAME" id="2">
            <field name="COUNTERPARTY_NAME" />
        </key>
        <key name="COUNTERPARTY_BY_EXTERNAL_ID" id="3">
            <field name="EXTERNAL_ID" />
        </key>
    </keys>
</table>
```

13. Create the **dbtogenesis.xml** configuration. **Ensure the xmlns:xi attribute is included if you want to use xinclude in your configuration**.

```xml
<dbToGenesis xmlns:xi="http://www.w3.org/2001/XInclude"><options>
    <databaseType>ORACLE</databaseType>
    <url>jdbc:oracle:thin:@db1.ad.genesis.global:1521:genesisdev</url>
    <user>dd67b69b937b25da0704bc682461f54fad20d5161ffffde210a4a30370fcb557</user>
    <password>9577a0e7fc204a83ef59a57dcf9d543055100f440f2baebb38aef644c7ac2f03</password>
    <dbMinConnections>10</dbMinConnections>
    <dbMaxConnections>10</dbMaxConnections>
</options>

<genesisStream name="INSTRUMENT">

    <from>INSTRUMENT</from>
    <to>INSTRUMENT</to>

    <GenesisPrimaryKeyId>INSTRUMENT_BY_EXTERNAL_ID</GenesisPrimaryKeyId>
    <rdbmsPrimarykey>INSTRUMENT_ID</rdbmsPrimarykey>
    <rdbmsTimestampField>TIMESTAMP</rdbmsTimestampField>
    <generateCreatedInfo>true</generateCreatedInfo>

    <metaData>
        <field name="INSTRUMENT_ID" type="STRING" />
        <field name="NAME" type="STRING" />
        <field name="DESCRIPTION" type="STRING" />
        <field name="INSTRUMENT_TYPE" type="ENUM" values="EQ DV FI FU" default="EQ" />
        <field name="TICK_SIZE" type="DOUBLE" />
        <field name="BAND_STATUS" type="ENUM" values="DISABLED ENABLED" default="ENABLED" />
    </metaData>

    <proc>
        <queryQueue>
            <![CDATA[
                {call queryUpdateQueue(?, ?, ?)}
            ]]>
        </queryQueue>
        <clearQueue>
            <![CDATA[
                {call clearUpdateQueue(?, ?)}
            ]]>
        </clearQueue>
        <loadTable>
            <![CDATA[
                {call retrieveInstrumentTable(?)}
            ]]>
        </loadTable>
        <retrieveRecord>
            <![CDATA[
                {call retrieveInstrumentRecord(?, ?)}
            ]]>
        </retrieveRecord>
    </proc>

</genesisStream>

<genesisStream name="COUNTERPARTY">

    <from>COUNTERPARTY</from>
    <to>COUNTERPARTY</to>

    <GenesisPrimaryKeyId>COUNTERPARTY_BY_EXTERNAL_ID</GenesisPrimaryKeyId>
    <rdbmsPrimarykey>COUNTERPARTY_ID</rdbmsPrimarykey>
    <rdbmsTimestampField>TIMESTAMP</rdbmsTimestampField>
    <generateCreatedInfo>true</generateCreatedInfo>

    <metaData>
        <field name="COUNTERPARTY_NAME" type="STRING" />
        <field name="DESCRIPTION" type="STRING" />
        <field name="COUNTERPARTY_TYPE" type="ENUM" values="BROKER CLIENT CHARITY" default="BROKER" />
        <field name="BAND_STATUS" type="ENUM" values="DISABLED ENABLED" default="ENABLED" />
    </metaData>

    <proc>
        <queryQueue>
            <![CDATA[
                {call queryUpdateQueue(?, ?, ?)}
            ]]>
        </queryQueue>
        <clearQueue>
            <![CDATA[
                {call clearUpdateQueue(?, ?)}
            ]]>
        </clearQueue>
        <loadTable>
            <![CDATA[
                {call retrieveCounterpartyTable(?)}
            ]]>
        </loadTable>
        <retrieveRecord>
            <![CDATA[
                {call retrieveCounterpartyRecord(?, ?)}
            ]]>
        </retrieveRecord>
    </proc>

</genesisStream>
</dbToGenesis>
```

## generateSQLFromRDB

The `generateSQLFromRDB` script is a tool that generates **.sql** files to create tables, triggers and procedures in the RDBMS system by reading the current Genesis dictionary. It also adds the pertinent `genesisStream` configuration to the specified **dbtogenesis.xml** configuration file.

* It is by no means mandatory, but it provides a generic, quick and working example that can be further modified or extended with ease. However, the Genesis dictionary must be appropriately configured beforehand:
  EXTERNAL_ID field and TABLENAME_BY_EXTERNAL_ID key must exist (as shown in the examples in the previous section) inside the table
* You also need the CREATED_AT and CREATED_BY fields in the table if you want to use the `generateCreatedInfo` option in the **dbtogenesis.xml** configuration.

#### generateSQLFromRDB
  
```bash
generateSQLFromRDB
```

| Argument | Argument long name      | Mandatory |               Description                                                                                  | Restricted values         |
|----------|-------------------------|-----------|------------------------------------------------------------------------------------------------------------|---------------------------|       
| -cfg     |  --configFile `<arg>`   | No        | genesistodb config xml file to be modified                                                                 | No                        |                   
| -dbName  |  --databaseName `<arg>` | No        | the database name for Oracle dbs                                                                           | No                        |         
| -dbType  |  --databaseType `<arg>` | No        | the database type                                                                                          | MSSQL, ORACLE or POSTGRES |                    
| -genUID  | --generateUniqueID      | No        | forces generation of a unique ID. Unique IDs are created ALWAYS if the primary key has more than one field.| No                        |
| -f       |  --file `<arg>`         | No        | name of the sql file to export table                                                                       | No                        | 
| -h       |  --help                 | No        | show usage information                                                                                     | No                        |
| -t       |  --table `<arg>`        | No        | the name of the table to export to csv                                                                     | No                        |
