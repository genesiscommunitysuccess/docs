---
title: Service definitions
sidebar_label: Service definitions
sidebar_position: 3
id: service-definitions

---
# Service definitions

Just as each application must have  a *-processes.xml* config file, it must also have a *-service-definitions.xml* file. This is where the developer specifies the ports of the various processes. These ports are used to communicate internally between processes.

```xml
<configuration>
    <service host="localhost" name="GENESIS_CLUSTER" port="8510"/>
    <service host="localhost" name="GENESIS_WEBMON" port="8511"/>
    <service host="localhost" name="GENESIS_WEB_ADAPTER" port="8512"/>
</configuration>
```

When `genesisInstall` is executed, all products have their *-service-definitions.xml* files compiled into a system-wide **$GC/global-service-definitions.xml**. Take the following example of a global-service-definitions.xml file when we have the _auth_, _dta_ and _gcom_ products installed:

```xml
<configuration>
    <service external="false" host="localhost" name="GENESIS_AUTH_DATASERVER" port="8502" secure="false"/>
    <service external="false" host="localhost" name="GENESIS_AUTH_MANAGER" port="8501" secure="false"/>
    <service external="false" host="localhost" name="GENESIS_AUTH_PERMS" port="8503" secure="false"/>
    <service external="false" host="localhost" name="GENESIS_CLUSTER" port="8510" secure="false"/>
    <service external="false" host="localhost" name="GENESIS_WEBMON" port="8511" secure="false"/>
    <service external="false" host="localhost" name="GENESIS_WEB_ADAPTER" port="8512" secure="false"/>
    <service external="false" host="localhost" name="GCOM_DATA_SERVER" port="8570" secure="false"/>
    <service external="false" host="localhost" name="GCOM_REQUEST_SERVER" port="8571" secure="false"/>
</configuration>
```

If process lives in different server then set the `external` attribute to be "true"
Ex:

```xml
<configuration>
    <service host="hostname" name="GENESIS_CLUSTER" port="8510" external="true"/>
</configuration>
```

#### Enable SSL for processes
Set the `secure` attribute to be "true" on process you want to enable SSL and edit genesis-system-definition.kts file as specified in the example below

Ex: processes.xml
```xml
<configuration>
    <service host="localhost" name="GCOM_REQUEST_SERVER" port="8571" secure="true"/>
</configuration>
```

genesis-system-definition.kts
```kotlin
systemDefinition {
    global {
        item(name = "DefaultKeystoreLocation", value = "/home/applicationName/keystore.jks")
        item(name = "DefaultKeystorePassword", value = "Password123")
        item(name = "DefaultCertificate", value = "/home/applicationName/certificate.crt")
    }
}
```