---
title: 'Server configuration - service definitions'
sidebar_label: 'service definitions'
id: service-definitions
keywords: [server, configuration, service definitions]
tags:
  - server
  - configuration
  - service definitions
---


Every application must have  a **-service-definitions.xml** file. This is where you specify the ports of the various processes. These are used to communicate internally between processes.

```xml
<configuration>
    <service host="localhost" name="GENESIS_CLUSTER" port="8510"/>
    <service host="localhost" name="GENESIS_WEBMON" port="8511"/>
    <service host="localhost" name="GENESIS_WEB_ADAPTER" port="8512"/>
</configuration>
```

When `genesisInstall` is executed, all products have their **-service-definitions.xml** files compiled into a system-wide **$GC/global-service-definitions.xml**. Here is an example of a global-service-definitions.xml file where we have the _auth_, _genesis_ and _gcom_ products installed:

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

## Enabling SSL for processes
To enable SSL for a process, set the `secure` attribute to  "true" on the process in the **-service-definitions.xml** file.
For example:


```xml
<configuration>
    <service host="localhost" name="GCOM_REQUEST_SERVER" port="8571" secure="true"/>
</configuration>
```
You must also edit the _application_ **genesis-system-definition.kts** file, as specified in the example below:


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

## Overriding ports at runtime
The ports that each service uses can be overridden at runtime with an environment variable.

This is particularly useful when you want to run a single build across multiple environments that have different port requirements (i.e. multiple apps running on a single host).

To override the port, just use the environment variable `{PROCESS_NAME}_PORT={PORT}`.

So for example, if you wanted the `GENESIS_ROUTER` to run on port 22222 you would use `GENESIS_ROUTER_PORT=22222`.

This guide doesn't cover how to use environment variables, but there are many guides online such as [How to Set an Environment Variable in Linux](https://www.freecodecamp.org/news/how-to-set-an-environment-variable-in-linux/) that explain how they work.
