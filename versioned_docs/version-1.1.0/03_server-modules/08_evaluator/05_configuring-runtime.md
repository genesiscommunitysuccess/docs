---
title: 'Configuring Runtime'
sidebar_label: 'Configuring Runtime'
id: configuring-runtime
---

[Introduction](/server-modules/evaluator/introduction) | [Basics](/server-modules/evaluator/basics) |  [Advanced](/server-modules/evaluator/advanced) | [More examples](/server-modules/evaluator/examples) | [Configuring runtime](/server-modules/evaluator/configuring-runtime) | [Testing](/server-modules/evaluator/testing)

## Enabling the evaluator
The evaluator process is not enabled by default. Before you can use the GENESIS\_EVALUATOR, you must enable it in your _application_**-genesis-processes.xml** file.

The example below is for a standard Genesis file for controlling `/home/trading/run/site-specific/cfg/genesis-processes.xml`. You simply switch, `start` from `false` to `true`. Then run
"`genesisInstall` -> `killServer` -> `startServers`", so that the configuration takes effect.

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

**Note**: the evaluator only runs on a primary node within the cluster. You can set your node to primary with the command `SetPrimary`.If you do not do this,   the GENESIS_EVALUATOR will go into STANDBY mode.
