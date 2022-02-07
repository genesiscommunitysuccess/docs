---
id: sftp-encryption
sidebar_label: SFTP and encryption
sidebar_position: 20
title: SFTP and encryption 

---

If you are loading static data from an external site, this page gives more detail on the SFTP method for obtaining the data. It also looks at how you could deal with encryption and decryption in higher environments.

## SFTP
Below, the simple _application_**-camel.xml** file has  been renamed _application_**-camel.temptl.xml** to make it a template, and an SFTP route has been added:


```kotlin
//Handles sFTP BBG file transfer
String bbgEndPointPath = "{{BBG_SERVER_SFTP}}"
String bbgUserName = "{{BBG_SERVER_USERNAME}}"
String bbgPassword = "{{BBG_SERVER_PASSWORD}}"
String bbgFileName = "{{BBG_SERVER_FILENAME}}"
// String bbgFileName = "GEN_(PREL|PRICED)_[0-9]{4}\\.out\\.[0-9]{8}"
String bbgConsumerRepo = "${env:GENESIS_HOME}/runtime/inbound/IDEMPOTENT_CONSUMER.DATA"

from(bbgEndPointPath + '?username=' + bbgUserName  + '&password=' + bbgPassword + '&include=' + bbgFileName +
        '&delay=1000&sortBy=file:modified&delete=false&bridgeErrorHandler=true' +
        '&knownHostsFile=/home/priss/.ssh/known_hosts&throwExceptionOnConnectFailed=true&stepwise=false')
    .idempotentConsumer(header("CamelFileName"), FileIdempotentRepository.fileIdempotentRepository(new File(bbgConsumerRepo), 300000, 15000000))
    .process(new Processor() {
        @Override
        public void process(Exchange exchange) throws Exception {
            LOG.debug("SFTP copy CamelFileName = {}", exchange.in.headers.CamelFileName)
        }
    })
    .log('BBG file transfer: ${headers.CamelFileName}')
    .to('file:' + pathStr + '/bbg')

```

By defining this as a template, you can use site-specific variables for each instance (for example,  user name, password, and hosts can change between **DEV**, **QA**, **UAT**, and **PROD** instances). 

The template variables have **{{…}}** around them, and the actual values will be found in the **primary-issuance-system-definition.kts** file in either the **site-specific** directory or the application directory. We shall say more later about the variables in the definitions.

So, we now can dynamically define hosts, user names, passwords, and even file names to find. These are passed into the route to configure the camel SFTP connection. Camel will poll the sFTP server to look for unprocessed files, and download them into the staging directory (**…/bbg** in this instance). Only unprocessed files are downloaded, because we have configured `idempotentConsumer`, which has a DB that is used to store the downloaded file names. 

For the template to be used, we must also to modify the _application_**-process.xml** configuration file to include the **auto** filename. This ensures that the platofrm generates the **auto** based on your _application_**-camel.temptl.xml** file. Here is the codeblock for the new **ISSUANCE_CAMEL** process: 


```xml
<process name="ISSUANCE_CAMEL">
    <groupId>SYMPH</groupId>
    <primaryOnly>true<primaryOnly>
    <start>true</start>
    <options>-Xmx256m -DXSD_VALIDATE=false -DRedirectStreamsToLog=true</options>
    <module>genesis-camel</module>
    <package>global.genesis.camel</package>
    <config>primary-issuance-camel.auto.xml</config>
    <loggingLevel>INFO,DATADUMP_OFF</loggingLevel>
    <description>Handles inbound/outbound file consumption/production</description>
</process>
```

The example above also has a `primaryOnly` element defined. This ensures that process only runs on the primry node. Therefore, if you are running a cluster, there will be no duplicate downloading.

Lastly, back to the **{{..}}** variables used in the template, and defined in the _application_**-system-definition.kts** for each of the application instances. In the example below, we specify the user name and password for the **QA** instance:

![](/img/variables-qa.png)
 
 
## Encryption

In higher environments, you need to encrypt sensitive values in the _application_**-system-definition.kts** file.  A detailed discussion on genesis encryption can be found at the following link:

https://genesisglobal.atlassian.net/wiki/spaces/ON/pages/1004634113/Setting+up+an+Encrypted+Username+and+Password+for+an+external+System+4.1.0+onwards

The steps to follow are:

1. Generate a GENESIS_KEY key for each of the environments (specially for PROD and UAT).
2. Pass the GENESIS_KEY to each instance as an environment variable.
3. Using the GENESIS_KEY, encrypt the `username` and `password` with the [`encryptUserPassWithKey` command](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/overview/#encrypting-user-and-passwords) in the Genesis instance.
4. Add the encrypted `username` and `password` to the relevant section (**DEV**, **UAT**, etc...) of the _application_**-system-definition.kts** file.  
 5. Finally, because your password is encrypted in the script/configuration you are changing, you need to pull it out from the System definition object, which automatically decrypts it. Here is an example:


```kotlin
import global.genesis.config.system.SystemDefinitionResolver
import global.genesis.commons.standards.GenesisPaths

routeHandler.with {
    def systemDefinition = SystemDefinitionResolver.resolveService(GenesisPaths.genesisHome())
    String pathStr = "${env:GENESIS_HOME}/runtime/inbound/"
    String bbgUserName = systemDefinition.get("BBG_SERVER_USERNAME").get()
    String bbgPassword = systemDefinition.get("BBG_SERVER_PASSWORD").get()

```


## Troubleshooting

When you run `genesisInstall` the template file is used to generate the **auto** file. This can be found in the $GC directory. Open this file to check the variable values.

Check that your environment variables are set up. Look in the **.bachrc** file in the home directory of the application. At the bottom of the script, you will see a reference to _IP address_**/latest/user-data**. This is used to generate the environment variables. Check that your environment variable exists in the list. And does it return from the request?

 
