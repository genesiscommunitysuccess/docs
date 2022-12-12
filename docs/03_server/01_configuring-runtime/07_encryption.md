---
title: 'Service Traffic Encryption'
sidebar_label: 'Encryption'
id: encryption
keywords: [service, traffic, encryption]
tags:
- service
- traffic
- encryption
---
# Service Traffic Encryption

Service traffic encryption is meant to enhance the security of exchanges and to protect user privacy against attacks carried out from networks. This can be configured for your genesis applications and the means to do this will be detailed in this document.

### Setting secure to be true

Firstly, we must enable processes to communicate via SSL. In order to do this, we must ensure that the secure element is set to "true". Without this, your application would send communications along with any non-encrypted HTTP requests to your domain.
All Genesis modules are defined inside the service definition files. Therefore, in order to allow for service-service encryption you must make this change in the _application_ *gpal-system-definitions.xml* file.

```xml
<configuration>
  <service host="localhost" name="POSITION_DATASERVER" port="11000" secure="true"/>
  <service host="localhost" name="POSITION_REQUEST_SERVER" port="11001" secure="true"/>
  <service host="localhost" name="POSITION_EVENT_HANDLER" port="11002" secure="true"/>
  <service host="localhost" name="POSITION_CONSOLIDATOR" port="11003" secure="true"/>
  <service host="localhost" name="POSITION_FGW" port ="11004" secure="true"/>
  <service host="localhost" name="POSITION_FGW_STREAMER" port ="11005" secure="true"/>
  <service host="localhost" name="POSITION_FGW_STREAMER_CLIENT" port ="11006" secure="true"/>
</configuration>
```

### Service-service encryption

Secondly, we must configure the locations of certificates, Java keystore and passwords. In order to do this we must edit the values for DefaultKeystoreLocation, DefaultKeystoreLocation and DefaultCertificate as follows:

```xml
    <!-- Required if the processes are to communicate through SSL -->
    <Item name="DefaultKeystoreLocation" value="/home/exmon/keystore.jks" />
    <Item name="DefaultKeystorePassword" value="Password123" />
    <Item name="DefaultCertificate" value="/home/exmon/certificate.crt" />
```

These will be used by all processes to communicate with encrypted processes or to accept connections if they are encrypted themselves.

:::warning
The global-service-definitions.xml file and the processes.xml file are erased and re-generated every time you run `genesisInstall`. (You should never change these files, because any changes will be lost the next time you run genesisInstall.)

Therefore, it is essential that you set the **service-definitions.xml** file this way for every service or module for which you want to enable SSL.
:::

## Creating a certificate

Type the keytool command all on one line:

`java-home/bin/keytool -genkey -alias server-alias -keyalg RSA -keypass changeit -storepass changeit -keystore keystore.jks`

When you press Enter, keytool prompts you to enter the server name, organizational unit, organization, locality, state, and country code.

You must type the server name in response to keytool’s first prompt, in which it asks for first and last names. 

When you run the example applications, the host (server name) specified in the keystore must match the host identified in the javaee.server.name property specified in the file tut-install/examples/bp-project/build.properties.

## Configuring GENESIS_ROUTER
Routes such as **/sm/** and  **/gwf/** must be configured to use https, not http in the **nginx.conf** file**genesis-server/genesis-subcore/deploy-gradle-plugin/src/main/resources/docker/nginx.conf**:

```kotlin
location /gwf/ {
    rewrite                 ^/gwf(.*)/$ /$1 break;
    proxy_set_header        Host $host:$server_port;
    proxy_pass              https://localhost:9064;
    proxy_http_version      1.1;
    proxy_set_header        Upgrade $http_upgrade;
    proxy_set_header        HOSTNAME $remote_addr;
    proxy_set_header        Connection "Upgrade";
}
```

