---
title: 'Configuring Runtime'
sidebar_label: 'Configuring Runtime'
id: configuring-runtime
---

[Introduction](/server/evaluator/introduction) | [Basics](/server/evaluator/basics) | [Examples](/server/evaluator/examples) | [Configuring runtime](/server/evaluator/configuring-runtime) | [Testing](/server/evaluator/testing)

## Enabling the Evaluator
The Evaluator process is not enabled by default. Before you can use the process, you must add/enable it in your _application_**-genesis-processes.xml** file.

The example below is for a standard Genesis file for controlling `/home/trading/run/site-specific/cfg/genesis-processes.xml`. In this case, we have called our process GENESIS_EVALUATOR. Ensure that `start` is set to `true`. 
```xml {2}
<process name="GENESIS_EVALUATOR">
    <start>true</start>
    <groupId>GENESIS</groupId>
    <options>-Xmx512m -DXSD_VALIDATE=false</options>
    <module>genesis-evaluator</module>
    <primaryOnly>true</primaryOnly>
    <package>global.genesis.eventhandler,global.genesis.evaluator</package>
    <description>Dynamic/time rules engine</description>
</process>
```


Add the Evaluator to the file _application-name_**-service-definitions.xml** in your project folder **server/jvm/**_application-name_**-config/src/main/resources/cfg** with the code below.
Replace the PROCESS_NAME with the process you named above: in this case, GENESIS_EVALUATOR .

```xml
<configuration>
    ...
    <service host="localhost" name="PROCESS_NAME" port="11003"/>
</configuration>
```
If your server was already running when you made the modification to the above files, run
"`genesisInstall` -> `killServer` -> `startServers`" from the command line on the server, so that the configuration takes effect.


Run `mon` to see if the above GENESIS_EVALUATOR process is running.

**Note**: the Evaluator only runs on a primary node within the cluster. If your application only has one node, you still have to identify it as the primary node. You can set your node to primary with the command `SetPrimary`. If you do not do this, the GENESIS_EVALUATOR will go into STANDBY mode.

After you run `SetPrimary`, you should be able to see all the processes running.
