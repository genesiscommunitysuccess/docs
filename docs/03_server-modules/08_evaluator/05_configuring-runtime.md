---
title: 'Configuring Runtime'
sidebar_label: 'Configuring Runtime'
id: configuring-runtime
---

[Introduction](/server-modules/evaluator/introduction) | [Basics](/server-modules/evaluator/basics) | [Examples](/server-modules/evaluator/examples) | [Configuring runtime](/server-modules/evaluator/configuring-runtime) | [Testing](/server-modules/evaluator/testing)

### Enabling the evaluator
The evaluator process is not enabled by default. Before you can use the process, you must add/enable it in your _application_**-genesis-processes.xml** file.

The example below is for a standard Genesis file for controlling `/home/trading/run/site-specific/cfg/genesis-processes.xml`. In this case we have called our process GENESIS_EVALUATOR. Ensure that `start` is set to `true`. 
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


Add the evaluator to the file _application-name_**-service-definitions.xml** inside your project folder **server/jvm/**_application-name_**-config/src/main/resources/cfg** with the code below.
Replacing PROCESS_NAME with process you named above, in this case GENESIS_EVALUATOR .
```xml
<configuration>
    ...
    <service host="localhost" name="PROCESS_NAME" port="11003"/>
</configuration>
```
If your server was already running when you made the modification to the above files, run
"`genesisInstall` -> `killServer` -> `startServers`" from the command line on the server, so that the configuration takes effect.


Run `mon` to see if the above GENESIS_EVALUATOR process is running.

**Note**: the evaluator only runs on a primary node within the cluster. If your application only has one node, you still have to identify it as the primary node. You can set your node to primary with the command `SetPrimary`. If you do not do this, the GENESIS_EVALUATOR will go into STANDBY mode.

Run `SetPrimary` and you should be able to see all processes running.
