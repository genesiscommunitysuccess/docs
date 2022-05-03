---
id: sftp-encryption
sidebar_label: SFTP and encryption
sidebar_position: 20
title: SFTP and encryption 

---

If you are loading static data from an external site, this page gives more detail on the SFTP method for obtaining the data. It also looks at how you could deal with encryption and decryption in higher environments.

## SFTP
Below, the simple _application_**-camel.kts** file has had an SFTP route added to it.

```kotlin
camel {
    routeHandler {
        //Handles sFTP BBG file transfer
        val bbgEndPointPath = systemDefinition.getItem("BBG_SERVER_SFTP")
        val bbgUserName = systemDefinition.getItem("BBG_SERVER_USERNAME")
        val bbgPassword = systemDefinition.getItem("BBG_SERVER_PASSWORD")
        val bbgFileName = systemDefinition.getItem("BBG_SERVER_FILENAME")
        // String bbgFileName = "GEN_(PREL|PRICED)_[0-9]{4}\\.out\\.[0-9]{8}"
        val pathStr = "${GenesisPaths.genesisHome()}/runtime/inbound/IDEMPOTENT_CONSUMER.DATA"
        val bbgConsumerRepo = "${pathStr}IDEMPOTENT_CONSUMER.DATA"

        from("sftp:${bbgEndPointPath}?username=${bbgUserName}&password=${bbgPassword}&include=$${bbgFileName}" +
            "&delay=1000&sortBy=file:modified&delete=false&bridgeErrorHandler=true" +
            "&knownHostsFile=/home/priss/.ssh/known_hosts&throwExceptionOnConnectFailed=true&stepwise=false")
            .idempotentConsumer(header("CamelFileName"),
                FileIdempotentRepository.fileIdempotentRepository(File(bbgConsumerRepo), 300000, 15000000))
            .process { exchange ->
                LOG.debug("SFTP copy CamelFileName = ${exchange.`in`.getHeader("CamelFileNameOnly").toString()}")
            }
            .log("BBG file transfer: \${headers.CamelFileName}")
            .to("file:${pathStr}/bbg")
    }
}
```

By using the `systemDefinition` to get items, we can use site-specific variables for each instance (for example,  username, password, and hosts can change between **DEV**, **QA**, **UAT**, and **PROD** instances).

These variables values are defined in the _application_**-system-definition.kts** for each of the application instances. In the example below, we specify the username and password for the **QA** instance:

![](/img/variables-qa.png)

This way you can dynamically define hosts, usernames, passwords, and even file names to find. These are passed into the route to configure the Apache Camel SFTP connection.  Camel will poll the sFTP server to look for unprocessed files, and download them into the staging directory (**…/bbg** in this instance). Only unprocessed files are downloaded, because we have configured `idempotentConsumer`, which has a DB that is used to store the downloaded file names.

## Encryption

In higher environments, you need to encrypt sensitive values in the _application_**-system-definition.kts** file.  

The steps to follow are:

1. Generate a GENESIS_KEY key for each of the environments (specially for PROD and UAT).
2. Pass the GENESIS_KEY to each instance as an environment variable.
3. Using the GENESIS_KEY, encrypt the `username` and `password` with the [`encryptUserPassWithKey` command](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/overview/#encrypting-user-and-passwords) in the Genesis instance.
4. Add the encrypted `username` and `password` to the relevant section (**DEV**, **UAT**, etc...) of the _application_**-system-definition.kts** file.  
5. Finally, because your password is encrypted in the script/configuration you are changing, the `systemDefinition` object will automatically decrypt it. Here is an example:

```kotlin
camel {
    routeHandler.with {
        val pathStr = "${GenesisPaths.genesisHome()}/runtime/inbound/"
        val bbgUserName = systemDefinition.getItem("BBG_SERVER_USERNAME")
        val bbgPassword = systemDefinition.getItem("BBG_SERVER_PASSWORD")
    }
}
```


## Troubleshooting

Check that your environment variables are set up. Look in the **.bachrc** file in the home directory of the application. At the bottom of the script, you will see a reference to _IP address_**/latest/user-data**. This is used to generate the environment variables. Check that your environment variable exists in the list. And does it return from the request?

 
