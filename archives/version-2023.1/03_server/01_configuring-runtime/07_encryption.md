---
title: 'Service traffic encryption'
sidebar_label: 'Encryption'
id: encryption
keywords: [service, traffic, encryption]
tags:
- service
- traffic
- encryption
---
# Service traffic encryption

Service traffic encryption is designed to enhance the security of exchanges and to protect user privacy against attacks carried out from networks. In this section, we show you how toconfigure it for your Genesis applications.

In order to achieve this, we will create a certificate and a Java Keystore. A file with the extension **.jks** serves as a keystore. It can store keys such as public key certificates, authorisation certificates or private keys.

Here are some [instructions](https://support.globalsign.com/digital-certificates/digital-certificate-installation/java-keytool-create-keystore#:~:text=Use%20the%20chart%20below%20to%20guide%20you%20through,on%20hash%20algorithm%20and%20product%20type.%20See%20More) on how to create a Java keystore file.
## Setting secure to be true

First, you must enable processes to communicate via SSL. In order to do this, we must ensure that the secure element is set to "true". Without this, your application would send communications along with any non-encrypted HTTP requests to your domain.

All Genesis modules are defined inside the service definition files. To allow for service-to-service encryption you must make this change in the _application_ **-service-definitions.xml** file.

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
:::warning
The global-service-definitions.xml file and the processes.xml file are erased and re-generated every time you run `genesisInstall`. (You should never change these files, because any changes will be lost the next time you run genesisInstall.)

Therefore, it is essential that you set the **service-definitions.xml** file this way for every service or module for which you want to enable SSL.
:::

## Service-to-service encryption

Second, you must configure the locations of certificates, Java keystore and passwords in the **genesis-system-definitions.kts** file. In order to do this, edit the values for `DefaultKeystoreLocation`, `DefaultKeystoreLocation` and `DefaultCertificate` as follows:

```kotlin
systemDefinition {
    global {
        item(name = "DefaultKeystoreLocation", value = "/home/exmon/keystore.jks")
        item(name = "DefaultKeystorePassword", value = "Password123")
        item(name = "DefaultCertificate", value = "/home/exmon/certificate.crt")
    }
}
```

These will be used by all processes to communicate in an encrypted manner or to accept connections if they are encrypted themselves.

## Creating a certificate

Type the keytool command all on one line:

`java-home/bin/keytool -genkey -alias server-alias -keyalg RSA -keypass changeit -storepass changeit -keystore keystore.jks`

When you press Enter, keytool prompts you to enter the server name, organizational unit, organization, locality, state, and country code.

Type the server name in response to keytool’s first prompt, in which it asks for first and last names.

When you run the example applications, the host (server name) specified in the keystore must match the host identified in the `javaee.server.name` property specified in the file **build.properties**.


