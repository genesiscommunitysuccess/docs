---
title: 'service definitions.xml'
sidebar_label: 'service definitions.xml'
id: service-definitions
---

Every application must have a **-service-definitions.xml** file. This is where you specify the ports of the various processes. The ports are used to communicate internally between these various processes.

Here is an example where port numbers have been specified for three modules:

```xml
<configuration>
    <service host="localhost" name="GENESIS_CLUSTER" port="8510"/>
    <service host="localhost" name="GENESIS_WEBMON" port="8511"/>
    <service host="localhost" name="GENESIS_WEB_ADAPTER" port="8512"/>
</configuration>
```

When `genesisInstall` is executed, all the products have their **service-definitions.xml ** files compiled into a system-wide **$GC/global-service-definitions.xml**. Here is an example of a **global-service-definitions.xml** file where we have the auth, genesis and gcom products installed:

```xml
<configuration>
    <service external="false" host="localhost" name="GENESIS_AUTH_DATASERVER" port="8502" secure="false"/>
    <service external="false" host="localhost" name="GENESIS_AUTH_MANAGER" port="8501" secure="false"/>
    <service external="false" host="localhost" name="GENESIS_AUTH_PERMS" port="8503" secure="false"/>
    <service external="false" host="localhost" name="GENESIS_CLUSTER" port="8510" secure="false"/>
    <service external="false" host="localhost" name="GENESIS_WEBMON" port="8511" secure="false"/>
    <service external="false" host="localhost" name="GENESIS_ROUTER" port="8512" secure="false"/>
    <service external="false" host="localhost" name="GCOM_DATA_SERVER" port="8570" secure="false"/>
    <service external="false" host="localhost" name="GCOM_REQUEST_SERVER" port="8571" secure="false"/>
</configuration>
```

More information on service-definition can be found [here](/server/configuring-runtime/service-definitions/)