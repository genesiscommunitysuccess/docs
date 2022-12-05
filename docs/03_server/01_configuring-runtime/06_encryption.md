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

Service traffic encryption

A key store is a file containing cryptographic key material, that will be written to a filesystem. To set up TLS you will need pairs of public keys or private keys, a pki. Those keys need to be stored as public and private key certificates. If you're going to store keys in a file, you must remember that the values of the private keys are very important. If someone were to get a hold of the private key, malicious attacks could be had. Hence, we must find a way to encrypt these private key. We must also ensure that our public keys are not tampered with. If a false certificate is given, sensitive data could be given to the wrong person. As such, we want to protect out certificates. This is where our Java keystores come in. For more information about keystores, please take a look [here](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqa3NvQm5acFNZNXl4QTZmWmUzZ1pKUWxTeFJId3xBQ3Jtc0tuWG4tdTlWck1Oc2RsWWhtRE1oZGwtbWw4bHVQai1EVzBvRE9ENmtkOVE3bWR1czlBeFl0YWdGQkY3VUdweUxIbno0MVUwX2dGSldEbk1Ha1Z4WFRlTU83SVhQV0NXWHVqMXBkeDNLUmo4WmxPTjdaVQ&q=https%3A%2F%2Fcryptosense.com%2Fwhitepapers%2Fjava-crypto-security-whitepaper%3Futm_source%3Dyoutube%26utm_medium%3Dvideo%26utm_campaign%3Dkeystores%26utm_content%3Dkeystores1&v=viOds2uniC0).

## Generating a keystore and certificate

This step is only required if using a self-signed certificate due to the absence of a proper trusted root authority issued one.

    $ keytool -genkey -keyalg RSA -keysize 2048 -alias selfsigned -storepass Password1233 -keystore keystore.jks -ext SAN=dns:genesisserv1,dns:genesisserv1.ad.genesis.global,dns:genesisserv2,dns:genesisserv2.ad.genesis.global,dns:genesisserv3,dns:genesisserv3.ad.genesis.global,dns:genesisserv4,dns:genesisserv4.ad.genesis.global,ip:193.144.16.43

    What is your first and last name?
      [Unknown]:  Fred Bloggs
    What is the name of your organizational unit?
      [Unknown]:  IT
    What is the name of your organization?
      [Unknown]:  Genesis Global Technology Ltd
    What is the name of your City or Locality?
      [Unknown]:  London
    What is the name of your State or Province?
      [Unknown]:  Greater London
    What is the two-letter country code for this unit?
      [Unknown]:  GB

    Is CN=Fred Bloggs, OU=IT, O=Genesis Global Technology Ltd, L=London, ST=Greater London, C=GB correct?
      [no]:  yes

    Enter key password for <selfsigned>
            (RETURN if same as keystore password):

Assuming no problems with privileges you will now have a certificate called "selfsigned" with a private key using the same password as the keystore password e.g. Password123.

In our example this certificate can be found here: /home/exmon/keystore.jks
Please note, however, that this certificate should be stored in another directory outside of this product in case it should be shared among multiple products in the same machine and then simply creating a symbolic link to it. For example, it could be stored in /etc/genesis-certs/ and then linked into /home/exmon/ and /home/oems.

The keystore (.jks) is, in a way, the private key to be used in the two-way authentication in the SSL protocol. As such, we need to use it to generate the certificate that needs to be installed by the target computers/loaded by the processes that intend to communicate with.

    $ keytool -export -alias mykey -file certificate.crt -keystore keystore.jks


## Installing TLS certificate in environment

### Linux

Varies according to the distribution being used. In Ubuntu:

    $ cp certificate.crt /usr/local/share/ca-certificates/
    $ sudo update-ca-certificates

### Windows

Right-click on certificate.crt and select 'Install Certificate'. On 'Place all certificates in the following store', select 'Trusted Root Certification Authorities'.

##Securing a Genesis processes

### Setting the process to communication via SSL/TLS

All Genesis modules are defined inside the service definition files:

Syntax:

    	~/run/<product>/cfg/<product>-service-definitions.xml

Example:

    	~/run/exmon/cfg/exmon-service-definitions.xml

To enable a process to be set to communicate via SSL set the secure element to be true.

Example:

```xml
    <configuration>
        <service host="localhost" name="EXMON_DATASERVER" port="8911" secure="true"/>
    </configuration>
```

### Setting the TLS settings for all processes by default

You must also edit the _application_ *dta-system-definitions.xml* file and edit the values for DefaultKeystoreLocation, DefaultKeystoreLocation and DefaultCertificate.

    Example:

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

### Setting the TLS settings for each individual process (you can have different processes secured via different certificates if required).

This setting is used if you want to override the defaults established above for a specific process.
Edit the process' configuration file (as defined in <product>-processes.xml)

To have the following settings:-

```xml
    <authManager>
        <settings>
           <messaging>
               <keyStoreLocation>
                   /home/poc/keystore.jks
               </keyStoreLocation>
               <keyStorePassword>
                   Password123
               </keyStorePassword>
           </messaging>
        </settings>
    </authManager>
```

Once the files are saved then run dtaInstall and then when the processes starts again it will be secure.

## GUI

To enable the GUI to be ready to connect securely edit the **%ProgramData%\Genesis\exmon\Rel\Config\PrimaryServiceConfig.xml** setting "encrypted" to true

### Example:

```xml
    <?xml version="1.0"?>
    <primary_service xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <encrypted>true</encrypted>
      <hosts>
        <host name="genesisserv4.ad.genesis.global" port="8001" />
      </hosts>
    </primary_service>
```

:::note
With encryption, if using a self-signed certificate, it is required to install the certificate.crt in the target machine's operating system as a trusted root CA.
:::

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

## Web applications

It suffices to install the certificate.crt in the target machine's operating system as a trusted root CA.

