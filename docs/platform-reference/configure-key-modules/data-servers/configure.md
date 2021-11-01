---
title: Data servers
sidebar_label: Data servers
sidebar_position: 1
id: configure

---
Data servers monitor specific tables or views in the database. When a change in data occurs, the data server makes the changed data available to the User Interface.

The data server configuration is refreshingly light, because all the hard work is done by the views.

You need to define queries to handle each event in the required way. You can define any number of queries. A query can be on to an individual table or view. All the details of the table or view are inherited from the definition, so you don’t need to supply any further details.

The initial run of the query serves all the data that is defined by the table or view. From then on, it automatically monitors the user who has requested the data. Whenever a value in the underlying table or view changes, that change is sent to the user. In this way, the user’s data is maintained up to date in real time, without the unnecessary burden of sending the whole data set each time there is a change.

Note that any table or view that you are monitoring might contain a join. By default, the fields that are joined are not monitored for updates - typically these are used for reference data that does not change intraday. If you need these fields to be monitored in real time along with the fields in the primary table, then you need to use a [backwards join](/platform-reference/configure-key-modules/data-servers/examples/#backwards-joins) (see below).

Typically in Genesis, each module has its own data server process, which points at this configuration.

### Configure in processes.xml

Data server service configuration is added in processes.xml like below example, for more information of each tag in below config follow this [link](/platform-reference/essential-information/processes-xml)

```xml
<process name="TRADING_APP_DATASERVER">
    <groupId>TRADING_APP</groupId>
    <start>true</start>
    <options>-Xmx256m</options>
    <module>genesis-pal-dataserver</module>
    <package>global.genesis.dataserver.pal</package>
    <script>trading_app-dataserver.kts</script>
    <description>Displays real-time details</description>
    <language>pal</language>
    <classpath>quickfixj-core-*.jar</classpath>
</process>
```

