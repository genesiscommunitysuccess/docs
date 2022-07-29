---
title: Service definitions
sidebar_label: Service definitions
sidebar_position: 3
id: service-definitions

---


Just as each application must have  a *-processes.xml* config file, it must also have a *-service-definitions.xml* file. This is where you specify the ports of the various processes. These  are used to communicate internally between processes.

```xml
<configuration>
    <service host="localhost" name="GENESIS_CLUSTER" port="8510"/>
    <service host="localhost" name="GENESIS_WEBMON" port="8511"/>
    <service host="localhost" name="GENESIS_WEB_ADAPTER" port="8512"/>
</configuration>
```

When `genesisInstall` is executed, all products have their *-service-definitions.xml* files compiled into a system-wide **$GC/global-service-definitions.xml**. Here is an example of a global-service-definitions.xml file where we have the _auth_, _genesis_ and _gcom_ products installed:

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

If the process lives on a different server, then set the `external` attribute to  "true".
For example:

```xml
<configuration>
    <service host="hostname" name="GENESIS_CLUSTER" port="8510" external="true"/>
</configuration>
```

## Enable SSL for processes
To enable SSL for a process, set the `secure` attribute to  "true" on the process in the **-service-definitions.xml** file.
For example:


```xml
<configuration>
    <service host="localhost" name="GCOM_REQUEST_SERVER" port="8571" secure="true"/>
</configuration>
```
You must also edit the _application_**genesis-system-definition.kts** file, as specified in the example below:


```kotlin
systemDefinition {
    global {
        item(name = "DefaultKeystoreLocation", value = "/home/applicationName/keystore.jks")
        item(name = "DefaultKeystorePassword", value = "Password123")
        item(name = "DefaultCertificate", value = "/home/applicationName/certificate.crt")
    }
}
```

:::warning
The global-service-definitions.xml file and the processes.xml file are are erased and re-generated every time you run `genesisInstall`. (You should never change these files, because any changes will be lost the next time you run genesisInstall.)

Therefore, it is essential that you set the **service-definitions.xml** file this way for every service or module for which you want to enable SSL.
:::


